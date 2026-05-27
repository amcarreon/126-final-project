document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('uploadForm');
    const submitBtn = document.getElementById('submitBtnPhotoForm');
    const cancelBtn = document.getElementById('cancelBtnPhotoForm');

    const fileInput = document.getElementById('photoURL');
    const previewContainer = document.getElementById('photosPageContainer');

    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const dropZone = document.getElementById('drop-zone');

    // =========================
    // HIDE ELEMENTS INITIALLY
    // =========================
    previewContainer.classList.add("hidden");
    submitBtn.classList.add("hidden");
    cancelBtn.classList.add("hidden");
    // =========================
    // IMAGE PREVIEW
    // =========================
    fileInput.addEventListener("change", () => {

        const file = fileInput.files[0];

        if (!file) return;

        // Validate image
        if (!file.type.startsWith("image/")) {
            alert("Please select an image.");
            return;
        }

        // Show hidden elements
        dropZone.classList.add("hidden");
        previewContainer.classList.remove("hidden");
        submitBtn.classList.remove("hidden");
        cancelBtn.classList.remove("hidden");

        // Clear old preview
        previewContainer.innerHTML = "";

        // Show filename
        fileNameDisplay.textContent = file.name;

        // Create preview
        const reader = new FileReader();

        reader.onload = (e) => {

            const img = document.createElement("img");

            img.src = e.target.result;

            img.style.maxWidth = "250px";
            img.style.borderRadius = "10px";

            previewContainer.appendChild(img);
        };

        reader.readAsDataURL(file);
    });

    // =========================
    // CANCEL BUTTON
    // =========================
    cancelBtn.addEventListener("click", () => {

    // Reset file input
    form.reset();

    // Clear preview
    previewContainer.innerHTML = "";

    // Hide preview/buttons
    previewContainer.classList.add("hidden");
    submitBtn.classList.add("hidden");
    cancelBtn.classList.add("hidden");

    // Show upload area again
    dropZone.classList.remove("hidden");

    // Clear filename text
    fileNameDisplay.textContent = "";
    });

    // =========================
    // FORM SUBMIT
    // =========================
    form.addEventListener('submit', async (e) => {

        e.preventDefault();

        if (!fileInput.files.length) {
            alert("Please upload an image first.");
            return;
        }

        const formData = new FormData(form);

        try {

            submitBtn.disabled = true;
            submitBtn.textContent = "Saving...";

            const response = await fetch("../../includes/save_photo.php", {
                method: "POST",
                body: formData
            });

            const result = await response.text();

            console.log(result);

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            window.location.href = "photos_page.html";

        } catch (error) {

            console.error(error);
            alert("Upload error.");

        } finally {

            submitBtn.disabled = false;
            submitBtn.textContent = "Save";
        }
    });

});