import { useCallback, useState } from 'react'
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import PieChart, { Slice } from '../libs/PieChart'
import SemiCircularProgress from '../libs/SemiCircularProgress'

// ============================================================================
// Constants - Developer Info
// ============================================================================

const DEVELOPER = {
  name: 'Cat Tech',
  github: 'https://github.com/meowcoding7044',
  username: '@meowcoding7044',
}

// ============================================================================
// Types
// ============================================================================

type ActionButtonProps = {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  icon?: string
}

type LegendItemProps = {
  color: string
  label: string
  value: number
  percentage: number
}

// ============================================================================
// Constants
// ============================================================================

const INITIAL_PIE_DATA: Slice[] = [
  { value: 1000, color: '#22C55E', label: { text: 'Found' } },
  { value: 800, color: '#EF4444', label: { text: 'Not Found' } },
  { value: 500, color: '#F59E0B', label: { text: 'In Progress' } },
]

const INITIAL_CHECKED_VALUE = 220
const TOTAL_SUPPLIERS = 300

// ============================================================================
// Sub Components
// ============================================================================

function ActionButton({ title, onPress, variant = 'primary', icon }: ActionButtonProps) {
  const buttonStyle = [
    styles.actionButton,
    variant === 'primary' && styles.actionButtonPrimary,
    variant === 'secondary' && styles.actionButtonSecondary,
    variant === 'danger' && styles.actionButtonDanger,
  ]

  const textStyle = [
    styles.actionButtonText,
    variant === 'secondary' && styles.actionButtonTextSecondary,
  ]

  return (
    <Pressable
      style={({ pressed }) => [buttonStyle, pressed && styles.actionButtonPressed]}
      onPress={onPress}
    >
      {icon && <Text style={textStyle}>{icon} </Text>}
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  )
}

function LegendItem({ color, label, value, percentage }: LegendItemProps) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <View style={styles.legendTextContainer}>
        <Text style={styles.legendLabel}>{label}</Text>
        <Text style={styles.legendValue}>
          {value.toLocaleString()} ({percentage.toFixed(1)}%)
        </Text>
      </View>
    </View>
  )
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.card, style]}>{children}</View>
}

function ActionButtonGroup({ children }: { children: React.ReactNode }) {
  return <View style={styles.actionButtonGroup}>{children}</View>
}

// ============================================================================
// Pie Chart Section
// ============================================================================

