#!/usr/bin/env node

/**
 * JEB CLI - Headless Agent Interface
 * Usage: 
 *   jeb search "url"
 *   jeb action "click" --id="ai-node-1"
 */

const http = require('http');
const args = process.argv.slice(2);
const command = args[0];
const target = args[1];

const JEB_LOG_HEADER = `
[ JEB ] Shadow Engine Active
[ AGENT ] Protocol: AI-BRIDGE v1.1
----------------------------
`;

if (!command) {
    console.log(`JEB Browser CLI - Headless Agent Path`);
    console.log(`Usage: jeb [search|navigate|status|install] [target]`);
    process.exit(0);
}

const fs = require('fs');
const path = require('path');
const os = require('os');

async function callBridge(data) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: '127.0.0.1',
            port: 3030,
            path: '/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (!body) {
                    return reject(new Error("Empty response from browser."));
                }
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    reject(new Error("Failed to parse response from browser."));
                }
            });
        });

        req.on('error', (err) => {
            reject(new Error("Could not connect to JEB Browser. Is it running?"));
        });

        req.write(JSON.stringify(data));
        req.end();
    });
}

async function run() {
    switch (command) {
        case 'install':
            console.log(JEB_LOG_HEADER);
            console.log(`Installing JEB system-wide...`);
            const scriptPath = path.resolve(__filename);
            const aliasCmd = `alias jeb='node ${scriptPath}'`;

            try {
                const shellRc = path.join(os.homedir(), '.bashrc');
                if (fs.existsSync(shellRc)) {
                    const content = fs.readFileSync(shellRc, 'utf8');
                    if (!content.includes("alias jeb=")) {
                        fs.appendFileSync(shellRc, `\n# JEB Browser CLI Alias\n${aliasCmd}\n`);
                        console.log(`[SUCCESS] Alias added to ${shellRc}`);
                        console.log(`Please run 'source ~/.bashrc' or restart your terminal.`);
                    } else {
                        console.log(`[INFO] JEB alias already exists in ${shellRc}`);
                    }
                }
            } catch (err) {
                console.error(`[ERROR] Failed to install alias: ${err.message}`);
            }
            break;

        case 'search':
        case 'navigate':
            console.log(JEB_LOG_HEADER);
            console.log(`Searching via Shadow Engine: "${target}"...`);
            try {
                const result = await callBridge({ command: 'search', target });
                if (!result) throw new Error("No data received from JEB.");

                const title = result.title || "No Title Found";
                const pageType = result.page_type || "unknown";
                const mainGoal = result.main_goal || "unknown";
                const entities = result.entities || [];
                const elements = result.elements || [];
                const description = result.description || "";

                console.log(`\n### [Page Context: ${title}]`);
                if (description) console.log(`> ${description}\n`);
                console.log(`- **Type**: ${pageType}`);
                console.log(`- **Goal**: ${mainGoal}`);

                if (entities.length > 0) {
                    console.log(`\n- **Identified Entities**:`);
                    entities.forEach(ent => console.log(`  - ${ent.type}: ${ent.value}`));
                }

                if (elements.length > 0) {
                    console.log(`\n- **Semantic Actions (Top 5)**:`);
                    elements.slice(0, 5).forEach(el => console.log(`  - [${el.intent?.toUpperCase() || 'VIEW'}] ${el.text} (ID: ${el.id})`));
                } else {
                    console.log(`\n[INFO] No semantic elements identified on this page.`);
                }

                console.log(`\n[SUCCESS] Result retrieved from Beyond Protocol.`);
            } catch (err) {
                console.error(`[ERROR] ${err.message}`);
                console.log(`[DEBUG] Target: ${target}`);
            }
            break;

        case 'status':
            try {
                await callBridge({ command: 'status' });
                console.log(`JEB Background Service: RUNNING`);
                console.log(`Shadow Engine: ACTIVE`);
                console.log(`Active bridge: http://127.0.0.1:3030`);
            } catch (err) {
                console.log(`JEB Background Service: STOPPED (Browser is not running)`);
            }
            break;

        default:
            console.log(`Unknown JEB command: ${command}`);
            process.exit(1);
    }
}

run();
