/**
 * Sentence Completion functionality for Quiz Engine Pro
 */
odoo.define('quiz_engine_pro.sentence_completion', [
    'web.public.widget'
], function (require) {
    'use strict';

    var publicWidget = require('web.public.widget');

    publicWidget.registry.QuizSentenceCompletion = publicWidget.Widget.extend({
        selector: '.quiz-sentence-completion',
        events: {
            'dragstart .sentence-token': '_onDragStart',
            'dragover .sentence-blank': '_onDragOver',
            'dragleave .sentence-blank': '_onDragLeave',
            'drop .sentence-blank': '_onDrop',
            'click .reset-tokens': '_onResetClick'
        },

        /**
         * @override
         */
        start: function () {
            // Initialize the sentence blank areas
            this._initializeSentenceBlanks();
            
            return this._super.apply(this, arguments);
        },
        
        /**
         * Initialize sentence blank areas by converting {blank} placeholders
         * to actual drop zones
         *
         * @private
         */
        _initializeSentenceBlanks: function () {
            var self = this;
            var sentenceText = this.$('.sentence-text');
            
            if (sentenceText.length) {
                // Process the HTML to replace {blank} placeholders with drop zones
                var html = sentenceText.html();
                var blankIndex = 0;
                
                // Replace {blank} with actual drop zones
                html = html.replace(/\{blank\}/g, function() {
                    blankIndex++;
                    return '<span class="sentence-blank drop-zone" data-zone-id="blank_' + blankIndex + '"></span>';
                });
                
                sentenceText.html(html);
            }
        },
        
        /**
         * Handle drag start event
         *
         * @private
         */
        _onDragStart: function (ev) {
            ev.originalEvent.dataTransfer.setData('text/plain', ev.currentTarget.dataset.tokenId);
            ev.currentTarget.classList.add('dragging');
        },
        
        /**
         * Handle drag over event
         *
         * @private
         */
        _onDragOver: function (ev) {
            ev.preventDefault();
            ev.currentTarget.classList.add('drag-over');
        },
        
        /**
         * Handle drag leave event
         *
         * @private
         */
        _onDragLeave: function (ev) {
            ev.currentTarget.classList.remove('drag-over');
        },
        
        /**
         * Handle drop event
         *
         * @private
         */
        _onDrop: function (ev) {
            ev.preventDefault();
            var $zone = $(ev.currentTarget);
            $zone.removeClass('drag-over');
            
            // If this zone already has a token, move it back to the tokens container
            var $existingToken = $zone.find('.sentence-token');
            if ($existingToken.length) {
                this.$('.tokens-container').append($existingToken);
            }
            
            var tokenId = ev.originalEvent.dataTransfer.getData('text/plain');
            var $token = this.$('.sentence-token[data-token-id="' + tokenId + '"]');
            
            if ($token.length) {
                $zone.append($token);
                $token.removeClass('dragging');
                this._updateSentenceData();
            }
        },
        
        /**
         * Handle reset button click
         *
         * @private
         */
        _onResetClick: function (ev) {
            ev.preventDefault();
            var $tokensContainer = this.$('.tokens-container');
            
            this.$('.sentence-token').each(function () {
                $tokensContainer.append($(this));
            });
            
            this._updateSentenceData();
        },
        
        /**
         * Update the hidden form field with sentence completion data
         *
         * @private
         */
        _updateSentenceData: function () {
            var data = [];
            var self = this;
            
            this.$('.sentence-blank').each(function () {
                var $zone = $(this);
                var zoneId = $zone.data('zone-id');
                var $token = $zone.find('.sentence-token');
                
                if ($token.length) {
                    data.push({
                        token_id: $token.data('token-id'),
                        zone_id: zoneId
                    });
                }
            });
            
            this.$('input[name="sentence_completion_data"]').val(JSON.stringify(data));
        }
    });

    return publicWidget.registry.QuizSentenceCompletion;
});
