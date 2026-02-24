import React, { useEffect, useState } from 'react'

interface StartPageProps { }

const StartPage: React.FC<StartPageProps> = () => {
    const [text, setText] = useState('')
    const fullText = 'Journey · Explore · Beyond'
    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (index < fullText.length) {
            const timeout = setTimeout(() => {
                setText((prev) => prev + fullText[index])
                setIndex((prev) => prev + 1)
            }, 100)
            return () => clearTimeout(timeout)
        }
    }, [index, fullText])

    return (
        <div className="start-page animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
            <div className="bg-drift"></div>
            <h1 className="start-jeb animate-slide-up">JEB</h1>
            <div className="start-subtitle animate-slide-up delay-1" style={{ minHeight: '1.5em' }}>
                <span className={index === fullText.length ? '' : 'typewriter'}>
                    {text}
                </span>
            </div>
            <p className="animate-slide-up delay-2" style={{ color: 'var(--text-dim)', fontSize: '13px', marginBottom: '40px' }}>Type a URL or search query above</p>
        </div>
    )
}

export default StartPage
