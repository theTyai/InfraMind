import { useEffect, useRef, useState } from 'react'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import styles from './MermaidDiagram.module.css'

let mermaidReady = false
let mermaidInit = null

async function getMermaid() {
  if (mermaidReady) return window.__mermaid
  if (mermaidInit) return mermaidInit

  mermaidInit = import('mermaid').then(m => {
    const mermaid = m.default
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose', // Allow click event callbacks
      theme: 'base',
      darkMode: true,
      themeVariables: {
        darkMode: true,
        background: '#000000',
        mainBkg: '#050505',
        lineColor: '#2563eb', // Electric blue connection lines
        primaryColor: '#2563eb',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#1e293b',
        secondaryColor: '#0a0a0a',
        tertiaryColor: '#111111',
        nodeBorder: '#1e293b',
        clusterBkg: '#0a0a0a',
        clusterBorder: '#1e293b',
        edgeLabelBackground: '#000000',
        titleColor: '#f8fafc',
        fontSize: '12px',
        fontFamily: '"JetBrains Mono", monospace',
        actorBkg: '#050505',
        actorBorder: '#2563eb',
        actorTextColor: '#f8fafc',
        actorLineColor: '#2563eb',
        signalColor: '#2563eb',
        signalTextColor: '#f8fafc',
        activationBkgColor: '#0c0c0c',
        activationBorderColor: '#2563eb',
        sequenceNumberColor: '#60a5fa',
        noteBkgColor: '#0a0a0a',
        noteTextColor: '#f8fafc',
        noteBorderColor: '#1e293b',
      },
      flowchart: {
        curve: 'basis',
        useMaxWidth: false, // Turn off so we can control pan/zoom dimensions
        htmlLabels: true,
        nodeSpacing: 50,
        rankSpacing: 60,
      },
      sequence: {
        diagramMarginX: 30,
        diagramMarginY: 20,
        actorMargin: 80,
        width: 160,
        height: 45,
        boxMargin: 10,
        useMaxWidth: false,
        showSequenceNumbers: false,
      }
    })
    window.__mermaid = mermaid
    mermaidReady = true
    return mermaid
  })
  return mermaidInit
}

let diagramCounter = 0

export default function MermaidDiagram({ code, title, onSelectNode }) {
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const [error, setError] = useState('')
  const [rendered, setRendered] = useState(false)
  const idRef = useRef(`mermaid-${++diagramCounter}`)

  // Pan & Zoom States
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Define a global callback for Mermaid node clicks
  useEffect(() => {
    window.onNodeClick = (nodeId) => {
      if (onSelectNode) {
        onSelectNode(nodeId)
      }
    }
    return () => {
      delete window.onNodeClick
    }
  }, [onSelectNode])

  // Reset viewport when code changes
  useEffect(() => {
    setScale(1)
    setPan({ x: 0, y: 0 })
  }, [code])

  useEffect(() => {
    if (!code || !containerRef.current) return
    let cancelled = false

    setRendered(false)
    setError('')

    getMermaid().then(async mermaid => {
      if (cancelled) return
      try {
        const { svg } = await mermaid.render(idRef.current + '-svg', code)
        if (cancelled) return
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
          
          // Select and style SVG element
          const svgEl = containerRef.current.querySelector('svg')
          if (svgEl) {
            svgEl.style.width = '100%'
            svgEl.style.height = '100%'
            svgEl.style.display = 'block'
            svgEl.style.overflow = 'visible'
          }

          // Attach direct DOM click listeners for maximum reliability
          const nodeGroups = containerRef.current.querySelectorAll('.node, .actor')
          nodeGroups.forEach((node) => {
            node.style.cursor = 'pointer'
            
            // Highlight node borders on hover
            node.addEventListener('mouseenter', () => {
              const rects = node.querySelectorAll('rect, polygon, circle, ellipse, path')
              rects.forEach(r => {
                r.style.stroke = '#2563eb'
                r.style.strokeWidth = '2px'
              })
            })

            node.addEventListener('mouseleave', () => {
              const rects = node.querySelectorAll('rect, polygon, circle, ellipse, path')
              rects.forEach(r => {
                r.style.stroke = ''
                r.style.strokeWidth = ''
              })
            })

            node.addEventListener('click', (e) => {
              e.stopPropagation()
              // Find the text elements inside
              const textEl = node.querySelector('.label') || node
              const textContent = textEl.textContent?.trim() || ''
              
              if (onSelectNode) {
                // If it contains a newline or code markers, clean it up
                const cleanLabel = textContent.split('\n')[0].replace(/[\(\[\{\}\]\)]/g, '').trim()
                onSelectNode(cleanLabel)
              }
            })
          })

          setRendered(true)
        }
      } catch (e) {
        if (!cancelled) {
          setError(`Diagram render error: ${e.message}`)
          if (containerRef.current) containerRef.current.innerHTML = ''
        }
      }
    })

    return () => { cancelled = true }
  }, [code, onSelectNode])

  // Drag-to-Pan Handlers
  function handleMouseDown(e) {
    if (e.button !== 0) return // Left click only
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  function handleMouseMove(e) {
    if (!isDragging) return
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }

  function handleMouseUp() {
    setIsDragging(false)
  }

  // Scroll-to-Zoom Handler
  function handleWheel(e) {
    e.preventDefault()
    const zoomFactor = 0.08
    const direction = e.deltaY < 0 ? 1 : -1
    setScale((prev) => {
      const next = prev + direction * zoomFactor
      return Math.max(0.4, Math.min(2.5, next))
    })
  }

  // Zoom Button Triggers
  function zoomIn() {
    setScale((prev) => Math.min(2.5, prev + 0.15))
  }

  function zoomOut() {
    setScale((prev) => Math.max(0.4, prev - 0.15))
  }

  function resetZoom() {
    setScale(1)
    setPan({ x: 0, y: 0 })
  }

  return (
    <div className={styles.wrap}>
      {title && <div className={styles.title}>{title}</div>}
      
      {/* Pan & Zoom Canvas Window */}
      <div 
        ref={wrapperRef}
        className={`${styles.diagramBox} ${isDragging ? styles.grabbing : styles.grab}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div 
          ref={containerRef} 
          className={styles.mermaid} 
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />

        {/* Floating Canvas Zoom Controls */}
        {rendered && !error && (
          <div className={styles.canvasControls} onMouseDown={(e) => e.stopPropagation()}>
            <button type="button" onClick={zoomIn} title="Zoom In"><ZoomIn size={14} /></button>
            <button type="button" onClick={zoomOut} title="Zoom Out"><ZoomOut size={14} /></button>
            <button type="button" onClick={resetZoom} title="Reset View"><Maximize2 size={12} /></button>
            <span className={styles.zoomPercent}>{Math.round(scale * 100)}%</span>
          </div>
        )}

        {!rendered && !error && (
          <div className={styles.placeholder}>
            <span className={styles.placeholderDot} />
            <span className={styles.placeholderDot} style={{ animationDelay: '0.2s' }} />
            <span className={styles.placeholderDot} style={{ animationDelay: '0.4s' }} />
          </div>
        )}
        
        {error && (
          <div className={styles.error} onMouseDown={(e) => e.stopPropagation()}>
            <code>{error}</code>
            <pre className={styles.errorCode}>{code}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
