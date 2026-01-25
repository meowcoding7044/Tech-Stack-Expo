import { ReactNode } from 'react'
import { Text, View } from 'react-native'
import { ArrowDirection, getArrowStyle, TOOLTIP_DEFAULTS } from '../utils'
import { Slice, TooltipContentData, TooltipRenderData } from '../types'

type TooltipProps = {
    slice: Slice
    index: number
    value: number
    percentage: number
    total: number
    left: number
    top: number
    width: number
    height: number
    backgroundColor: string
    borderRadius: number
    borderWidth: number
    borderColor: string
    shadow: boolean
    arrowDirection: ArrowDirection
    onClose: () => void
    renderContent?: (data: TooltipContentData) => ReactNode
}

export function Tooltip({
    slice,
    index,
    value,
    percentage,
    total,
    left,
    top,
    width,
    height,
    backgroundColor,
    borderRadius,
    borderWidth,
    borderColor,
    shadow,
    arrowDirection,
    onClose,
    renderContent,
}: TooltipProps) {
    const arrowStyle = getArrowStyle(
        arrowDirection,
        width,
        height,
        TOOLTIP_DEFAULTS.arrowSize,
        backgroundColor
    )

    const contentData: TooltipContentData = {
        slice,
        index,
        value,
        percentage,
        total,
        close: onClose,
    }

    const content = renderContent ? (
        renderContent(contentData)
    ) : (
        <DefaultTooltipContent slice={slice} value={value} percentage={percentage} />
    )

    return (
        <View
            style={{
                position: 'absolute',
                left,
                top,
                width,
                height,
                backgroundColor,
                borderRadius,
                borderWidth,
                borderColor,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                ...(shadow && {
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                }),
            }}
            pointerEvents="none"
        >
            <View
                style={{
                    position: 'absolute',
                    width: 0,
                    height: 0,
                    borderStyle: 'solid',
                    ...arrowStyle,
                }}
            />
            {content}
        </View>
    )
}

function DefaultTooltipContent({
    slice,
    value,
    percentage,
}: {
    slice: Slice
    value: number
    percentage: number
}) {
    if (!slice.label) return null

    return (
        <View style={{ alignItems: 'center' }}>
            <Text style={{ color: slice.color, fontWeight: 'bold', fontSize: 11, marginBottom: 2 }}>
                {slice.label.text}
            </Text>
            <Text style={{ color: '#1a1a1a', fontWeight: 'bold', fontSize: 12 }}>
                {`${value.toLocaleString()} (${percentage.toFixed(1)}%)`}
            </Text>
        </View>
    )
}

// Custom tooltip wrapper (full control)
type CustomTooltipWrapperProps = {
    data: TooltipRenderData
    renderTooltip: (data: TooltipRenderData) => ReactNode
}

export function CustomTooltipWrapper({ data, renderTooltip }: CustomTooltipWrapperProps) {
    return (
        <View
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 1000,
            }}
            pointerEvents="box-none"
        >
            {renderTooltip(data)}
        </View>
    )
}
