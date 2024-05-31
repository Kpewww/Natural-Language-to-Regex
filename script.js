document.addEventListener('DOMContentLoaded', (event) => {
    const dragBoxes = document.querySelectorAll('.drag-box');
    const dropArea = document.getElementById('drop-area');
    const regexOutput = document.getElementById('regex-output');
    const sortableContainer = document.getElementById('sortable-container');
    const dropText = document.querySelector('.drop-text');
    const customTextInput = document.getElementById('custom-text');
    const addCustomTextButton = document.getElementById('add-custom-text');
    const errorMessage = document.getElementById('error-message');

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
        errorMessage.textContent = ''; // Clear any existing error message

        if (data === '{') {
            const char = prompt('Enter the character to be repeated (one character only):');
            const number = prompt('Enter the number for exact repetition (integer only):');
            if (char.length === 1 && !isNaN(number)) {
                addSortableItem(`${char}{${number}}`);
            } else {
                errorMessage.textContent = 'Invalid input. Ensure character is one character long and number is an integer.';
            }
        } else if (data === 'range') {
            const leftSide = prompt('Enter the left side of the range (one character only):');
            const rightSide = prompt('Enter the right side of the range (one character only):');
            if (leftSide.length === 1 && rightSide.length === 1) {
                addSortableItem(`[${leftSide}-${rightSide}]`);
            } else {
                errorMessage.textContent = 'Invalid input. Ensure both sides of the range are one character long.';
            }
        } else {
            addSortableItem(data);
        }
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
