import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import Workspace from '../workspace/Workspace.jsx'
import styles from './AppShell.module.css'

export default function AppShell(props) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className={`${styles.shell} ${!sidebarOpen ? styles.sidebarCollapsed : ''}`}>
      {/* Sidebar */}
      <aside className={styles.sidebarSlot}>
        {sidebarOpen ? (
          <Sidebar
            history={props.history}
            onNewProject={props.onReset}
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
        ) : (
          <button
            type="button"
            className={styles.sidebarToggle}
            onClick={() => setSidebarOpen(true)}
            title="Expand sidebar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 3v18"/>
            </svg>
          </button>
        )}
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
