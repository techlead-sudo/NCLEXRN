/* JavaScript for Reading Passage Questions - Updated for Odoo 17 */
odoo.define('quiz_engine_pro.passage_question', function (require) {
    'use strict';

    const publicWidget = require('web.public.widget');

    publicWidget.registry.PassageQuestion = publicWidget.Widget.extend({
        selector: '.passage-question',
        events: {
            'click .prev-sub-question': '_onPrevSubQuestion',
            'click .next-sub-question': '_onNextSubQuestion',
            'change input[type="radio"]': '_updateAnswerState',
            'change input[type="checkbox"]': '_updateAnswerState',
            'input textarea': '_updateAnswerState',
            'submit .question-form': '_onFormSubmit'
        },

        /**
         * @override
         */
        start: function () {
            var def = this._super.apply(this, arguments);
            this._initPassageQuestion();
            return def;
        },

        /**
         * Initialize the passage question interface
         * @private
         */
        _initPassageQuestion: function () {
            // Show the first sub-question, hide the rest
            this.$('.sub-question').hide();
            this.$('.sub-question:first').show();
            
            // Initialize variables
            this.currentIndex = 0;
            this.totalQuestions = this.$('.sub-question').length;
            
            // Update counter display
            this._updateCounterDisplay();
            
            // Initialize the answers object
            this.answers = {};
            
            // Update navigation buttons
            this._updateNavigationButtons();
            
            // Set up persistent passage view on desktop
            if (window.innerWidth >= 992) {
                this._setupStickyPassage();
            }
        },
        
        /**
         * Update the sub-question counter display
         * @private
         */
        _updateCounterDisplay: function() {
            this.$('#current-sub-q').text(this.currentIndex + 1);
            this.$('.sub-question-counter').text('Question ' + (this.currentIndex + 1));
        },

        /**
         * Set up sticky passage on desktop
         * @private
         */
        _setupStickyPassage: function () {
            const passageContent = this.$('.passage-content')[0];
            if (!passageContent) return;
            
            const observer = new IntersectionObserver(
                ([e]) => {
                    e.target.classList.toggle('is-sticky', e.intersectionRatio < 1);
                },
                { threshold: [1] }
            );
            
            observer.observe(passageContent);
        },

        /**
         * Handle next question button clicks
         * @private
         * @param {Event} ev
         */
        _onNextSubQuestion: function (ev) {
            ev.preventDefault();
            
            if (this.currentIndex < this.totalQuestions - 1) {
                // Save current answers
                this._saveCurrentAnswers();
                
                // Hide current question
                this.$('.sub-question').eq(this.currentIndex).hide();
                
                // Show next question
                this.currentIndex++;
                this.$('.sub-question').eq(this.currentIndex).show();
                
                // Update counter and navigation
                this._updateCounterDisplay();
                this._updateNavigationButtons();
            }
        },

        /**
         * Handle previous question button clicks
         * @private
         * @param {Event} ev
         */
        _onPrevSubQuestion: function (ev) {
            ev.preventDefault();
            
            if (this.currentIndex > 0) {
                // Save current answers
                this._saveCurrentAnswers();
                
                // Hide current question
                this.$('.sub-question').eq(this.currentIndex).hide();
                
                // Show previous question
                this.currentIndex--;
                this.$('.sub-question').eq(this.currentIndex).show();
                
                // Update counter and navigation
                this._updateCounterDisplay();
                this._updateNavigationButtons();
            }
        },

        /**
         * Update navigation buttons based on current question
         * @private
         */
        _updateNavigationButtons: function () {
            // Update previous button
            var $prevBtn = this.$('.prev-sub-question');
            $prevBtn.prop('disabled', this.currentIndex === 0);
            
            // Update next button
            var $nextBtn = this.$('.next-sub-question');
            $nextBtn.prop('disabled', this.currentIndex === this.totalQuestions - 1);
            
            // Change text for last question
            if (this.currentIndex === this.totalQuestions - 1) {
                $nextBtn.html('<i class="fa fa-check"></i> Finish Reading');
            } else {
                $nextBtn.html('Next <i class="fa fa-arrow-right"></i>');
            }
        },

        /**
         * Save answers for the current sub-question
         * @private
         */
        _saveCurrentAnswers: function () {
            var self = this;
            var $currentQuestion = this.$('.sub-question:visible');
            var questionId = $currentQuestion.data('question-id');
            var questionType = $currentQuestion.data('question-type');
            
            if (!questionId) return;
            
            var answerKey = 'sub_q_' + questionId;
            
            if (questionType === 'mcq_single') {
                var $selected = $currentQuestion.find('input[type="radio"]:checked');
                if ($selected.length) {
                    self.answers[answerKey] = $selected.val();
                }
            } else if (questionType === 'mcq_multiple') {
                var selectedValues = [];
                $currentQuestion.find('input[type="checkbox"]:checked').each(function () {
                    selectedValues.push($(this).val());
                });
                if (selectedValues.length > 0) {
                    self.answers[answerKey] = selectedValues;
                }
            } else if (questionType === 'text_short' || questionType === 'text_long') {
                var text = $currentQuestion.find('textarea').val();
                if (text) {
                    self.answers[answerKey] = text;
                }
            }
            
            // Update hidden input with all answers
            this._updateHiddenAnswersField();
        },

        /**
         * Update the hidden form field with all answers
         * @private
         */
        _updateHiddenAnswersField: function () {
            var $hiddenField = this.$('input[name="answer_data"]');
            $hiddenField.val(JSON.stringify(this.answers));
        },

        /**
         * Update answer state when user selects an answer
         * @private
         */
        _updateAnswerState: function () {
            this._saveCurrentAnswers();
        },

        /**
         * Handle form submission
         * @private
         * @param {Event} ev
         */
        _onFormSubmit: function (ev) {
            // Make sure we save all answers before submission
            this._saveCurrentAnswers();
            
            // Log for debugging
            console.log('Passage question answers:', this.answers);
        }
    });

    return publicWidget.registry.PassageQuestion;
});