function PieChartSection() {
  const [series, setSeries] = useState<Slice[]>(INITIAL_PIE_DATA)
  const [animationKey, setAnimationKey] = useState(0)

  const total = series.reduce((sum, s) => sum + s.value, 0)

  const updateSlice = useCallback((label: string, delta: number) => {
    setSeries(prev =>
      prev.map(s =>
        s.label?.text === label
          ? { ...s, value: Math.max(0, s.value + delta) }
          : s
      )
    )
  }, [])

  const resetData = useCallback(() => {
    setSeries(INITIAL_PIE_DATA)
    setAnimationKey(prev => prev + 1)
  }, [])

  return (
    <Card>
      <SectionTitle title="Donut Chart" subtitle="Asset Distribution Overview" />

      <View style={styles.chartWrapper}>
        <PieChart
          key={animationKey}
          widthAndHeight={220}
          series={series}
          cover={0.65}
          radiusScale={0.85}
          animation={{
            enabled: true,
            duration: 800,
            easing: 'easeOut',
            sequential: true,
            sequentialDelay: 100,
          }}
          tooltipStyle={{
            width: 100,
            height: 55,
            borderRadius: 10,
          }}
        >
          <View style={styles.centerContent}>
            <Text style={styles.centerLabel}>Total</Text>
            <Text style={styles.centerValue}>{total.toLocaleString()}</Text>
          </View>
        </PieChart>
      </View>

      {/* Legend */}
      <View style={styles.legendContainer}>
        {series.map((slice, index) => (
          <LegendItem
            key={index}
            color={slice.color}
            label={slice.label?.text || `Slice ${index + 1}`}
            value={slice.value}
            percentage={(slice.value / total) * 100}
          />
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actionSection}>
        <Text style={styles.actionSectionTitle}>Adjust Values</Text>
        <ActionButtonGroup>
          <ActionButton
            icon="+"
            title="Found"
            variant="primary"
            onPress={() => updateSlice('Found', 100)}
          />
          <ActionButton
            icon="-"
            title="Found"
            variant="secondary"
            onPress={() => updateSlice('Found', -100)}
          />
        </ActionButtonGroup>
        <ActionButtonGroup>
          <ActionButton
            icon="+"
            title="Not Found"
            variant="danger"
            onPress={() => updateSlice('Not Found', 100)}
          />
          <ActionButton
            icon="-"
            title="Not Found"
            variant="secondary"
            onPress={() => updateSlice('Not Found', -100)}
          />
        </ActionButtonGroup>
        <ActionButtonGroup>
          <ActionButton
            icon="↺"
            title="Reset"
            variant="secondary"
            onPress={resetData}
          />
        </ActionButtonGroup>
      </View>
    </Card>
  )
}

// ============================================================================
// Semi Circular Progress Section
// ============================================================================

function SemiCircularSection() {
  const [checkedValue, setCheckedValue] = useState(INITIAL_CHECKED_VALUE)
  const [animationKey, setAnimationKey] = useState(0)

  const inProgressValue = TOTAL_SUPPLIERS - checkedValue
  const checkedPercent = Math.round((checkedValue / TOTAL_SUPPLIERS) * 100)

  const updateChecked = useCallback((delta: number) => {
    setCheckedValue(prev => Math.max(0, Math.min(TOTAL_SUPPLIERS, prev + delta)))
  }, [])

  const resetData = useCallback(() => {
    setCheckedValue(INITIAL_CHECKED_VALUE)
    setAnimationKey(prev => prev + 1)
  }, [])

  return (
    <Card>
      <SectionTitle title="Semi-Circular Progress" subtitle="Supplier Check Status" />

      <View style={styles.chartWrapper}>
        <SemiCircularProgress
          key={animationKey}
          width={280}
          height={180}
          centerOffset={55}
          segments={[
            {
              value: checkedValue,
              color: '#22C55E',
              label: String(checkedValue),
              sublabel: `${checkedPercent}% Checked`,
              sublabelColor: '#22C55E',
              thicknessMultiplier: 1.0,
              cornerRadius: 10,
            },
            {
              value: inProgressValue,
              color: '#E5E7EB',
              label: String(inProgressValue),
              sublabel: 'In Progress',
              sublabelColor: '#6B7280',
              thicknessMultiplier: 0.6,
              endCornerRadius: 8,
            },
          ]}
          thickness={0.22}
          cornerRadius={20}
          tooltip={{
            backgroundColor: 'white',
            borderRadius: 12,
            shadow: true,
            width: 110,
            height: 60,
            autoHideDelay: 5000,
          }}
          renderTooltipContent={({ segment }) => (
            <View style={styles.tooltipContent}>
              <Text style={[styles.tooltipLabel, { color: segment.color }]}>
                {segment.sublabel}
              </Text>
              <Text style={styles.tooltipValue}>{segment.label}</Text>
            </View>
          )}
          animation={{
            enabled: true,
            duration: 800,
            easing: 'easeOut',
          }}
        >
          {({ total, animationProgress }) => (
            <View style={styles.centerContent}>
              <Text style={styles.semiCenterLabel}>Total Suppliers</Text>
              <Text style={styles.semiCenterValue}>
                {Math.round(total * animationProgress)}
              </Text>
            </View>
          )}
        </SemiCircularProgress>
      </View>

      {/* Status Summary */}
      <View style={styles.statusSummary}>
        <View style={styles.statusItem}>
          <View style={[styles.statusDot, { backgroundColor: '#22C55E' }]} />
          <Text style={styles.statusLabel}>Checked</Text>
          <Text style={[styles.statusValue, { color: '#22C55E' }]}>{checkedValue}</Text>
        </View>
        <View style={styles.statusDivider} />
        <View style={styles.statusItem}>
          <View style={[styles.statusDot, { backgroundColor: '#E5E7EB' }]} />
          <Text style={styles.statusLabel}>Pending</Text>
          <Text style={[styles.statusValue, { color: '#6B7280' }]}>{inProgressValue}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionSection}>
        <Text style={styles.actionSectionTitle}>Simulate Progress</Text>
        <ActionButtonGroup>
          <ActionButton
            icon="+"
            title="10"
            variant="primary"
            onPress={() => updateChecked(10)}
          />
          <ActionButton
            icon="+"
            title="50"
            variant="primary"
            onPress={() => updateChecked(50)}
          />
          <ActionButton
            icon="-"
            title="10"
            variant="secondary"
            onPress={() => updateChecked(-10)}
          />
          <ActionButton
            icon="-"
            title="50"
            variant="secondary"
            onPress={() => updateChecked(-50)}
          />
        </ActionButtonGroup>
        <ActionButtonGroup>
          <ActionButton
            icon="✓"
            title="Complete All"
            variant="primary"
            onPress={() => setCheckedValue(TOTAL_SUPPLIERS)}
          />
          <ActionButton
            icon="↺"
            title="Reset"
            variant="secondary"
            onPress={resetData}
          />
        </ActionButtonGroup>
      </View>
    </Card>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export default function PieChartComponent() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chart Examples</Text>
        <Text style={styles.headerSubtitle}>Interactive data visualization components</Text>
      </View>

      <PieChartSection />
      <SemiCircularSection />

      {/* Footer with Developer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerHint}>
          Tap on chart segments to see tooltips
        </Text>

        <View style={styles.developerSection}>
          <View style={styles.divider} />
          
          <View style={styles.developerInfo}>
            <Text style={styles.developerLabel}>Developed by</Text>
            <View style={styles.developerNameRow}>
              <Text style={styles.catEmoji}>🐱</Text>
              <Text style={styles.developerName}>{DEVELOPER.name}</Text>
            </View>
            
            <Pressable
              style={({ pressed }) => [
                styles.githubButton,
                pressed && styles.githubButtonPressed,
              ]}
              onPress={() => Linking.openURL(DEVELOPER.github)}
            >
              <Text style={styles.githubIcon}>⚡</Text>
              <Text style={styles.githubText}>{DEVELOPER.username}</Text>
              <Text style={styles.githubArrow}>→</Text>
            </Pressable>
          </View>

          <Text style={styles.copyright}>
            © 2024 Cat Tech. Made with ❤️ in Thailand
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    width:'100%',
    backgroundColor: '#F3F4F6',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },

  // Header
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  // Section Header
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  // Chart Wrapper
  chartWrapper: {
    alignItems: 'center',
    marginVertical: 8,
  },

  // Center Content
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  centerValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: -2,
  },
  semiCenterLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  semiCenterValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: -4,
  },

  // Legend
  legendContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  legendValue: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Status Summary
  statusSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 6,
  },
  statusLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
  },

  // Action Section
  actionSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionButtonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },

  // Action Button
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    minHeight: 40,
  },
  actionButtonPrimary: {
    backgroundColor: '#22C55E',
  },
  actionButtonSecondary: {
    backgroundColor: '#F3F4F6',
  },
  actionButtonDanger: {
    backgroundColor: '#EF4444',
  },
  actionButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtonTextSecondary: {
    color: '#374151',
  },

  // Tooltip
  tooltipContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  tooltipLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tooltipValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 2,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 24,
  },
  footerHint: {
    fontSize: 13,
    color: '#9CA3AF',
  },

  // Developer Section
  developerSection: {
    marginTop: 24,
    alignItems: 'center',
    width: '100%',
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 20,
  },
  developerInfo: {
    alignItems: 'center',
  },
  developerLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  developerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  catEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  developerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  githubButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
  },
  githubButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  githubIcon: {
    fontSize: 14,
  },
  githubText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  githubArrow: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  copyright: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 16,
  },
})
