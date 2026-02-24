import { app, BrowserWindow, shell, ipcMain, Menu, BrowserView, nativeTheme } from 'electron'
import { release } from 'os'
import { join } from 'path'
import { setupAIHandlers } from './ai-engine'

// Optimization: Suppress common Linux GPU/Shader warnings if possible
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('disable-software-rasterizer')
app.commandLine.appendSwitch('enable-unsafe-swiftshader')

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

let win: BrowserWindow | null = null
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(__dirname, '../../dist/index.html')

// Map to store BrowserViews for each tab
const views = new Map<number, BrowserView>()
let activeViewId: number | null = null

async function createWindow() {
    Menu.setApplicationMenu(null) // Remove default menu

    win = new BrowserWindow({
        title: 'JEB Browser',
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        backgroundColor: '#0a0b0e',
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        frame: false, // Frameless for native look
        show: false,
    })

    // Suppress MaxListenersExceededWarning for dev HMR
    win.setMaxListeners(50)

    win.once('ready-to-show', () => {
        win?.show()
    })

    if (url) {
        win.loadURL(url)
    } else {
        win.loadFile(indexHtml)
    }

    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })
}

app.whenReady().then(() => {
    setupAIHandlers()
    createWindow()
})

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})

// --- Window Controls ---
ipcMain.on('window-minimize', () => {
    if (win) win.minimize()
})

ipcMain.on('window-maximize', () => {
    if (win) {
        if (win.isMaximized()) win.unmaximize()
        else win.maximize()
    }
})

ipcMain.on('window-close', () => {
    if (win) win.close()
})

// --- BrowserView Management ---
ipcMain.on('create-view', (_, { tabId, url, bounds, backgroundColor }) => {
    if (!win) return

    // Cleanup if already exists
    if (views.has(tabId)) {
        const oldView = views.get(tabId)
        if (oldView) {
            win.removeBrowserView(oldView);
            (oldView.webContents as any).destroy();
        }
    }

    const view = new BrowserView({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    })

    if (backgroundColor) {
        view.setBackgroundColor(backgroundColor)
        nativeTheme.themeSource = backgroundColor === '#0a0b0e' ? 'dark' : 'light'
    } else {
        view.setBackgroundColor('#0a0b0e')
        nativeTheme.themeSource = 'dark'
    }

    // Inject dark mode for common search engines if in dark theme
    let finalUrl = url
    if (nativeTheme.shouldUseDarkColors) {
        if (url.includes('duckduckgo.com') && !url.includes('kae=')) {
            finalUrl = url + (url.includes('?') ? '&' : '?') + 'kae=d'
        }
    }

    views.set(tabId, view)
    view.webContents.loadURL(finalUrl)
    if (bounds) view.setBounds(bounds)

    // Handle downloads
    view.webContents.session.on('will-download', (_event, item, _webContents) => {
        const downloadId = Date.now().toString()
        win?.webContents.send('download-started', {
            id: downloadId,
            name: item.getFilename(),
            totalBytes: item.getTotalBytes(),
            url: item.getURL()
        })

        item.on('updated', (_event, state) => {
            if (state === 'interrupted') {
                win?.webContents.send('download-interrupted', { id: downloadId })
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    win?.webContents.send('download-paused', { id: downloadId })
                } else {
                    win?.webContents.send('download-progress', {
                        id: downloadId,
                        receivedBytes: item.getReceivedBytes()
                    })
                }
            }
        })

        item.once('done', (_event, state) => {
            win?.webContents.send('download-done', {
                id: downloadId,
                state: state
            })
        })
    })

    // Auto-update title
    view.webContents.on('page-title-updated', (_, title) => {
        win?.webContents.send('view-title-updated', { tabId, title })
    })

    // Handle navigation events
    view.webContents.on('did-navigate', (_, url) => {
        win?.webContents.send('view-url-updated', { tabId, url })
    })

    view.webContents.on('did-finish-load', () => {
        const isDark = nativeTheme.shouldUseDarkColors
        const script = `
            (function() {
                const isDark = ${isDark};
                const themeColor = isDark ? 'dark' : 'light';
                
                // Set color scheme meta tag
                let meta = document.querySelector('meta[name="color-scheme"]');
                if (!meta) {
                    meta = document.createElement('meta');
                    meta.name = 'color-scheme';
                    document.head.appendChild(meta);
                }
                meta.content = themeColor;

                // Force theme for search engines
                if (window.location.hostname.includes('google.com') || window.location.hostname.includes('duckduckgo.com')) {
                    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
                    if (isDark) {
                        document.documentElement.classList.add('dark');
                        document.documentElement.classList.remove('light');
                        if (window.location.hostname.includes('google.com')) {
                            document.body.style.backgroundColor = '#202124';
                            document.body.style.color = '#e8eaed';
                        }
                    } else {
                        document.documentElement.classList.remove('dark');
                        document.documentElement.classList.add('light');
                        if (window.location.hostname.includes('google.com')) {
                            document.body.style.backgroundColor = '';
                            document.body.style.color = '';
                        }
                    }
                }
            })();
        `
        view.webContents.executeJavaScript(script).catch(() => { })
    })

    // Handle favicon
    view.webContents.on('page-favicon-updated', (_, favicons) => {
        if (favicons && favicons.length > 0) {
            win?.webContents.send('view-favicon-updated', { tabId, favicon: favicons[0] })
        }
    })
})

