// Analytics and monitoring utilities for the teacher application

export interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp?: number
  userId?: string
  sessionId?: string
}

export interface FormAnalytics {
  step: number
  stepName: string
  timeSpent: number
  fieldsCompleted: number
  totalFields: number
  errors: string[]
  helpUsed: boolean
}

export interface PerformanceMetrics {
  pageLoadTime: number
  formRenderTime: number
  fileUploadTime: number
  validationTime: number
  submissionTime: number
}

// Analytics class for tracking user interactions
export class Analytics {
  private static instance: Analytics
  private events: AnalyticsEvent[] = []
  private sessionId: string
  private userId?: string
  private startTime: number

  constructor() {
    this.sessionId = this.generateSessionId()
    this.startTime = Date.now()
    this.initializeTracking()
  }

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics()
    }
    return Analytics.instance
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeTracking(): void {
    // Track page load
    this.track('page_load', {
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    })

    // Track form interactions
    this.setupFormTracking()
    
    // Track performance metrics
    this.trackPerformance()
  }

  private setupFormTracking(): void {
    // Track form field focus/blur
    document.addEventListener('focusin', (e) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        this.track('form_field_focus', {
          fieldName: target.getAttribute('name'),
          fieldType: target.getAttribute('type'),
          step: this.getCurrentStep()
        })
      }
    })

    document.addEventListener('focusout', (e) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        this.track('form_field_blur', {
          fieldName: target.getAttribute('name'),
          fieldType: target.getAttribute('type'),
          step: this.getCurrentStep(),
          hasValue: (target as HTMLInputElement).value.length > 0
        })
      }
    })
  }

  private trackPerformance(): void {
    // Track page load performance
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      this.track('performance_metrics', {
        pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: this.getFirstPaint(),
        firstContentfulPaint: this.getFirstContentfulPaint()
      })
    })
  }

  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint')
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')
    return firstPaint ? firstPaint.startTime : 0
  }

  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint')
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    return firstContentfulPaint ? firstContentfulPaint.startTime : 0
  }

  private getCurrentStep(): number {
    // This would be implemented based on your form structure
    const stepElement = document.querySelector('[data-step]')
    return stepElement ? parseInt(stepElement.getAttribute('data-step') || '1') : 1
  }

  // Public methods
  track(event: string, properties?: Record<string, any>): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: Date.now(),
        pageUrl: window.location.href
      }
    }

    this.events.push(analyticsEvent)
    
    // Send to analytics service (implement based on your analytics provider)
    this.sendToAnalytics(analyticsEvent)
    
    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', analyticsEvent)
    }
  }

  private async sendToAnalytics(event: AnalyticsEvent): Promise<void> {
    try {
      // Example: Send to your analytics endpoint
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      })
    } catch (error) {
      console.error('Failed to send analytics event:', error)
    }
  }

  setUserId(userId: string): void {
    this.userId = userId
  }

  // Form-specific tracking methods
  trackFormStep(step: number, stepName: string, timeSpent: number): void {
    this.track('form_step_completed', {
      step,
      stepName,
      timeSpent,
      sessionDuration: Date.now() - this.startTime
    })
  }

  trackFormError(fieldName: string, errorMessage: string, step: number): void {
    this.track('form_validation_error', {
      fieldName,
      errorMessage,
      step,
      timestamp: Date.now()
    })
  }

  trackFileUpload(fileName: string, fileSize: number, uploadTime: number, success: boolean): void {
    this.track('file_upload', {
      fileName,
      fileSize,
      uploadTime,
      success,
      step: this.getCurrentStep()
    })
  }

  trackFormSubmission(success: boolean, errors?: string[]): void {
    this.track('form_submission', {
      success,
      errors,
      totalTime: Date.now() - this.startTime,
      stepsCompleted: this.getCurrentStep()
    })
  }

  trackHelpUsage(helpType: string, step: number): void {
    this.track('help_used', {
      helpType,
      step,
      timestamp: Date.now()
    })
  }

  // Get analytics data
  getEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  getSessionDuration(): number {
    return Date.now() - this.startTime
  }

  // Export analytics data
  exportAnalytics(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      userId: this.userId,
      startTime: this.startTime,
      duration: this.getSessionDuration(),
      events: this.events
    }, null, 2)
  }
}

// Form completion tracking
export class FormCompletionTracker {
  private stepStartTimes: Map<number, number> = new Map()
  private stepData: Map<number, FormAnalytics> = new Map()
  private currentStep: number = 1

  startStep(step: number, stepName: string): void {
    this.currentStep = step
    this.stepStartTimes.set(step, Date.now())
    
    this.stepData.set(step, {
      step,
      stepName,
      timeSpent: 0,
      fieldsCompleted: 0,
      totalFields: this.countFieldsInStep(step),
      errors: [],
      helpUsed: false
    })
  }

