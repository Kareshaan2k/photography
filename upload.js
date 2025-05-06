class PhotoUploader {
  constructor() {
    this.uploadForm = document.getElementById('uploadForm');
    this.filePreview = document.getElementById('filePreview');
    this.photoUpload = document.getElementById('photoUpload');
    this.uploadLabel = document.querySelector('.file-upload label');
    this.galleryData = JSON.parse(localStorage.getItem('wildlifeGallery')) || [];
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.photoUpload.addEventListener('change', (e) => this.handleFileSelect(e));
    this.uploadForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    
    // Drag and drop events
    this.filePreview.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.filePreview.classList.add('drag-over');
    });
    
    this.filePreview.addEventListener('dragleave', () => {
      this.filePreview.classList.remove('drag-over');
    });
    
    this.filePreview.addEventListener('drop', (e) => {
      e.preventDefault();
      this.filePreview.classList.remove('drag-over');
      this.photoUpload.files = e.dataTransfer.files;
      this.handleFileSelect({ target: this.photoUpload });
    });
  }

  handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.filePreview.innerHTML = `
        <img src="${e.target.result}" alt="Preview">
        <div class="file-info">
          <p>${file.name}</p>
          <small>${(file.size / 1024).toFixed(2)} KB</small>
        </div>
        <button class="remove-btn" type="button"><i class="fas fa-times"></i></button>
      `;
      
      const removeBtn = this.filePreview.querySelector('.remove-btn');
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.photoUpload.value = '';
        this.filePreview.innerHTML = `
          <i class="fas fa-cloud-upload-alt"></i>
          <p>No file selected</p>
        `;
      });
    };
    reader.readAsDataURL(file);
  }

  validateForm() {
    const title = document.getElementById('photoTitle').value.trim();
    const photographer = document.getElementById('photographer').value.trim();
    const file = this.photoUpload.files[0];
    
    if (!title || !photographer || !file) {
      alert('Please fill in all required fields');
      return false;
    }
    
    return true;
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    
    if (!this.validateForm()) return;

    const submitBtn = this.uploadForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading...';

    try {
      const file = this.photoUpload.files[0];
      const imageUrl = await this.convertToBase64(file);
      
      const newItem = {
        id: Date.now().toString(),
        title: document.getElementById('photoTitle').value.trim(),
        photographer: document.getElementById('photographer').value.trim(),
        imageUrl: imageUrl,
        category: 'mammals', // Default category, can be enhanced
        description: document.getElementById('description').value.trim(),
        location: document.getElementById('location').value.trim(),
        species: document.getElementById('species').value.trim(),
        date: new Date().toISOString().split('T')[0],
        likes: 0
      };

      // Add to gallery data
      this.galleryData.unshift(newItem);
      localStorage.setItem('wildlifeGallery', JSON.stringify(this.galleryData));

      // Show success message
      this.showSuccessMessage('Photo uploaded successfully!');
      this.resetForm();
      
      // Update gallery displays
      this.updateAllGalleryDisplays();

    } catch (error) {
      this.showErrorMessage('Upload failed. Please try again.');
      console.error(error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Upload Photo';
    }
  }

  convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  showSuccessMessage(message) {
    const existingAlert = document.querySelector('.alert-message');
    if (existingAlert) existingAlert.remove();

    const alert = document.createElement('div');
    alert.className = 'alert-message success';
    alert.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    `;
    this.uploadForm.prepend(alert);
    
    setTimeout(() => {
      alert.remove();
    }, 5000);
  }

  showErrorMessage(message) {
    const existingAlert = document.querySelector('.alert-message');
    if (existingAlert) existingAlert.remove();

    const alert = document.createElement('div');
    alert.className = 'alert-message error';
    alert.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <span>${message}</span>
    `;
    this.uploadForm.prepend(alert);
  }

  resetForm() {
    this.uploadForm.reset();
    this.filePreview.innerHTML = `
      <i class="fas fa-cloud-upload-alt"></i>
      <p>No file selected</p>
    `;
  }

  updateAllGalleryDisplays() {
    // This will update any gallery displays on the page
    if (typeof wildlifeGallery !== 'undefined') {
      wildlifeGallery.galleryData = JSON.parse(localStorage.getItem('wildlifeGallery')) || [];
      if (document.getElementById('previewGallery')) {
        wildlifeGallery.displayGalleryItems('previewGallery', 4);
      }
      if (document.getElementById('mainGallery')) {
        wildlifeGallery.displayGalleryItems('mainGallery', wildlifeGallery.currentLimit);
      }
    }
  }
}

// Initialize the uploader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const uploader = new PhotoUploader();
});