ipcMain.on('set-active-view', (_, { tabId, bounds }) => {
    if (!win) return

    // Safety check for HMR reloads
    if (tabId === null) {
        if (activeViewId !== null) {
            const currentView = views.get(activeViewId)
            if (currentView) win.removeBrowserView(currentView)
        }
        activeViewId = null
        return
    }

    // Hide old view if different
    if (activeViewId !== null && activeViewId !== tabId) {
        const oldView = views.get(activeViewId)
        if (oldView) win.removeBrowserView(oldView)
    }

    const view = views.get(tabId)
    if (view) {
        win.setBrowserView(view)
        view.setBounds(bounds)
        activeViewId = tabId
    } else {
        activeViewId = null
    }
})

ipcMain.on('update-view-bounds', (_, { tabId, bounds }) => {
    const view = views.get(tabId)
    if (view && tabId === activeViewId) {
        view.setBounds(bounds)
    }
})

ipcMain.on('navigate-view', (_, { tabId, url }) => {
    const view = views.get(tabId)
    if (view) {
        view.webContents.loadURL(url)
    }
})

ipcMain.on('close-view', (_, { tabId }) => {
    const view = views.get(tabId)
    if (view) {
        if (win && tabId === activeViewId) {
            win.removeBrowserView(view)
            activeViewId = null
        }
        (view.webContents as any).destroy()
        views.delete(tabId)
    }
})

ipcMain.on('go-back', (_, { tabId }) => {
    const view = views.get(tabId)
    if (view && view.webContents.canGoBack()) {
        view.webContents.goBack()
    }
})

ipcMain.on('go-forward', (_, { tabId }) => {
    const view = views.get(tabId)
    if (view && view.webContents.canGoForward()) {
        view.webContents.goForward()
    }
})

ipcMain.on('set-views-background', (_, { color }) => {
    const isDark = color === '#0a0b0e'
    nativeTheme.themeSource = isDark ? 'dark' : 'light'

    const themeScript = `
        (function() {
            const isDark = ${isDark};
            const themeColor = isDark ? 'dark' : 'light';
            let meta = document.querySelector('meta[name="color-scheme"]');
            if (meta) meta.content = themeColor;
            
            if (window.location.hostname.includes('google.com') || window.location.hostname.includes('duckduckgo.com')) {
                document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
                if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    if (window.location.hostname.includes('google.com')) {
                        document.body.style.backgroundColor = '#202124';
                        document.body.style.color = '#e8eaed';
                    }
                } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    if (window.location.hostname.includes('google.com')) {
                        document.body.style.backgroundColor = '';
                        document.body.style.color = '';
                    }
                    if (window.location.hostname.includes('duckduckgo.com')) {
                        const url = new URL(window.location.href);
                        if (url.searchParams.get('kae') === 'd') {
                            url.searchParams.delete('kae');
                            window.location.href = url.href;
                        }
                    }
                }
            }
        })();
    `;

    views.forEach(view => {
        view.setBackgroundColor(color)
        view.webContents.executeJavaScript(themeScript).catch(() => { })
    })
})

ipcMain.handle('get-app-status', () => {
    return {
        status: 'ACTIVE',
        engine: 'Shadow Engine',
        version: '0.1.0'
    }
})
