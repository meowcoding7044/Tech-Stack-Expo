# PieChart Component

Pie/Donut Chart component for React Native with animation, tooltip, and customization options.

## Installation

This component requires the following dependencies:

```bash
npm install d3-shape react-native-svg
```

## Basic Usage

```tsx
import PieChart, { Slice } from '@/libs/PieChart';

const data: Slice[] = [
  { value: 300, color: '#4CAF50', label: { text: 'Success' } },
  { value: 150, color: '#FF9800', label: { text: 'Warning' } },
  { value: 50, color: '#F44336', label: { text: 'Error' } },
];

<PieChart
  widthAndHeight={250}
  series={data}
  cover={0.6}
/>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `widthAndHeight` | `number` | Size of the chart (width = height) |
| `series` | `Slice[]` | Data for each slice |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cover` | `number \| Cover` | - | Donut hole radius (0-1) or object `{ radius, color }` |
| `style` | `StyleProp<ViewStyle>` | - | Container style |
| `padAngle` | `number` | - | Gap between slices (e.g., `0.02`) |
| `showTooltip` | `boolean` | `true` | Show tooltip on slice press |
| `tooltipDelay` | `number` | `3000` | Auto-hide delay (ms) |
| `tooltipStyle` | `TooltipStyle` | - | Customize tooltip appearance |
| `showOuterBorder` | `boolean` | `true` | Show outer border |
| `outerBorderStyle` | `OuterBorderStyle` | - | Customize outer border |
| `radiusScale` | `number` | `0.40` | Scale factor for radius |
| `animation` | `boolean \| AnimationConfig` | `true` | Animation configuration |
| `centerLabel` | `CenterLabelConfig` | - | Center label for donut |
| `children` | `ReactNode` | - | Custom center content |
| `debug` | `boolean` | `false` | Show debug overlay |
| `renderTooltip` | `(data: TooltipRenderData) => ReactNode` | - | Custom tooltip (full control) |
| `renderTooltipContent` | `(data: TooltipContentData) => ReactNode` | - | Custom tooltip content |
| `onSlicePress` | `(index: number, slice: Slice) => void` | - | Callback on slice press |
| `onAnimationComplete` | `() => void` | - | Callback when animation completes |

## Types

### Slice

```tsx
type Slice = {
  value: number;      // Slice value (must be > 0)
  color: string;      // Slice color
  label?: SliceLabel; // Label for tooltip
}

type SliceLabel = {
  text: string;
  fill?: string;
  stroke?: string;
  fontSize?: NumberProp;
  fontWeight?: FontWeight;
  fontFamily?: string;
  fontStyle?: FontStyle;
  offsetX?: number;
  offsetY?: number;
}
```

### Cover (Donut Hole)

```tsx
// Simple usage
cover={0.6} // 60% radius

// With color
cover={{ radius: 0.6, color: '#f0f0f0' }}
```

### TooltipStyle

```tsx
type TooltipStyle = {
  backgroundColor?: string;  // default: 'white'
  borderColor?: string;      // default: '#e0e0e0'
  borderWidth?: number;      // default: 1
  borderRadius?: number;     // default: 8
  width?: number;            // default: 90
  height?: number;           // default: 50
  shadow?: boolean;          // default: true
}
```

### AnimationConfig

```tsx
type AnimationConfig = {
  enabled?: boolean;         // default: true
  duration?: number;         // default: 800
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'; // default: 'easeOut'
  delay?: number;            // default: 0
  sequential?: boolean;      // default: false
  sequentialDelay?: number;  // default: 100
  selectionScale?: number;   // default: 1.05
}
```

### CenterLabelConfig

```tsx
type CenterLabelConfig = {
  label?: string;
  value?: string | number;
  labelColor?: string;       // default: '#666'
  valueColor?: string;       // default: '#000'
  labelFontSize?: number;    // default: 14
  valueFontSize?: number;    // default: 24
  labelFontWeight?: FontWeight;
  valueFontWeight?: FontWeight;
  fontFamily?: string;
  offsetY?: number;          // default: 0
  gap?: number;              // default: 6
  showTotal?: boolean;       // default: false
  valueFormatter?: (value: number) => string;
}
```

## Examples

### Pie Chart (no hole)

```tsx
<PieChart
  widthAndHeight={200}
  series={[
    { value: 40, color: '#FF6384' },
    { value: 30, color: '#36A2EB' },
    { value: 30, color: '#FFCE56' },
  ]}
/>
```

### Donut Chart with Center Label

```tsx
<PieChart
  widthAndHeight={250}
  series={data}
  cover={0.6}
  centerLabel={{
    label: 'Total',
    showTotal: true,
    valueFormatter: (val) => `$${val.toLocaleString()}`,
  }}
/>
```

### Custom Children Center Content

