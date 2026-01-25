import * as d3 from 'd3-shape'
import { ArcData, EasingType, EndCapInfo, ProgressSegment, SegmentRadii } from './types'

// ============================================================================
// Constants
// ============================================================================

export const DEFAULT_THICKNESS = 0.18
export const DEFAULT_PAD_ANGLE = 0.04
export const DEFAULT_CORNER_RADIUS = 0

export const TOOLTIP_DEFAULTS = {
    show: true,
    backgroundColor: 'white',
    borderRadius: 12,
    shadow: true,
    width: 110,
    height: 70,
    autoHideDelay: 3000,
    offset: 15,
    arrowSize: 10,
}

export const CENTER_DEFAULTS = {
    labelColor: '#333',
    valueColor: '#000',
    labelFontSize: 16,
    valueFontSize: 48,
    labelFontWeight: '600' as const,
    valueFontWeight: 'bold' as const,
}

export const ANIMATION_DEFAULTS = {
    enabled: true,
    duration: 1000,
    delay: 0,
    easing: 'easeOut' as EasingType,
}

// Semi-circle angles
export const START_ANGLE = -Math.PI / 2  // Left (9 o'clock)
export const END_ANGLE = Math.PI / 2     // Right (3 o'clock)
export const TOTAL_ANGLE = END_ANGLE - START_ANGLE

// ============================================================================
// Easing Functions
// ============================================================================

export const easingFunctions: Record<EasingType, (t: number) => number> = {
    linear: (t) => t,
    easeIn: (t) => t * t,
    easeOut: (t) => t * (2 - t),
    easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
}

// ============================================================================
// Dimension Calculations
// ============================================================================

export function calculateDimensions(width: number, customHeight?: number, thickness = DEFAULT_THICKNESS) {
    const radius = width * 0.38
    const innerRadius = radius * (1 - thickness)
    const height = customHeight ?? width * 0.55
    const centerX = width / 2
    const centerY = height * 0.78

    return { radius, innerRadius, height, centerX, centerY }
}

// ============================================================================
// Arc Calculations
// ============================================================================

export function generateArcs(
    segments: ProgressSegment[],
    total: number,
    padAngle: number
): ArcData[] {
    const arcs: ArcData[] = []
    let currentAngle = START_ANGLE

    segments.forEach((segment, index) => {
        const segmentAngle = (segment.value / total) * TOTAL_ANGLE
        const arcStartAngle = currentAngle + (index > 0 ? padAngle / 2 : 0)
        const arcEndAngle = currentAngle + segmentAngle - (index < segments.length - 1 ? padAngle / 2 : 0)
        const midAngle = (arcStartAngle + arcEndAngle) / 2

        arcs.push({
            segment,
            startAngle: arcStartAngle,
            endAngle: arcEndAngle,
            midAngle,
            index,
        })

        currentAngle += segmentAngle
    })

    return arcs
}

// ============================================================================
// Segment Radii Calculations
// ============================================================================

export function calculateSegmentRadii(
    segment: ProgressSegment,
    baseThickness: number,
    referenceMidRadius: number
): SegmentRadii {
    const thicknessMult = segment.thicknessMultiplier ?? 1.0
    const segmentThickness = baseThickness * thicknessMult
    const segmentOuterRadius = referenceMidRadius + segmentThickness / 2
    const segmentInnerRadius = referenceMidRadius - segmentThickness / 2

    return { segmentOuterRadius, segmentInnerRadius, segmentThickness }
}

export function calculateReferenceMidRadius(
    segments: ProgressSegment[],
    radius: number,
    innerRadius: number
): number {
    const maxThicknessMult = Math.max(...segments.map(s => s.thicknessMultiplier ?? 1.0))
    const baseThickness = radius - innerRadius
    const maxSegmentThickness = baseThickness * maxThicknessMult
    const maxSegmentOuterRadius = radius
    const maxSegmentInnerRadius = radius - maxSegmentThickness

    return (maxSegmentOuterRadius + maxSegmentInnerRadius) / 2
}

// ============================================================================
// Arc Path Generation
// ============================================================================

