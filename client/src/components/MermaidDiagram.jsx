// src/components/MermaidDiagram.jsx
import { useEffect, useRef, useState } from 'react'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
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
  const [error, setError] = useState('')
  const [svgContent, setSvgContent] = useState('')
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const idRef = useRef(`mermaid-${++diagramCounter}`)

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
    setSvgContent('')
    setDimensions({ width: 0, height: 0 })
  }, [code])

  // Mermaid Renderer
  useEffect(() => {
    if (!code) return
    let cancelled = false

    setError('')

    getMermaid().then(async mermaid => {
      if (cancelled) return
      try {
        const svgId = `${idRef.current}-svg`
        const { svg } = await mermaid.render(svgId, code)
        if (cancelled) return

        // Parse viewBox dimensions
        const parser = new DOMParser()
        const doc = parser.parseFromString(svg, 'image/svg+xml')
        const svgEl = doc.querySelector('svg')
        let w = 800
        let h = 600
        if (svgEl) {
          const viewBox = svgEl.getAttribute('viewBox')
          if (viewBox) {
            const parts = viewBox.split(/\s+/)
            if (parts.length === 4) {
              w = parseFloat(parts[2])
              h = parseFloat(parts[3])
            }
          }
        }

        setDimensions({ width: w, height: h })
        setSvgContent(svg)
      } catch (e) {
        if (!cancelled) {
          setError(`Diagram render error: ${e.message}`)
          setSvgContent('')
          setDimensions({ width: 0, height: 0 })
        }
      }
    })

    return () => { cancelled = true }
  }, [code])

  // DOM node listener attacher
  useEffect(() => {
    if (!svgContent || !containerRef.current) return

    // Style SVG element inside container
    const svgEl = containerRef.current.querySelector('svg')
    if (svgEl) {
      svgEl.style.width = '100%'
      svgEl.style.height = '100%'
      svgEl.style.display = 'block'
      svgEl.style.overflow = 'visible'
    }

    // Attach click and hover listeners
    const nodeGroups = containerRef.current.querySelectorAll('.node, .actor')
    nodeGroups.forEach((node) => {
      node.style.cursor = 'pointer'
      
      const rects = node.querySelectorAll('rect, polygon, circle, ellipse, path')
      
      const onEnter = () => {
        rects.forEach(r => {
          r.style.stroke = '#2563eb'
          r.style.strokeWidth = '2px'
        })
      }
      
      const onLeave = () => {
        rects.forEach(r => {
          r.style.stroke = ''
          r.style.strokeWidth = ''
        })
      }
      
      const onClick = (e) => {
        e.stopPropagation()
        const textEl = node.querySelector('.label') || node
        const textContent = textEl.textContent?.trim() || ''
        if (onSelectNode) {
          const cleanLabel = textContent.split('\n')[0].replace(/[\(\[\{\}\]\)]/g, '').trim()
          onSelectNode(cleanLabel)
        }
      }

      node.addEventListener('mouseenter', onEnter)
      node.addEventListener('mouseleave', onLeave)
      node.addEventListener('click', onClick)
    })
  }, [svgContent, onSelectNode])

  const wrapperKey = `${idRef.current}-${code.length}-${dimensions.width}-${dimensions.height}`

  return (
    <div className={styles.wrap}>
      {title && <div className={styles.title}>{title}</div>}
      
      <div className={styles.diagramBox}>
        {svgContent && dimensions.width > 0 ? (
          <TransformWrapper
            key={wrapperKey}
            initialScale={1}
            minScale={0.25}
            maxScale={2.0}
            centerOnInit={true}
            limitToBounds={true}
            alignmentAnimation={{ disabled: true }}
            doubleClick={{ disabled: true }}
            panning={{ velocityDisabled: true }}
            wheel={{ step: 0.05 }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Floating Canvas Zoom Controls */}
                <div className={styles.canvasControls} onMouseDown={(e) => e.stopPropagation()}>
                  <button type="button" onClick={() => zoomIn()} title="Zoom In"><ZoomIn size={14} /></button>
                  <button type="button" onClick={() => zoomOut()} title="Zoom Out"><ZoomOut size={14} /></button>
                  <button type="button" onClick={() => resetTransform()} title="Reset View"><Maximize2 size={12} /></button>
                </div>

                <TransformComponent
                  wrapperStyle={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                  }}
                  contentStyle={{
                    width: `${dimensions.width}px`,
                    height: `${dimensions.height}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div 
                    ref={containerRef} 
                    className={styles.mermaid}
                    style={{ width: '100%', height: '100%' }}
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        ) : !error ? (
          <div className={styles.placeholder}>
            <span className={styles.placeholderDot} />
            <span className={styles.placeholderDot} style={{ animationDelay: '0.2s' }} />
            <span className={styles.placeholderDot} style={{ animationDelay: '0.4s' }} />
          </div>
        ) : (
          <div className={styles.error}>
            <code>{error}</code>
            <pre className={styles.errorCode}>{code}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
