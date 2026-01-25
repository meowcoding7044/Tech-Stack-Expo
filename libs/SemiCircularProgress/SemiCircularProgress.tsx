import { JSX } from 'react'
import { View } from 'react-native'
import { G, Svg } from 'react-native-svg'

import {
    ArcSegments,
    ArrowTargetMarker,
    CenterContent,
    CustomTooltipWrapper,
    DebugInfoPanel,
    DebugSvgElements,
    Tooltip,
} from './components'
import { useProgressAnimation, useSegmentSelection } from './hooks'
import { ChartRenderData, SemiCircularProgressProps, SegmentRadii, TooltipRenderData } from './types'
import {
    calculateDimensions,
    calculateMidPoint,
    calculateReferenceMidRadius,
    calculateSegmentRadii,
    calculateTooltipPosition,
    CENTER_DEFAULTS,
    DEFAULT_CORNER_RADIUS,
    DEFAULT_PAD_ANGLE,
    DEFAULT_THICKNESS,
    generateArcs,
    TOOLTIP_DEFAULTS,
} from './utils'

const SemiCircularProgress = ({
    width,
    height: customHeight,
    segments,
    thickness = DEFAULT_THICKNESS,
    children,
    center,
    // Legacy props
    centerLabel: legacyCenterLabel,
    centerValue: legacyCenterValue,
    centerLabelColor: legacyCenterLabelColor,
    centerValueColor: legacyCenterValueColor,
    centerLabelFontSize: legacyCenterLabelFontSize,
    centerValueFontSize: legacyCenterValueFontSize,
    tooltip = {},
    padAngle = DEFAULT_PAD_ANGLE,
    cornerRadius: globalCornerRadius = DEFAULT_CORNER_RADIUS,
    style,
    centerOffset: customCenterOffset,
    debug = false,
    animation = {},
    onSegmentPress,
    renderTooltip,
    renderTooltipContent,
}: SemiCircularProgressProps): JSX.Element => {
    // ========================================================================
    // Hooks
    // ========================================================================
    
    const animationProgress = useProgressAnimation(animation)
    
    const {
        show: showTooltip = TOOLTIP_DEFAULTS.show,
        backgroundColor: tooltipBg = TOOLTIP_DEFAULTS.backgroundColor,
        borderRadius: tooltipBorderRadius = TOOLTIP_DEFAULTS.borderRadius,
        shadow: tooltipShadow = TOOLTIP_DEFAULTS.shadow,
        width: tooltipWidth = TOOLTIP_DEFAULTS.width,
        height: tooltipHeight = TOOLTIP_DEFAULTS.height,
        autoHideDelay = TOOLTIP_DEFAULTS.autoHideDelay,
        offset: tooltipOffset = TOOLTIP_DEFAULTS.offset,
    } = tooltip

    const { selectedIndex, toggleSelection, clearSelection } = useSegmentSelection(autoHideDelay)

    // ========================================================================
    // Merge Config with Legacy Props
    // ========================================================================
    
    const centerLabel = center?.label ?? legacyCenterLabel
    const centerValue = center?.value ?? legacyCenterValue
    const centerLabelColor = center?.labelColor ?? legacyCenterLabelColor ?? CENTER_DEFAULTS.labelColor
    const centerValueColor = center?.valueColor ?? legacyCenterValueColor ?? CENTER_DEFAULTS.valueColor
    const centerLabelFontSize = center?.labelFontSize ?? legacyCenterLabelFontSize ?? CENTER_DEFAULTS.labelFontSize
    const centerValueFontSize = center?.valueFontSize ?? legacyCenterValueFontSize ?? CENTER_DEFAULTS.valueFontSize
    const centerLabelFontWeight = center?.labelFontWeight ?? CENTER_DEFAULTS.labelFontWeight
    const centerValueFontWeight = center?.valueFontWeight ?? CENTER_DEFAULTS.valueFontWeight

    // ========================================================================
    // Calculations
    // ========================================================================
    
    const { radius, innerRadius, height, centerX, centerY } = calculateDimensions(width, customHeight, thickness)
    const total = segments.reduce((sum, s) => sum + s.value, 0)
    const arcs = generateArcs(segments, total, padAngle)
    
    const baseThickness = radius - innerRadius
    const referenceMidRadius = calculateReferenceMidRadius(segments, radius, innerRadius)

    const getSegmentRadii = (index: number): SegmentRadii => {
        return calculateSegmentRadii(segments[index], baseThickness, referenceMidRadius)
    }

    // ========================================================================
    // Event Handlers
    // ========================================================================
    
    const handleSegmentPress = (index: number) => {
        toggleSelection(index)
        onSegmentPress?.(index, segments[index])
    }

    // ========================================================================
    // Chart Data for Render Functions
    // ========================================================================
    
    const chartData: ChartRenderData = {
        total,
        segments,
        selectedIndex,
        animationProgress,
        dimensions: { width, height, radius, innerRadius, centerX, centerY },
    }

    // ========================================================================
    // Center Content
    // ========================================================================
    
    const defaultCenterOffset = innerRadius * 0.35
    const centerOffsetValue = customCenterOffset ?? defaultCenterOffset
    const hasCenterContent = children || centerLabel || centerValue !== undefined

    // ========================================================================
    // Tooltip Calculations
    // ========================================================================
    
    const renderSelectedTooltip = () => {
        if (!showTooltip || selectedIndex === null) return null

        const arc = arcs[selectedIndex]
        const { segment } = arc
        const radii = getSegmentRadii(selectedIndex)
        const { midX, midY, midAngle } = calculateMidPoint(arc, radii)
        const arrowDirection: 'left' | 'right' = midAngle < 0 ? 'right' : 'left'

        const tooltipData: TooltipRenderData = {
            segment,
            index: selectedIndex,
            position: { x: centerX + midX, y: centerY + midY },
            arrowDirection,
            close: clearSelection,
        }

        // Custom render tooltip (full control)
        if (renderTooltip) {
            return <CustomTooltipWrapper data={tooltipData} renderTooltip={renderTooltip} />
        }

        // Default tooltip
        const hasCustomContent = !!renderTooltipContent
        if (!hasCustomContent && !segment.label && !segment.sublabel) return null

        const { left, top, arrowStyle } = calculateTooltipPosition(
            midAngle,
            midX,
            midY,
            centerX,
            centerY,
            tooltipWidth,
            tooltipHeight,
            tooltipOffset,
            tooltipBg,
            TOOLTIP_DEFAULTS.arrowSize
        )

        return (
            <Tooltip
                segment={segment}
                index={selectedIndex}
                left={left}
                top={top}
                width={tooltipWidth}
                height={tooltipHeight}
                backgroundColor={tooltipBg}
                borderRadius={tooltipBorderRadius}
                shadow={tooltipShadow}
                arrowStyle={arrowStyle}
                hasCustomContent={hasCustomContent}
                onClose={clearSelection}
                renderContent={renderTooltipContent}
            />
        )
    }

    // ========================================================================
    // Debug Elements
    // ========================================================================
    
    const renderDebugArrowTarget = () => {
        if (!debug || !showTooltip || selectedIndex === null) return null

        const arc = arcs[selectedIndex]
        const radii = getSegmentRadii(selectedIndex)
        const { midX, midY } = calculateMidPoint(arc, radii)

        return <ArrowTargetMarker targetX={centerX + midX} targetY={centerY + midY} />
    }

    // ========================================================================
    // Render
    // ========================================================================
    
    return (
        <View
            style={[
                { width, height, overflow: 'visible' },
                debug && { borderColor: '#68696E', borderWidth: 1 },
                style,
            ]}
        >
            <Svg width={width} height={height} style={{ overflow: 'visible' }}>
                <G transform={`translate(${centerX}, ${centerY})`}>
                    <ArcSegments
                        arcs={arcs}
                        animationProgress={animationProgress}
                        globalCornerRadius={globalCornerRadius}
                        getSegmentRadii={getSegmentRadii}
                        onSegmentPress={handleSegmentPress}
                    />
                    
                    {debug && (
                        <DebugSvgElements
                            radius={radius}
                            arcs={arcs}
                            getSegmentRadii={getSegmentRadii}
                        />
                    )}
                </G>
            </Svg>

            {hasCenterContent && (
                <CenterContent
                    centerY={centerY}
                    offset={centerOffsetValue}
                    children={children}
                    chartData={chartData}
                    label={centerLabel}
                    value={centerValue}
                    labelColor={centerLabelColor}
                    valueColor={centerValueColor}
                    labelFontSize={centerLabelFontSize}
                    valueFontSize={centerValueFontSize}
                    labelFontWeight={centerLabelFontWeight}
                    valueFontWeight={centerValueFontWeight}
                />
            )}

            {renderSelectedTooltip()}
            {renderDebugArrowTarget()}

            {debug && (
                <DebugInfoPanel
                    width={width}
                    height={height}
                    radius={radius}
                    innerRadius={innerRadius}
                    centerX={centerX}
                    centerY={centerY}
                    total={total}
                    selectedIndex={selectedIndex}
                />
            )}
        </View>
    )
}

export default SemiCircularProgress
