// Wildlife Photography Gallery Application
class WildlifeGallery {
  constructor() {
    this.galleryData = [
      {
        id: 1,
        title: "Majestic Lion",
        photographer: "Sarah Johnson",
        imageUrl: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        category: "mammals",
        description: "A powerful male lion resting in the Serengeti.",
        location: "Serengeti National Park, Tanzania",
        species: "Panthera leo",
        likes: 124,
        date: "2023-05-15"
      },
      // ... (other gallery items with additional properties)
    ];
    
    this.currentLimit = 8;
    this.initialize();
  }

  initialize() {
    // Check which page we're on and initialize accordingly
    if (document.getElementById('previewGallery')) {
      this.displayGalleryItems('previewGallery', 4);
    }
    
    if (document.getElementById('mainGallery')) {
      this.displayGalleryItems('mainGallery', this.currentLimit);
      this.setupEventListeners();
    }
    
    this.setupLightbox();
  }

  setupEventListeners() {
    // Search and filter functionality
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (searchInput) {
      searchInput.addEventListener('input', () => this.filterGallery());
    }
    
    if (filterSelect) {
      filterSelect.addEventListener('change', () => this.filterGallery());
    }
    
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => this.loadMoreItems());
    }
  }

  setupLightbox() {
    const closeBtn = document.getElementById('closeLightbox');
    if (closeBtn) {
      closeBtn.addEventListener('click', this.closeLightbox);
    }
    
    // Close lightbox when clicking outside content
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) this.closeLightbox();
      });
    }
  }

  displayGalleryItems(containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    const itemsToShow = limit ? this.galleryData.slice(0, limit) : this.galleryData;

    itemsToShow.forEach(item => {
      const galleryItem = this.createGalleryItem(item);
      container.appendChild(galleryItem);
    });

    // Update load more button state
    if (containerId === 'mainGallery') {
      this.updateLoadMoreButton();
    }
  }

  createGalleryItem(item) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.dataset.id = item.id;
    galleryItem.dataset.category = item.category;

    galleryItem.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.title}" loading="lazy">
      <div class="overlay">
        <h3>${item.title}</h3>
        <p>By ${item.photographer}</p>
        <div class="item-meta">
          <span><i class="fas fa-heart"></i> ${item.likes || 0}</span>
          <span><i class="fas fa-calendar-alt"></i> ${new Date(item.date).toLocaleDateString()}</span>
        </div>
      </div>
    `;

    galleryItem.addEventListener('click', () => this.openLightbox(item));
    return galleryItem;
  }

  openLightbox(item) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    document.getElementById('lightboxImage').src = item.imageUrl;
    document.getElementById('lightboxImage').alt = item.title;
    document.getElementById('imageTitle').textContent = item.title;
    document.getElementById('imagePhotographer').textContent = `By ${item.photographer}`;
    document.getElementById('imageDescription').textContent = item.description;
    document.getElementById('imageLocation').textContent = item.location ? `📍 ${item.location}` : '';
    document.getElementById('imageSpecies').textContent = item.species ? `🦁 ${item.species}` : '';
    
    // Add additional info
    const metaElement = document.querySelector('.image-meta');
    if (metaElement) {
      metaElement.innerHTML = `
        ${item.location ? `<span>📍 ${item.location}</span>` : ''}
        ${item.species ? `<span>🦁 ${item.species}</span>` : ''}
        ${item.date ? `<span><i class="fas fa-calendar-alt"></i> ${new Date(item.date).toLocaleDateString()}</span>` : ''}
        ${item.likes ? `<span><i class="fas fa-heart"></i> ${item.likes} likes</span>` : ''}
      `;
    }

    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
  }

  closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.style.display = 'none';
      document.body.style.overflow = ''; // Re-enable scrolling
    }
  }

  filterGallery() {
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');
    
    if (!searchInput || !filterSelect) return;

    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;

    const filteredItems = this.galleryData.filter(item => {
      const matchesSearch = Object.values(item).some(
        value => typeof value === 'string' && value.toLowerCase().includes(searchTerm)
      );
      
      const matchesFilter = filterValue === 'all' || item.category === filterValue;
      
      return matchesSearch && matchesFilter;
    });

    this.displayGalleryItems('mainGallery');
    this.currentLimit = 8; // Reset limit when filtering
  }

  loadMoreItems() {
    this.currentLimit += 4;
    this.displayGalleryItems('mainGallery', this.currentLimit);
  }

  updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
      loadMoreBtn.style.display = this.currentLimit >= this.galleryData.length ? 'none' : 'block';
    }
  }
}

// Initialize the gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const gallery = new WildlifeGallery();
  
  // Make the gallery instance available globally for debugging if needed
  window.wildlifeGallery = gallery;
});
