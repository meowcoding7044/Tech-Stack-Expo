import { useEffect, useRef, useState } from 'react'
import { AnimationConfig, EasingType } from './types'
import { ANIMATION_DEFAULTS, easingFunctions } from './utils'

// ============================================================================
// Animation Hook
// ============================================================================

export function usePieAnimation(
    seriesLength: number,
    config: AnimationConfig = {},
    onComplete?: () => void
) {
    const [progress, setProgress] = useState<number[]>([])
    const animationRef = useRef<number | null>(null)

    const {
        enabled = ANIMATION_DEFAULTS.enabled,
        duration = ANIMATION_DEFAULTS.duration,
        easing = ANIMATION_DEFAULTS.easing,
        delay = ANIMATION_DEFAULTS.delay,
        sequential = ANIMATION_DEFAULTS.sequential,
        sequentialDelay = ANIMATION_DEFAULTS.sequentialDelay,
    } = config

    useEffect(() => {
        if (!enabled) {
            setProgress(Array(seriesLength).fill(1))
            return
        }

        setProgress(Array(seriesLength).fill(0))

        const easingFn = easingFunctions[easing]
        const startTime = performance.now() + delay

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime

            if (elapsed < 0) {
                animationRef.current = requestAnimationFrame(animate)
                return
            }

            const newProgress = Array(seriesLength).fill(0).map((_, index) => {
                const sliceDelay = sequential ? index * sequentialDelay : 0
                const sliceElapsed = elapsed - sliceDelay

                if (sliceElapsed < 0) return 0

                const prog = Math.min(sliceElapsed / duration, 1)
                return easingFn(prog)
            })

            setProgress(newProgress)

            const allComplete = newProgress.every(p => p >= 1)

            if (!allComplete) {
                animationRef.current = requestAnimationFrame(animate)
            } else {
                onComplete?.()
            }
        }

        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [seriesLength, enabled, duration, easing, delay, sequential, sequentialDelay])

    return { progress, enabled }
}

// ============================================================================
// Selection Scale Hook
// ============================================================================

export function useSelectionScale(
    seriesLength: number,
    selectedIndex: number | null,
    animationEnabled: boolean,
    selectionScale: number = ANIMATION_DEFAULTS.selectionScale
) {
    const [scales, setScales] = useState<number[]>(Array(seriesLength).fill(1))

    useEffect(() => {
        const targetScales = Array(seriesLength).fill(0).map((_, i) =>
            selectedIndex === i ? selectionScale : 1
        )

        if (!animationEnabled) {
            setScales(targetScales)
            return
        }

        const startScales = [...scales]
        const startTime = performance.now()
        const duration = ANIMATION_DEFAULTS.scaleAnimationDuration

        const animateScale = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easedProgress = easingFunctions.easeOut(progress)

            const newScales = startScales.map((start, i) => {
                const target = targetScales[i]
                return start + (target - start) * easedProgress
            })

            setScales(newScales)

            if (progress < 1) {
                requestAnimationFrame(animateScale)
            }
        }

        requestAnimationFrame(animateScale)
    }, [selectedIndex, animationEnabled, selectionScale, seriesLength])

    return scales
}

// ============================================================================
// Selection Hook
// ============================================================================

export function useSelection(autoHideDelay: number) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    useEffect(() => {
        if (selectedIndex !== null && autoHideDelay > 0) {
            const timer = setTimeout(() => {
                setSelectedIndex(null)
            }, autoHideDelay)
            return () => clearTimeout(timer)
        }
    }, [selectedIndex, autoHideDelay])

    const toggle = (index: number) => {
        setSelectedIndex(selectedIndex === index ? null : index)
    }

    const clear = () => setSelectedIndex(null)

    return { selectedIndex, toggle, clear }
}
