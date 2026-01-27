import { ReactNode } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { FontStyle, FontWeight, NumberProp } from 'react-native-svg'

// ============================================================================
// Slice Types
// ============================================================================

export type SliceLabel = {
    text: string
    fill?: string
    stroke?: string
    fontSize?: NumberProp
    fontWeight?: FontWeight
    fontFamily?: string
    fontStyle?: FontStyle
    offsetX?: number
    offsetY?: number
}

export type Slice = {
    value: number
    color: string
    label?: SliceLabel
}

export type Cover = {
    radius: number
    color?: string
}

// ============================================================================
// Tooltip Types
// ============================================================================

export type TooltipStyle = {
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
    borderRadius?: number
    width?: number
    height?: number
    shadow?: boolean
}

export type TooltipRenderData = {
    slice: Slice
    index: number
    value: number
    percentage: number
    total: number
    position: { x: number; y: number }
    arrowDirection: 'top' | 'bottom' | 'left' | 'right'
    close: () => void
}

export type TooltipContentData = {
    slice: Slice
    index: number
    value: number
    percentage: number
    total: number
    close: () => void
}

// ============================================================================
// Style Types
// ============================================================================

export type OuterBorderStyle = {
    width?: number
    color?: string
}

export type CenterLabelConfig = {
    label?: string
    value?: string | number
    labelColor?: string
    valueColor?: string
    labelFontSize?: number
    valueFontSize?: number
    labelFontWeight?: FontWeight
    valueFontWeight?: FontWeight
    fontFamily?: string
    offsetY?: number
    gap?: number
    showTotal?: boolean
    valueFormatter?: (value: number) => string
}

// ============================================================================
// Animation Types
// ============================================================================

export type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'

export type AnimationConfig = {
    enabled?: boolean
    duration?: number
    easing?: EasingType
    delay?: number
    sequential?: boolean
    sequentialDelay?: number
    selectionScale?: number
    /**
     * Opacity of unselected slices when a slice is selected.
     * Default: 0.5
     */
    unselectedOpacity?: number
    /**
     * Whether to animate the opacity change.
     * Default: true
     */
    animateOpacity?: boolean
    /**
     * Whether to expand the slice when selected.
     * Default: true
     */
    enableSelectionScale?: boolean
}

// ============================================================================
// Component Props
// ============================================================================

export type PieChartProps = {
    widthAndHeight: number
    series: Slice[]
    cover?: number | Cover
    style?: StyleProp<ViewStyle>
    padAngle?: number
    showTooltip?: boolean
    alwaysShowTooltips?: boolean
    tooltipDelay?: number
    tooltipStyle?: TooltipStyle
    showOuterBorder?: boolean
    outerBorderStyle?: OuterBorderStyle
    radiusScale?: number
    animation?: boolean | AnimationConfig
    centerLabel?: CenterLabelConfig
    children?: ReactNode
    onSlicePress?: (index: number, slice: Slice) => void
    onAnimationComplete?: () => void
    debug?: boolean
    renderTooltip?: (data: TooltipRenderData) => ReactNode
    renderTooltipContent?: (data: TooltipContentData) => ReactNode
}
