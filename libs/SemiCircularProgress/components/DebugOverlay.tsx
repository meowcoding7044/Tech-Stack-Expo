import { Text, View } from 'react-native'
import { Circle, G, Path } from 'react-native-svg'
import { ArcData, EndCapInfo, SegmentRadii } from '../types'
import { calculateArcCentroid, calculateEndCapInfo } from '../utils'

// ============================================================================
// SVG Debug Elements (inside SVG)
// ============================================================================

type DebugSvgElementsProps = {
    radius: number
    arcs: ArcData[]
    getSegmentRadii: (index: number) => SegmentRadii
}

export function DebugSvgElements({ radius, arcs, getSegmentRadii }: DebugSvgElementsProps) {
    return (
        <G>
            {/* Horizontal baseline */}
            <Path
                d={`M ${-radius - 20} 0 L ${radius + 20} 0`}
                stroke="#FF0000"
                strokeWidth={1}
                strokeDasharray="3,3"
            />
            {/* Center point */}
            <Circle cx={0} cy={0} r={3} fill="#FF0000" />
            
            {/* End cap markers */}
            {arcs.map((arc, i) => {
                const segment = arc.segment
                if (!segment.endCornerRadius || segment.endCornerRadius <= 0) return null
                const radii = getSegmentRadii(i)
                const endCap = calculateEndCapInfo(arc.endAngle, radii, segment)
                return (
                    <Circle
                        key={`debug-endcap-${i}`}
                        cx={endCap.x}
                        cy={endCap.y}
                        r={endCap.capRadius > 0 ? endCap.capRadius : 5}
                        fill="none"
                        stroke="#00FF00"
                        strokeWidth={2}
                    />
                )
            })}
            
            {/* Arc centroids (magenta) */}
            {arcs.map((arc, i) => {
                const radii = getSegmentRadii(i)
                const centroid = calculateArcCentroid(arc.startAngle, arc.endAngle, radii)
                return (
                    <Circle
                        key={`centroid-${i}`}
                        cx={centroid.x}
                        cy={centroid.y}
                        r={5}
                        fill="#FF00FF"
                    />
                )
            })}
            
            {/* Mid points - arrow target (cyan) */}
            {arcs.map((arc, i) => {
                const radii = getSegmentRadii(i)
                const segmentMidRadius = (radii.segmentOuterRadius + radii.segmentInnerRadius) / 2
                const midAngle = (arc.startAngle + arc.endAngle) / 2
                const midX = segmentMidRadius * Math.sin(midAngle)
                const midY = -segmentMidRadius * Math.cos(midAngle)
                return (
                    <Circle
                        key={`midpoint-${i}`}
                        cx={midX}
                        cy={midY}
                        r={8}
                        fill="none"
                        stroke="#00FFFF"
                        strokeWidth={3}
                    />
                )
            })}
        </G>
    )
}

// ============================================================================
// Debug Info Panel (outside SVG)
// ============================================================================

type DebugInfoPanelProps = {
    width: number
    height: number
    radius: number
    innerRadius: number
    centerX: number
    centerY: number
    total: number
    selectedIndex: number | null
}

export function DebugInfoPanel({
    width,
    height,
    radius,
    innerRadius,
    centerX,
    centerY,
    total,
    selectedIndex,
}: DebugInfoPanelProps) {
    return (
        <View
            style={{
                position: 'absolute',
                top: 4,
                left: 4,
                backgroundColor: 'rgba(0,0,0,0.75)',
                padding: 6,
                borderRadius: 4,
            }}
            pointerEvents="none"
        >
            <Text style={{ color: '#00FF00', fontSize: 9 }}>
                {`size: ${width}x${height.toFixed(0)}`}
            </Text>
            <Text style={{ color: '#00FF00', fontSize: 9 }}>
                {`radius: ${radius.toFixed(1)}, inner: ${innerRadius.toFixed(1)}`}
            </Text>
            <Text style={{ color: '#00FF00', fontSize: 9 }}>
                {`center: ${centerX.toFixed(0)}, ${centerY.toFixed(0)}`}
            </Text>
            <Text style={{ color: '#FFFF00', fontSize: 9 }}>
                {`total: ${total}, selected: ${selectedIndex ?? 'none'}`}
            </Text>
        </View>
    )
}

// ============================================================================
// Arrow Target Marker (outside SVG)
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
                zIndex: 2000,
            }}
            pointerEvents="none"
        />
    )
}
