// Accessibility utilities for enhanced user experience

export interface AccessibilityConfig {
  announceChanges: boolean
  highContrast: boolean
  reducedMotion: boolean
  fontSize: 'small' | 'medium' | 'large'
  screenReader: boolean
}

export interface FocusTrapOptions {
  container: HTMLElement
  initialFocus?: HTMLElement
  returnFocus?: HTMLElement
  escapeDeactivates?: boolean
}

// Accessibility manager class
export class AccessibilityManager {
  private static instance: AccessibilityManager
  private config: AccessibilityConfig
  private focusHistory: HTMLElement[] = []
  private currentFocusTrap: HTMLElement | null = null
  private observers: Map<string, MutationObserver> = new Map()

  constructor() {
    this.config = this.detectPreferences()
    this.initializeAccessibility()
  }

  static getInstance(): AccessibilityManager {
    if (!AccessibilityManager.instance) {
      AccessibilityManager.instance = new AccessibilityManager()
    }
    return AccessibilityManager.instance
  }

  private detectPreferences(): AccessibilityConfig {
    // Detect user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
    
    // Detect screen reader
    const hasScreenReader = this.detectScreenReader()
    
    return {
      announceChanges: true,
      highContrast: prefersHighContrast,
      reducedMotion: prefersReducedMotion,
      fontSize: 'medium',
      screenReader: hasScreenReader
    }
  }

  private detectScreenReader(): boolean {
    // Check for common screen reader indicators
    const indicators = [
      'speechSynthesis' in window,
      'webkitSpeechSynthesis' in window,
      navigator.userAgent.includes('NVDA'),
      navigator.userAgent.includes('JAWS'),
      navigator.userAgent.includes('VoiceOver'),
      document.querySelector('[aria-live]') !== null
    ]
    
    return indicators.some(indicator => indicator)
  }

  private initializeAccessibility(): void {
    // Set up ARIA live regions
    this.createLiveRegions()
    
    // Set up focus management
    this.setupFocusManagement()
    
    // Set up keyboard navigation
    this.setupKeyboardNavigation()
    
    // Set up high contrast mode
    if (this.config.highContrast) {
      this.enableHighContrast()
    }
    
    // Set up reduced motion
    if (this.config.reducedMotion) {
      this.enableReducedMotion()
    }
    
    // Listen for preference changes
    this.setupPreferenceListeners()
  }

  private createLiveRegions(): void {
    // Create polite live region for general announcements
    const politeRegion = document.createElement('div')
    politeRegion.setAttribute('aria-live', 'polite')
    politeRegion.setAttribute('aria-atomic', 'true')
    politeRegion.className = 'sr-only'
    politeRegion.id = 'live-region-polite'
    document.body.appendChild(politeRegion)

    // Create assertive live region for urgent announcements
    const assertiveRegion = document.createElement('div')
    assertiveRegion.setAttribute('aria-live', 'assertive')
    assertiveRegion.setAttribute('aria-atomic', 'true')
    assertiveRegion.className = 'sr-only'
    assertiveRegion.id = 'live-region-assertive'
    document.body.appendChild(assertiveRegion)
  }

