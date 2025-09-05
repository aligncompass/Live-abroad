import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { costData, countryFlags, formatCurrency } from './data/costData.js'
import './App.css'

function App() {
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(1) // Start with Brazil
  const [showLocalCurrency, setShowLocalCurrency] = useState(false)
  const [animatingCards, setAnimatingCards] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const selectedCountry = costData[selectedCountryIndex]
  const usBaseline = costData[0] // United States is always index 0

  // Count-up animation hook
  const useCountUp = (end, duration = 1000, start = 0) => {
    const [count, setCount] = useState(start)
    
    useEffect(() => {
      let startTime = null
      const animate = (currentTime) => {
        if (startTime === null) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        setCount(start + (end - start) * easeOutQuart)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }, [end, duration, start])
    
    return count
  }

  // Trigger animation when country changes
  useEffect(() => {
    setAnimatingCards(true)
    const timer = setTimeout(() => setAnimatingCards(false), 300)
    return () => clearTimeout(timer)
  }, [selectedCountryIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setSelectedCountryIndex(prev => Math.max(0, prev - 1))
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        setSelectedCountryIndex(prev => Math.min(costData.length - 1, prev + 1))
      } else if (event.key === 'Escape') {
        event.preventDefault()
        setShowTooltip(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Calculate delta percentage for a metric
  const calculateDelta = (metric) => {
    const countryPrice = selectedCountry.metrics[metric].usd
    const usPrice = usBaseline.metrics[metric].usd
    return ((countryPrice - usPrice) / usPrice) * 100
  }

  // Format delta display
  const formatDelta = (delta) => {
    const absValue = Math.abs(delta)
    const rounded = Math.round(absValue)
    const capped = Math.min(rounded, 99)
    
    if (delta < 0) {
      return `${capped}% cheaper`
    } else if (delta > 0) {
      return `${capped}% more`
    } else {
      return 'Same price'
    }
  }

  // Get delta color class
  const getDeltaColorClass = (delta) => {
    if (delta < 0) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (delta > 0) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }

  // Get overall index gradient class
  const getOverallIndexGradient = (index) => {
    if (index < -40) return 'from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950'
    if (index < -20) return 'from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950'
    if (index < 0) return 'from-yellow-50 to-green-50 dark:from-yellow-950 dark:to-green-950'
    if (index < 20) return 'from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950'
    return 'from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950'
  }

  const metricLabels = {
    rent_monthly: 'Rent (monthly)',
    coffee_cappuccino: 'Cappuccino',
    sandwich_lunch: 'Sandwich (lunch)',
    haircut_mens: 'Haircut',
  }

  // Animated Metric Card Component
  const AnimatedMetricCard = ({ metricKey, label, delay = 0 }) => {
    const metric = selectedCountry.metrics[metricKey]
    const delta = calculateDelta(metricKey)
    
    const displayValue = showLocalCurrency && metric.local.currency !== 'USD' 
      ? metric.local.amount 
      : metric.usd
    
    const animatedValue = useCountUp(displayValue, 800, 0)
    
    const fullDelta = ((metric.usd - usBaseline.metrics[metricKey].usd) / usBaseline.metrics[metricKey].usd) * 100
    const deltaText = fullDelta < 0 
      ? `${Math.abs(fullDelta).toFixed(1)} percent cheaper than United States`
      : fullDelta > 0 
        ? `${fullDelta.toFixed(1)} percent more expensive than United States`
        : 'Same price as United States'
    
    return (
      <motion.div
        key={`${selectedCountryIndex}-${metricKey}`}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ 
          duration: 0.4, 
          delay: delay,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="bg-card rounded-lg p-6 shadow-sm border hover:shadow-md transition-all duration-300"
        role="region"
        aria-label={`${label} cost comparison for ${selectedCountry.country}`}
      >
        <h3 className="font-semibold text-lg mb-3">{label}</h3>
        
        <div className="space-y-2">
          <div 
            className="text-2xl font-bold"
            aria-label={`Price: ${showLocalCurrency && metric.local.currency !== 'USD'
              ? formatCurrency(metric.local.amount, metric.local.currency)
              : formatCurrency(metric.usd, 'USD')
            }`}
          >
            {showLocalCurrency && metric.local.currency !== 'USD'
              ? formatCurrency(animatedValue, metric.local.currency)
              : formatCurrency(animatedValue, 'USD')
            }
          </div>
          
          {showLocalCurrency && metric.local.currency !== 'USD' && (
            <div className="text-sm text-muted-foreground">
              {formatCurrency(metric.usd, 'USD')}
            </div>
          )}
          
          <motion.div 
            key={`badge-${selectedCountryIndex}-${metricKey}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.3, duration: 0.3 }}
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDeltaColorClass(delta)}`}
            role="status"
            aria-label={deltaText}
          >
            {formatDelta(delta)}
          </motion.div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="text-center py-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          What would your daily costs look like abroad?
        </h1>
        <p className="text-lg text-muted-foreground">
          Slide east or west to compare prices with the U.S.
        </p>
      </div>

      {/* Country Slider */}
      <div className="px-4 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-card rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Select Country</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={showLocalCurrency ? "outline" : "default"}
                  size="sm"
                  onClick={() => setShowLocalCurrency(false)}
                >
                  USD
                </Button>
                <Button
                  variant={showLocalCurrency ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowLocalCurrency(true)}
                >
                  Local
                </Button>
              </div>
            </div>
            
            {/* Horizontal Country Slider */}
            <div className="relative">
              <div className="flex items-center justify-center mb-4">
                <div className="text-sm text-muted-foreground">West ← → East</div>
              </div>
              
              {/* Slider Track */}
              <div className="relative bg-muted rounded-full h-2 mb-6">
                <div 
                  className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-300 ease-out"
                  style={{ 
                    width: `${((selectedCountryIndex) / (costData.length - 1)) * 100}%` 
                  }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background shadow-lg transition-all duration-300 ease-out"
                  style={{ 
                    left: `calc(${((selectedCountryIndex) / (costData.length - 1)) * 100}% - 8px)` 
                  }}
                />
              </div>
              
              {/* Country Buttons */}
              <div className="flex justify-between items-center" role="radiogroup" aria-label="Select country for cost comparison">
                {costData.map((country, index) => (
                  <button
                    key={country.country}
                    onClick={() => setSelectedCountryIndex(index)}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 hover:scale-110 ${
                      selectedCountryIndex === index
                        ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                        : 'bg-background hover:bg-accent'
                    }`}
                    role="radio"
                    aria-checked={selectedCountryIndex === index}
                    aria-label={`Select ${country.country} for cost comparison`}
                    tabIndex={selectedCountryIndex === index ? 0 : -1}
                  >
                    <div className="text-3xl mb-2" aria-hidden="true">{countryFlags[country.country]}</div>
                    <div className="text-xs font-medium text-center max-w-16">
                      {country.country}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Keyboard Navigation Hint */}
              <div className="text-center mt-4">
                <div className="text-xs text-muted-foreground">
                  Use ← → arrow keys to navigate
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* US Baseline Row */}
      <div className="px-4 mb-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-muted/50 rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{countryFlags["United States"]}</span>
              <h3 className="font-semibold">United States (Baseline)</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {Object.entries(metricLabels).map(([key, label]) => (
                <div key={key}>
                  <div className="text-muted-foreground">{label}</div>
                  <div className="font-medium">
                    {formatCurrency(usBaseline.metrics[key].usd, 'USD')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedCountryIndex}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Individual Metric Cards */}
              {Object.entries(metricLabels).map(([key, label], index) => (
                <AnimatedMetricCard 
                  key={key}
                  metricKey={key} 
                  label={label} 
                  delay={index * 0.1}
                />
              ))}

              {/* Overall Cost of Living Card */}
              <motion.div 
                key={`overall-${selectedCountryIndex}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className={`bg-gradient-to-br ${getOverallIndexGradient(selectedCountry.metrics.overall_index_vs_us)} rounded-lg p-6 shadow-sm border hover:shadow-md transition-all duration-300 md:col-span-2 lg:col-span-3`}
              >
                <h3 className="font-semibold text-lg mb-3">Overall cost of living</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <motion.div 
                      key={`overall-text-${selectedCountryIndex}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.3 }}
                      className="text-2xl font-bold"
                    >
                      {selectedCountry.metrics.overall_index_vs_us === 0 
                        ? 'Same as U.S.'
                        : selectedCountry.metrics.overall_index_vs_us < 0
                          ? `${Math.abs(selectedCountry.metrics.overall_index_vs_us)}% cheaper vs U.S.`
                          : `${selectedCountry.metrics.overall_index_vs_us}% more vs U.S.`
                      }
                    </motion.div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Compared to United States baseline
                    </div>
                  </div>
                  
                  <motion.div 
                    key={`flag-${selectedCountryIndex}`}
                    initial={{ scale: 0.5, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                    className="text-4xl"
                  >
                    {countryFlags[selectedCountry.country]}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="relative">
              <button
                onClick={() => setShowTooltip(!showTooltip)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setShowTooltip(!showTooltip)
                  }
                }}
                className="p-1 rounded-full hover:bg-accent transition-colors"
                aria-label="Information about cost estimates"
                aria-expanded={showTooltip}
                aria-haspopup="true"
              >
                <Info className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-popover text-popover-foreground rounded-lg shadow-lg border text-xs"
                    role="tooltip"
                    aria-live="polite"
                  >
                    <div className="font-medium mb-1">About these estimates</div>
                    <div>
                      These figures are approximations based on city and country averages. 
                      They are intended for relative comparison only and may not reflect 
                      actual costs in specific locations or circumstances.
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span>Estimates; city/country averages. For exploration only.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

