import { ReactNode } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

// ============================================================================
// Segment Types
// ============================================================================

export type ProgressSegment = {
    /** Value of this segment */
    value: number
    /** Color of this segment */
    color: string
    /** Label text for tooltip (main value like "220") */
    label?: string
    /** Secondary label (e.g., "100% Checked") */
    sublabel?: string
    /** Sublabel color override (defaults to segment color) */
    sublabelColor?: string
    /** Thickness multiplier (1.0 = default, 1.2 = 20% thicker) */
    thicknessMultiplier?: number
    /** Corner radius in pixels (uniform rounding) */
    cornerRadius?: number
    /** Corner radius only at the END of segment */
    endCornerRadius?: number
}

// ============================================================================
// Tooltip Types
// ============================================================================

export type TooltipConfig = {
    /** Show tooltips on press. Default: true */
    show?: boolean
    /** Background color. Default: 'white' */
    backgroundColor?: string
    /** Border radius. Default: 12 */
    borderRadius?: number
    /** Shadow enabled. Default: true */
    shadow?: boolean
    /** Custom width. Default: 110 */
    width?: number
    /** Custom height. Default: 70 */
    height?: number
    /** Auto hide delay in ms. Default: 3000 (0 = no auto hide) */
    autoHideDelay?: number
    /** Distance from slice bar to tooltip. Default: 15 */
    offset?: number
}

export type TooltipRenderData = {
    segment: ProgressSegment
    index: number
    position: { x: number; y: number }
    arrowDirection: 'left' | 'right'
    close: () => void
}

export type TooltipContentData = {
    segment: ProgressSegment
    index: number
    close: () => void
}

// ============================================================================
// Animation Types
// ============================================================================

export type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'

export type AnimationConfig = {
    /** Enable animation. Default: true */
    enabled?: boolean
    /** Duration in milliseconds. Default: 1000 */
    duration?: number
    /** Delay before start in milliseconds. Default: 0 */
    delay?: number
    /** Easing function. Default: 'easeOut' */
    easing?: EasingType
}

// ============================================================================
// Center Content Types
// ============================================================================

export type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'

export type CenterConfig = {
    /** Center label text */
    label?: string
    /** Center value */
    value?: string | number
    /** Label color. Default: '#333' */
    labelColor?: string
    /** Value color. Default: '#000' */
    valueColor?: string
    /** Label font size. Default: 16 */
    labelFontSize?: number
    /** Value font size. Default: 48 */
    valueFontSize?: number
    /** Label font weight. Default: '600' */
    labelFontWeight?: FontWeight
    /** Value font weight. Default: 'bold' */
    valueFontWeight?: FontWeight
}

export type ChartRenderData = {
    total: number
    segments: ProgressSegment[]
    selectedIndex: number | null
    animationProgress: number
    dimensions: {
        width: number
        height: number
        radius: number
        innerRadius: number
        centerX: number
        centerY: number
    }
}

// ============================================================================
// Arc Types (Internal)
// ============================================================================

export type ArcData = {
    segment: ProgressSegment
    startAngle: number
    endAngle: number
    midAngle: number
    index: number
}

export type SegmentRadii = {
    segmentOuterRadius: number
    segmentInnerRadius: number
    segmentThickness: number
}

export type EndCapInfo = {
    x: number
    y: number
    capRadius: number
}

// ============================================================================
// Component Props
// ============================================================================

export type SemiCircularProgressProps = {
    /** Width of the component */
    width: number
    /** Height of the component */
    height?: number
    /** Progress segments */
    segments: ProgressSegment[]
    /** Thickness as percentage of radius. Default: 0.18 */
    thickness?: number
    /** Center content - ReactNode or render function */
    children?: ReactNode | ((data: ChartRenderData) => ReactNode)
    /** Center content configuration */
    center?: CenterConfig
    /** @deprecated Use center.label */
    centerLabel?: string
    /** @deprecated Use center.value */
    centerValue?: string | number
    /** @deprecated Use center.labelColor */
    centerLabelColor?: string
    /** @deprecated Use center.valueColor */
    centerValueColor?: string
    /** @deprecated Use center.labelFontSize */
    centerLabelFontSize?: number
    /** @deprecated Use center.valueFontSize */
    centerValueFontSize?: number
    /** Tooltip configuration */
    tooltip?: TooltipConfig
    /** Gap between segments in radians. Default: 0.04 */
    padAngle?: number
    /** Corner radius for all segments. Default: 0 */
    cornerRadius?: number
    /** Container style */
    style?: StyleProp<ViewStyle>
    /** Vertical offset for center content */
    centerOffset?: number
    /** Debug mode */
    debug?: boolean
    /** Animation configuration */
    animation?: AnimationConfig
    /** Callback when segment is pressed */
    onSegmentPress?: (index: number, segment: ProgressSegment) => void
    /** Custom tooltip render function (full control) */
    renderTooltip?: (data: TooltipRenderData) => ReactNode
    /** Custom tooltip content render function */
    renderTooltipContent?: (data: TooltipContentData) => ReactNode
}