```tsx
<PieChart
  widthAndHeight={250}
  series={data}
  cover={0.6}
>
  <View style={{ alignItems: 'center' }}>
    <Text style={{ fontSize: 12, color: '#666' }}>Revenue</Text>
    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>$50,000</Text>
    <Text style={{ fontSize: 10, color: '#4CAF50' }}>+12.5%</Text>
  </View>
</PieChart>
```

### Custom Animation

```tsx
<PieChart
  widthAndHeight={250}
  series={data}
  cover={0.6}
  animation={{
    duration: 1200,
    easing: 'easeInOut',
    sequential: true,
    sequentialDelay: 150,
  }}
  onAnimationComplete={() => console.log('Animation done!')}
/>
```

### Disable Animation

```tsx
<PieChart
  widthAndHeight={250}
  series={data}
  animation={false}
/>
```

### Custom Tooltip Content

```tsx
<PieChart
  widthAndHeight={250}
  series={data}
  cover={0.6}
  renderTooltipContent={({ slice, value, percentage }) => (
    <View style={{ padding: 8 }}>
      <Text style={{ color: slice.color, fontWeight: 'bold' }}>
        {slice.label?.text}
      </Text>
      <Text>{value.toLocaleString()}</Text>
      <Text style={{ fontSize: 10, color: '#666' }}>
        {percentage.toFixed(1)}%
      </Text>
    </View>
  )}
/>
```

### Full Custom Tooltip

```tsx
<PieChart
  widthAndHeight={250}
  series={data}
  cover={0.6}
  renderTooltip={({ slice, value, percentage, position, arrowDirection, close }) => (
    <View
      style={{
        position: 'absolute',
        left: position.x - 50,
        top: position.y - 70,
        backgroundColor: slice.color,
        padding: 12,
        borderRadius: 8,
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>
        {slice.label?.text}: {value}
      </Text>
      <TouchableOpacity onPress={close}>
        <Text style={{ color: 'white', fontSize: 10 }}>Close</Text>
      </TouchableOpacity>
    </View>
  )}
/>
```

### With Gap Between Slices

```tsx
<PieChart
  widthAndHeight={250}
  series={data}
  cover={0.6}
  padAngle={0.03}
/>
```

### Custom Outer Border

```tsx
<PieChart
  widthAndHeight={250}
  series={data}
  cover={0.6}
  outerBorderStyle={{
    width: 3,
    color: '#333',
  }}
/>
```

### Press Handler

```tsx
<PieChart
  widthAndHeight={250}
  series={data}
  cover={0.6}
  onSlicePress={(index, slice) => {
    console.log(`Pressed slice ${index}:`, slice);
    Alert.alert(slice.label?.text || 'Slice', `Value: ${slice.value}`);
  }}
/>
```

### Debug Mode

```tsx
<PieChart
  widthAndHeight={250}
  series={data}
  cover={0.6}
  debug={true}
/>
```

Debug mode displays:
- Crosshairs (red dashed lines)
- Outer radius circle (green)
- Inner radius circle (blue)
- Mid radius circle (magenta - tooltip position)
- Slice boundaries (yellow lines)
- Arc centroids (magenta dots)
- Tooltip targets (cyan circles)
- Slice indices
- Info panel (size, radius, total, selected)

## File Structure

```
libs/PieChart/
├── index.ts           # Main exports
├── PieChart.tsx       # Main component
├── types.ts           # TypeScript types
├── utils.ts           # Utility functions & constants
├── hooks.ts           # Custom React hooks
├── README.md          # Documentation
└── components/
    ├── index.ts       # Component exports
    ├── Tooltip.tsx    # Tooltip component
    ├── CenterLabel.tsx # SVG center label
    └── DebugOverlay.tsx # Debug visualizations
```

## Exported Hooks (Advanced)

```tsx
import { usePieAnimation, useSelection, useSelectionScale } from '@/libs/PieChart';

// Animation progress for each slice
const { progress, enabled } = usePieAnimation(seriesLength, config, onComplete);

// Selection state management
const { selectedIndex, toggle, clear } = useSelection(autoHideDelay);

// Scale animation for selected slice
const scales = useSelectionScale(seriesLength, selectedIndex, animationEnabled, scale);
```

## Exported Constants (Advanced)

```tsx
import {
  DEFAULTS,
  TOOLTIP_DEFAULTS,
  ANIMATION_DEFAULTS,
  CENTER_LABEL_DEFAULTS,
  OUTER_BORDER_DEFAULTS,
  easingFunctions,
} from '@/libs/PieChart';
```

## Tips

1. **Performance**: Use `animation={false}` for frequently changing data
2. **Responsive**: Calculate `widthAndHeight` from screen dimensions
3. **Accessibility**: Add `onSlicePress` handler for interaction
4. **Tooltip Position**: Adjust `radiusScale` if tooltip is obscured
5. **Center Content**: Use `children` instead of `centerLabel` for complex layouts
