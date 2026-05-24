import { useEffect } from 'react'
import styles from './CommandPalette.module.css'

const COMMANDS = [
  { label: 'Add a new microservice', hint: 'Cmd+K' },
  { label: 'Search workspace' },
  { label: 'Update complexity score' },
  { label: 'Export architecture PDF' },
  { label: 'Copy architecture summary' },
]

export default function CommandPalette({ visible, onClose }) {
  useEffect(() => {
    if (!visible) return

    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [visible, onClose])

  if (!visible) return null

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.panel} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <p className={styles.label}>Command Palette</p>
            <h2 className={styles.title}>Recent</h2>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.commandList}>
          {COMMANDS.map((command) => (
            <button key={command.label} type="button" className={styles.commandItem}>
              <div>
                <strong>{command.label}</strong>
                {command.hint && <p>{command.hint}</p>}
              </div>
            </button>
          ))}
        </div>

        <div className={styles.footer}>Press <span>Esc</span> to close</div>
      </div>
    </div>
  )
}
