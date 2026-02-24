import { BrowserWindow, ipcMain } from 'electron';

export interface SemanticElement {
    type: string;
    text: string;
    id?: string;
    role?: string;
    href?: string;
    intent?: string;
}

export interface PageState {
    url: string;
    title: string;
    page_type?: string;
    main_goal?: string;
    elements: SemanticElement[];
    entities: any[];
    description?: string;
}

class AIEngine {
    private worker: BrowserWindow | null = null;

    constructor() { }

    public setup() {
        if (!this.worker) {
            this.initWorker();
        }
    }

    private initWorker() {
        this.worker = new BrowserWindow({
            show: false,
            webPreferences: {
                offscreen: true,
                contextIsolation: true,
                nodeIntegration: false,
            }
        });
    }

    async navigate(url: string): Promise<PageState> {
        console.log(`[SHADOW ENGINE] Navigating to: ${url}`);
        if (!this.worker) {
            console.log('[SHADOW ENGINE] Initializing worker...');
            this.initWorker();
        }

        let targetUrl = url;
        if (!targetUrl.startsWith('http') && !targetUrl.startsWith('file')) {
            targetUrl = `https://${targetUrl}`;
        }

        try {
            await this.worker!.loadURL(targetUrl);
        } catch (e) {
            console.error(`[SHADOW ENGINE] Failed to load URL: ${targetUrl}`, e);
            throw new Error(`Failed to load ${targetUrl}: ${(e as Error).message}`);
        }

        // Wait for page load and JS execution
        await new Promise(resolve => {
            const check = () => {
                if (!this.worker || !this.worker.webContents) {
                    resolve(false);
                    return;
                }
                if (!this.worker.webContents.isLoading()) resolve(true);
                else setTimeout(check, 500);
            };
            check();
        });

        // Additional wait for dynamic content
        await new Promise(resolve => setTimeout(resolve, 3000));

        const rawData = await this.extractSemantics();
        console.log(`[SHADOW ENGINE] Raw data extracted for ${targetUrl}: Title="${rawData?.title}", Elements=${rawData?.elements?.length}`);
        return this.cognitiveCompression(rawData);
    }

    private async extractSemantics(): Promise<PageState> {
        console.log('[SHADOW ENGINE] Executing extraction script...');
        const script = `
            (function() {
                try {
                    const elements = [];
                    const entities = [];
                    
                    const pageType = (window.location.hostname.includes('amazon') || document.querySelector('[class*="product"]')) ? 'ecommerce' : 
                                     (document.querySelector('article') ? 'informational' : 'general');

                    const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
                    const title = document.title || 'Untitled Page';

                    const selectors = 'h1, h2, h3, a, button, input, select';
                    const nodes = document.querySelectorAll(selectors);
                    
                    for (let i = 0; i < Math.min(nodes.length, 150); i++) {
                        const el = nodes[i];
                        const rect = el.getBoundingClientRect();
                        if (rect.width === 0 && rect.height === 0 && el.tagName !== 'INPUT') continue;

                        const text = (el.innerText || el.value || el.placeholder || '').trim().substring(0, 100);
                        if (!text && el.tagName !== 'INPUT') continue;

                        let intent = 'view';
                        if (el.tagName === 'BUTTON') intent = 'action';
                        if (el.tagName === 'A') intent = 'navigation';
                        if (el.tagName === 'INPUT' || el.tagName === 'SELECT') intent = 'input';

                        elements.push({
                            type: el.tagName.toLowerCase(),
                            text: text,
                            id: el.id || 'ai-node-' + i,
                            intent: intent
                        });
                    }

                    // Simple price entity extraction
                    const prices = document.body.innerText.match(/[\\$£€₹][\\d,]+(\\.\\d+)?/g) || [];
                    prices.slice(0, 5).forEach(p => entities.push({ type: 'price', value: p }));

                    return {
                        url: window.location.href,
                        title: title,
                        page_type: pageType,
                        description: metaDesc,
                        elements: elements,
                        entities: entities
                    };
                } catch (e) {
                    return { error: e.message };
                }
            })()
        `;

        try {
            const result = await this.worker!.webContents.executeJavaScript(script);
            if (result?.error) {
                console.error('[SHADOW ENGINE] Script inner error:', result.error);
            }
            console.log('[SHADOW ENGINE] Script execution complete.');
            return {
                url: result?.url || '',
                title: result?.title || 'No Title',
                page_type: 'general',
                elements: result?.elements || [],
                entities: result?.entities || [],
                description: result?.description || ''
            };
        } catch (e) {
            console.error('[SHADOW ENGINE] executeJavaScript failed:', e);
            return {
                url: this.worker!.webContents.getURL(),
                title: 'Error Extracting',
                elements: [],
                entities: []
            };
        }
    }

    private cognitiveCompression(data: PageState): PageState {
        // Step 5: Cognitive Compression
        // Filter out redundant elements and prioritize by intent
        const priorityIntents = ['action', 'input', 'navigation'];

        const compressedElements = data.elements
            .filter(el => {
                // Keep all headers
                if (el.type.startsWith('h')) return true;
                // Keep interactive elements
                if (priorityIntents.includes(el.intent || '')) return true;
                return false;
            })
            .slice(0, 50); // Hard limit for AI tokens

        return {
            ...data,
            main_goal: data.page_type === 'ecommerce' ? 'purchase_or_research' : 'information_gathering',
            elements: compressedElements
        };
    }

    async executeAction(action: string, payload: any): Promise<PageState> {
        if (!this.worker) throw new Error("No active AI worker session");

        const script = `
            (function() {
                const el = document.getElementById("${payload.id}") || 
                           Array.from(document.querySelectorAll("${payload.type}")).find(e => e.innerText.includes("${payload.text}"));
                if (el) {
                    if ("${action}" === "CLICK") {
                        el.click();
                    } else if ("${action}" === "TYPE") {
                        (el as any).value = "${payload.value}";
                        el.dispatchEvent(new Event('input', { bubbles: true }));
                        el.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    return true;
                }
                return false;
            })()
        `;

        const success = await this.worker.webContents.executeJavaScript(script);
        if (!success) {
            // Fallback: search by text if ID failed
            console.log("Action target not found by primary selector, trying fallback...");
        }

        // Wait for potential navigation
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.navigate(this.worker.webContents.getURL());
    }
}

import { createServer } from 'http';

export const aiEngine = new AIEngine();

export function setupAIHandlers() {
    aiEngine.setup();
    ipcMain.handle('ai-navigate', async (_, { url }) => {
        return await aiEngine.navigate(url);
    });

    ipcMain.handle('ai-action', async (_, { action, payload }) => {
        return await aiEngine.executeAction(action, payload);
    });

    // Background Bridge for CLI / External AI
    const server = createServer(async (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
                try {
                    const { command, target, payload } = JSON.parse(body);
                    let result;

                    if (command === 'search' || command === 'navigate') {
                        result = await aiEngine.navigate(target);
                    } else if (command === 'action') {
                        result = await aiEngine.executeAction(payload.type, payload);
                    } else if (command === 'status') {
                        result = { status: 'ok', engine: 'Shadow Engine', active: true };
                    } else {
                        result = { status: 'unknown_command' };
                    }

                    res.statusCode = 200;
                    res.end(JSON.stringify(result));
                } catch (err) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: (err as Error).message }));
                }
            });
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Not found' }));
        }
    });

    server.listen(3030, '127.0.0.1', () => {
        console.log('[AI BRIDGE] Background server active on port 3030');
    });
}
