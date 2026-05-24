import ArchitectureTabs from './ArchitectureTabs.jsx'
import styles from './Workspace.module.css'

export default function Workspace(props) {
  if (props.state === 'error' && props.error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3>Generation Failed</h3>
        <p className={styles.errorDesc}>{props.error}</p>
        <button 
          type="button" 
          className={styles.errorResetBtn} 
          onClick={props.onReset}
        >
          Return to Dashboard
        </button>
      </div>
    )
  }

  if (!props.data) {
    return <div className={styles.emptyState}>Preparing workspace canvas…</div>
  }

  return (
    <main className={styles.workspace}>
      <ArchitectureTabs
        data={props.data}
        idea={props.lastIdea}
        onExport={props.onExport}
        onScaffold={props.onScaffold}
        onOpenShare={props.onOpenShare}
        exporting={props.exporting}
        onSubmit={props.onSubmit}
        envKeyStatus={props.envKeyStatus}
        selectedNode={props.selectedNode}
        onSelectNode={props.onSelectNode}
      />
    </main>

  )
}
