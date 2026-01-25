import * as d3 from 'd3-shape'
import { EasingType, Slice } from './types'

// ============================================================================
// Constants
// ============================================================================

export const DEFAULTS = {
    radiusScale: 0.40,
    padAngle: 0,
    showTooltip: true,
    tooltipDelay: 3000,
    showOuterBorder: true,
}

export const TOOLTIP_DEFAULTS = {
    backgroundColor: 'white',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 8,
    width: 90,
    height: 50,
    shadow: true,
    arrowSize: 6,
    margin: 10,
}

export const OUTER_BORDER_DEFAULTS = {
    width: 5,
    color: 'white',
}

export const ANIMATION_DEFAULTS = {
    enabled: true,
    duration: 800,
    delay: 0,
    easing: 'easeOut' as EasingType,
    sequential: false,
    sequentialDelay: 100,
    selectionScale: 1.05,
    scaleAnimationDuration: 200,
}

export const CENTER_LABEL_DEFAULTS = {
    labelColor: '#666',
    valueColor: '#000',
    labelFontSize: 14,
    valueFontSize: 24,
    labelFontWeight: '600' as const,
    valueFontWeight: 'bold' as const,
    offsetY: 0,
    gap: 6,
}

// ============================================================================
// Easing Functions
// ============================================================================

export const easingFunctions: Record<EasingType, (t: number) => number> = {
    linear: (t) => t,
    easeIn: (t) => t * t * t,
    easeOut: (t) => 1 - Math.pow(1 - t, 3),
    easeInOut: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
}

// ============================================================================
// Validation
// ============================================================================

export function validateSeries(series: Slice[]): void {
    series.forEach((s) => {
        if (s.value < 0) {
            throw Error(`Invalid series: all numbers should be positive. The invalid slice: ${JSON.stringify(s)}`)
        }
        if (!s.color) {
            throw Error(`'color' is mandatory in the series. The invalid slice: ${JSON.stringify(s)}`)
        }
    })

    const sum = series.reduce((acc, current) => acc + current.value, 0)
    if (sum <= 0) {
        throw Error('Invalid series: sum of series is zero')
    }
}

export function validateCoverRadius(coverRadius: number | undefined): void {
    if (coverRadius != null && (coverRadius <= 0 || coverRadius >= 1)) {
        throw Error(`Invalid "coverRadius": It should be between zero and one. But it's ${coverRadius}`)
    }
}

// ============================================================================
// Arc Calculations
// ============================================================================

export function generateArcs(series: Slice[]) {
    return d3
        .pie<Slice>()
        .sort(null)
        .value((d) => d.value)(series)
}

export function createArcGenerator(
    outerRadius: number,
    innerRadius: number,
    startAngle: number,
    endAngle: number,
    padAngle?: number
) {
    let generator: any = d3.arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadius)
        .startAngle(startAngle)
        .endAngle(endAngle)

    if (padAngle) {
        generator = generator.padAngle(padAngle)
    }

    return generator
}

// ============================================================================
// Tooltip Position Calculations
// ============================================================================

export type ArrowDirection = 'top' | 'bottom' | 'left' | 'right'

export function calculateTooltipPosition(
    midAngle: number,
    tipX: number,
    tipY: number,
    centerX: number,
    centerY: number,
    boxWidth: number,
    boxHeight: number,
    margin: number
): { left: number; top: number; arrowDirection: ArrowDirection } {
    const degrees = (midAngle * 180) / Math.PI
    const absoluteTipX = centerX + tipX
    const absoluteTipY = centerY + tipY

    let left: number, top: number
    let arrowDirection: ArrowDirection

    if (degrees >= 315 || degrees < 45) {
        left = absoluteTipX - boxWidth / 2
        top = absoluteTipY - boxHeight - margin
        arrowDirection = 'bottom'
    } else if (degrees >= 45 && degrees < 135) {
        left = absoluteTipX + margin
        top = absoluteTipY - boxHeight / 2
        arrowDirection = 'left'
    } else if (degrees >= 135 && degrees < 225) {
        left = absoluteTipX - boxWidth / 2
        top = absoluteTipY + margin
        arrowDirection = 'top'
    } else {
        left = absoluteTipX - boxWidth - margin
        top = absoluteTipY - boxHeight / 2
        arrowDirection = 'right'
    }

    return { left, top, arrowDirection }
}

export function getArrowStyle(
    direction: ArrowDirection,
    boxWidth: number,
    boxHeight: number,
    arrowSize: number,
    backgroundColor: string
): Record<string, any> {
    switch (direction) {
        case 'bottom':
            return {
                bottom: -arrowSize,
                left: boxWidth / 2 - arrowSize,
                borderLeftWidth: arrowSize,
                borderRightWidth: arrowSize,
                borderTopWidth: arrowSize,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderTopColor: backgroundColor,
            }
        case 'top':
            return {
                top: -arrowSize,
                left: boxWidth / 2 - arrowSize,
                borderLeftWidth: arrowSize,
                borderRightWidth: arrowSize,
                borderBottomWidth: arrowSize,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: backgroundColor,
            }
        case 'left':
            return {
                left: -arrowSize,
                top: boxHeight / 2 - arrowSize,
                borderTopWidth: arrowSize,
                borderBottomWidth: arrowSize,
                borderRightWidth: arrowSize,
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent',
                borderRightColor: backgroundColor,
            }
        case 'right':
            return {
                right: -arrowSize,
                top: boxHeight / 2 - arrowSize,
                borderTopWidth: arrowSize,
                borderBottomWidth: arrowSize,
                borderLeftWidth: arrowSize,
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent',
                borderLeftColor: backgroundColor,
            }
    }
}

// ============================================================================
// Centroid Calculations
// ============================================================================

export function calculateTipPosition(
    midAngle: number,
    radius: number,
    coverRadius: number | undefined
): [number, number] {
    const innerRadiusVal = coverRadius ? coverRadius * radius : 0
    const tipRadius = (radius + innerRadiusVal) / 2
    return d3.arc()
        .outerRadius(tipRadius)
        .innerRadius(tipRadius)
        .startAngle(midAngle)
        .endAngle(midAngle)
        .centroid(null as any)
}
