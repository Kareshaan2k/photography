class PhotoUploader {
  constructor() {
    this.uploadForm = document.getElementById('uploadForm');
    this.filePreview = document.getElementById('filePreview');
    this.photoUpload = document.getElementById('photoUpload');
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Preview image before upload
    this.photoUpload.addEventListener('change', (e) => this.handleFileSelect(e));
    
    // Form submission
    this.uploadForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
  }

  handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/heic'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, or HEIC file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.filePreview.innerHTML = `
        <img src="${e.target.result}" alt="Preview">
        <p>${file.name}</p>
        <small>${(file.size / 1024 / 1024).toFixed(2)} MB</small>
      `;
    };
    reader.readAsDataURL(file);
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(this.uploadForm);
    const submitBtn = this.uploadForm.querySelector('button[type="submit"]');
    
    // Validate form
    if (!this.validateForm()) return;

    try {
      // Disable submit button during upload
      submitBtn.disabled = true;
      submitBtn.textContent = 'Uploading...';

      // Simulate upload (replace with actual API call)
      const response = await this.simulateUpload(formData);
      
      // For demo purposes - in real app you would handle the API response
      console.log('Upload successful:', response);
      this.showSuccessMessage();
      this.resetForm();
      
    } catch (error) {
      console.error('Upload failed:', error);
      this.showErrorMessage(error.message || 'Upload failed. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Upload Photo';
    }
  }

  validateForm() {
    const title = document.getElementById('photoTitle').value.trim();
    const name = document.getElementById('photographer').value.trim();
    const file = this.photoUpload.files[0];
    const terms = document.getElementById('termsAgree').checked;

    if (!title) {
      alert('Please enter a photo title');
      return false;
    }

    if (!name) {
      alert('Please enter your name');
      return false;
    }

    if (!file) {
      alert('Please select a photo to upload');
      return false;
    }

    if (!terms) {
      alert('You must agree to the terms and conditions');
      return false;
    }

    return true;
  }

  async uploadToBackend(formData) {
  try {
    const response = await fetch('https://your-api-endpoint.com/upload', {
      method: 'POST',
      body: formData,
      // headers are automatically set by browser for FormData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Upload failed');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

  showSuccessMessage() {
    // Create or show a success message element
    const existingAlert = document.querySelector('.alert-message');
    if (existingAlert) existingAlert.remove();

    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-message success';
    alertDiv.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>Your photo has been uploaded successfully!</span>
    `;
    
    this.uploadForm.parentNode.insertBefore(alertDiv, this.uploadForm.nextSibling);
    
    // Remove after 5 seconds
    setTimeout(() => alertDiv.remove(), 5000);
  }

  showErrorMessage(message) {
    const existingAlert = document.querySelector('.alert-message');
    if (existingAlert) existingAlert.remove();

    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-message error';
    alertDiv.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <span>${message}</span>
    `;
    
    this.uploadForm.parentNode.insertBefore(alertDiv, this.uploadForm.nextSibling);
  }

  resetForm() {
    this.uploadForm.reset();
    this.filePreview.innerHTML = `
      <i class="fas fa-cloud-upload-alt"></i>
      <p>No file selected</p>
    `;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('uploadForm')) {
    new PhotoUploader();
  }
});
