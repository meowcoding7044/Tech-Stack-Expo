import { ReactNode } from 'react'
import { Text, View } from 'react-native'
import { ProgressSegment, TooltipContentData, TooltipRenderData } from '../types'

type TooltipProps = {
    segment: ProgressSegment
    index: number
    left: number
    top: number
    width: number
    height: number
    backgroundColor: string
    borderRadius: number
    shadow: boolean
    arrowStyle: Record<string, any>
    hasCustomContent: boolean
    onClose: () => void
    renderContent?: (data: TooltipContentData) => ReactNode
}

export function Tooltip({
    segment,
    index,
    left,
    top,
    width,
    height,
    backgroundColor,
    borderRadius,
    shadow,
    arrowStyle,
    hasCustomContent,
    onClose,
    renderContent,
}: TooltipProps) {
    const contentData: TooltipContentData = {
        segment,
        index,
        close: onClose,
    }

    const content = renderContent ? (
        renderContent(contentData)
    ) : (
        <DefaultTooltipContent segment={segment} />
    )

    return (
        <View
            style={{
                position: 'absolute',
                left,
                top,
                width,
                height,
                justifyContent: 'center',
                alignItems: 'center',
                ...(hasCustomContent ? {} : {
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                }),
                backgroundColor,
                borderRadius,
                zIndex: 1000,
                ...(shadow && {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.12,
                    shadowRadius: 12,
                    elevation: 8,
                }),
            }}
            pointerEvents="none"
        >
            <TooltipArrow style={arrowStyle} />
            {content}
        </View>
    )
}

function TooltipArrow({ style }: { style: Record<string, any> }) {
    return (
        <View
            style={{
                position: 'absolute',
                width: 0,
                height: 0,
                borderStyle: 'solid',
                ...style,
            }}
        />
    )
}

function DefaultTooltipContent({ segment }: { segment: ProgressSegment }) {
    return (
        <>
            {segment.sublabel && (
                <Text
                    style={{
                        color: segment.sublabelColor || segment.color,
                        fontSize: 13,
                        fontWeight: '600',
                        marginBottom: 2,
                    }}
                >
                    {segment.sublabel}
                </Text>
            )}
            {segment.label && (
                <Text
                    style={{
                        color: '#000',
                        fontSize: 26,
                        fontWeight: 'bold',
                    }}
                >
                    {segment.label}
                </Text>
            )}
        </>
    )
}

// Wrapper for custom render tooltip (full control)
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
