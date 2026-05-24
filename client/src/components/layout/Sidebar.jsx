import { Plus, Layers, BookOpen, Settings2, ChevronLeft, LogOut, Clock, Cpu } from 'lucide-react'
import Logo from '../ui/Logo.jsx'
import styles from './Sidebar.module.css'

export default function Sidebar({
  history = [],
  onNewProject,
  onClose,
  onSelectProject,
  activeIdea,
  user,
  onLogout,
  onOpenTemplates,
  onOpenSaved,
  onOpenDocs,
  onOpenSettings,
}) {
  return (
    <aside className={styles.sidebar}>

      {/* ── TOP: User Profile ── */}
      {user && (
        <div className={styles.userBlock}>
          <div className={styles.userAvatar}>
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className={styles.userMeta}>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.userEmail} title={user.email}>{user.email}</span>
          </div>
          <button
            type="button"
            className={styles.logoutBtn}
            onClick={onLogout}
            title="Sign out"
          >
            <LogOut size={13} />
          </button>
        </div>
      )}

      {/* ── New Architecture Button ── */}
      <button className={styles.newBtn} type="button" onClick={onNewProject}>
        <Plus size={14} />
        <span>New Architecture</span>
      </button>

      {/* ── Active Project Brief (if any) ── */}
      {activeIdea && (
        <div className={styles.activeCard}>
          <div className={styles.activeCardLabel}>
            <Cpu size={11} />
            Active
          </div>
          <p className={styles.activeCardText} title={activeIdea}>
            {activeIdea.length > 100 ? `${activeIdea.slice(0, 97)}…` : activeIdea}
          </p>
        </div>
      )}

      {/* ── Past Projects (scrollable) ── */}
      <div className={styles.projectsSection}>
        <div className={styles.sectionLabel}>
          <Clock size={11} />
          Past Projects
        </div>
        <div className={styles.projectList}>
          {history.length === 0 ? (
            <div className={styles.emptyState}>
              No projects yet.<br />Generate your first architecture above.
            </div>
          ) : (
            history.slice(0, 8).map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.projectItem}
                onClick={() => onSelectProject && onSelectProject(item)}
                title={item.title || 'Untitled project'}
              >
                <div className={styles.projectDot} />
                <div className={styles.projectMeta}>
                  <span className={styles.projectName}>{item.title || 'Untitled project'}</span>
                  <span className={styles.projectStats}>
                    {item.metrics?.layers || 0}L · {item.metrics?.apis || 0} APIs
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Spacer ── */}
      <div className={styles.spacer} />

      {/* ── Settings ── */}
      <div className={styles.bottomNav}>
        <button
          type="button"
          className={styles.bottomNavBtn}
          onClick={onOpenDocs}
        >
          <BookOpen size={14} />
          <span>Documentation</span>
        </button>
        <button
          type="button"
          className={styles.bottomNavBtn}
          onClick={onOpenSettings}
        >
          <Settings2 size={14} />
          <span>Settings</span>
        </button>
      </div>

      {/* ── Company Branding (very bottom) ── */}
      <div className={styles.brandFooter}>
        <Logo size={22} showText={true} />
        {onClose && (
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={onClose}
            title="Collapse sidebar"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

    </aside>
  )
}
