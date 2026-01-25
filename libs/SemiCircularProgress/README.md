# SemiCircularProgress Component

A customizable semi-circular (half-donut) progress chart for React Native with animations, tooltips, and flexible styling.

## Installation

The component is located in `libs/SemiCircularProgress/`. Import it directly:

```tsx
import SemiCircularProgress from '../libs/SemiCircularProgress';
// or with types
import SemiCircularProgress, { ProgressSegment } from '../libs/SemiCircularProgress';
```

## Basic Usage

```tsx
<SemiCircularProgress
  width={300}
  height={200}
  segments={[
    { value: 220, color: '#4CAF50', label: '220', sublabel: '100% Checked' },
    { value: 80, color: '#E0E0E0', label: '80', sublabel: 'In Progress' },
  ]}
/>
```

---

## Props Reference

### Main Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | **required** | Width of the component |
| `height` | `number` | `width * 0.55` | Height of the component |
| `segments` | `ProgressSegment[]` | **required** | Array of progress segments |
| `thickness` | `number` | `0.18` | Arc thickness as percentage of radius |
| `padAngle` | `number` | `0.04` | Gap between segments in radians |
| `cornerRadius` | `number` | `0` | Global corner radius for all segments |
| `style` | `ViewStyle` | - | Container style |
| `debug` | `boolean` | `false` | Show debug overlay |

### ProgressSegment

```ts
type ProgressSegment = {
  value: number              // Segment value
  color: string              // Segment color
  label?: string             // Tooltip main text (e.g., "220")
  sublabel?: string          // Tooltip secondary text (e.g., "100% Checked")
  sublabelColor?: string     // Override sublabel color
  thicknessMultiplier?: number  // 1.0 = default, 1.2 = 20% thicker
  cornerRadius?: number      // Override global cornerRadius
  endCornerRadius?: number   // Rounded corner only at segment end
}
```

---

## Center Content

### Option 1: Using `center` config

```tsx
<SemiCircularProgress
  width={300}
  segments={segments}
  center={{
    label: 'Total Suppliers',
    value: 300,
    labelColor: '#333',
    valueColor: '#000',
    labelFontSize: 16,
    valueFontSize: 48,
    labelFontWeight: '600',
    valueFontWeight: 'bold',
  }}
/>
```

### Option 2: Using `children` (ReactNode)

```tsx
<SemiCircularProgress width={300} segments={segments}>
  <View style={{ alignItems: 'center' }}>
    <Text>Total Suppliers</Text>
    <Text style={{ fontSize: 48, fontWeight: 'bold' }}>300</Text>
  </View>
</SemiCircularProgress>
```

### Option 3: Using `children` (Render Function)

Access chart data like `total`, `animationProgress`, `selectedIndex`:

```tsx
<SemiCircularProgress width={300} segments={segments}>
  {({ total, animationProgress }) => (
    <View style={{ alignItems: 'center' }}>
      <Text>Total Suppliers</Text>
      <Text style={{ fontSize: 48, fontWeight: 'bold' }}>
        {Math.round(total * animationProgress)}
      </Text>
    </View>
  )}
</SemiCircularProgress>
```

### CenterConfig Type

```ts
type CenterConfig = {
  label?: string
  value?: string | number
  labelColor?: string         // Default: '#333'
  valueColor?: string         // Default: '#000'
  labelFontSize?: number      // Default: 16
  valueFontSize?: number      // Default: 48
  labelFontWeight?: FontWeight // Default: '600'
  valueFontWeight?: FontWeight // Default: 'bold'
}
```

---

## Tooltip Configuration

### Basic Tooltip Config

```tsx
<SemiCircularProgress
  width={300}
  segments={segments}
  tooltip={{
    show: true,              // Default: true
    backgroundColor: 'white',
    borderRadius: 12,
    shadow: true,
    width: 110,
    height: 70,
    autoHideDelay: 3000,     // ms, 0 = no auto hide
    offset: 15,              // Distance from slice bar
  }}
/>
```

