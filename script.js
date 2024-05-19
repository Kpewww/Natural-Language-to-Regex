document.addEventListener('DOMContentLoaded', (event) => {
    const dragBoxes = document.querySelectorAll('.drag-box');
    const dropArea = document.getElementById('drop-area');
    const regexOutput = document.getElementById('regex-output');
    const sortableContainer = document.getElementById('sortable-container');
    const dropText = document.querySelector('.drop-text');
    const customTextInput = document.getElementById('custom-text');
    const addCustomTextButton = document.getElementById('add-custom-text');

    dragBoxes.forEach(box => {
        box.addEventListener('dragstart', dragStart);
    });

    addCustomTextButton.addEventListener('click', () => {
        const customText = customTextInput.value.trim();
        if (customText) {
            addSortableItem(customText);
            customTextInput.value = '';
            updateOutput();
            toggleDropText();
        }
    });

    dropArea.addEventListener('dragover', dragOver);
    dropArea.addEventListener('drop', drop);

    function dragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.getAttribute('data-regex'));
        event.target.classList.add('dragging');
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        addSortableItem(data);
        updateOutput();
        toggleDropText();
    }

    function addSortableItem(data) {
        const newItem = document.createElement('div');
        newItem.textContent = data;
        newItem.setAttribute('data-regex', data);
        newItem.addEventListener('dblclick', () => {
            newItem.remove();
            updateOutput();
            toggleDropText();
        });
        sortableContainer.appendChild(newItem);
        $(sortableContainer).sortable({
            axis: 'x',
            update: function(event, ui) {
                updateOutput();
            }
        });
        $(sortableContainer).disableSelection();
    }

    function updateOutput() {
        let regexPattern = '';
        const items = sortableContainer.querySelectorAll('div');
        items.forEach(item => {
            regexPattern += item.getAttribute('data-regex');
        });
        regexOutput.textContent = regexPattern;
        resizeDropArea();
    }

    function resizeDropArea() {
        const items = sortableContainer.querySelectorAll('div');
        let totalWidth = 0;
        items.forEach(item => {
            totalWidth += item.offsetWidth + 5; // Adding margin
        });
        sortableContainer.style.width = `${totalWidth}px`;
    }

    function toggleDropText() {
        if (sortableContainer.childElementCount > 0) {
            dropText.style.display = 'none';
        } else {
            dropText.style.display = 'block';
        }
    }

    // Initial check
    toggleDropText();
});
