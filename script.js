// Wildlife Photography Gallery Application
class WildlifeGallery {
  constructor() {
    this.galleryData = JSON.parse(localStorage.getItem('wildlifeGallery')) || [];
    this.currentLimit = 8;
    this.initialize();
  }

  initialize() {
    // Initialize with sample data if empty
    if (this.galleryData.length === 0) {
      this.galleryData = [
        {
          id: '1',
          title: 'Majestic Lion',
          photographer: 'Jane Doe',
          imageUrl: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
          category: 'mammals',
          description: 'A beautiful lion resting in the savannah',
          location: 'Serengeti, Tanzania',
          species: 'Panthera leo',
          date: '2023-01-15',
          likes: 42
        },
        {
          id: '2',
          title: 'Colorful Parrot',
          photographer: 'John Smith',
          imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
          category: 'birds',
          description: 'A vibrant parrot in the rainforest',
          location: 'Amazon Rainforest',
          species: 'Ara macao',
          date: '2023-02-20',
          likes: 35
        }
      ];
      localStorage.setItem('wildlifeGallery', JSON.stringify(this.galleryData));
    }

    if (document.getElementById('previewGallery')) {
      this.displayGalleryItems('previewGallery', 4);
    }
    
    if (document.getElementById('mainGallery')) {
      this.displayGalleryItems('mainGallery', this.currentLimit);
      this.setupEventListeners();
    }
    
    this.setupLightbox();
  }

  // ... [rest of the WildlifeGallery class methods remain the same]
}

// Initialize the gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const gallery = new WildlifeGallery();
  window.wildlifeGallery = gallery;
});
