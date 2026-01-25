import { Text, View } from 'react-native'
import { Circle, G, Path, Text as SvgText } from 'react-native-svg'
import { Slice } from '../types'

// ============================================================================
// SVG Debug Elements (Background - render before slices)
// ============================================================================

type DebugBackgroundProps = {
    radius: number
    coverRadius?: number
    arcs: any[]
}

export function DebugBackground({ radius, coverRadius, arcs }: DebugBackgroundProps) {
    return (
        <G>
            {/* Crosshairs */}
            <Path
                d={`M ${-radius - 10} 0 L ${radius + 10} 0 M 0 ${-radius - 10} L 0 ${radius + 10}`}
                stroke="#FF0000"
                strokeWidth={1}
                strokeDasharray="5,5"
                opacity={0.4}
            />

            {/* Outer radius circle (green) */}
            <Circle
                cx={0}
                cy={0}
                r={radius}
                fill="none"
                stroke="#00FF00"
                strokeWidth={1}
                strokeDasharray="4,4"
                opacity={0.5}
            />

            {/* Inner radius circle (blue - if donut) */}
            {coverRadius && coverRadius > 0 && (
                <Circle
                    cx={0}
                    cy={0}
                    r={coverRadius * radius}
                    fill="none"
                    stroke="#0088FF"
                    strokeWidth={1}
                    strokeDasharray="4,4"
                    opacity={0.5}
                />
            )}

            {/* Mid radius circle (magenta - tooltip position) */}
            {coverRadius && coverRadius > 0 && (
                <Circle
                    cx={0}
                    cy={0}
                    r={(radius + coverRadius * radius) / 2}
                    fill="none"
                    stroke="#FF00FF"
                    strokeWidth={1}
                    strokeDasharray="3,3"
                    opacity={0.4}
                />
            )}

            {/* Slice boundaries (yellow lines) */}
            {arcs.map((arc: any, i: number) => {
                const startX = Math.sin(arc.startAngle) * radius
                const startY = -Math.cos(arc.startAngle) * radius
                return (
                    <Path
                        key={`debug-boundary-${i}`}
                        d={`M 0 0 L ${startX} ${startY}`}
                        stroke="#FFFF00"
                        strokeWidth={1}
                        strokeDasharray="2,2"
                        opacity={0.4}
                    />
                )
            })}
        </G>
    )
}

// ============================================================================
// SVG Debug Elements (Foreground - render after slices)
// ============================================================================

type DebugForegroundProps = {
    radius: number
    coverRadius?: number
    arcs: any[]
    selectedIndex: number | null
}

export function DebugForeground({ radius, coverRadius, arcs, selectedIndex }: DebugForegroundProps) {
    const innerRadiusVal = coverRadius ? coverRadius * radius : 0
    const midRadius = (radius + innerRadiusVal) / 2

    return (
        <G pointerEvents="none">
            {/* Center point (red) */}
            <Circle cx={0} cy={0} r={4} fill="#FF0000" />

            {/* Arc centroids (magenta dots) */}
            {arcs.map((arc: any, i: number) => {
                const midAngle = (arc.startAngle + arc.endAngle) / 2
                const centroidX = Math.sin(midAngle) * midRadius
                const centroidY = -Math.cos(midAngle) * midRadius
                return (
                    <Circle
                        key={`debug-centroid-${i}`}
                        cx={centroidX}
                        cy={centroidY}
                        r={5}
                        fill="#FF00FF"
                        opacity={0.8}
                    />
                )
            })}

            {/* Tooltip target points (cyan circles) */}
            {arcs.map((arc: any, i: number) => {
                const midAngle = (arc.startAngle + arc.endAngle) / 2
                const tipX = Math.sin(midAngle) * midRadius
                const tipY = -Math.cos(midAngle) * midRadius
                return (
                    <Circle
                        key={`debug-tip-${i}`}
                        cx={tipX}
                        cy={tipY}
                        r={7}
                        fill="none"
                        stroke="#00FFFF"
                        strokeWidth={2}
                        opacity={selectedIndex === i ? 1 : 0.6}
                    />
                )
            })}

            {/* Slice index labels */}
            {arcs.map((arc: any, i: number) => {
                const labelRadius = radius + 12
                const midAngle = (arc.startAngle + arc.endAngle) / 2
                const labelX = Math.sin(midAngle) * labelRadius
                const labelY = -Math.cos(midAngle) * labelRadius
                return (
                    <SvgText
                        key={`debug-label-${i}`}
                        x={labelX}
                        y={labelY}
                        fontSize={9}
                        fill="#FFFFFF"
                        stroke="#000000"
                        strokeWidth={0.3}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                    >
                        {i}
                    </SvgText>
                )
            })}
        </G>
    )
}

// ============================================================================
// Debug Info Panel (View layer)
// ============================================================================

type DebugInfoPanelProps = {
    widthAndHeight: number
    radius: number
    radiusScale: number
    coverRadius?: number
    total: number
    seriesLength: number
    selectedIndex: number | null
    series: Slice[]
}

export function DebugInfoPanel({
    widthAndHeight,
    radius,
    radiusScale,
    coverRadius,
    total,
    seriesLength,
    selectedIndex,
    series,
}: DebugInfoPanelProps) {
    return (
        <View
            style={{
                position: 'absolute',
                top: 2,
                left: 2,
                backgroundColor: 'rgba(0,0,0,0.5)',
                paddingHorizontal: 5,
                paddingVertical: 3,
                borderRadius: 4,
            }}
            pointerEvents="none"
        >
            <Text style={{ color: '#0F0', fontSize: 8 }}>
                {`size: ${widthAndHeight}x${widthAndHeight}`}
            </Text>
            <Text style={{ color: '#0F0', fontSize: 8 }}>
                {`radius: ${radius.toFixed(1)} (${(radiusScale * 100).toFixed(0)}%)`}
            </Text>
            {coverRadius && (
                <Text style={{ color: '#0AF', fontSize: 8 }}>
                    {`inner: ${(coverRadius * radius).toFixed(1)} (${(coverRadius * 100).toFixed(0)}%)`}
                </Text>
            )}
            <Text style={{ color: '#FF0', fontSize: 8 }}>
                {`total: ${total.toLocaleString()} | slices: ${seriesLength}`}
            </Text>
            <Text style={{ color: selectedIndex !== null ? '#F80' : '#888', fontSize: 8 }}>
                {selectedIndex !== null
                    ? `selected: [${selectedIndex}] ${series[selectedIndex].value.toLocaleString()} (${((series[selectedIndex].value / total) * 100).toFixed(1)}%)`
                    : `selected: none`
                }
            </Text>
        </View>
    )
}

// ============================================================================
// Arrow Target Marker (View layer)
// ============================================================================

type ArrowTargetMarkerProps = {
    targetX: number
    targetY: number
}

export function ArrowTargetMarker({ targetX, targetY }: ArrowTargetMarkerProps) {
    return (
        <View
            style={{
                position: 'absolute',
                left: targetX - 6,
                top: targetY - 6,
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: 'red',
                borderWidth: 2,
                borderColor: 'white',
                zIndex: 2000,
            }}
            pointerEvents="none"
        />
    )
}
