document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const previewGrid = document.getElementById('previewGrid');
    const photoURLInput = document.getElementById('photoURL');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const uploadText = document.getElementById('uploadText');
    const dropZone = document.getElementById('drop-zone');
    const submitBtn = document.getElementById('submitBtn');
    const photosContainer = document.getElementById('photosContainer');

    let previewImages = [];

    // File input change handler
    photoURLInput.addEventListener('change', handleFileSelect);

    // Drag & drop
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    uploadForm.addEventListener('submit', handleFormSubmit);

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            createImageContainer(file);
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    }

    function handleDragLeave(e) {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
    }

    function handleDrop(e) {
        e.preventDefault();
        dropZone.classList.remove('drop'); // mali ata naming drag-over nakalagay kanina
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            photoURLInput.files = files;
            createImageContainer(files[0]);
        }
    }

    function createImageContainer(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Create SEPARATE container for each image
            const container = document.createElement('div');
            container.className = 'image-container';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = file.name;
            img.className = 'container-image';
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'container-remove';
            removeBtn.innerHTML = '×'; 
            removeBtn.onclick = () => removeImageContainer(container);
            
            container.appendChild(img);
            container.appendChild(removeBtn);
            
            // Add to grid
            previewGrid.appendChild(container);
            previewImages.push({ container, src: e.target.result, name: file.name });
            
            fileNameDisplay.textContent = '';
            uploadText.style.display = 'none';
            updateSubmitButton();
        };
        reader.readAsDataURL(file);
    }

    function removeImageContainer(container) {
        container.remove();
        previewImages = previewImages.filter(item => item.container !== container);
        updateSubmitButton();
        if (previewImages.length === 0) {
            uploadText.style.display = 'block';
        }
    }

    function updateSubmitButton() {
        const count = previewImages.length;
        submitBtn.textContent = count > 0 
            ? `Add ${count} Photo${count > 1 ? 's' : ''}` 
            : 'Add Photo';
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (previewImages.length === 0) {
            alert('Please select image(s) first!');
            return;
        }

        // Move ALL to gallery
        previewImages.forEach((preview, index) => {
            setTimeout(() => {
                addToGallery(preview.src, preview.name);
                preview.container.remove();
            }, index * 150);
        });

        // Reset
        previewImages = [];
        previewGrid.innerHTML = '';
        uploadText.style.display = 'block';
        photoURLInput.value = '';
        submitBtn.textContent = 'Add Photo';
    }

    function addToGallery(imageSrc, fileName) {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo-item';
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = fileName;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-photo';
        removeBtn.innerHTML = '×'; 
        removeBtn.onclick = () => photoDiv.remove();
        
        photoDiv.appendChild(img);
        photoDiv.appendChild(removeBtn);
        photosContainer.insertBefore(photoDiv, photosContainer.firstChild);
    }
});