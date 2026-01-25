import { G, Text as SvgText } from 'react-native-svg'
import { CenterLabelConfig } from '../types'
import { CENTER_LABEL_DEFAULTS } from '../utils'

type CenterLabelProps = {
    config: CenterLabelConfig
    total: number
}

export function CenterLabel({ config, total }: CenterLabelProps) {
    const {
        label,
        value,
        labelColor = CENTER_LABEL_DEFAULTS.labelColor,
        valueColor = CENTER_LABEL_DEFAULTS.valueColor,
        labelFontSize = CENTER_LABEL_DEFAULTS.labelFontSize,
        valueFontSize = CENTER_LABEL_DEFAULTS.valueFontSize,
        labelFontWeight = CENTER_LABEL_DEFAULTS.labelFontWeight,
        valueFontWeight = CENTER_LABEL_DEFAULTS.valueFontWeight,
        fontFamily,
        offsetY = CENTER_LABEL_DEFAULTS.offsetY,
        gap = CENTER_LABEL_DEFAULTS.gap,
        showTotal = false,
        valueFormatter,
    } = config

    // Determine the value to display
    let displayValue: string | undefined
    if (value !== undefined) {
        displayValue = typeof value === 'number'
            ? (valueFormatter ? valueFormatter(value) : value.toLocaleString())
            : value
    } else if (showTotal) {
        displayValue = valueFormatter ? valueFormatter(total) : total.toLocaleString()
    }

    const hasLabel = !!label
    const hasValue = !!displayValue

    // Calculate vertical positions
    let labelY = 0
    let valueY = 0

    if (hasLabel && hasValue) {
        const totalHeight = labelFontSize + gap + valueFontSize
        labelY = -totalHeight / 2 + labelFontSize / 2 + offsetY
        valueY = labelY + labelFontSize / 2 + gap + valueFontSize / 2
    } else if (hasLabel) {
        labelY = offsetY
    } else if (hasValue) {
        valueY = offsetY
    }

    return (
        <G pointerEvents="none">
            {hasLabel && (
                <SvgText
                    x={0}
                    y={labelY}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize={labelFontSize}
                    fontWeight={labelFontWeight}
                    fontFamily={fontFamily}
                    fill={labelColor}
                >
                    {label}
                </SvgText>
            )}
            {hasValue && (
                <SvgText
                    x={0}
                    y={valueY}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize={valueFontSize}
                    fontWeight={valueFontWeight}
                    fontFamily={fontFamily}
                    fill={valueColor}
                >
                    {displayValue}
                </SvgText>
            )}
        </G>
    )
}
