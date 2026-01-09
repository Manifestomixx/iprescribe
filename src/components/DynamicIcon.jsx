import { useState, useEffect } from 'react'

export default function DynamicIcon({ src, svgContent: propSvgContent, isActive, className = '', style = {} }) {
    const needsFetch = !propSvgContent && src && !(typeof src === 'string' && src.trim().startsWith('<svg'))
    const [fetchedSvg, setFetchedSvg] = useState('')
    const [loading, setLoading] = useState(needsFetch)

    useEffect(() => {
        if (!needsFetch) {
            return
        }

        fetch(src)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.text()
            })
            .then(svg => {
                setFetchedSvg(svg)
                setLoading(false)
            })
            .catch((err) => {
                console.error('Error loading SVG:', err, 'Source:', src)
                setLoading(false)
            })
    }, [src, propSvgContent, needsFetch])

    const svgContent = propSvgContent || (typeof src === 'string' && src.trim().startsWith('<svg') ? src : fetchedSvg)

    if (loading) {
        return (
            <div 
                style={{ 
                    width: style.width || '24px', 
                    height: style.height || '24px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} 
            />
        )
    }

    if (svgContent) {
        const fillColor = isActive ? '#283C85' : 'white'
        const strokeColor = isActive ? '#283C85' : 'white'

        let coloredSvg = svgContent
        
        coloredSvg = coloredSvg.replace(/fill="([^"]*)"/g, (match, value) => {
            if (value === 'none' || value === 'transparent') {
                return match
            }
            return `fill="${fillColor}"`
        })
        coloredSvg = coloredSvg.replace(/fill='([^']*)'/g, (match, value) => {
            if (value === 'none' || value === 'transparent') {
                return match
            }
            return `fill="${fillColor}"`
        })
        
        coloredSvg = coloredSvg.replace(/stroke="([^"]*)"/g, (match, value) => {
            if (value === 'none' || value === 'transparent') {
                return match
            }
            return `stroke="${strokeColor}"`
        })
        coloredSvg = coloredSvg.replace(/stroke='([^']*)'/g, (match, value) => {
            if (value === 'none' || value === 'transparent') {
                return match
            }
            return `stroke="${strokeColor}"`
        })

        return (
            <span
                className={className}
                style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    ...style 
                }}
                dangerouslySetInnerHTML={{ __html: coloredSvg }}
            />
        )
    }

    return (
        <img 
            src={src} 
            alt="icon" 
            className={className} 
            style={{ 
                ...style,
                display: 'inline-block',
                filter: isActive 
                    ? 'brightness(0) saturate(100%) invert(18%) sepia(95%) saturate(2000%) hue-rotate(210deg) brightness(0.5) contrast(1.2)' 
                    : 'brightness(0) invert(1)',
            }} 
        />
    )
}