  endStep(step: number): void {
    const startTime = this.stepStartTimes.get(step)
    if (startTime) {
      const timeSpent = Date.now() - startTime
      const stepData = this.stepData.get(step)
      
      if (stepData) {
        stepData.timeSpent = timeSpent
        this.stepData.set(step, stepData)
        
        // Track with analytics
        Analytics.getInstance().trackFormStep(step, stepData.stepName, timeSpent)
      }
    }
  }

  updateFieldCompletion(step: number, completed: number): void {
    const stepData = this.stepData.get(step)
    if (stepData) {
      stepData.fieldsCompleted = completed
      this.stepData.set(step, stepData)
    }
  }

  addError(step: number, fieldName: string, errorMessage: string): void {
    const stepData = this.stepData.get(step)
    if (stepData) {
      stepData.errors.push(`${fieldName}: ${errorMessage}`)
      this.stepData.set(step, stepData)
      
      // Track with analytics
      Analytics.getInstance().trackFormError(fieldName, errorMessage, step)
    }
  }

  markHelpUsed(step: number, helpType: string): void {
    const stepData = this.stepData.get(step)
    if (stepData) {
      stepData.helpUsed = true
      this.stepData.set(step, stepData)
      
      // Track with analytics
      Analytics.getInstance().trackHelpUsage(helpType, step)
    }
  }

  private countFieldsInStep(step: number): number {
    // This would be implemented based on your form structure
    const stepElement = document.querySelector(`[data-step="${step}"]`)
    if (stepElement) {
      return stepElement.querySelectorAll('input, textarea, select').length
    }
    return 0
  }

  getStepData(step: number): FormAnalytics | undefined {
    return this.stepData.get(step)
  }

  getAllStepData(): FormAnalytics[] {
    return Array.from(this.stepData.values())
  }

  getCompletionRate(): number {
    const allSteps = this.getAllStepData()
    if (allSteps.length === 0) return 0
    
    const totalFields = allSteps.reduce((sum, step) => sum + step.totalFields, 0)
    const completedFields = allSteps.reduce((sum, step) => sum + step.fieldsCompleted, 0)
    
    return totalFields > 0 ? (completedFields / totalFields) * 100 : 0
  }
}

// Error tracking
export class ErrorTracker {
  private errors: Array<{
    message: string
    stack?: string
    timestamp: number
    url: string
    userAgent: string
    userId?: string
  }> = []

  trackError(error: Error, context?: Record<string, any>): void {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: Analytics.getInstance().getEvents().find(e => e.properties?.userId)?.properties?.userId,
      context
    }

    this.errors.push(errorData)
    
    // Send to error tracking service
    this.sendErrorToService(errorData)
    
    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.error('Tracked Error:', errorData)
    }
  }

  private async sendErrorToService(errorData: any): Promise<void> {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData)
      })
    } catch (error) {
      console.error('Failed to send error to service:', error)
    }
  }

  getErrors(): any[] {
    return [...this.errors]
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    pageLoadTime: 0,
    formRenderTime: 0,
    fileUploadTime: 0,
    validationTime: 0,
    submissionTime: 0
  }

  startTiming(metric: keyof PerformanceMetrics): () => void {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      this.metrics[metric] = endTime - startTime
      
      // Track with analytics
      Analytics.getInstance().track('performance_metric', {
        metric,
        duration: this.metrics[metric]
      })
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  // Monitor Core Web Vitals
  monitorWebVitals(): void {
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      
      Analytics.getInstance().track('web_vital', {
        metric: 'LCP',
        value: lastEntry.startTime
      })
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach((entry) => {
        Analytics.getInstance().track('web_vital', {
          metric: 'FID',
          value: entry.processingStart - entry.startTime
        })
      })
    }).observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift
    let clsValue = 0
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      
      Analytics.getInstance().track('web_vital', {
        metric: 'CLS',
        value: clsValue
      })
    }).observe({ entryTypes: ['layout-shift'] })
  }
}

// Initialize analytics
export function initializeAnalytics(): void {
  const analytics = Analytics.getInstance()
  const errorTracker = new ErrorTracker()
  const performanceMonitor = new PerformanceMonitor()
  
  // Set up global error handling
  window.addEventListener('error', (event) => {
    errorTracker.trackError(event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    })
  })

  // Set up unhandled promise rejection handling
  window.addEventListener('unhandledrejection', (event) => {
    errorTracker.trackError(new Error(event.reason), {
      type: 'unhandledrejection'
    })
  })

  // Monitor web vitals
  performanceMonitor.monitorWebVitals()

  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    analytics.track('page_visibility_change', {
      hidden: document.hidden,
      timestamp: Date.now()
    })
  })

  // Track beforeunload
  window.addEventListener('beforeunload', () => {
    analytics.track('page_unload', {
      sessionDuration: analytics.getSessionDuration(),
      timestamp: Date.now()
    })
  })
}

// Export instances for use in components
export const analytics = Analytics.getInstance()
export const formTracker = new FormCompletionTracker()
export const errorTracker = new ErrorTracker()
export const performanceMonitor = new PerformanceMonitor()
