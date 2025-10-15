/**
 * Fill in the Blanks functionality for Quiz Engine Pro
 */
odoo.define('quiz_engine_pro.fill_blanks', [
    'web.public.widget'
], function (require) {
    'use strict';

    var publicWidget = require('web.public.widget');

    publicWidget.registry.QuizFillBlanks = publicWidget.Widget.extend({
        selector: '.fill-blanks, .fill-blanks-container',
        events: {
            'change input[type="text"]': '_onInputChange',
            'submit form': '_onFormSubmit'
        },

        /**
         * @override
         */
        start: function () {
            this._initializeFillBlanks();
            return this._super.apply(this, arguments);
        },
        
        /**
         * Initialize the fill blanks functionality
         *
         * @private
         */
        _initializeFillBlanks: function () {
            var $form = this.$el.closest('form');
            if (!$form.length) {
                return;
            }
            
            // Create hidden field for answer data if it doesn't exist
            if (!$form.find('input[name="fill_blanks_data"]').length) {
                $form.append($('<input>', {
                    type: 'hidden',
                    name: 'fill_blanks_data',
                    value: '{}'
                }));
            }
            
            this._updateFillBlanksData();
        },
        
        /**
         * Handle input change events
         *
         * @private
         */
        _onInputChange: function (ev) {
            this._updateFillBlanksData();
        },
        
        /**
         * Handle form submission
         * 
         * @private
         */
        _onFormSubmit: function (ev) {
            // Make sure we have the latest data
            this._updateFillBlanksData();
        },
        
        /**
         * Update the hidden form field with fill blanks data
         *
         * @private
         */
        _updateFillBlanksData: function () {
            var data = {};
            var $inputs = this.$('input[name^="blank_"]');
            
            $inputs.each(function () {
                var $input = $(this);
                var name = $input.attr('name');
                var blankNumber = name.replace('blank_', '');
                
                data[blankNumber] = $input.val().trim();
            });
            
            var $form = this.$el.closest('form');
            if ($form.length) {
                $form.find('input[name="fill_blanks_data"]').val(JSON.stringify(data));
            }
        }
    });

    return publicWidget.registry.QuizFillBlanks;
});
