class PhotoUploader {
  constructor() {
    this.uploadForm = document.getElementById('uploadForm');
    this.filePreview = document.getElementById('filePreview');
    this.photoUpload = document.getElementById('photoUpload');
    this.uploadLabel = document.querySelector('.file-upload label');
    this.galleryData = JSON.parse(localStorage.getItem('wildlifeGallery')) || [];
    this.setupEventListeners();
  }

  // ... [previous methods remain the same until handleFormSubmit]

  async handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(this.uploadForm);
    const submitBtn = this.uploadForm.querySelector('button[type="submit"]');
    
    if (!this.validateForm()) return;

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Uploading...';

      // Get the file and convert to base64 for localStorage demo
      const file = this.photoUpload.files[0];
      const imageData = await this.convertToBase64(file);

      // Create new gallery item
      const newItem = {
        id: Date.now(),
        title: formData.get('photoTitle'),
        photographer: formData.get('photographer'),
        description: formData.get('description'),
        location: formData.get('location'),
        species: formData.get('species'),
        imageUrl: imageData,
        category: 'mammals', // Default category for demo
        likes: 0,
        date: new Date().toISOString()
      };

      // Add to gallery data and save
      this.galleryData.unshift(newItem); // Add to beginning
      localStorage.setItem('wildlifeGallery', JSON.stringify(this.galleryData));

      this.showSuccessMessage();
      this.resetForm();

      // Update gallery displays if on gallery page
      this.updateAllGalleryDisplays();

    } catch (error) {
      console.error('Upload failed:', error);
      this.showErrorMessage(error.message || 'Upload failed. Please try again.');
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

  updateAllGalleryDisplays() {
    // Update preview gallery on home page
    if (document.getElementById('previewGallery')) {
      const previewGallery = new WildlifeGallery();
      previewGallery.displayGalleryItems('previewGallery', 4);
    }

    // Update main gallery on gallery page
    if (document.getElementById('mainGallery')) {
      const mainGallery = new WildlifeGallery();
      mainGallery.displayGalleryItems('mainGallery');
    }
  }

  // ... [rest of the methods]
}
