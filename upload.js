class PhotoUploader {
  constructor() {
    this.uploadForm = document.getElementById('uploadForm');
    this.filePreview = document.getElementById('filePreview');
    this.photoUpload = document.getElementById('photoUpload');
    this.uploadLabel = document.querySelector('.file-upload label');
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Click event for the visible file upload label/button
    this.uploadLabel.addEventListener('click', (e) => {
      e.preventDefault();
      this.photoUpload.click(); // Trigger the hidden file input
    });

    // Change event for the actual file input
    this.photoUpload.addEventListener('change', (e) => this.handleFileSelect(e));
    
    // Form submission
    this.uploadForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
  }

  handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    console.log('File selected:', file); // Debugging

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      this.showErrorMessage(`Unsupported file type: ${file.type}. Please upload JPG, PNG, or HEIC.`);
      this.resetFileInput();
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.showErrorMessage(`File too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Max 5MB allowed.`);
      this.resetFileInput();
      return;
    }

    // Create preview
    this.createImagePreview(file);
  }

  createImagePreview(file) {
    const reader = new FileReader();
    
    reader.onloadstart = () => {
      this.filePreview.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
    };

    reader.onload = (e) => {
      this.filePreview.innerHTML = `
        <img src="${e.target.result}" alt="Preview">
        <div class="file-info">
          <p>${file.name}</p>
          <small>${(file.size / 1024 / 1024).toFixed(2)} MB</small>
        </div>
        <button class="remove-btn" aria-label="Remove file">
          <i class="fas fa-times"></i>
        </button>
      `;

      // Add event listener for remove button
      const removeBtn = this.filePreview.querySelector('.remove-btn');
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.resetFileInput();
      });
    };

    reader.onerror = () => {
      this.showErrorMessage('Error reading file. Please try another image.');
      this.resetFileInput();
    };

    reader.readAsDataURL(file);
  }

  resetFileInput() {
    this.photoUpload.value = '';
    this.filePreview.innerHTML = `
      <i class="fas fa-cloud-upload-alt"></i>
      <p>No file selected</p>
      <small>Click to browse or drag & drop</small>
    `;
  }

  // ... [rest of the methods remain the same as previous implementation]
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('uploadForm')) {
    new PhotoUploader();
  }
});
