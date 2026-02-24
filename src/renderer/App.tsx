import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Sidebar from './components/Sidebar'
import StartPage from './components/StartPage'
import Settings from './components/Settings'
import Discovery from './components/Discovery'
import HistoryView from './components/HistoryView'
import BookmarksView from './components/BookmarksView'
import DownloadsView from './components/DownloadsView'
import type { DownloadItem } from './components/DownloadsView'
import {
  IconChevronLeft,
  IconChevronRight,
  IconRotate,
  IconPlus,
  IconX,
  IconMinus,
  IconSquare,
  IconWorld,
  IconStar,
  IconStarFilled
} from '@tabler/icons-react'

interface Tab {
  id: number;
  title: string;
  url: string;
  isDiscovery: boolean;
  favicon?: string;
}

interface HistoryItem {
  id: string;
  title: string;
  url: string;
  timestamp: number;
}

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
}

let tabIdCounter = Date.now();

function isURL(str: string) {
  const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return !!pattern.test(str);
}

function formatURL(str: string) {
  if (str.startsWith('http')) return str;
  return `https://${str}`;
}

function App() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 1, title: 'New Tab', url: '', isDiscovery: false }
  ])
  const [activeTabId, setActiveTabId] = useState<number>(1)
  const [urlInput, setUrlInput] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('jeb-theme')
    return saved ? saved === 'dark' : true
  })
  const [searchEngine, setSearchEngine] = useState(() => {
    return localStorage.getItem('jeb-search-engine') || 'DuckDuckGo'
  })

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('jeb-history')
    return saved ? JSON.parse(saved) : []
  })

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    const saved = localStorage.getItem('jeb-bookmarks')
    return saved ? JSON.parse(saved) : []
  })

  const [downloads, setDownloads] = useState<DownloadItem[]>([])

  type ViewType = 'home' | 'settings' | 'history' | 'bookmarks' | 'downloads';
  const [currentView, setCurrentView] = useState<ViewType>('home')

  const pageContainerRef = useRef<HTMLDivElement>(null)
  const activeTab = useMemo(() => tabs.find(t => t.id === activeTabId), [tabs, activeTabId])

  const showSettings = currentView === 'settings'
  const showHistory = currentView === 'history'
  const showBookmarks = currentView === 'bookmarks'
  const showDownloads = currentView === 'downloads'

  const isBrowsing = !!activeTab && !activeTab.isDiscovery && activeTab.url !== '' &&
    currentView === 'home'

  // Persist settings
  useEffect(() => {
    localStorage.setItem('jeb-search-engine', searchEngine)
  }, [searchEngine])

  useEffect(() => {
    localStorage.setItem('jeb-history', JSON.stringify(history))
  }, [history])

  useEffect(() => {
    localStorage.setItem('jeb-bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks])

  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light'
    localStorage.setItem('jeb-theme', theme)

    // Sync native engine background
    const color = isDarkMode ? '#0a0b0e' : '#f8f9fa'
      ; (window as any).ipcRenderer.send('set-views-background', { color })
  }, [isDarkMode])

  // --- IPC Setup ---
  useEffect(() => {
    const ipc = (window as any).ipcRenderer

    const titleListener = (_: any, { tabId, title }: { tabId: number, title: string }) => {
      setTabs(prev => prev.map(t => t.id === tabId ? { ...t, title } : t))
      // Add to history logic
      setHistory(prev => {
        const tab = tabs.find(t => t.id === tabId)
        if (tab && tab.url && title && title !== 'New Tab') {
          const newItem = { id: Math.random().toString(36).substr(2, 9), title, url: tab.url, timestamp: Date.now() }
          const filtered = prev.filter(item => item.url !== tab.url)
          return [newItem, ...filtered].slice(0, 200)
        }
        return prev
      })
    }

    const urlListener = (_: any, { tabId, url }: { tabId: number, url: string }) => {
      setTabs(prev => prev.map(t => t.id === tabId ? { ...t, url } : t))
      if (activeTabId === tabId) setUrlInput(url)
    }

    const faviconListener = (_: any, { tabId, favicon }: { tabId: number, favicon: string }) => {
      setTabs(prev => prev.map(t => t.id === tabId ? { ...t, favicon } : t))
    }

    const dlStartListener = (_: any, item: any) => {
      setDownloads(prev => [{ ...item, receivedBytes: 0, state: 'progressing', timestamp: Date.now() }, ...prev])
      setCurrentView('downloads')
    }

    const dlProgressListener = (_: any, { id, receivedBytes }: { id: string, receivedBytes: number }) => {
      setDownloads(prev => prev.map(d => d.id === id ? { ...d, receivedBytes } : d))
    }

    const dlDoneListener = (_: any, { id, state }: { id: string, state: any }) => {
      setDownloads(prev => prev.map(d => d.id === id ? { ...d, state: state === 'completed' ? 'completed' : 'interrupted' } : d))
    }

    ipc.on('view-title-updated', titleListener)
    ipc.on('view-url-updated', urlListener)
    ipc.on('view-favicon-updated', faviconListener)
    ipc.on('download-started', dlStartListener)
    ipc.on('download-progress', dlProgressListener)
    ipc.on('download-done', dlDoneListener)

    return () => {
      ipc.off('view-title-updated', titleListener)
      ipc.off('view-url-updated', urlListener)
      ipc.off('view-favicon-updated', faviconListener)
      ipc.off('download-started', dlStartListener)
      ipc.off('download-progress', dlProgressListener)
      ipc.off('download-done', dlDoneListener)
    }
  }, [activeTabId, tabs])

  const toggleBookmark = () => {
    if (!activeTab || !activeTab.url) return
    const isBookmarked = bookmarks.some(b => b.url === activeTab.url)
    if (isBookmarked) {
      setBookmarks(prev => prev.filter(b => b.url !== activeTab.url))
    } else {
      setBookmarks(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), title: activeTab.title || activeTab.url, url: activeTab.url }])
    }
  }

  // --- BrowserView Bounds Update ---
  const updateViewBounds = useCallback(() => {
    if (!pageContainerRef.current || !isBrowsing) return

    const rect = pageContainerRef.current.getBoundingClientRect()
    const bounds = {
      x: Math.round(rect.left),
      y: Math.round(rect.top),
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    }

      ; (window as any).ipcRenderer.send('update-view-bounds', { tabId: activeTabId, bounds })
  }, [activeTabId, isBrowsing])

  useEffect(() => {
    if (isBrowsing) {
      updateViewBounds()
      window.addEventListener('resize', updateViewBounds)
      const observer = new ResizeObserver(() => {
        // Debounce or just call it
        requestAnimationFrame(updateViewBounds)
      })
      if (pageContainerRef.current) observer.observe(pageContainerRef.current)

      return () => {
        window.removeEventListener('resize', updateViewBounds)
        observer.disconnect()
      }
    }
  }, [isBrowsing, updateViewBounds])

  // --- Active View Sync ---
  useEffect(() => {
    const ipc = (window as any).ipcRenderer
    const sync = () => {
      if (isBrowsing) {
        const rect = pageContainerRef.current?.getBoundingClientRect()
        const bounds = rect ? {
          x: Math.round(rect.left),
          y: Math.round(rect.top),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        } : { x: 0, y: 0, width: 0, height: 0 }

        ipc.send('set-active-view', { tabId: activeTabId, bounds })
      } else {
        ipc.send('set-active-view', { tabId: null })
      }
    }

    sync()
    // Small delay to ensure DOM has settled after view transitions
    const timer = setTimeout(sync, 100)
    return () => clearTimeout(timer)
  }, [activeTabId, isBrowsing, currentView])

  // --- Handlers ---
  const handleNewTab = () => {
    const newId = ++tabIdCounter
    setTabs(prev => [...prev, { id: newId, title: 'New Tab', url: '', isDiscovery: false }])
    setActiveTabId(newId)
    setCurrentView('home')
    setUrlInput('')
  }

  const handleCloseTab = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()

      // Close in main process immediately
      ; (window as any).ipcRenderer.send('close-view', { tabId: id })

    setTabs(prev => {
      const filtered = prev.filter(t => t.id !== id)

      if (filtered.length === 0) {
        const newId = ++tabIdCounter
        setActiveTabId(newId)
        setUrlInput('')
        return [{ id: newId, title: 'New Tab', url: '', isDiscovery: false }]
      }

      // If we closed the active tab, pick a new one
      if (activeTabId === id) {
        const currentIndex = prev.findIndex(t => t.id === id)
        const nextTab = filtered[currentIndex] || filtered[currentIndex - 1] || filtered[0]
        setActiveTabId(nextTab.id)
        setUrlInput(nextTab.url)
      }

      return filtered
    })
  }

  const getSearchUrl = (query: string) => {
    if (searchEngine === 'Google') return `https://www.google.com/search?q=${encodeURIComponent(query)}`
    return `https://duckduckgo.com/?q=${encodeURIComponent(query)}`
  }

  const handleNavigate = (e?: React.FormEvent, manualUrl?: string) => {
    if (e) e.preventDefault()
    const rawInput = manualUrl || urlInput
    if (!rawInput) return

    let isUrlInput = isURL(rawInput)
    let formatted = rawInput.toLowerCase() === 'cornerstone'
      ? `file://${window.location.pathname.split('src')[0]}cornerstone/index.html`
      : (isUrlInput ? formatURL(rawInput) : getSearchUrl(rawInput))

    setTabs(prev => prev.map(t => {
      if (t.id === activeTabId) {
        return { ...t, url: formatted, title: rawInput, isDiscovery: false }
      }
      return t
    }))

    const rect = pageContainerRef.current?.getBoundingClientRect()
    const bounds = rect ? {
      x: Math.round(rect.left),
      y: Math.round(rect.top),
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    } : { x: 0, y: 0, width: 0, height: 0 }

    const backgroundColor = isDarkMode ? '#0a0b0e' : '#f8f9fa'
      ; (window as any).ipcRenderer.send('create-view', {
        tabId: activeTabId,
        url: formatted,
        bounds,
        backgroundColor
      })
    setCurrentView('home')
  }

  const handleSidebarView = (view: ViewType) => {
    setCurrentView(currentView === view ? 'home' : view)
  }

  const handleMinimize = () => {
    (window as any).ipcRenderer.send('window-minimize')
  }

  const handleMaximize = () => {
    (window as any).ipcRenderer.send('window-maximize')
  }

  const handleClose = () => {
    (window as any).ipcRenderer.send('window-close')
  }

  const isCurrentBookmarked = activeTab && activeTab.url && bookmarks.some(b => b.url === activeTab.url)

  return (
    <div className={`app-container ${!isDarkMode ? 'light-theme' : ''}`}>
      <div className="titlebar">
        <div style={{ flex: 1, paddingLeft: '12px', fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={isDarkMode ? "/logo_dark.png" : "/logo.png"} style={{ width: '14px', height: '14px' }} />
          JEB BROWSER
        </div>
        <div className="window-controls">
          <button className="window-control-btn" onClick={handleMinimize}><IconMinus size={14} /></button>
          <button className="window-control-btn" onClick={handleMaximize}><IconSquare size={12} /></button>
          <button className="window-control-btn close" onClick={handleClose}><IconX size={14} /></button>
        </div>
      </div>
      <div className="main-layout">
        <Sidebar
          onSettingsClick={() => handleSidebarView('settings')}
          isSettingsActive={showSettings}
          onHomeClick={() => setCurrentView('home')}
          onHistoryClick={() => handleSidebarView('history')}
          onBookmarksClick={() => handleSidebarView('bookmarks')}
          onDownloadsClick={() => handleSidebarView('downloads')}
          currentView={currentView}
          isDarkMode={isDarkMode}
        />
        <div className="main-content">
          <div className="tabbar">
            {tabs.map(tab => (
              <div
                key={tab.id}
                className={`tab ${activeTabId === tab.id && currentView === 'home' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTabId(tab.id)
                  setUrlInput(tab.url)
                  setCurrentView('home')
                }}
              >
                {tab.favicon ? (
                  <img src={tab.favicon} style={{ width: '12px', height: '12px', borderRadius: '2px' }} />
                ) : (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: tab.isDiscovery ? 'var(--accent)' : (tab.url ? '#10b981' : 'var(--text-dim)') }}></div>
                )}
                <span className="tab-title">{tab.title || 'New Tab'}</span>
                <button
                  className="tab-close-btn"
                  onClick={(e) => handleCloseTab(e, tab.id)}
                >
                  <IconX size={10} />
                </button>
              </div>
            ))}
            <button className="sidebar-btn" style={{ marginLeft: '4px', width: '24px', height: '24px' }} onClick={handleNewTab}>
              <IconPlus size={14} />
            </button>
          </div>

          <div className="omnibar">
            <div className="nav-controls">
              <button className="sidebar-btn" onClick={() => (window as any).ipcRenderer.send('go-back', { tabId: activeTabId })}><IconChevronLeft size={18} /></button>
              <button className="sidebar-btn" onClick={() => (window as any).ipcRenderer.send('go-forward', { tabId: activeTabId })}><IconChevronRight size={18} /></button>
              <button className="sidebar-btn" onClick={() => (window as any).ipcRenderer.send('navigate-view', { tabId: activeTabId, url: activeTab?.url })}><IconRotate size={18} /></button>
            </div>
            <div className="url-input-container" style={{ display: 'flex', gap: '8px' }}>
              <IconWorld size={14} color="var(--text-dim)" />
              <form onSubmit={handleNavigate} style={{ flex: 1 }}>
                <input
                  className="url-input"
                  placeholder="Search or enter URL"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </form>
              {activeTab?.url && (
                <button onClick={toggleBookmark} className="sidebar-btn" style={{ padding: '0 4px' }}>
                  {isCurrentBookmarked ? <IconStarFilled size={16} color="#f59e0b" /> : <IconStar size={16} />}
                </button>
              )}
            </div>
          </div>

          <div className="page-container" ref={pageContainerRef}>
            {showSettings ? (
              <Settings
                isDarkMode={isDarkMode}
                onToggleTheme={() => setIsDarkMode(!isDarkMode)}
                searchEngine={searchEngine}
                onSearchEngineChange={setSearchEngine}
              />
            ) : showHistory ? (
              <HistoryView history={history} onNavigate={(url: string) => { setUrlInput(url); handleNavigate(undefined, url); }} onClear={() => setHistory([])} />
            ) : showBookmarks ? (
              <BookmarksView bookmarks={bookmarks} onNavigate={(url: string) => { setUrlInput(url); handleNavigate(undefined, url); }} />
            ) : showDownloads ? (
              <DownloadsView downloads={downloads} onClear={() => setDownloads([])} />
            ) : activeTab?.isDiscovery ? (
              <Discovery
                query={activeTab.url}
                onBrowse={() => handleNavigate(undefined, getSearchUrl(activeTab.url))}
              />
            ) : !activeTab?.url ? (
              <StartPage />
            ) : (
              <div className="native-view-placeholder" key={activeTabId} style={{ backgroundColor: 'var(--bg-main)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--accent)', opacity: 0.3 }}>
                  <IconRotate size={32} className="spin" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
