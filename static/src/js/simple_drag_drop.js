(function() {
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
    const DEBUG = false; // set true for verbose drag-drop logging
    if(DEBUG) console.log('Simple drag-drop script loaded');
        initDragDrop();
        
        // We need to initialize again after a short delay to handle
        // dynamic content loading in Odoo
        setTimeout(initDragDrop, 500);
    });
    
    function initDragDrop() {
        var tokens = document.querySelectorAll('.draggable-token');
        var dropZones = document.querySelectorAll('.drop-zone');
        var resetButtons = document.querySelectorAll('.reset-tokens');
        var tokensContainer = document.querySelector('.tokens-container');
        
    if(DEBUG) console.log('Found ' + tokens.length + ' tokens and ' + dropZones.length + ' drop zones');
        
        // Set up draggable tokens
        tokens.forEach(function(token) {
            // Ensure token is draggable
            token.setAttribute('draggable', 'true');
            token.style.cursor = 'grab';
            
            // Remove any existing listeners before adding new ones
            token.removeEventListener('dragstart', handleDragStart);
            token.addEventListener('dragstart', handleDragStart);
        });
        
        // Set up drop zones
        dropZones.forEach(function(zone) {
            // Remove any existing listeners before adding new ones
            zone.removeEventListener('dragover', handleDragOver);
            zone.removeEventListener('dragleave', handleDragLeave);
            zone.removeEventListener('drop', handleDrop);
            
            zone.addEventListener('dragover', handleDragOver);
            zone.addEventListener('dragleave', handleDragLeave);
            zone.addEventListener('drop', handleDrop);
        });
        
        // Set up reset buttons
        resetButtons.forEach(function(button) {
            button.removeEventListener('click', handleReset);
            button.addEventListener('click', handleReset);
        });
        
        function handleDragStart(e) {
            if(DEBUG) console.log('Drag started');
            e.dataTransfer.setData('text/plain', this.getAttribute('data-token-id'));
            this.classList.add('dragging');
            
            // For Firefox
            if (e.dataTransfer.setDragImage) {
                e.dataTransfer.setDragImage(this, 10, 10);
            }
        }
        
        function handleDragOver(e) {
            // This is essential for the drop event to fire
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            this.classList.add('drag-over');
        }
        
        function handleDragLeave(e) {
            this.classList.remove('drag-over');
        }
        
        function handleDrop(e) {
            if(DEBUG) console.log('Drop event fired');
            e.preventDefault();
            this.classList.remove('drag-over');
            
            var tokenId = e.dataTransfer.getData('text/plain');
            if(DEBUG) console.log('Token ID from dataTransfer:', tokenId);
            
            var token = document.querySelector('.draggable-token[data-token-id="' + tokenId + '"]');
            if (token) {
                if(DEBUG) console.log('Found token, moving it');
                this.appendChild(token);
                token.classList.remove('dragging');
                updateFormData();
            } else {
                if(DEBUG) console.log('Token not found');
            }
        }
        
        function handleReset() {
            if (tokensContainer) {
                tokens.forEach(function(token) {
                    tokensContainer.appendChild(token);
                });
                updateFormData();
            }
        }
        
        function updateFormData() {
            var data = [];
            dropZones.forEach(function(zone) {
                var zoneId = zone.getAttribute('data-zone-id');
                var zoneTokens = zone.querySelectorAll('.draggable-token');
                
                zoneTokens.forEach(function(token) {
                    data.push({
                        token_id: token.getAttribute('data-token-id'),
                        zone_id: zoneId
                    });
                });
            });
            
            var hiddenField = document.querySelector('input[name="drag_drop_data"]');
            if (hiddenField) {
                hiddenField.value = JSON.stringify(data);
                if(DEBUG) console.log('Updated form data:', hiddenField.value);
            }
        }
    }
})();
