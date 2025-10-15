/**
 * Quiz Engine Pro - Enhanced JavaScript
 * Unified interaction system for all question types
 */

odoo.define('quiz_engine_pro.enhanced_interaction', [
    'web.core'
], function (require) {
    'use strict';

    var core = require('web.core');
    var _t = core._t;

    /**
     * Main Quiz Interaction Manager
     */
    var QuizInteractionManager = {
        
        initialized: false,
        
        /**
         * Initialize all quiz interactions
         */
        init: function() {
            if (this.initialized) return;
            
            // Add immediate protection for dropdowns
            this.addImmediateDropdownProtection();
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', this.initializeComponents.bind(this));
            } else {
                this.initializeComponents();
            }
            
            this.initialized = true;
        },
        
        /**
         * Add immediate protection before DOM is ready
         */
        addImmediateDropdownProtection: function() {
            // Minimal protection - only for quiz elements that might interfere
            const style = document.createElement('style');
            style.id = 'quiz-dropdown-protection';
            style.textContent = `
                /* Only target quiz elements that might interfere with dropdowns */
                .quiz-choice:not(.quiz-container .quiz-choice):hover {
                    transform: none !important;
                }
            `;
            
            // Add to head immediately, even if DOM isn't ready
            if (document.head) {
                document.head.appendChild(style);
            } else {
                // If head doesn't exist yet, add when it does
                const observer = new MutationObserver(function(mutations) {
                    if (document.head) {
                        document.head.appendChild(style);
                        observer.disconnect();
                    }
                });
                observer.observe(document, { childList: true, subtree: true });
            }
        },
        
        /**
         * Initialize all quiz components
         */
        initializeComponents: function() {
            const DEBUG = false; // flip to true for detailed interaction logs
            if(DEBUG) console.log('Initializing Quiz Engine Pro interactions...');
            
            // Add protection against dropdown interference
            this.protectOdooDropdowns();
            
            // Initialize different question types
            this.initializeMultipleChoice();
            this.initializeFillBlanks();
            this.initializeDragAndDrop();
            this.initializeDropdowns();
            this.initializeSequencing();
            this.initializeFormValidation();
            this.initializeAccessibility();
            this.initializeResponsiveFeatures();
            
            // Initialize global features
            this.initializeProgressTracking();
            this.initializeAutoSave();
            this.initializeKeyboardShortcuts();
            
            if(DEBUG) console.log('Quiz Engine Pro interactions initialized successfully');
        },
        
        /**
         * Protect Odoo dropdowns from interference - MINIMAL approach
         */
        protectOdooDropdowns: function() {
            // Only target quiz elements, don't interfere with general Odoo UI
            document.addEventListener('mouseover', function(e) {
                const target = e.target;
                // Only intervene if it's a quiz choice outside quiz container causing issues
                if (target.classList.contains('quiz-choice') && 
                    !target.closest('.quiz-container') &&
                    (target.closest('.o_dropdown') || target.closest('.dropdown'))) {
                    // Only remove transform if it's a quiz element in a dropdown context
                    if (target.style.transform) {
                        target.style.transform = 'none';
                    }
                }
            });
            
            // Remove all other interventions that break Odoo functionality
        },
        
        /**
         * Enhanced Multiple Choice functionality
         */
        initializeMultipleChoice: function() {
            const choices = document.querySelectorAll('.quiz-choice');
            
            choices.forEach(choice => {
                const input = choice.querySelector('input[type="radio"], input[type="checkbox"]');
                
                if (!input) return;
                
                // Add click handler for entire choice area
                choice.addEventListener('click', (e) => {
                    if (e.target !== input) {
                        input.click();
                    }
                });
                
                // Add keyboard navigation
                choice.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        input.click();
                    }
                });
                
                // Add selection styling
                input.addEventListener('change', () => {
                    this.updateChoiceSelection(input);
                });
                
                // Add hover effects
                this.addHoverEffects(choice);
            });
        },
        
        /**
         * Update choice selection styling
         */
        updateChoiceSelection: function(input) {
            const choice = input.closest('.quiz-choice');
            const questionContainer = input.closest('.quiz-choice-container');
            
            if (input.type === 'radio') {
                // Remove selected class from all choices in this question
                questionContainer.querySelectorAll('.quiz-choice').forEach(c => {
                    c.classList.remove('selected');
                });
            }
            
            // Add selected class to current choice
            if (input.checked) {
                choice.classList.add('selected');
            } else {
                choice.classList.remove('selected');
            }
        },
        
        /**
         * Enhanced Fill in the Blanks functionality
         */
        initializeFillBlanks: function() {
            const fillInputs = document.querySelectorAll('.quiz-form-input[name^="blank_"]');
            
            fillInputs.forEach(input => {
                // Add real-time validation
                input.addEventListener('input', (e) => {
                    this.validateFillBlank(e.target);
                });
                
                // Add placeholder animation
                this.addPlaceholderAnimation(input);
                
                // Add auto-complete for common words
                this.addAutoComplete(input);
            });
        },
        
        /**
         * Enhanced Drag and Drop functionality
         */
        initializeDragAndDrop: function() {
            const dragContainers = document.querySelectorAll('.quiz-drag-container');
            
            dragContainers.forEach(container => {
                this.initializeDragContainer(container);
            });
        },
        
        /**
         * Initialize individual drag container
         */
        initializeDragContainer: function(container) {
            const tokens = container.querySelectorAll('.quiz-drag-token');
            const dropZones = container.querySelectorAll('.quiz-drop-zone');
            const resetButton = container.querySelector('.reset-tokens');
            
            // Initialize drag tokens
            tokens.forEach(token => {
                this.initializeDragToken(token);
            });
            
            // Initialize drop zones
            dropZones.forEach(zone => {
                this.initializeDropZone(zone);
            });
            
            // Initialize reset button
            if (resetButton) {
                resetButton.addEventListener('click', () => {
                    this.resetDragAndDrop(container);
                });
            }
            
            // Add touch support for mobile
            this.addTouchSupport(container);
        },
        
        /**
         * Initialize drag token
         */
        initializeDragToken: function(token) {
            // Desktop drag events
            token.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', token.dataset.tokenId);
                token.classList.add('dragging');
                this.addDragPreview(e, token);
            });
            
            token.addEventListener('dragend', () => {
                token.classList.remove('dragging');
            });
            
            // Add keyboard support
            token.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    this.handleKeyboardDrag(token, e);
                }
            });
            
            // Add focus management
            token.setAttribute('tabindex', '0');
            token.setAttribute('role', 'button');
            token.setAttribute('aria-label', `Draggable token: ${token.textContent}`);
        },
        
        /**
         * Initialize drop zone
         */
        initializeDropZone: function(zone) {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });
            
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });
            
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                
                const tokenId = e.dataTransfer.getData('text/plain');
                const token = document.querySelector(`[data-token-id="${tokenId}"]`);
                
                if (token && this.canDropToken(token, zone)) {
                    this.dropToken(token, zone);
                    this.updateDragDropData();
                }
            });
            
            // Add keyboard support
            zone.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    this.handleKeyboardDrop(zone, e);
                }
            });
            
            // Add accessibility attributes
            zone.setAttribute('role', 'region');
            zone.setAttribute('aria-label', `Drop zone ${zone.dataset.zoneId}`);
        },
        
        /**
         * Enhanced Dropdown functionality
         */
        initializeDropdowns: function() {
            const dropdowns = document.querySelectorAll('.dropdown-blank-select');
            
            dropdowns.forEach(dropdown => {
                // Add change handler
                dropdown.addEventListener('change', () => {
                    this.updateDropdownData();
                    this.validateDropdown(dropdown);
                });
                
                // Add custom styling
                this.styleDropdown(dropdown);
                
                // Add keyboard navigation
                this.addDropdownKeyboardNavigation(dropdown);
            });
        },
        
        /**
         * Initialize form validation
         */
        initializeFormValidation: function() {
            const forms = document.querySelectorAll('.quiz-question-form');
            
            forms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    if (!this.validateForm(form)) {
                        e.preventDefault();
                        this.showValidationErrors(form);
                    }
                });
            });
        },
        
        /**
         * Validate form before submission
         */
        validateForm: function(form) {
            let isValid = true;
            const errors = [];
            
            // Check required fields
            const requiredInputs = form.querySelectorAll('[required]');
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    errors.push(`${input.name} is required`);
                    this.highlightError(input);
                }
            });
            
            // Check specific question types
            const questionType = this.getQuestionType(form);
            
            switch (questionType) {
                case 'mcq_single':
                    isValid = this.validateMultipleChoice(form) && isValid;
                    break;
                case 'mcq_multiple':
                    isValid = this.validateMultipleChoiceMultiple(form) && isValid;
                    break;
                case 'drag_zone':
                case 'drag_text':
                    isValid = this.validateDragAndDrop(form) && isValid;
                    break;
                case 'dropdown_blank':
                    isValid = this.validateDropdowns(form) && isValid;
                    break;
            }
            
            return isValid;
        },
        
        /**
         * Initialize accessibility features
         */
        initializeAccessibility: function() {
            // Add skip links
            this.addSkipLinks();
            
            // Add ARIA labels
            this.addAriaLabels();
            
            // Add keyboard navigation
            this.addKeyboardNavigation();
            
            // Add screen reader announcements
            this.addScreenReaderAnnouncements();
        },
        
        /**
         * Initialize responsive features
         */
        initializeResponsiveFeatures: function() {
            // Add mobile-specific interactions
            this.addMobileInteractions();
            
            // Add responsive drag and drop
            this.addResponsiveDragAndDrop();
            
            // Add touch gestures
            this.addTouchGestures();
        },
        
        /**
         * Add touch support for mobile devices
         */
        addTouchSupport: function(container) {
            let touchToken = null;
            
            container.addEventListener('touchstart', (e) => {
                const target = e.target.closest('.quiz-drag-token');
                if (target) {
                    touchToken = target;
                    target.classList.add('touch-dragging');
                    e.preventDefault();
                }
            });
            
            container.addEventListener('touchmove', (e) => {
                if (touchToken) {
                    const touch = e.touches[0];
                    const element = document.elementFromPoint(touch.clientX, touch.clientY);
                    const dropZone = element ? element.closest('.quiz-drop-zone') : null;
                    
                    // Remove previous hover states
                    container.querySelectorAll('.quiz-drop-zone').forEach(zone => {
                        zone.classList.remove('touch-hover');
                    });
                    
                    // Add hover state to current drop zone
                    if (dropZone) {
                        dropZone.classList.add('touch-hover');
                    }
                    
                    e.preventDefault();
                }
            });
            
            container.addEventListener('touchend', (e) => {
                if (touchToken) {
                    const touch = e.changedTouches[0];
                    const element = document.elementFromPoint(touch.clientX, touch.clientY);
                    const dropZone = element ? element.closest('.quiz-drop-zone') : null;
                    
                    if (dropZone && this.canDropToken(touchToken, dropZone)) {
                        this.dropToken(touchToken, dropZone);
                        this.updateDragDropData();
                    }
                    
                    touchToken.classList.remove('touch-dragging');
                    container.querySelectorAll('.quiz-drop-zone').forEach(zone => {
                        zone.classList.remove('touch-hover');
                    });
                    
                    touchToken = null;
                    e.preventDefault();
                }
            });
        },
        
        /**
         * Add progress tracking
         */
        initializeProgressTracking: function() {
            const progressBar = document.querySelector('.quiz-progress-bar');
            if (progressBar) {
                this.animateProgressBar(progressBar);
            }
        },
        
        /**
         * Add auto-save functionality
         */
        initializeAutoSave: function() {
            const forms = document.querySelectorAll('.quiz-question-form');
            
            forms.forEach(form => {
                const inputs = form.querySelectorAll('input, select, textarea');
                
                inputs.forEach(input => {
                    input.addEventListener('change', () => {
                        this.autoSaveAnswer(form, input);
                    });
                });
            });
        },
        
        /**
         * Add keyboard shortcuts
         */
        initializeKeyboardShortcuts: function() {
            document.addEventListener('keydown', (e) => {
                // Ctrl/Cmd + Enter to submit
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    const submitButton = document.querySelector('.quiz-btn-primary[type="submit"]');
                    if (submitButton) {
                        submitButton.click();
                    }
                }
                
                // Arrow keys for navigation
                if (e.key === 'ArrowLeft' && e.altKey) {
                    const prevButton = document.querySelector('.quiz-btn-secondary[href*="question"]');
                    if (prevButton) {
                        prevButton.click();
                    }
                }
                
                if (e.key === 'ArrowRight' && e.altKey) {
                    const nextButton = document.querySelector('.quiz-btn-primary[type="submit"]');
                    if (nextButton) {
                        nextButton.click();
                    }
                }
            });
        },
        
        /**
         * Utility function to get question type
         */
        getQuestionType: function(form) {
            if (form.querySelector('.quiz-choice-container')) {
                const radios = form.querySelectorAll('input[type="radio"]');
                const checkboxes = form.querySelectorAll('input[type="checkbox"]');
                
                if (radios.length > 0) return 'mcq_single';
                if (checkboxes.length > 0) return 'mcq_multiple';
            }
            
            if (form.querySelector('.quiz-drag-container')) {
                return 'drag_zone';
            }
            
            if (form.querySelector('.dropdown-blank-select')) {
                return 'dropdown_blank';
            }
            
            if (form.querySelector('.fill-blanks-container')) {
                return 'fill_blank';
            }
            
            return 'unknown';
        },
        
        /**
         * Show loading indicator
         */
        showLoading: function(message = 'Loading...') {
            const loadingHtml = `
                <div class="quiz-loading-overlay">
                    <div class="quiz-loading">
                        <div class="quiz-spinner"></div>
                        <span>${message}</span>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', loadingHtml);
        },
        
        /**
         * Hide loading indicator
         */
        hideLoading: function() {
            const overlay = document.querySelector('.quiz-loading-overlay');
            if (overlay) {
                overlay.remove();
            }
        },
        
        /**
         * Show notification
         */
        showNotification: function(message, type = 'info') {
            const notificationHtml = `
                <div class="quiz-notification quiz-alert quiz-alert-${type}">
                    <i class="fa fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}-circle"></i>
                    ${message}
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', notificationHtml);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                const notification = document.querySelector('.quiz-notification');
                if (notification) {
                    notification.remove();
                }
            }, 5000);
        },
        
        /**
         * Update drag and drop data
         */
        updateDragDropData: function() {
            const container = document.querySelector('.quiz-drag-container');
            if (!container) return;
            
            const data = [];
            const dropZones = container.querySelectorAll('.quiz-drop-zone');
            
            dropZones.forEach(zone => {
                const tokens = zone.querySelectorAll('.quiz-drag-token');
                tokens.forEach(token => {
                    data.push({
                        token_id: token.dataset.tokenId,
                        zone_id: zone.dataset.zoneId
                    });
                });
            });
            
            const hiddenField = container.querySelector('input[name="drag_drop_data"]');
            if (hiddenField) {
                hiddenField.value = JSON.stringify(data);
            }
        },
        
        /**
         * Update dropdown data
         */
        updateDropdownData: function() {
            const data = [];
            const dropdowns = document.querySelectorAll('.dropdown-blank-select');
            
            dropdowns.forEach(dropdown => {
                if (dropdown.value) {
                    data.push({
                        blank_id: dropdown.dataset.blankId,
                        option_id: dropdown.value
                    });
                }
            });
            
            const hiddenField = document.querySelector('input[name="dropdown_blank_data"]');
            if (hiddenField) {
                hiddenField.value = JSON.stringify(data);
            }
        },
        
        /**
         * Add hover effects (completely disabled for dropdown compatibility)
         */
        addHoverEffects: function(element) {
            // Completely disable hover effects to prevent dropdown interference
            // CSS-only hover effects are safer and don't interfere with positioning
            return;
        },
        
        /**
         * Animate progress bar
         */
        animateProgressBar: function(progressBar) {
            const width = progressBar.style.width;
            progressBar.style.width = '0%';
            
            setTimeout(() => {
                progressBar.style.width = width;
            }, 100);
        },
        
        /**
         * Auto-save answer
         */
        autoSaveAnswer: function(form, input) {
            const sessionToken = form.querySelector('input[name="session"]').value;
            const questionId = form.dataset.questionId;
            
            if (!sessionToken || !questionId) return;
            
            // Implement auto-save logic here
            if(DEBUG) console.log('Auto-saving answer for question:', questionId);
        },
        
        /**
         * Validate multiple choice question
         */
        validateMultipleChoice: function(form) {
            const radios = form.querySelectorAll('input[type="radio"]');
            const checked = Array.from(radios).some(radio => radio.checked);
            
            if (!checked) {
                this.showNotification('Please select an answer', 'error');
                return false;
            }
            
            return true;
        },
        
        /**
         * Validate multiple choice multiple question
         */
        validateMultipleChoiceMultiple: function(form) {
            const checkboxes = form.querySelectorAll('input[type="checkbox"]');
            const checked = Array.from(checkboxes).some(checkbox => checkbox.checked);
            
            if (!checked) {
                this.showNotification('Please select at least one answer', 'error');
                return false;
            }
            
            return true;
        },
        
        /**
         * Validate drag and drop
         */
        validateDragAndDrop: function(form) {
            const hiddenField = form.querySelector('input[name="drag_drop_data"]');
            const data = hiddenField ? JSON.parse(hiddenField.value || '[]') : [];
            
            if (data.length === 0) {
                this.showNotification('Please drag at least one token to a drop zone', 'error');
                return false;
            }
            
            return true;
        },
        
        /**
         * Validate dropdowns
         */
        validateDropdowns: function(form) {
            const dropdowns = form.querySelectorAll('.dropdown-blank-select');
            const hasSelection = Array.from(dropdowns).some(dropdown => dropdown.value);
            
            if (!hasSelection) {
                this.showNotification('Please select at least one dropdown option', 'error');
                return false;
            }
            
            return true;
        },
        
        /**
         * Check if token can be dropped in zone
         */
        canDropToken: function(token, zone) {
            // Add custom logic here if needed
            return true;
        },
        
        /**
         * Drop token in zone
         */
        dropToken: function(token, zone) {
            zone.appendChild(token);
            zone.classList.add('filled');
            token.classList.remove('dragging');
        },
        
        /**
         * Reset drag and drop
         */
        resetDragAndDrop: function(container) {
            const tokens = container.querySelectorAll('.quiz-drag-token');
            const tokenContainer = container.querySelector('.quiz-drag-tokens');
            const dropZones = container.querySelectorAll('.quiz-drop-zone');
            
            tokens.forEach(token => {
                if (tokenContainer) {
                    tokenContainer.appendChild(token);
                }
            });
            
            dropZones.forEach(zone => {
                zone.classList.remove('filled');
            });
            
            this.updateDragDropData();
        }
    };
    
    // Initialize when DOM is ready
    QuizInteractionManager.init();
    
    // Export for use in other modules
    return QuizInteractionManager;
});

