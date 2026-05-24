import Logo from './ui/Logo.jsx'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <Logo size={24} showText={true} />
          <p className={styles.copy}>
            Enterprise-grade, AI-powered system architecture planner. Describe your project and get production-ready stack maps, schema collections, API specs, and roadmap milestones in seconds.
          </p>
          <div className={styles.legalCopy}>
            &copy; {new Date().getFullYear()} InfraMind Technologies Inc. All rights reserved.
          </div>
        </div>

        <div className={styles.links}>
          <div className={styles.linkGroup}>
            <span className={styles.groupTitle}>Platform</span>
            <a href="#features">Features</a>
            <a href="#docs">Documentation</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className={styles.linkGroup}>
            <span className={styles.groupTitle}>Features</span>
            <a href="#inst-arch">Instant Blueprints</a>
            <a href="#db-schemas">Schema Models</a>
            <a href="#api-specs">API Specs</a>
            <a href="#pdf-export">PDF Export</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