  private setupFocusManagement(): void {
    // Track focus changes
    document.addEventListener('focusin', (e) => {
      const target = e.target as HTMLElement
      if (target && target !== document.body) {
        this.focusHistory.push(target)
        // Keep only last 10 focus elements
        if (this.focusHistory.length > 10) {
          this.focusHistory.shift()
        }
      }
    })

    // Handle focus trap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && this.currentFocusTrap) {
        this.handleFocusTrap(e)
      }
    })
  }

  private setupKeyboardNavigation(): void {
    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.handleEscapeKey()
      }
    })

    // Handle arrow key navigation for custom components
    document.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        this.handleArrowNavigation(e)
      }
    })
  }

  private setupPreferenceListeners(): void {
    // Listen for reduced motion preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    motionQuery.addEventListener('change', (e) => {
      this.config.reducedMotion = e.matches
      if (e.matches) {
        this.enableReducedMotion()
      } else {
        this.disableReducedMotion()
      }
    })

    // Listen for high contrast preference changes
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    contrastQuery.addEventListener('change', (e) => {
      this.config.highContrast = e.matches
      if (e.matches) {
        this.enableHighContrast()
      } else {
        this.disableHighContrast()
      }
    })
  }

  // Public methods
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.config.announceChanges) return

    const region = document.getElementById(`live-region-${priority}`)
    if (region) {
      region.textContent = message
      // Clear after announcement
      setTimeout(() => {
        region.textContent = ''
      }, 1000)
    }
  }

  setFocus(element: HTMLElement): void {
    if (element && typeof element.focus === 'function') {
      element.focus()
      this.announce(`Focused on ${this.getElementDescription(element)}`)
    }
  }

  trapFocus(options: FocusTrapOptions): () => void {
    const { container, initialFocus, returnFocus } = options
    this.currentFocusTrap = container

    // Find all focusable elements
    const focusableElements = this.getFocusableElements(container)
    
    if (focusableElements.length === 0) return () => {}

    // Set initial focus
    const firstFocusable = initialFocus || focusableElements[0]
    this.setFocus(firstFocusable)

    // Return cleanup function
    return () => {
      this.currentFocusTrap = null
      if (returnFocus) {
        this.setFocus(returnFocus)
      }
    }
  }

  private handleFocusTrap(e: KeyboardEvent): void {
    if (!this.currentFocusTrap) return

    const focusableElements = this.getFocusableElements(this.currentFocusTrap)
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement)

    if (e.shiftKey) {
      // Shift + Tab: move to previous element
      e.preventDefault()
      const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1
      this.setFocus(focusableElements[prevIndex])
    } else {
      // Tab: move to next element
      e.preventDefault()
      const nextIndex = currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1
      this.setFocus(focusableElements[nextIndex])
    }
  }

  private getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')

    return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[]
  }

  private handleEscapeKey(): void {
    // Close any open modals, dropdowns, etc.
    const openElements = document.querySelectorAll('[aria-expanded="true"], [aria-modal="true"]')
    openElements.forEach(element => {
      const closeButton = element.querySelector('[aria-label*="close"], [aria-label*="Close"]') as HTMLElement
      if (closeButton) {
        closeButton.click()
      }
    })
  }

  private handleArrowNavigation(e: KeyboardEvent): void {
    const target = e.target as HTMLElement
    const role = target.getAttribute('role')
    
    if (role === 'tablist') {
      this.handleTabNavigation(e, target)
    } else if (role === 'menu' || role === 'menubar') {
      this.handleMenuNavigation(e, target)
    }
  }

  private handleTabNavigation(e: KeyboardEvent, tablist: HTMLElement): void {
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]')) as HTMLElement[]
    const currentIndex = tabs.indexOf(document.activeElement as HTMLElement)

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      const prevIndex = currentIndex <= 0 ? tabs.length - 1 : currentIndex - 1
      this.setFocus(tabs[prevIndex])
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      const nextIndex = currentIndex >= tabs.length - 1 ? 0 : currentIndex + 1
      this.setFocus(tabs[nextIndex])
    }
  }

  private handleMenuNavigation(e: KeyboardEvent, menu: HTMLElement): void {
    const menuItems = Array.from(menu.querySelectorAll('[role="menuitem"]')) as HTMLElement[]
    const currentIndex = menuItems.indexOf(document.activeElement as HTMLElement)

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prevIndex = currentIndex <= 0 ? menuItems.length - 1 : currentIndex - 1
      this.setFocus(menuItems[prevIndex])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nextIndex = currentIndex >= menuItems.length - 1 ? 0 : currentIndex + 1
      this.setFocus(menuItems[nextIndex])
    }
  }

  private getElementDescription(element: HTMLElement): string {
    // Get accessible name
    const accessibleName = this.getAccessibleName(element)
    if (accessibleName) return accessibleName

    // Fallback to common attributes
    const label = element.getAttribute('aria-label') || 
                 element.getAttribute('title') || 
                 element.textContent?.trim() ||
                 element.tagName.toLowerCase()

    return label
  }

  private getAccessibleName(element: HTMLElement): string | null {
    // Check aria-label first
    const ariaLabel = element.getAttribute('aria-label')
    if (ariaLabel) return ariaLabel

    // Check aria-labelledby
    const labelledBy = element.getAttribute('aria-labelledby')
    if (labelledBy) {
      const labelElement = document.getElementById(labelledBy)
      if (labelElement) return labelElement.textContent?.trim() || null
    }

    // Check for associated label
    const id = element.getAttribute('id')
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`)
      if (label) return label.textContent?.trim() || null
    }

    // Check for parent label
    const parentLabel = element.closest('label')
    if (parentLabel) return parentLabel.textContent?.trim() || null

    return null
  }

  private enableHighContrast(): void {
    document.body.classList.add('high-contrast')
  }

  private disableHighContrast(): void {
    document.body.classList.remove('high-contrast')
  }

  private enableReducedMotion(): void {
    document.body.classList.add('reduced-motion')
  }

  private disableReducedMotion(): void {
    document.body.classList.remove('reduced-motion')
  }

  // Form-specific accessibility helpers
  announceFormError(fieldName: string, errorMessage: string): void {
    this.announce(`Error in ${fieldName}: ${errorMessage}`, 'assertive')
  }

  announceFormSuccess(message: string): void {
    this.announce(message, 'polite')
  }

  announceFormStepChange(stepName: string, stepNumber: number, totalSteps: number): void {
    this.announce(`Step ${stepNumber} of ${totalSteps}: ${stepName}`, 'polite')
  }

  // File upload accessibility
  announceFileUpload(fileName: string, success: boolean): void {
    const message = success 
      ? `File ${fileName} uploaded successfully`
      : `Failed to upload file ${fileName}`
    this.announce(message, success ? 'polite' : 'assertive')
  }

  // Progress accessibility
  announceProgress(current: number, total: number, label?: string): void {
    const percentage = Math.round((current / total) * 100)
    const message = label 
      ? `${label}: ${percentage}% complete`
      : `${percentage}% complete`
    this.announce(message, 'polite')
  }

  // Get current configuration
  getConfig(): AccessibilityConfig {
    return { ...this.config }
  }

  // Update configuration
  updateConfig(updates: Partial<AccessibilityConfig>): void {
    this.config = { ...this.config, ...updates }
  }
}

// Utility functions for common accessibility patterns
export function createAccessibleButton(
  text: string,
  onClick: () => void,
  options: {
    variant?: 'primary' | 'secondary' | 'danger'
    size?: 'small' | 'medium' | 'large'
    disabled?: boolean
    ariaLabel?: string
    ariaDescribedBy?: string
  } = {}
): HTMLElement {
  const button = document.createElement('button')
  button.textContent = text
  button.addEventListener('click', onClick)
  
  // Add classes
  button.className = `btn btn-${options.variant || 'primary'} btn-${options.size || 'medium'}`
  
  // Add accessibility attributes
  if (options.ariaLabel) {
    button.setAttribute('aria-label', options.ariaLabel)
  }
  if (options.ariaDescribedBy) {
    button.setAttribute('aria-describedby', options.ariaDescribedBy)
  }
  if (options.disabled) {
    button.disabled = true
    button.setAttribute('aria-disabled', 'true')
  }

  return button
}

export function createAccessibleInput(
  type: string,
  options: {
    id: string
    name: string
    label: string
    required?: boolean
    placeholder?: string
    errorMessage?: string
    helpText?: string
  }
): HTMLElement {
  const container = document.createElement('div')
  container.className = 'form-field'

  // Create label
  const label = document.createElement('label')
  label.setAttribute('for', options.id)
  label.textContent = options.label
  if (options.required) {
    label.innerHTML += ' <span class="required" aria-label="required">*</span>'
  }
  container.appendChild(label)

  // Create input
  const input = document.createElement('input')
  input.type = type
  input.id = options.id
  input.name = options.name
  if (options.placeholder) {
    input.placeholder = options.placeholder
  }
  if (options.required) {
    input.required = true
    input.setAttribute('aria-required', 'true')
  }
  if (options.errorMessage) {
    input.setAttribute('aria-invalid', 'true')
    input.setAttribute('aria-describedby', `${options.id}-error`)
  }
  if (options.helpText) {
    input.setAttribute('aria-describedby', `${options.id}-help`)
  }
  container.appendChild(input)

  // Create help text
  if (options.helpText) {
    const help = document.createElement('div')
    help.id = `${options.id}-help`
    help.className = 'help-text'
    help.textContent = options.helpText
    container.appendChild(help)
  }

  // Create error message
  if (options.errorMessage) {
    const error = document.createElement('div')
    error.id = `${options.id}-error`
    error.className = 'error-message'
    error.setAttribute('role', 'alert')
    error.textContent = options.errorMessage
    container.appendChild(error)
  }

  return container
}

export function createAccessibleModal(
  title: string,
  content: HTMLElement,
  options: {
    closeButton?: boolean
    onClose?: () => void
  } = {}
): HTMLElement {
  const modal = document.createElement('div')
  modal.className = 'modal'
  modal.setAttribute('role', 'dialog')
  modal.setAttribute('aria-modal', 'true')
  modal.setAttribute('aria-labelledby', 'modal-title')

  // Create modal content
  const modalContent = document.createElement('div')
  modalContent.className = 'modal-content'

  // Create header
  const header = document.createElement('div')
  header.className = 'modal-header'
  
  const titleElement = document.createElement('h2')
  titleElement.id = 'modal-title'
  titleElement.textContent = title
  header.appendChild(titleElement)

  if (options.closeButton !== false) {
    const closeButton = document.createElement('button')
    closeButton.className = 'modal-close'
    closeButton.setAttribute('aria-label', 'Close modal')
    closeButton.innerHTML = '&times;'
    closeButton.addEventListener('click', () => {
      options.onClose?.()
      modal.remove()
    })
    header.appendChild(closeButton)
  }

  modalContent.appendChild(header)

  // Create body
  const body = document.createElement('div')
  body.className = 'modal-body'
  body.appendChild(content)
  modalContent.appendChild(body)

  modal.appendChild(modalContent)

  // Set up focus trap
  const accessibilityManager = AccessibilityManager.getInstance()
  const cleanup = accessibilityManager.trapFocus({
    container: modal,
    initialFocus: modal.querySelector('button, input, select, textarea') as HTMLElement
  })

  // Handle escape key
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      options.onClose?.()
      modal.remove()
      cleanup()
    }
  }
  modal.addEventListener('keydown', handleEscape)

  return modal
}

// Initialize accessibility
export function initializeAccessibility(): void {
  const accessibilityManager = AccessibilityManager.getInstance()
  
  // Add CSS for screen reader only content
  const style = document.createElement('style')
  style.textContent = `
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    
    .high-contrast {
      filter: contrast(150%);
    }
    
    .reduced-motion * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    
    .required {
      color: red;
    }
    
    .error-message {
      color: red;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    .help-text {
      color: #6b7280;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `
  document.head.appendChild(style)
}

// Export instance for use in components
export const accessibilityManager = AccessibilityManager.getInstance()
