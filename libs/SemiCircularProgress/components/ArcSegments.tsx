import { Circle, G, Path } from 'react-native-svg'
import { ArcData, ProgressSegment, SegmentRadii } from '../types'
import { calculateEndCapInfo, END_ANGLE, generateArcPath, START_ANGLE } from '../utils'

type ArcSegmentsProps = {
    arcs: ArcData[]
    animationProgress: number
    globalCornerRadius: number
    getSegmentRadii: (index: number) => SegmentRadii
    onSegmentPress: (index: number) => void
}

export function ArcSegments({
    arcs,
    animationProgress,
    globalCornerRadius,
    getSegmentRadii,
    onSegmentPress,
}: ArcSegmentsProps) {
    return (
        <>
            {/* Background segment (full semi-circle) */}
            {arcs.length > 1 && (
                <BackgroundArc
                    arc={arcs[arcs.length - 1]}
                    index={arcs.length - 1}
                    globalCornerRadius={globalCornerRadius}
                    getSegmentRadii={getSegmentRadii}
                    onPress={() => onSegmentPress(arcs.length - 1)}
                />
            )}
            
            {/* Progress segment (animated) */}
            {arcs.length > 0 && animationProgress > 0 && (
                <ProgressArc
                    arc={arcs[0]}
                    index={0}
                    animationProgress={animationProgress}
                    globalCornerRadius={globalCornerRadius}
                    getSegmentRadii={getSegmentRadii}
                    onPress={() => onSegmentPress(0)}
                />
            )}
        </>
    )
}

// ============================================================================
// Background Arc (Full Semi-circle)
// ============================================================================

type BackgroundArcProps = {
    arc: ArcData
    index: number
    globalCornerRadius: number
    getSegmentRadii: (index: number) => SegmentRadii
    onPress: () => void
}

function BackgroundArc({
    arc,
    index,
    globalCornerRadius,
    getSegmentRadii,
    onPress,
}: BackgroundArcProps) {
    const segment = arc.segment
    const radii = getSegmentRadii(index)
    const hasEndCap = segment.endCornerRadius !== undefined && segment.endCornerRadius > 0
    const endCap = hasEndCap ? calculateEndCapInfo(END_ANGLE, radii, segment) : null

    return (
        <G>
            <Path
                d={generateArcPath(START_ANGLE, END_ANGLE, radii, segment, globalCornerRadius)}
                fill={segment.color}
                onPressIn={onPress}
            />
            {hasEndCap && endCap && endCap.capRadius > 0 && (
                <Circle
                    cx={endCap.x}
                    cy={endCap.y}
                    r={endCap.capRadius}
                    fill={segment.color}
                    onPressIn={onPress}
                />
            )}
        </G>
    )
}

// ============================================================================
// Progress Arc (Animated)
// ============================================================================

type ProgressArcProps = {
    arc: ArcData
    index: number
    animationProgress: number
    globalCornerRadius: number
    getSegmentRadii: (index: number) => SegmentRadii
    onPress: () => void
}

function ProgressArc({
    arc,
    index,
    animationProgress,
    globalCornerRadius,
    getSegmentRadii,
    onPress,
}: ProgressArcProps) {
    const segment = arc.segment
    const radii = getSegmentRadii(index)
    
    // Animate from startAngle to endAngle
    const arcSpan = arc.endAngle - arc.startAngle
    const animatedEndAngle = arc.startAngle + arcSpan * animationProgress
    
    // End cap only when fully visible
    const isFullyVisible = animationProgress >= 1
    const hasEndCap = segment.endCornerRadius !== undefined && segment.endCornerRadius > 0
    const endCap = hasEndCap && isFullyVisible ? calculateEndCapInfo(arc.endAngle, radii, segment) : null

    return (
        <G>
            <Path
                d={generateArcPath(arc.startAngle, animatedEndAngle, radii, segment, globalCornerRadius)}
                fill={segment.color}
                onPressIn={onPress}
            />
            {hasEndCap && endCap && endCap.capRadius > 0 && (
                <Circle
                    cx={endCap.x}
                    cy={endCap.y}
                    r={endCap.capRadius}
                    fill={segment.color}
                    onPressIn={onPress}
                />
            )}
        </G>
    )
}
