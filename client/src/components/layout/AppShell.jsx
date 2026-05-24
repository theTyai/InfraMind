import { useState, useEffect } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import Workspace from '../workspace/Workspace.jsx'
import styles from './AppShell.module.css'

export default function AppShell(props) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 1024 : false)
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth > 1024 : true)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024
      setIsMobile(mobile)
      if (mobile) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={`${styles.shell} ${!sidebarOpen ? styles.sidebarCollapsed : ''}`}>
      {/* Sidebar Backdrop for Mobile */}
      {sidebarOpen && (
        <div 
          className={styles.sidebarBackdrop} 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Slot */}
      <aside className={`${styles.sidebarSlot} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <Sidebar
          collapsed={!sidebarOpen && !isMobile}
          history={props.history}
          onNewProject={props.onReset}
          onToggle={() => setSidebarOpen(p => !p)}
          onClose={() => setSidebarOpen(false)}
          onSelectProject={props.onSelectProject}
          activeIdea={props.lastIdea}
          user={props.user}
          onLogout={props.onLogout}
          onOpenTemplates={props.onOpenTemplates}
          onOpenSaved={props.onOpenSaved}
          onOpenDocs={props.onOpenDocs}
          onOpenSettings={props.onOpenSettings}
        />
      </aside>

      {/* Main Column */}
      <div className={styles.centerColumn}>
        <Topbar
          state={props.state}
          envKeyStatus={props.envKeyStatus}
          searchValue={props.searchValue}
          onSearchChange={props.onSearchChange}
          onOpenCommand={props.onOpenCommand}
          user={props.user}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(p => !p)}
          onOpenSettings={props.onOpenSettings}
        />
        <div className={styles.workspaceContainer}>
          <Workspace {...props} />
        </div>
      </div>
    </div>
  )
}