### Custom Tooltip Content

Use `renderTooltipContent` to customize only the content inside the tooltip box:

```tsx
<SemiCircularProgress
  width={300}
  segments={segments}
  tooltip={{ width: 120, height: 70 }}
  renderTooltipContent={({ segment, index, close }) => (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ color: segment.color, fontWeight: 'bold' }}>
        {segment.sublabel}
      </Text>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        {segment.label}
      </Text>
    </View>
  )}
/>
```

### Fully Custom Tooltip

Use `renderTooltip` for complete control over tooltip rendering:

```tsx
<SemiCircularProgress
  width={300}
  segments={segments}
  renderTooltip={({ segment, index, position, arrowDirection, close }) => (
    <View
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
      }}
    >
      <Text>{segment.label}</Text>
      <TouchableOpacity onPress={close}>
        <Text>Close</Text>
      </TouchableOpacity>
    </View>
  )}
/>
```

### TooltipConfig Type

```ts
type TooltipConfig = {
  show?: boolean           // Default: true
  backgroundColor?: string // Default: 'white'
  borderRadius?: number    // Default: 12
  shadow?: boolean         // Default: true
  width?: number           // Default: 110
  height?: number          // Default: 70
  autoHideDelay?: number   // Default: 3000 (ms)
  offset?: number          // Default: 15
}
```

---

## Animation

### Animation Config

```tsx
<SemiCircularProgress
  width={300}
  segments={segments}
  animation={{
    enabled: true,       // Default: true
    duration: 1000,      // Default: 1000 (ms)
    delay: 0,            // Default: 0 (ms)
    easing: 'easeOut',   // 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'
  }}
/>
```

### Disable Animation

```tsx
<SemiCircularProgress
  width={300}
  segments={segments}
  animation={{ enabled: false }}
/>
```

---

## Segment Styling

### Variable Thickness

Make segments thicker or thinner:

```tsx
const segments = [
  { 
    value: 220, 
    color: '#4CAF50',
    thicknessMultiplier: 1.2,  // 20% thicker
  },
  { 
    value: 80, 
    color: '#E0E0E0',
    thicknessMultiplier: 0.6,  // 40% thinner
  },
]
```

### Corner Radius

```tsx
// Global corner radius
<SemiCircularProgress
  width={300}
  segments={segments}
  cornerRadius={10}
/>

// Per-segment corner radius
const segments = [
  { value: 220, color: '#4CAF50', cornerRadius: 15 },
  { value: 80, color: '#E0E0E0', cornerRadius: 5 },
]

// End-only corner radius (flat start, rounded end)
const segments = [
  { value: 220, color: '#4CAF50' },
  { value: 80, color: '#E0E0E0', endCornerRadius: 10 },
]
```

---

## Event Handling

### onSegmentPress

```tsx
<SemiCircularProgress
  width={300}
  segments={segments}
  onSegmentPress={(index, segment) => {
    console.log(`Pressed segment ${index}:`, segment)
  }}
/>
```

---

## Debug Mode

Enable debug mode to see visual guides:

```tsx
<SemiCircularProgress
  width={300}
  segments={segments}
  debug={true}
/>
```

Debug overlay shows:
- **Red dashed line**: Baseline
- **Red dot**: Center point
- **Magenta dots**: Arc centroids
- **Cyan circles**: Mid points (tooltip arrow targets)
- **Green circles**: End cap positions
- **Info panel**: Dimensions, radius, selected index

---

## Complete Example

