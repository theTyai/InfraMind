import { useState, useRef } from 'react'
import {
  ArrowRight, Layers, Zap, LogOut, User,
  Sparkles, Database, Cloud, Network, Settings,
  BookOpen, Clock, Plus, ChevronRight, Cpu
} from 'lucide-react'
import Logo from '../ui/Logo.jsx'
import Footer from '../Footer.jsx'
import { getTechIconUrl } from '../../utils/techIcons.js'
import styles from './Dashboard.module.css'

const PRESET_CHIPS = [
  { label: '🚗 Ride Sharing', idea: 'A real-time ride sharing app with driver dispatching, geo-tracking, stripe payments, and redis caching.', tags: ['React', 'Node.js', 'PostgreSQL', 'Redis'] },
  { label: '🛍️ E-Commerce', idea: 'Multi-vendor e-commerce store with product search, cart caching, stripe billing, and inventory tracking.', tags: ['Next.js', 'Express', 'MongoDB', 'Stripe'] },
  { label: '📈 IoT Pipeline', idea: 'Ingests millions of telemetry updates per minute, processes alerts via streaming rules, and aggregates stats.', tags: ['Kafka', 'Apache Spark', 'InfluxDB', 'Node.js'] },
  { label: '📝 Doc Editor', idea: 'A collaborative rich-text document editor like Google Docs with real-time sync and document version history.', tags: ['React', 'WebSockets', 'Yjs', 'Redis'] },
]

const TEMPLATE_PRESETS = [
  {
    id: 'ride-sharing',
    title: 'Ride Sharing Platform',
    desc: 'Real-time driver dispatch, geo-tracking, payment gateways, and high-concurrency queuing.',
    prompt: 'A real-time ride sharing app with driver dispatching, geo-tracking, stripe payments, and redis caching.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'WebSockets', 'Stripe'],
    icon: Network,
    color: '#3b82f6',
  },
  {
    id: 'saas-billing',
    title: 'Multi-Tenant B2B SaaS',
    desc: 'Subscription billing, tenant isolation, OAuth SSO, and centralized admin dashboards.',
    prompt: 'A B2B SaaS platform with subscription billing, multi-tenant database partitioning, Okta SSO integration, and analytics dashboard.',
    stack: ['Next.js', 'Express', 'MongoDB', 'Stripe', 'Auth0'],
    icon: Layers,
    color: '#8b5cf6',
  },
  {
    id: 'iot-telemetry',
    title: 'IoT Telemetry Pipeline',
    desc: 'Process millions of sensor updates per minute, stream alerts, and aggregate analytics.',
    prompt: 'An IoT analytics system that processes millions of temperature telemetry messages per second, aggregates data, and raises alerts via slack.',
    stack: ['Kafka', 'Apache Spark', 'InfluxDB', 'Node.js', 'Redis'],
    icon: Database,
    color: '#06b6d4',
  },
  {
    id: 'doc-collab',
    title: 'Collaborative Doc Editor',
    desc: 'CRDT-based rich-text sync, live cursor indicators, and document version history.',
    prompt: 'A collaborative rich-text document editor like Google Docs with real-time sync and document version history.',
    stack: ['React', 'WebSockets', 'Yjs', 'Redis', 'Express', 'PostgreSQL'],
    icon: Sparkles,
    color: '#10b981',
  },
]

const TECH_SUGGESTIONS = [
  'React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis',
  'Docker', 'AWS', 'GCP', 'Stripe', 'GraphQL', 'Next.js', 'Kafka', 'Kubernetes',
]