// Initialize immediately for backward compatibility
if (typeof odoo === 'undefined') {
    // Minimal immediate protection - only if absolutely necessary
    (function() {
        // Don't add any global styles that might break Odoo functionality
        // Let the main initialization handle any needed protections
    })();
    
    // Fallback for when Odoo framework is not available
    document.addEventListener('DOMContentLoaded', function() {
    if(DEBUG) console.log('Quiz Engine Pro: Odoo framework not available, using fallback initialization');
        
        // Basic initialization without Odoo framework
        const basicInit = {
            init: function() {
                this.initBasicInteractions();
            },
            
            initBasicInteractions: function() {
                // Basic drag and drop
                this.initBasicDragAndDrop();
                
                // Basic form validation
                this.initBasicFormValidation();
                
                // Basic choice interactions
                this.initBasicChoiceInteractions();
            },
            
            initBasicDragAndDrop: function() {
                const tokens = document.querySelectorAll('[draggable="true"]');
                const dropZones = document.querySelectorAll('.quiz-drop-zone, .drop-zone');
                
                tokens.forEach(token => {
                    token.addEventListener('dragstart', (e) => {
                        e.dataTransfer.setData('text/plain', token.dataset.tokenId || token.textContent);
                    });
                });
                
                dropZones.forEach(zone => {
                    zone.addEventListener('dragover', (e) => {
                        e.preventDefault();
                    });
                    
                    zone.addEventListener('drop', (e) => {
                        e.preventDefault();
                        const tokenId = e.dataTransfer.getData('text/plain');
                        const token = document.querySelector(`[data-token-id="${tokenId}"]`);
                        
                        if (token) {
                            zone.appendChild(token);
                        }
                    });
                });
            },
            
            initBasicFormValidation: function() {
                const forms = document.querySelectorAll('form');
                
                forms.forEach(form => {
                    form.addEventListener('submit', (e) => {
                        const requiredFields = form.querySelectorAll('[required]');
                        let isValid = true;
                        
                        requiredFields.forEach(field => {
                            if (!field.value.trim()) {
                                isValid = false;
                                field.style.borderColor = 'red';
                            } else {
                                field.style.borderColor = '';
                            }
                        });
                        
                        if (!isValid) {
                            e.preventDefault();
                            alert('Please fill in all required fields');
                        }
                    });
                });
            },
            
            initBasicChoiceInteractions: function() {
                const choices = document.querySelectorAll('.quiz-choice, .form-check');
                
                choices.forEach(choice => {
                    choice.addEventListener('click', (e) => {
                        const input = choice.querySelector('input[type="radio"], input[type="checkbox"]');
                        if (input && e.target !== input) {
                            input.click();
                        }
                    });
                });
            }
        };
        
        basicInit.init();
    });
}
