import * as d3 from 'd3-shape'
import { JSX } from 'react'
import { View } from 'react-native'
import { Circle, G, Path, Svg } from 'react-native-svg'

import {
    ArrowTargetMarker,
    CenterLabel,
    CustomTooltipWrapper,
    DebugBackground,
    DebugForeground,
    DebugInfoPanel,
    Tooltip,
} from './components'
import { usePieAnimation, useSelection, useSelectionOpacity, useSelectionScale } from './hooks'
import { AnimationConfig, PieChartProps, Slice, TooltipRenderData } from './types'
import {
    ANIMATION_DEFAULTS,
    calculateTipPosition,
    calculateTooltipPosition,
    createArcGenerator,
    DEFAULTS,
    generateArcs,
    OUTER_BORDER_DEFAULTS,
    TOOLTIP_DEFAULTS,
    validateCoverRadius,
    validateSeries,
} from './utils'

const PieChart = ({
    widthAndHeight,
    series,
    cover,
    style = {},
    padAngle,
    showTooltip = DEFAULTS.showTooltip,
    alwaysShowTooltips,
    tooltipDelay = DEFAULTS.tooltipDelay,
    tooltipStyle = {},
    showOuterBorder = DEFAULTS.showOuterBorder,
    outerBorderStyle = {},
    radiusScale = DEFAULTS.radiusScale,
    animation = true,
    centerLabel,
    children,
    onSlicePress,
    onAnimationComplete,
    debug = false,
    renderTooltip,
    renderTooltipContent,
}: PieChartProps): JSX.Element => {
    // ========================================================================
    // Validation
    // ========================================================================

    validateSeries(series)

    const coverRadius = typeof cover === 'object' ? cover.radius : cover
    const coverColor = typeof cover === 'object' ? cover.color : undefined
    validateCoverRadius(coverRadius)

    // ========================================================================
    // Parse Configs
    // ========================================================================

    const animationConfig: AnimationConfig = typeof animation === 'boolean'
        ? { enabled: animation }
        : { enabled: true, ...animation }

    const {
        backgroundColor: tooltipBg = TOOLTIP_DEFAULTS.backgroundColor,
        borderColor: tooltipBorderColor = TOOLTIP_DEFAULTS.borderColor,
        borderWidth: tooltipBorderWidth = TOOLTIP_DEFAULTS.borderWidth,
        borderRadius: tooltipBorderRadius = TOOLTIP_DEFAULTS.borderRadius,
        width: tooltipWidth = TOOLTIP_DEFAULTS.width,
        height: tooltipHeight = TOOLTIP_DEFAULTS.height,
        shadow: tooltipShadow = TOOLTIP_DEFAULTS.shadow,
    } = tooltipStyle

    const {
        width: outerBorderWidth = OUTER_BORDER_DEFAULTS.width,
        color: outerBorderColor = OUTER_BORDER_DEFAULTS.color,
    } = outerBorderStyle

    // ========================================================================
    // Hooks
    // ========================================================================

    const { selectedIndex, toggle, clear } = useSelection(tooltipDelay)
    const { progress: animationProgress, enabled: animationEnabled } = usePieAnimation(
        series.length,
        animationConfig,
        onAnimationComplete
    )
    const selectionScale = useSelectionScale(
        series.length,
        selectedIndex,
        animationEnabled,
        (animationConfig.enableSelectionScale ?? ANIMATION_DEFAULTS.enableSelectionScale)
            ? (animationConfig.selectionScale ?? ANIMATION_DEFAULTS.selectionScale)
            : 1
    )
    const selectionOpacity = useSelectionOpacity(
        series.length,
        selectedIndex,
        animationConfig.animateOpacity !== false && animationEnabled,
        animationConfig.unselectedOpacity ?? ANIMATION_DEFAULTS.unselectedOpacity
    )

    // ========================================================================
    // Calculations
    // ========================================================================

    const radius = (widthAndHeight / 2) * radiusScale
    const arcs = generateArcs(series)
    const total = series.reduce((sum, slice) => sum + slice.value, 0)
    const centerX = widthAndHeight / 2
    const centerY = widthAndHeight / 2

    // ========================================================================
    // Event Handlers
    // ========================================================================

    const handleSlicePress = (index: number, slice: Slice) => {
        if (showTooltip) {
            toggle(index)
        }
        onSlicePress?.(index, slice)
    }

    // ========================================================================
    // Render Tooltip
    // ========================================================================

    const renderTooltipForSlice = (index: number) => {
        const selectedArc = arcs[index]
        const slice = selectedArc.data as Slice
        const sliceValue = slice.value
        const percentage = (sliceValue / total) * 100
        const midAngle = (selectedArc.startAngle + selectedArc.endAngle) / 2

        const [tipX, tipY] = calculateTipPosition(midAngle, radius, coverRadius)
        const absoluteTipX = centerX + tipX
        const absoluteTipY = centerY + tipY

        const { left, top, arrowDirection } = calculateTooltipPosition(
            midAngle,
            tipX,
            tipY,
            centerX,
            centerY,
            tooltipWidth,
            tooltipHeight,
            TOOLTIP_DEFAULTS.margin
        )

        const tooltipRenderData: TooltipRenderData = {
            slice,
            index,
            value: sliceValue,
            percentage,
            total,
            position: { x: absoluteTipX, y: absoluteTipY },
            arrowDirection,
            close: clear,
        }

        // Custom render tooltip (full control)
        if (renderTooltip) {
            return (
                <View key={`tooltip-${index}`} style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
                    <CustomTooltipWrapper data={tooltipRenderData} renderTooltip={renderTooltip} />
                </View>
            )
        }

        // Default tooltip
        const hasCustomContent = !!renderTooltipContent
        if (!hasCustomContent && !slice.label) return null

        return (
            <Tooltip
                key={`tooltip-${index}`}
                slice={slice}
                index={index}
                value={sliceValue}
                percentage={percentage}
                total={total}
                left={left}
                top={top}
                width={tooltipWidth}
                height={tooltipHeight}
                backgroundColor={tooltipBg}
                borderRadius={tooltipBorderRadius}
                borderWidth={tooltipBorderWidth}
                borderColor={tooltipBorderColor}
                shadow={tooltipShadow}
                arrowDirection={arrowDirection}
                onClose={clear}
                renderContent={renderTooltipContent}
            />
        )
    }

    const renderTooltips = () => {
        if (!showTooltip) return null

        if (alwaysShowTooltips) {
            return series.map((_, index) => renderTooltipForSlice(index))
        }

        if (selectedIndex === null) return null
        return renderTooltipForSlice(selectedIndex)
    }

    // ========================================================================
    // Render Debug Arrow Target
    // ========================================================================

    const renderDebugArrowTarget = () => {
        if (!debug || !showTooltip || selectedIndex === null) return null

        const selectedArc = arcs[selectedIndex]
        const midAngle = (selectedArc.startAngle + selectedArc.endAngle) / 2
        const innerRadiusVal = coverRadius ? coverRadius * radius : 0
        const tipRadius = (radius + innerRadiusVal) / 2
        const tipX = Math.sin(midAngle) * tipRadius
        const tipY = -Math.cos(midAngle) * tipRadius

        return <ArrowTargetMarker targetX={centerX + tipX} targetY={centerY + tipY} />
    }

    // ========================================================================
    // Render
    // ========================================================================

    return (
        <View
            style={[
                { width: widthAndHeight, height: widthAndHeight, overflow: 'visible' },
                debug && { borderColor: '#68696E', borderWidth: 1 },
                style,
            ]}
        >
            <Svg width={widthAndHeight} height={widthAndHeight}>
                <G transform={`translate(${centerX}, ${centerY})`}>
                    {/* Debug background elements */}
                    {debug && <DebugBackground radius={radius} coverRadius={coverRadius} arcs={arcs} />}

                    {/* Slices */}
                    {arcs.map((arc: any, index: number) => {
                        const progress = animationProgress[index] ?? (animationEnabled ? 0 : 1)
                        const scale = selectionScale[index] ?? 1
                        const opacity = selectionOpacity[index] ?? 1

                        if (progress <= 0) return null

                        const animatedEndAngle = arc.startAngle + (arc.endAngle - arc.startAngle) * progress
                        const animatedRadius = radius * scale
                        const innerRadius = coverRadius ? coverRadius * animatedRadius : 0

                        const arcGenerator = createArcGenerator(
                            animatedRadius,
                            innerRadius,
                            arc.startAngle,
                            animatedEndAngle,
                            padAngle
                        )

                        const sliceData = arc.data as Slice

                        return (
                            <Path
                                key={`slice-${index}`}
                                fill={sliceData.color}
                                d={arcGenerator(arc) as string}
                                onPressIn={() => handleSlicePress(index, sliceData)}
                                delayPressIn={0}
                                opacity={opacity}
                            />
                        )
                    })}

                    {/* Outer circle border */}
                    {showOuterBorder && (
                        <Circle
                            cx={0}
                            cy={0}
                            r={radius}
                            fill="none"
                            stroke={outerBorderColor}
                            strokeWidth={outerBorderWidth}
                            pointerEvents="none"
                        />
                    )}

                    {/* Debug foreground elements */}
                    {debug && (
                        <DebugForeground
                            radius={radius}
                            coverRadius={coverRadius}
                            arcs={arcs}
                            selectedIndex={selectedIndex}
                        />
                    )}

                    {/* Cover (hole color) */}
                    {coverRadius && coverRadius > 0 && coverColor && (
                        <Path
                            fill={coverColor}
                            d={d3
                                .arc()
                                .outerRadius(coverRadius * radius)
                                .innerRadius(0)
                                .startAngle(0)
                                .endAngle(Math.PI * 2)(null as any) as string}
                        />
                    )}

                    {/* Center Label */}
                    {centerLabel && coverRadius && coverRadius > 0 && (
                        <CenterLabel config={centerLabel} total={total} />
                    )}
                </G>
            </Svg>

            {/* Children overlay */}
            {children && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        pointerEvents: 'none',
                    }}
                >
                    {children}
                </View>
            )}

            {/* Tooltip */}
            {renderTooltips()}

            {/* Debug arrow target marker */}
            {renderDebugArrowTarget()}

            {/* Debug info panel */}
            {debug && (
                <DebugInfoPanel
                    widthAndHeight={widthAndHeight}
                    radius={radius}
                    radiusScale={radiusScale}
                    coverRadius={coverRadius}
                    total={total}
                    seriesLength={series.length}
                    selectedIndex={selectedIndex}
                    series={series}
                />
            )}
        </View>
    )
}

export default PieChart
