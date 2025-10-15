/**
 * Enhanced Question Editor Component
 * Provides a unified interface for editing all question types
 * Updated for Odoo 17 with Owl Components
 */

odoo.define('quiz_engine_pro.QuestionEditor', function (require) {
    'use strict';

    const { Component, useState, useRef, onMounted, onWillUnmount } = owl;
    const { useService } = require("@web/core/utils/hooks");
    const { AlertDialog } = require("@web/core/dialog/dialog");
    const { _t } = require("@web/core/l10n/translation");
    
    const rpcService = 'rpc';
    const userService = 'user';

    /**
     * Question Editor Component using Owl
     */
    class QuestionEditor extends Component {
        static template = 'quiz_engine_pro.question_editor';
        static props = {
            questionId: { type: Number, optional: true },
            quizId: { type: Number, required: true },
            onSave: { type: Function, optional: true },
            onCancel: { type: Function, optional: true }
        };
        
        setup() {
            this.rpc = useService(rpcService);
            this.user = useService(userService);
            
            this.state = useState({
                question_id: this.props.questionId || false,
                quiz_id: this.props.quizId,
                question_type: 'multiple_choice',
                question_name: '',
                question_content: '',
                question_points: 1,
                question_explanation: '',
                options: [],
                isLoading: false,
                errorMessage: ''
            });
            
            this.questionContentRef = useRef('questionContent');
            this.optionsContainerRef = useRef('optionsContainer');
            
            this.question_types = {
                'mcq_single': 'Multiple Choice (Single)',
                'mcq_multiple': 'Multiple Choice (Multiple)',
                'fill_blank': 'Fill in the Blank',
                'match': 'Match the Following',
                'drag_text': 'Drag into Text',
                'drag_zone': 'Drag into Zones',
                'dropdown_blank': 'Dropdown in Text',
                'step_sequence': 'Drag and Drop - Step Sequencing',
                'sentence_completion': 'Sentence Completion',
                'matrix': 'Matrix Question',
                'passage': 'Reading Passage with Questions'
            };
            
            onMounted(() => this.onMounted());
            onWillUnmount(() => this.onWillUnmount());
        }

        start: function () {
            var self = this;
            return this._super().then(function () {
                self._setupEditor();
                if (self.question_id) {
                    self._loadQuestion();
                } else {
                    self._initNewQuestion();
                }
            });
        },

        _setupEditor: function () {
            // Initialize rich text editor for question content
            this.$('.question-content').summernote({
                height: 200,
                toolbar: [
                    ['style', ['style']],
                    ['font', ['bold', 'italic', 'underline', 'clear']],
                    ['fontsize', ['fontsize']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['table', ['table']],
                    ['insert', ['link', 'picture', 'video']],
                    ['view', ['fullscreen', 'codeview']]
                ]
            });

            // Initialize drag and drop for options
            this._setupSortableOptions();
        },

        _setupSortableOptions: function () {
            var self = this;
            if (this.$('.options-container').length) {
                this.$('.options-container').sortable({
                    handle: '.drag-handle',
                    placeholder: 'option-placeholder',
                    update: function (event, ui) {
                        self._updateOptionOrder();
                    }
                });
            }
        },

        _onTypeChange: function (event) {
            var type = $(event.target).val();
            this._renderOptionsForType(type);
        },

        _renderOptionsForType: function (type) {
            var $container = this.$('.options-container');
            $container.empty();

            switch (type) {
                case 'multiple_choice':
                    this._renderMultipleChoiceOptions();
                    break;
                case 'true_false':
                    this._renderTrueFalseOptions();
                    break;
                case 'fill_blank':
                    this._renderFillBlankOptions();
                    break;
                case 'drag_drop':
                    this._renderDragDropOptions();
                    break;
                case 'dropdown':
                    this._renderDropdownOptions();
                    break;
                case 'matrix':
                    this._renderMatrixOptions();
                    break;
                case 'sequence':
                    this._renderSequenceOptions();
                    break;
            }

            this._setupSortableOptions();
        },

        _renderMultipleChoiceOptions: function () {
            var $container = this.$('.options-container');
            var template = `
                <div class="option-item" data-option-id="">
                    <div class="option-controls">
                        <span class="drag-handle"><i class="fa fa-grip-vertical"></i></span>
                        <input type="checkbox" class="option-correct" />
                        <label>Correct</label>
                        <button type="button" class="btn btn-sm btn-danger remove-option">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                    <div class="option-content">
                        <input type="text" class="form-control option-text" placeholder="Option text" />
                    </div>
                </div>
            `;
            
            // Add at least 2 options by default
            $container.append(template);
            $container.append(template);
            
            // Add "Add Option" button
            $container.append(`
                <button type="button" class="btn btn-sm btn-primary add-option">
                    <i class="fa fa-plus"></i> Add Option
                </button>
            `);
        },

        _renderTrueFalseOptions: function () {
            var $container = this.$('.options-container');
            $container.html(`
                <div class="form-group">
                    <label>Correct Answer:</label>
                    <select class="form-control correct-answer">
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                </div>
            `);
        },

        _renderFillBlankOptions: function () {
            var $container = this.$('.options-container');
            $container.html(`
                <div class="form-group">
                    <label>Correct Answers (one per line):</label>
                    <textarea class="form-control correct-answers" rows="4" 
                              placeholder="Enter possible correct answers, one per line"></textarea>
                    <small class="form-text text-muted">
                        Each line represents a possible correct answer. Case insensitive.
                    </small>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" class="case-sensitive" />
                        Case Sensitive
                    </label>
                </div>
            `);
        },

        _renderDragDropOptions: function () {
            var $container = this.$('.options-container');
            $container.html(`
                <div class="row">
                    <div class="col-md-6">
                        <h5>Draggable Items</h5>
                        <div class="draggable-items">
                            <div class="form-group">
                                <input type="text" class="form-control" placeholder="Item 1" />
                            </div>
                            <div class="form-group">
                                <input type="text" class="form-control" placeholder="Item 2" />
                            </div>
                        </div>
                        <button type="button" class="btn btn-sm btn-primary add-draggable">
                            <i class="fa fa-plus"></i> Add Item
                        </button>
                    </div>
                    <div class="col-md-6">
                        <h5>Drop Zones</h5>
                        <div class="drop-zones">
                            <div class="form-group">
                                <input type="text" class="form-control" placeholder="Zone 1 Label" />
                                <select class="form-control mt-1 correct-items" multiple>
                                    <option>Select correct items for this zone</option>
                                </select>
                            </div>
                        </div>
                        <button type="button" class="btn btn-sm btn-primary add-zone">
                            <i class="fa fa-plus"></i> Add Zone
                        </button>
                    </div>
                </div>
            `);
        },

        _renderDropdownOptions: function () {
            var $container = this.$('.options-container');
            $container.html(`
                <div class="form-group">
                    <label>Question Text with Dropdowns:</label>
                    <textarea class="form-control question-template" rows="4" 
                              placeholder="Enter question text. Use [dropdown] where you want dropdowns to appear."></textarea>
                    <small class="form-text text-muted">
                        Use [dropdown] in your text where you want a dropdown to appear.
                    </small>
                </div>
                <div class="dropdown-configs">
                    <h5>Dropdown Configurations</h5>
                    <div class="dropdown-config">
                        <label>Dropdown 1 Options:</label>
                        <textarea class="form-control dropdown-options" rows="3" 
                                  placeholder="Option 1&#10;Option 2&#10;Option 3"></textarea>
                        <select class="form-control mt-1 correct-option">
                            <option>Select correct option</option>
                        </select>
                    </div>
                </div>
            `);
        },

        _renderMatrixOptions: function () {
            var $container = this.$('.options-container');
            $container.html(`
                <div class="row">
                    <div class="col-md-6">
                        <h5>Rows</h5>
                        <div class="matrix-rows">
                            <div class="form-group">
                                <input type="text" class="form-control" placeholder="Row 1" />
                            </div>
                            <div class="form-group">
                                <input type="text" class="form-control" placeholder="Row 2" />
                            </div>
                        </div>
                        <button type="button" class="btn btn-sm btn-primary add-row">
                            <i class="fa fa-plus"></i> Add Row
                        </button>
                    </div>
                    <div class="col-md-6">
                        <h5>Columns</h5>
                        <div class="matrix-columns">
                            <div class="form-group">
                                <input type="text" class="form-control" placeholder="Column 1" />
                            </div>
                            <div class="form-group">
                                <input type="text" class="form-control" placeholder="Column 2" />
                            </div>
                        </div>
                        <button type="button" class="btn btn-sm btn-primary add-column">
                            <i class="fa fa-plus"></i> Add Column
                        </button>
                    </div>
                </div>
                <div class="mt-3">
                    <h5>Correct Answers</h5>
                    <div class="matrix-answers">
                        <p class="text-muted">Configure rows and columns first to set correct answers.</p>
                    </div>
                </div>
            `);
        },

        _renderSequenceOptions: function () {
            var $container = this.$('.options-container');
            $container.html(`
                <div class="form-group">
                    <label>Sequence Items (will be randomized for participants):</label>
                    <div class="sequence-items">
                        <div class="sequence-item">
                            <span class="sequence-number">1.</span>
                            <input type="text" class="form-control" placeholder="First item in sequence" />
                            <button type="button" class="btn btn-sm btn-danger remove-sequence-item">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                        <div class="sequence-item">
                            <span class="sequence-number">2.</span>
                            <input type="text" class="form-control" placeholder="Second item in sequence" />
                            <button type="button" class="btn btn-sm btn-danger remove-sequence-item">
                                <i class="fa fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <button type="button" class="btn btn-sm btn-primary add-sequence-item">
                        <i class="fa fa-plus"></i> Add Item
                    </button>
                </div>
            `);
        },

        _onAddOption: function () {
            var type = this.$('#question_type').val();
            // Implementation depends on question type
            this._addOptionForType(type);
        },

        _onRemoveOption: function (event) {
            var $option = $(event.target).closest('.option-item');
            $option.remove();
        },

        _onMoveUp: function (event) {
            var $item = $(event.target).closest('.option-item');
            $item.prev().before($item);
            this._updateOptionOrder();
        },

        _onMoveDown: function (event) {
            var $item = $(event.target).closest('.option-item');
            $item.next().after($item);
            this._updateOptionOrder();
        },

        _updateOptionOrder: function () {
            this.$('.option-item').each(function (index) {
                $(this).attr('data-order', index + 1);
            });
        },

        _onPreviewQuestion: function () {
            var questionData = this._getQuestionData();
            this._showPreview(questionData);
        },

        _showPreview: function (questionData) {
            var self = this;
            var dialog = new Dialog(this, {
                title: _t('Question Preview'),
                size: 'large',
                $content: QWeb.render('quiz_engine_pro.question_preview', {
                    question: questionData
                }),
                buttons: [
                    {
                        text: _t('Close'),
                        classes: 'btn-secondary',
                        close: true
                    }
                ]
            });
            dialog.open();
        },

        _onSaveQuestion: function () {
            var questionData = this._getQuestionData();
            if (this._validateQuestion(questionData)) {
                this._saveQuestion(questionData);
            }
        },

        _getQuestionData: function () {
            var type = this.$('#question_type').val();
            var data = {
                name: this.$('#question_name').val(),
                type: type,
                content: this.$('.question-content').summernote('code'),
                points: parseFloat(this.$('#question_points').val()) || 1,
                explanation: this.$('#question_explanation').val(),
                quiz_id: this.quiz_id
            };

            // Add type-specific data
            switch (type) {
                case 'multiple_choice':
                    data.options = this._getMultipleChoiceData();
                    break;
                case 'true_false':
                    data.correct_answer = this.$('.correct-answer').val();
                    break;
                case 'fill_blank':
                    data.correct_answers = this.$('.correct-answers').val().split('\n');
                    data.case_sensitive = this.$('.case-sensitive').is(':checked');
                    break;
                // Add other types...
            }

            return data;
        },

        _getMultipleChoiceData: function () {
            var options = [];
            this.$('.option-item').each(function () {
                var $item = $(this);
                options.push({
                    text: $item.find('.option-text').val(),
                    is_correct: $item.find('.option-correct').is(':checked'),
                    order: parseInt($item.attr('data-order')) || 0
                });
            });
            return options;
        },

        _validateQuestion: function (data) {
            var errors = [];
            
            if (!data.name) {
                errors.push('Question name is required');
            }
            
            if (!data.content) {
                errors.push('Question content is required');
            }
            
            if (data.type === 'multiple_choice' && data.options.length < 2) {
                errors.push('Multiple choice questions need at least 2 options');
            }
            
            if (data.type === 'multiple_choice' && !data.options.some(opt => opt.is_correct)) {
                errors.push('At least one option must be marked as correct');
            }

            if (errors.length > 0) {
                this._showErrors(errors);
                return false;
            }
            
            return true;
        },

        _showErrors: function (errors) {
            var errorHtml = errors.map(function (error) {
                return '<div class="alert alert-danger">' + error + '</div>';
            }).join('');
            
            this.$('.error-container').html(errorHtml);
        },

        _saveQuestion: function (data) {
            var self = this;
            framework.blockUI();
            
            rpc.query({
                model: 'quiz.question',
                method: this.question_id ? 'write' : 'create',
                args: this.question_id ? [[this.question_id], data] : [data]
            }).then(function (result) {
                framework.unblockUI();
                self.trigger('question_saved', result);
            }).catch(function (error) {
                framework.unblockUI();
                self._showErrors(['Error saving question: ' + error.message]);
            });
        },

        _loadQuestion: function () {
            var self = this;
            rpc.query({
                model: 'quiz.question',
                method: 'read',
                args: [[this.question_id]]
            }).then(function (result) {
                if (result.length > 0) {
                    self._populateForm(result[0]);
                }
            });
        },

        _populateForm: function (questionData) {
            this.$('#question_name').val(questionData.name);
            this.$('#question_type').val(questionData.type);
            this.$('.question-content').summernote('code', questionData.content);
            this.$('#question_points').val(questionData.points);
            this.$('#question_explanation').val(questionData.explanation);
            
            this._renderOptionsForType(questionData.type);
            // Populate type-specific data...
        },

        _initNewQuestion: function () {
            this.$('#question_type').val('multiple_choice');
            this._renderOptionsForType('multiple_choice');
        },

        _onCancelEdit: function () {
            this.trigger('edit_cancelled');
        }
    });

    return QuestionEditor;
});
