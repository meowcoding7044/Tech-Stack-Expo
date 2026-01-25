import { ReactNode } from 'react'
import { Text, View } from 'react-native'
import { ChartRenderData, FontWeight } from '../types'
import { CENTER_DEFAULTS } from '../utils'

type CenterContentProps = {
    centerY: number
    offset: number
    children?: ReactNode | ((data: ChartRenderData) => ReactNode)
    chartData: ChartRenderData
    // Config props
    label?: string
    value?: string | number
    labelColor?: string
    valueColor?: string
    labelFontSize?: number
    valueFontSize?: number
    labelFontWeight?: FontWeight
    valueFontWeight?: FontWeight
}

export function CenterContent({
    centerY,
    offset,
    children,
    chartData,
    label,
    value,
    labelColor = CENTER_DEFAULTS.labelColor,
    valueColor = CENTER_DEFAULTS.valueColor,
    labelFontSize = CENTER_DEFAULTS.labelFontSize,
    valueFontSize = CENTER_DEFAULTS.valueFontSize,
    labelFontWeight = CENTER_DEFAULTS.labelFontWeight,
    valueFontWeight = CENTER_DEFAULTS.valueFontWeight,
}: CenterContentProps) {
    // Check if children is a render function
    const isRenderFunction = typeof children === 'function'
    const renderedChildren = isRenderFunction
        ? (children as (data: ChartRenderData) => ReactNode)(chartData)
        : children

    return (
        <View
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: centerY - offset,
                alignItems: 'center',
                justifyContent: 'center',
            }}
            pointerEvents="none"
        >
            {renderedChildren ? (
                renderedChildren
            ) : (
                <DefaultCenterContent
                    label={label}
                    value={value}
                    labelColor={labelColor}
                    valueColor={valueColor}
                    labelFontSize={labelFontSize}
                    valueFontSize={valueFontSize}
                    labelFontWeight={labelFontWeight}
                    valueFontWeight={valueFontWeight}
                />
            )}
        </View>
    )
}

type DefaultCenterContentProps = {
    label?: string
    value?: string | number
    labelColor: string
    valueColor: string
    labelFontSize: number
    valueFontSize: number
    labelFontWeight: FontWeight
    valueFontWeight: FontWeight
}

function DefaultCenterContent({
    label,
    value,
    labelColor,
    valueColor,
    labelFontSize,
    valueFontSize,
    labelFontWeight,
    valueFontWeight,
}: DefaultCenterContentProps) {
    return (
        <View style={{ alignItems: 'center' }}>
            {label && (
                <Text
                    style={{
                        color: labelColor,
                        fontSize: labelFontSize,
                        fontWeight: labelFontWeight,
                    }}
                >
                    {label}
                </Text>
            )}
            {value !== undefined && (
                <Text
                    style={{
                        color: valueColor,
                        fontSize: valueFontSize,
                        fontWeight: valueFontWeight,
                        marginTop: -4,
                    }}
                >
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </Text>
            )}
        </View>
    )
}