export default function Dashboard({
  onSubmit,
  user,
  onLogout,
  history = [],
  onSelectRecent,
  onOpenTemplates,
  onOpenDocs,
  onOpenSettings,
}) {
  const [idea, setIdea] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const tagInputRef = useRef(null)

  function handleTagInput(e) {
    const value = e.target.value
    setTagInput(value)
    if (!value.trim()) { setSuggestions([]); return }
    setSuggestions(
      TECH_SUGGESTIONS
        .filter((t) => t.toLowerCase().includes(value.toLowerCase()) && !tags.includes(t))
        .slice(0, 5)
    )
  }

  function addTag(tech) {
    const v = tech.trim()
    if (!v || tags.includes(v) || tags.length >= 8) return
    setTags((p) => [...p, v])
    setTagInput('')
    setSuggestions([])
    tagInputRef.current?.focus()
  }

  function removeTag(tag) {
    setTags((p) => p.filter((t) => t !== tag))
  }

  function handleTagKeyDown(e) {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      addTag(tagInput)
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags((p) => p.slice(0, -1))
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault()
    if (!idea.trim()) return
    onSubmit({ idea: idea.trim(), knownStack: tags })
  }

  function loadPreset(preset) {
    setIdea(preset.idea)
    setTags(preset.tags)
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className={styles.wrapper}>
      {/* Ambient Background */}
      <div className={styles.ambientBg}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>

      {/* ── Navbar ── */}
      <nav className={styles.navbar}>
        <div className={styles.navInner}>
          <div className={styles.logoBlock}>
            <Logo size={30} showText={true} />
          </div>

          <div className={styles.navCenter}>
            <button type="button" className={styles.navPill} onClick={onOpenTemplates}>
              <Layers size={13} />
              Templates
            </button>
            <button type="button" className={styles.navPill} onClick={onOpenDocs}>
              <BookOpen size={13} />
              Docs
            </button>
            <button type="button" className={styles.navPill} onClick={onOpenSettings}>
              <Settings size={13} />
              Settings
            </button>
          </div>

          <div className={styles.navRight}>
            <div className={styles.userChip}>
              <div className={styles.userAvatar}>
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <span className={styles.userName}>{user?.name}</span>
            </div>
            <button
              type="button"
              className={styles.signOutBtn}
              onClick={onLogout}
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className={styles.main}>
        {/* ── Composer Hero ── */}
        <section className={styles.composerSection}>
          <div className={styles.composerInner}>
            <div className={styles.composerGreeting}>
              <Cpu size={16} className={styles.greetingIcon} />
              <span>{greeting()}, {user?.name?.split(' ')[0]}.</span>
            </div>
            <h1 className={styles.composerTitle}>
              What are we{' '}
              <span className={styles.composerTitleAccent}>building</span>{' '}
              today?
            </h1>
            <p className={styles.composerSubtitle}>
              Describe your system — InfraMind generates a complete architecture blueprint, API specs, and database schemas in seconds.
            </p>

            <form className={styles.composerForm} onSubmit={handleFormSubmit}>
              {/* Textarea */}
              <div className={styles.textareaBox}>
                <textarea
                  id="dashboard-textarea"
                  className={styles.textarea}
                  placeholder="e.g. 'A real-time ride sharing app with driver dispatching, geo-tracking, stripe payments, and Redis caching'"
                  value={idea}
                  rows={4}
                  onChange={(e) => setIdea(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleFormSubmit(e)
                  }}
                />
                <div className={styles.textareaFooter}>
                  <div className={styles.presetRow}>
                    <span className={styles.presetLabel}>Try:</span>
                    {PRESET_CHIPS.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        className={styles.presetChip}
                        onClick={() => loadPreset(p)}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <span className={styles.kbHint}>⌘↵ to generate</span>
                </div>
              </div>

              {/* Stack Input */}
              <div className={styles.stackBox}>
                <div className={styles.stackHeader}>
                  <label htmlFor="dashboard-stack-input" className={styles.stackLabel}>
                    Preferred Stack
                  </label>
                  <span className={styles.stackHint}>Optional — up to 8 technologies</span>
                </div>
                <div className={styles.tagArea} onClick={() => tagInputRef.current?.focus()}>
                  {tags.map((tag) => {
                    const icon = getTechIconUrl(tag)
                    return (
                      <span key={tag} className={styles.tag}>
                        {icon && (
                          <img src={icon} alt="" className={styles.tagIcon} onError={(e) => { e.target.style.display = 'none' }} />
                        )}
                        {tag}
                        <button type="button" className={styles.tagX} onClick={(e) => { e.stopPropagation(); removeTag(tag) }}>×</button>
                      </span>
                    )
                  })}
                  <input
                    id="dashboard-stack-input"
                    ref={tagInputRef}
                    type="text"
                    className={styles.tagInput}
                    placeholder={tags.length === 0 ? 'React, AWS, PostgreSQL...' : ''}
                    value={tagInput}
                    onChange={handleTagInput}
                    onKeyDown={handleTagKeyDown}
                  />
                </div>
                {suggestions.length > 0 && (
                  <div className={styles.suggestions}>
                    {suggestions.map((tech) => {
                      const icon = getTechIconUrl(tech)
                      return (
                        <button key={tech} type="button" className={styles.suggestionBtn} onClick={() => addTag(tech)}>
                          {icon && <img src={icon} alt="" className={styles.tagIcon} onError={(e) => { e.target.style.display = 'none' }} />}
                          + {tech}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <button type="submit" className={styles.generateBtn} disabled={!idea.trim()}>
                <Zap size={16} />
                Generate Architecture Blueprint
                <ArrowRight size={16} className={styles.btnArrow} />
              </button>
            </form>
          </div>
        </section>

        {/* ── Recent Projects ── */}
        {history.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <Clock size={15} />
                Recent Architectures
              </div>
              <button type="button" className={styles.sectionAction} onClick={onOpenTemplates}>
                View all <ChevronRight size={13} />
              </button>
            </div>
            <div className={styles.recentGrid}>
              {history.slice(0, 3).map((project) => (
                <button
                  key={project.id}
                  type="button"
                  className={styles.recentCard}
                  onClick={() => onSelectRecent && onSelectRecent(project)}
                >
                  <div className={styles.recentCardTop}>
                    <div className={styles.recentCardIcon}>
                      <Layers size={14} />
                    </div>
                    <span className={styles.recentCardTitle}>{project.title || 'Untitled project'}</span>
                  </div>
                  {project.summary && (
                    <p className={styles.recentCardSummary}>{project.summary}</p>
                  )}
                  <div className={styles.recentCardMeta}>
                    <span>{project.metrics?.layers || 0} layers</span>
                    <span className={styles.dot}>·</span>
                    <span>{project.metrics?.apis || 0} APIs</span>
                    <span className={styles.dot}>·</span>
                    <span>{project.metrics?.dbSchema || project.metrics?.models || 0} models</span>
                  </div>
                  <div className={styles.recentCardCta}>
                    Open Workspace <ArrowRight size={12} />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Template Gallery ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Sparkles size={15} />
              Architecture Templates
            </div>
            <button type="button" className={styles.sectionAction} onClick={onOpenTemplates}>
              Browse all <ChevronRight size={13} />
            </button>
          </div>
          <p className={styles.sectionDesc}>
            Start from a pre-configured blueprint to jump-start your architecture design.
          </p>
          <div className={styles.templatesGrid}>
            {TEMPLATE_PRESETS.map((tmpl) => {
              const Icon = tmpl.icon
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  className={styles.templateCard}
                  style={{ '--tmpl-color': tmpl.color }}
                  onClick={() => onSubmit({ idea: tmpl.prompt, knownStack: tmpl.stack })}
                >
                  <div className={styles.templateCardAccent} />
                  <div className={styles.templateIconWrap}>
                    <Icon size={16} />
                  </div>
                  <h3 className={styles.templateTitle}>{tmpl.title}</h3>
                  <p className={styles.templateDesc}>{tmpl.desc}</p>
                  <div className={styles.templateTags}>
                    {tmpl.stack.slice(0, 4).map((tech) => {
                      const icon = getTechIconUrl(tech)
                      return (
                        <span key={tech} className={styles.templateTag}>
                          {icon && (
                            <img src={icon} alt="" className={styles.templateTagIcon} onError={(e) => { e.target.style.display = 'none' }} />
                          )}
                          {tech}
                        </span>
                      )
                    })}
                  </div>
                  <div className={styles.templateUseBtn}>
                    Use Template <ArrowRight size={12} />
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── Quick Actions ── */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <Plus size={15} />
            Quick Actions
          </div>
          <div className={styles.quickActions}>
            <button type="button" className={styles.quickBtn} onClick={onOpenTemplates}>
              <Layers size={18} />
              <span>Browse Templates</span>
            </button>
            <button type="button" className={styles.quickBtn} onClick={onOpenDocs}>
              <BookOpen size={18} />
              <span>Documentation</span>
            </button>
            <button type="button" className={styles.quickBtn} onClick={onOpenSettings}>
              <Settings size={18} />
              <span>API Key Settings</span>
            </button>
            <button type="button" className={styles.quickBtn} onClick={() => onSubmit({ idea: 'A scalable cloud-native SaaS platform with multi-tenancy, event sourcing, and CQRS pattern.', knownStack: ['Next.js', 'AWS', 'PostgreSQL', 'Kafka'] })}>
              <Cloud size={18} />
              <span>Generate SaaS Demo</span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
