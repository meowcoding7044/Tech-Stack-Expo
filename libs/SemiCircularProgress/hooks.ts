import { useEffect, useState } from 'react'
import { AnimationConfig, EasingType } from './types'
import { ANIMATION_DEFAULTS, easingFunctions } from './utils'

// ============================================================================
// Animation Hook
// ============================================================================

export function useProgressAnimation(config: AnimationConfig = {}) {
    const [animationProgress, setAnimationProgress] = useState(0)

    const {
        enabled = ANIMATION_DEFAULTS.enabled,
        duration = ANIMATION_DEFAULTS.duration,
        delay = ANIMATION_DEFAULTS.delay,
        easing = ANIMATION_DEFAULTS.easing,
    } = config

    useEffect(() => {
        if (!enabled) {
            setAnimationProgress(1)
            return
        }

        let startTime: number | null = null
        let animationFrame: number
        let delayTimeout: ReturnType<typeof setTimeout>

        const animate = (timestamp: number) => {
            if (startTime === null) {
                startTime = timestamp
            }

            const elapsed = timestamp - startTime
            const rawProgress = Math.min(elapsed / duration, 1)
            const easedProgress = easingFunctions[easing](rawProgress)

            setAnimationProgress(easedProgress)

            if (rawProgress < 1) {
                animationFrame = requestAnimationFrame(animate)
            }
        }

        delayTimeout = setTimeout(() => {
            animationFrame = requestAnimationFrame(animate)
        }, delay)

        return () => {
            clearTimeout(delayTimeout)
            if (animationFrame) {
                cancelAnimationFrame(animationFrame)
            }
        }
    }, [enabled, duration, delay, easing])

    return animationProgress
}

// ============================================================================
// Selection Hook
// ============================================================================

export function useSegmentSelection(autoHideDelay: number) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    useEffect(() => {
        if (selectedIndex !== null && autoHideDelay > 0) {
            const timer = setTimeout(() => {
                setSelectedIndex(null)
            }, autoHideDelay)
            return () => clearTimeout(timer)
        }
    }, [selectedIndex, autoHideDelay])

    const toggleSelection = (index: number) => {
        setSelectedIndex(selectedIndex === index ? null : index)
    }

    const clearSelection = () => {
        setSelectedIndex(null)
    }

    return { selectedIndex, toggleSelection, clearSelection }
}