```tsx
import { useState } from 'react'
import { View, Text, Button } from 'react-native'
import SemiCircularProgress from '../libs/SemiCircularProgress'

export default function ProgressExample() {
  const [checkedValue, setCheckedValue] = useState(220)
  const totalSuppliers = 300
  const inProgressValue = totalSuppliers - checkedValue

  return (
    <View style={{ alignItems: 'center', padding: 20 }}>
      <SemiCircularProgress
        width={300}
        height={200}
        segments={[
          {
            value: checkedValue,
            color: '#4CAF50',
            label: String(checkedValue),
            sublabel: `${Math.round((checkedValue / totalSuppliers) * 100)}% Checked`,
            thicknessMultiplier: 1.2,
          },
          {
            value: inProgressValue,
            color: '#E0E0E0',
            label: String(inProgressValue),
            sublabel: 'In Progress',
            thicknessMultiplier: 0.6,
            endCornerRadius: 8,
          },
        ]}
        tooltip={{
          backgroundColor: 'white',
          borderRadius: 14,
          shadow: true,
          width: 120,
          height: 70,
          autoHideDelay: 5000,
        }}
        animation={{
          enabled: true,
          duration: 800,
          easing: 'easeOut',
        }}
        onSegmentPress={(index) => console.log('Pressed:', index)}
      >
        {({ total, animationProgress }) => (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>
              Total Suppliers
            </Text>
            <Text style={{ fontSize: 48, fontWeight: 'bold' }}>
              {Math.round(total * animationProgress)}
            </Text>
          </View>
        )}
      </SemiCircularProgress>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
        <Button
          title="+ Checked"
          onPress={() => setCheckedValue(Math.min(checkedValue + 20, totalSuppliers))}
        />
        <Button
          title="- Checked"
          onPress={() => setCheckedValue(Math.max(checkedValue - 20, 0))}
        />
      </View>
    </View>
  )
}
```

---

## File Structure

```
libs/SemiCircularProgress/
├── index.ts              # Main exports
├── types.ts              # TypeScript types
├── utils.ts              # Utility functions & constants
├── hooks.ts              # Custom React hooks
├── SemiCircularProgress.tsx  # Main component
├── README.md             # This documentation
└── components/
    ├── index.ts          # Component exports
    ├── ArcSegments.tsx   # SVG arc rendering
    ├── CenterContent.tsx # Center content rendering
    ├── Tooltip.tsx       # Tooltip component
    └── DebugOverlay.tsx  # Debug visualization
```

---

## Advanced: Using Hooks & Utils

For advanced customization, you can import hooks and utilities:

```tsx
import {
  // Hooks
  useProgressAnimation,
  useSegmentSelection,
  
  // Utils
  calculateDimensions,
  calculateTooltipPosition,
  easingFunctions,
  
  // Constants
  TOOLTIP_DEFAULTS,
  CENTER_DEFAULTS,
  ANIMATION_DEFAULTS,
} from '../libs/SemiCircularProgress'
```

### useProgressAnimation

```tsx
const animationProgress = useProgressAnimation({
  enabled: true,
  duration: 1000,
  delay: 0,
  easing: 'easeOut',
})
// Returns: number (0 to 1)
```

### useSegmentSelection

```tsx
const { selectedIndex, toggleSelection, clearSelection } = useSegmentSelection(3000)
// selectedIndex: number | null
// toggleSelection: (index: number) => void
// clearSelection: () => void
```

---

## Types Summary

```ts
// Main Props
type SemiCircularProgressProps = { ... }

// Segment
type ProgressSegment = { ... }

// Configs
type TooltipConfig = { ... }
type AnimationConfig = { ... }
type CenterConfig = { ... }

// Render Data
type ChartRenderData = {
  total: number
  segments: ProgressSegment[]
  selectedIndex: number | null
  animationProgress: number
  dimensions: { width, height, radius, innerRadius, centerX, centerY }
}

type TooltipRenderData = {
  segment: ProgressSegment
  index: number
  position: { x: number; y: number }
  arrowDirection: 'left' | 'right'
  close: () => void
}

type TooltipContentData = {
  segment: ProgressSegment
  index: number
  close: () => void
}
```
