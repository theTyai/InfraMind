// src/components/workspace/PublicShare.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Layers, ArrowRight, ExternalLink, AlertCircle, Cpu, Database, Network } from 'lucide-react'
import { getTechIconUrl } from '../../utils/techIcons.js'
import Logo from '../ui/Logo.jsx'
import styles from './PublicShare.module.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export default function PublicShare() {
  const { shareId } = useParams()
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    if (!shareId) return
    fetch(`${API_BASE}/public/${shareId}`)
      .then(r => { if (!r.ok) throw new Error('Architecture not found or has been revoked.'); return r.json() })
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [shareId])

  if (loading) {
    return (
      <div className={styles.center}>
        <div className={styles.spinner} />
        <p>Loading shared architecture…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.center}>
        <div className={styles.errorCard}>
          <AlertCircle size={32} className={styles.errorIcon} />
          <h2>Not Found</h2>
          <p>{error}</p>
          <Link to="/" className={styles.homeBtn}>Go to InfraMind →</Link>
        </div>
      </div>
    )
  }

  const arch = data?.architecture || {}

  return (
    <div className={styles.page}>
      {/* Ambient */}
      <div className={styles.ambient}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>

      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Logo size={28} showText />
          <div className={styles.navBadge}>
            <ExternalLink size={11} />
            Shared Architecture
          </div>
          <Link to="/" className={styles.navCta}>
            Try InfraMind free <ArrowRight size={13} />
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className={styles.main}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroBadge}>
            <Layers size={12} />
            AI-Generated Architecture Blueprint
          </div>
          <h1 className={styles.heroTitle}>{arch.projectTitle || data.title || 'Architecture'}</h1>
          <p className={styles.heroDesc}>{arch.projectSummary || data.summary}</p>
        </div>

        {/* Rationale */}
        {arch.architectureExplanation?.whyThisStack && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Architecture Rationale</h2>
            <p className={styles.cardText}>{arch.architectureExplanation.whyThisStack}</p>
          </div>
        )}

        {/* Tech Stack */}
        {arch.stack?.length > 0 && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Technology Stack</h2>
            <div className={styles.stackGrid}>
              {arch.stack.map((item, i) => {
                const icon = getTechIconUrl(item.recommendation)
                return (
                  <div key={i} className={styles.stackChip}>
                    {icon && <img src={icon} alt="" className={styles.chipIcon} onError={e => e.target.style.display='none'} />}
                    <span className={styles.chipLayer}>{item.layer}:</span>
                    <span className={styles.chipRec}>{item.recommendation}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Key Decisions */}
        {arch.architectureExplanation?.keyDecisions?.length > 0 && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Key System Decisions</h2>
            <ul className={styles.decisionsList}>
              {arch.architectureExplanation.keyDecisions.map((d, i) => (
                <li key={i} className={styles.decisionItem}>
                  <span className={styles.bullet}>✦</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* API Preview */}
        {arch.apis?.length > 0 && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Network size={15} /> API Endpoints ({arch.apis.length})
            </h2>
            <div className={styles.apiList}>
              {arch.apis.slice(0, 6).map((api, i) => (
                <div key={i} className={styles.apiRow}>
                  <span className={`${styles.methodBadge} ${styles[api.method]}`}>{api.method}</span>
                  <code className={styles.apiRoute}>{api.route}</code>
                  <span className={styles.apiDesc}>{api.description}</span>
                </div>
              ))}
              {arch.apis.length > 6 && (
                <p className={styles.moreHint}>+{arch.apis.length - 6} more endpoints</p>
              )}
            </div>
          </div>
        )}

        {/* DB Schema Preview */}
        {arch.dbSchema?.length > 0 && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Database size={15} /> Database Models ({arch.dbSchema.length})
            </h2>
            <div className={styles.dbGrid}>
              {arch.dbSchema.slice(0, 4).map((model, i) => (
                <div key={i} className={styles.dbCard}>
                  <strong className={styles.dbName}>{model.collection}</strong>
                  <span className={styles.dbFields}>{model.fields?.length || 0} fields</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className={styles.cta}>
          <div className={styles.ctaInner}>
            <Cpu size={20} className={styles.ctaIcon} />
            <div>
              <h3 className={styles.ctaTitle}>Design your own architecture</h3>
              <p className={styles.ctaDesc}>Generate production-ready blueprints for any system in seconds. Free to start.</p>
            </div>
            <Link to="/" className={styles.ctaBtn}>
              Start Building Free <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
