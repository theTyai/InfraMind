// src/App.jsx
import { useState, useCallback, useEffect } from 'react'
import AppShell from './components/layout/AppShell.jsx'
import LandingPage from './components/workspace/LandingPage.jsx'
import Dashboard from './components/workspace/Dashboard.jsx'
import GenerationStream from './components/workspace/GenerationStream.jsx'
import CommandPalette from './components/ui/CommandPalette.jsx'
import AuthModal from './components/workspace/AuthModal.jsx'
import { useArchitecture } from './hooks/useArchitecture.js'
import { exportToPdf } from './utils/exportPdf.js'
import { useAuth } from './hooks/useAuth.js'
import { useArchitectureStore } from './store/useArchitectureStore.js'
import SettingsModal from './components/workspace/SettingsModal.jsx'
import TemplatesModal from './components/workspace/TemplatesModal.jsx'
import DocsModal from './components/workspace/DocsModal.jsx'
import SavedArchitecturesModal from './components/workspace/SavedArchitecturesModal.jsx'

function getEnvKeyStatus(value) {
  if (!value) return 'missing'
  if (!/^AIza[\w-]{20,}$/.test(value)) return 'invalid'
  return 'valid'
}

export default function App() {
  const { state, data, error, generate, reset, load } = useArchitecture()
  const [lastIdea, setLastIdea]   = useState('')
  const [exporting, setExporting] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)
  
  // Auth state
  const { user, idToken, loading: authLoading, login, signup, logout, getFreshToken } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)

  // Modals state
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [docsOpen, setDocsOpen] = useState(false)
  const [templatesOpen, setTemplatesOpen] = useState(false)
  const [savedOpen, setSavedOpen] = useState(false)

  // Zustand State Store SELECTORS
  const projects = useArchitectureStore(state => state.projects)
  const chatHistories = useArchitectureStore(state => state.chatHistories)
  const currentProjectId = useArchitectureStore(state => state.currentProjectId)
  const fetchProjects = useArchitectureStore(state => state.fetchProjects)
  const clearStore = useArchitectureStore(state => state.clearStore)

  // Sync projects list on auth state change
  useEffect(() => {
    if (user && idToken) {
      fetchProjects(idToken)
    } else if (!authLoading && !user) {
      clearStore()
    }
  }, [user, idToken, authLoading, fetchProjects, clearStore])

  // Automatically update lastIdea from loaded chat history
  useEffect(() => {
    if (currentProjectId && chatHistories[currentProjectId]) {
      const history = chatHistories[currentProjectId]
      const latestMsg = history[history.length - 1]
      if (latestMsg) {
        setLastIdea(latestMsg.prompt)
      }
    }
  }, [currentProjectId, chatHistories])

  const envKey = process.env.REACT_APP_GEMINI_API_KEY || ''
  const envKeyStatus = getEnvKeyStatus(envKey)
  const [search, setSearch] = useState('')
  const [commandOpen, setCommandOpen] = useState(false)

  // Keybindings for command palette (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeydown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  const handleSubmit = useCallback(async ({ idea, knownStack }) => {
    setLastIdea(idea)
    setSelectedNode(null)
    try {
      const token = await getFreshToken()
      if (!token) {
        setAuthOpen(true)
        return
      }
      await generate({ idea, knownStack, idToken: token })
    } catch (err) {
      console.error(err)
    }
  }, [generate, getFreshToken])

  const handleSelectRecent = useCallback(async (project) => {
    setSelectedNode(null)
    try {
      const token = await getFreshToken()
      if (!token) {
        setAuthOpen(true)
        return
      }
      await load({ projectId: project.id, idToken: token })
    } catch (err) {
      console.error(err)
    }
  }, [load, getFreshToken])

  const handleReset = useCallback(() => {
    setSelectedNode(null)
    useArchitectureStore.getState().setCurrentProjectId(null)
    reset()
  }, [reset])

  const handleExport = useCallback(async () => {
    if (!data) return
    setExporting(true)
    try {
      await exportToPdf(data, lastIdea)
    } catch (e) {
      console.error('PDF export failed:', e)
      alert('PDF export failed: ' + e.message)
    } finally {
      setExporting(false)
    }
  }, [data, lastIdea])

  const handleLogout = useCallback(async () => {
    try {
      await logout()
      handleReset()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }, [logout, handleReset])

  const appUser = user ? {
    name: user.displayName || user.email.split('@')[0],
    email: user.email
  } : null

  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        height: '100vh', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#0a0a0c', 
        color: 'white', 
        fontFamily: 'IBM Plex Sans, sans-serif' 
      }}>
        Loading secure session...
      </div>
    )
  }

  // Phase 1: Public Landing Page or Dashboard
  if (state === 'idle') {
    if (appUser) {
      return (
        <>
          <Dashboard
            onSubmit={handleSubmit}
            user={appUser}
            onLogout={handleLogout}
            history={projects}
            onSelectRecent={handleSelectRecent}
            onOpenTemplates={() => setTemplatesOpen(true)}
            onOpenDocs={() => setDocsOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
          />
          <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
          <TemplatesModal 
            isOpen={templatesOpen} 
            onClose={() => setTemplatesOpen(false)} 
            onSelectTemplate={handleSubmit} 
          />
          <DocsModal isOpen={docsOpen} onClose={() => setDocsOpen(false)} />
        </>
      )
    }

    return (
      <>
        <LandingPage
          onOpenAuth={() => setAuthOpen(true)}
          onOpenDocs={() => setDocsOpen(true)}
        />
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          login={login}
          signup={signup}
        />
        <DocsModal isOpen={docsOpen} onClose={() => setDocsOpen(false)} />
      </>
    )
  }

  // Phase 2: Engine Room Loader Overlay
  if (state === 'loading') {
    return <GenerationStream />
  }

  // Phase 3: Internal Workspace (IDE-style)
  return (
    <>
      <AppShell
        state={state}
        data={data}
        error={error}
        lastIdea={lastIdea}
        history={projects}
        onSubmit={handleSubmit}
        onReset={handleReset}
        onExport={handleExport}
        exporting={exporting}
        envKeyStatus={envKeyStatus}
        searchValue={search}
        onSearchChange={setSearch}
        onOpenCommand={() => setCommandOpen(true)}
        selectedNode={selectedNode}
        onSelectNode={setSelectedNode}
        onSelectProject={handleSelectRecent}
        user={appUser}
        onLogout={handleLogout}
        onOpenTemplates={() => setTemplatesOpen(true)}
        onOpenSaved={() => setSavedOpen(true)}
        onOpenDocs={() => setDocsOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <CommandPalette visible={commandOpen} onClose={() => setCommandOpen(false)} />
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        login={login}
        signup={signup}
      />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <TemplatesModal 
        isOpen={templatesOpen} 
        onClose={() => setTemplatesOpen(false)} 
        onSelectTemplate={handleSubmit} 
      />
      <DocsModal isOpen={docsOpen} onClose={() => setDocsOpen(false)} />
      <SavedArchitecturesModal 
        isOpen={savedOpen} 
        onClose={() => setSavedOpen(false)} 
        history={projects} 
        onSelectProject={handleSelectRecent} 
      />
    </>
  )
}