export function generateArcPath(
    start: number,
    end: number,
    radii: SegmentRadii,
    segment: ProgressSegment,
    globalCornerRadius: number
): string {
    const { segmentOuterRadius, segmentInnerRadius, segmentThickness } = radii
    
    // If endCornerRadius is set but cornerRadius is not, use flat arc
    const hasEndCapOnly = segment.endCornerRadius !== undefined && segment.cornerRadius === undefined
    const segmentCornerRadius = hasEndCapOnly ? 0 : (segment.cornerRadius ?? globalCornerRadius)
    const maxCornerRadius = segmentThickness / 2
    const effectiveCornerRadius = Math.min(segmentCornerRadius, maxCornerRadius)

    // Shorten arc if endCornerRadius is set (to make room for cap)
    let adjustedEnd = end
    if (segment.endCornerRadius && segment.endCornerRadius > 0) {
        const midRadius = (segmentOuterRadius + segmentInnerRadius) / 2
        const capRadius = Math.min(segment.endCornerRadius, maxCornerRadius)
        const angleOffset = capRadius / midRadius
        adjustedEnd = end - angleOffset
    }

    const arcGenerator = d3
        .arc()
        .outerRadius(segmentOuterRadius)
        .innerRadius(segmentInnerRadius)
        .startAngle(start)
        .endAngle(adjustedEnd)
        .cornerRadius(effectiveCornerRadius)

    return arcGenerator(null as any) as string
}

// ============================================================================
// End Cap Calculations
// ============================================================================

export function calculateEndCapInfo(
    angle: number,
    radii: SegmentRadii,
    segment: ProgressSegment
): EndCapInfo {
    const { segmentOuterRadius, segmentInnerRadius, segmentThickness } = radii
    
    const maxCapRadius = segmentThickness / 2
    const capRadius = Math.min(segment.endCornerRadius ?? 0, maxCapRadius)
    const midRadius = (segmentOuterRadius + segmentInnerRadius) / 2
    
    // Position cap at the end of shortened arc
    const angleOffset = capRadius / midRadius
    const capCenterAngle = angle - angleOffset
    
    const x = midRadius * Math.sin(capCenterAngle)
    const y = -midRadius * Math.cos(capCenterAngle)

    return { x, y, capRadius }
}

// ============================================================================
// Centroid Calculation
// ============================================================================

export function calculateArcCentroid(
    start: number,
    end: number,
    radii: SegmentRadii
): { x: number; y: number } {
    const { segmentOuterRadius, segmentInnerRadius } = radii

    const arcGenerator = d3
        .arc()
        .outerRadius(segmentOuterRadius)
        .innerRadius(segmentInnerRadius)
        .startAngle(start)
        .endAngle(end)

    const centroid = arcGenerator.centroid(null as any)
    return { x: centroid[0], y: centroid[1] }
}

// ============================================================================
// Tooltip Position Calculations
// ============================================================================

export type TooltipPosition = {
    left: number
    top: number
    arrowStyle: Record<string, any>
    isLeftSide: boolean
}

export function calculateTooltipPosition(
    midAngle: number,
    midX: number,
    midY: number,
    centerX: number,
    centerY: number,
    boxWidth: number,
    boxHeight: number,
    tooltipOffset: number,
    tooltipBg: string,
    arrowSize: number
): TooltipPosition {
    // Determine arrow direction based on midAngle
    const isLeftSide = midAngle < 0
    
    // Arrow tip position (center of slice bar)
    const arrowTipX = centerX + midX
    const arrowTipY = centerY + midY
    
    // Arrow vertical position (centered in box)
    const arrowTopPx = boxHeight / 2 - arrowSize

    let left: number
    let top: number
    let arrowStyle: Record<string, any>

    if (isLeftSide) {
        // Tooltip to the left
        left = arrowTipX - boxWidth - tooltipOffset
        top = arrowTipY - boxHeight / 2
        arrowStyle = {
            right: -arrowSize,
            top: arrowTopPx,
            borderTopWidth: arrowSize,
            borderBottomWidth: arrowSize,
            borderLeftWidth: arrowSize,
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
            borderLeftColor: tooltipBg,
        }
    } else {
        // Tooltip to the right
        left = arrowTipX + tooltipOffset
        top = arrowTipY - boxHeight / 2
        arrowStyle = {
            left: -arrowSize,
            top: arrowTopPx,
            borderTopWidth: arrowSize,
            borderBottomWidth: arrowSize,
            borderRightWidth: arrowSize,
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
            borderRightColor: tooltipBg,
        }
    }

    return { left, top, arrowStyle, isLeftSide }
}

// ============================================================================
// Mid Point Calculation (for tooltip arrow target)
// ============================================================================

export function calculateMidPoint(
    arc: ArcData,
    radii: SegmentRadii
): { midX: number; midY: number; midAngle: number } {
    const segmentMidRadius = (radii.segmentOuterRadius + radii.segmentInnerRadius) / 2
    const midAngle = (arc.startAngle + arc.endAngle) / 2
    const midX = segmentMidRadius * Math.sin(midAngle)
    const midY = -segmentMidRadius * Math.cos(midAngle)

    return { midX, midY, midAngle }
}
