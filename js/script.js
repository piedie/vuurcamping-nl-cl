// VuurCamping.nl - Upgraded JavaScript with sidebar, routing, and sharing
let map;
let markers = [];
let filteredCampings = [...campings];
let currentSliders = {};
let isLeafletMap = false;
let currentCampingId = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    updateCampingList();
    checkFireBans();
    initEventListeners();
    initRouting();
    initOpenStreetMap();
});

// Simple routing system
function initRouting() {
    // Handle initial URL
    handleRoute();
    
    // Handle browser back/forward
    window.addEventListener('popstate', handleRoute);
}

function handleRoute() {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    
    // Handle camping detail URLs like /camping/camping-de-wildhoeve
    if (path.startsWith('/camping/')) {
        const campingSlug = path.replace('/camping/', '');
        const camping = findCampingBySlug(campingSlug);
        if (camping) {
            showCampingInSidebar(camping.id);
            return;
        }
    }
    
    // Handle page navigation
    if (path === '/' || path === '/index.html' || path === '') {
        showPage('home');
    } else if (path === '/over-deze-site' || searchParams.get('page') === 'about') {
        showPage('about');
    } else if (path === '/camping-toevoegen' || searchParams.get('page') === 'add') {
        showPage('add');
    } else if (path === '/buitenland' || searchParams.get('page') === 'international') {
        showPage('international');
    }
}

function findCampingBySlug(slug) {
    return campings.find(camping => 
        createSlug(camping.name) === slug
    );
}

function createSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/--+/g, '-') // Replace multiple hyphens with single
        .trim('-'); // Remove leading/trailing hyphens
}

function updateURL(campingId = null, page = null) {
    let newPath = '/';
    
    if (campingId) {
        const camping = campings.find(c => c.id === campingId);
        if (camping) {
            newPath = `/camping/${createSlug(camping.name)}`;
        }
    } else if (page && page !== 'home') {
        const pageUrls = {
            'about': '/over-deze-site',
            'add': '/camping-toevoegen',
            'international': '/buitenland'
        };
        newPath = pageUrls[page] || '/';
    }
    
    // Use replaceState instead of pushState for camping details to avoid cluttering history
    const method = campingId ? 'replaceState' : 'pushState';
    window.history[method]({}, '', newPath);
}

// Page navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(`${pageId}-page`).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[onclick="showPage('${pageId}')"]`).classList.add('active');
    
    // Close sidebar when changing pages
    if (pageId !== 'home') {
        closeSidebar();
    }
    
    // Close mobile menu
    closeMobileMenu();
    
    // Update URL
    updateURL(null, pageId);
}

// Mobile menu
function toggleMobileMenu() {
    const nav = document.querySelector('.navigation');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    nav.classList.toggle('open');
    overlay.classList.toggle('show');
}

function closeMobileMenu() {
    const nav = document.querySelector('.navigation');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    nav.classList.remove('open');
    overlay.classList.remove('show');
}

// Initialize OpenStreetMap
function initOpenStreetMap() {
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    cssLink.onload = loadLeafletScript;
    cssLink.onerror = initGoogleMaps;
    document.head.appendChild(cssLink);
}

function loadLeafletScript() {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
        if (typeof L !== 'undefined') {
            initLeafletMap();
        } else {
            initGoogleMaps();
        }
    };
    script.onerror = initGoogleMaps;
    document.head.appendChild(script);
}

function initLeafletMap() {
    try {
        isLeafletMap = true;
        map = L.map('map').setView([52.2, 5.5], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
        updateMarkers();
        console.log('✅ OpenStreetMap loaded');
    } catch (error) {
        initGoogleMaps();
    }
}

function initGoogleMaps() {
    console.log('🔄 Google Maps fallback disabled - API key removed for security');
    console.log('📝 To enable Google Maps fallback: add your API key to the script');
    showMapFallback();
}

function updateMarkers() {
    if (isLeafletMap) {
        updateLeafletMarkers();
    } else {
        updateGoogleMarkers();
    }
}

function updateLeafletMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    filteredCampings.forEach(camping => {
        const icon = L.divIcon({
            html: `<div style="background: ${camping.fireBan ? '#dc3545' : '#d2691e'}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 16px;">${camping.fireBan ? '🚫' : '🔥'}</div>`,
            className: '',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        
        const marker = L.marker([camping.lat, camping.lng], { icon }).addTo(map);
        
        // Click handler to open sidebar instead of popup
        marker.on('click', () => {
            showCampingInSidebar(camping.id);
        });
        
        markers.push(marker);
    });
}

function updateGoogleMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    
    filteredCampings.forEach(camping => {
        const marker = new google.maps.Marker({
            position: { lat: camping.lat, lng: camping.lng },
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: camping.fireBan ? '#dc3545' : '#d2691e',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 3
            }
        });
        
        marker.addListener('click', () => {
            showCampingInSidebar(camping.id);
        });
        
        markers.push(marker);
    });
}

// Sidebar functionality
function showCampingInSidebar(campingId) {
    const camping = campings.find(c => c.id === campingId);
    if (!camping) return;
    
    currentCampingId = campingId;
    const sidebar = document.getElementById('campingSidebar');
    const content = document.getElementById('sidebarContent');
    
    // Create sidebar content
    content.innerHTML = createSidebarContent(camping);
    
    // Show sidebar
    sidebar.classList.add('open');
    
    // Initialize photo slider
    if (camping.photos && camping.photos.length > 0) {
        initSlider(campingId);
    }
    
    // Update URL
    updateURL(campingId);
    
    // Focus on camping on map
    focusOnCampingOnMap(camping);
}

function createSidebarContent(camping) {
    const photosHtml = camping.photos ? camping.photos.map((photo, index) => 
        `<div class="photo-slide ${index === 0 ? 'active' : ''}" style="background-image: url('${photo}');"></div>`
    ).join('') : '';

    const dotsHtml = camping.photos && camping.photos.length > 1 ? camping.photos.map((_, index) => 
        `<div class="slider-dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${camping.id}, ${index})"></div>`
    ).join('') : '';

    return `
        <div class="camping-header">
            <h2 class="camping-title">${camping.name}</h2>
            <div class="camping-address">📍 ${camping.address}</div>
            <div class="camping-rating">⭐ ${camping.rating}/5</div>
        </div>
        
        ${camping.fireBan ? `
            <div class="fire-ban-warning">
                🚫 STOOKVERBOD ACTIEF!
                <div style="font-size: 0.9rem; margin-top: 0.5rem;">Check lokale regelgeving</div>
            </div>
        ` : ''}
        
        <div class="camping-info-grid">
            <div class="info-item">
                <div class="info-label">📞 Telefoon</div>
                <div class="info-value">${camping.phone}</div>
            </div>
            <div class="info-item">
                <div class="info-label">🌐 Website</div>
                <div class="info-value">
                    <a href="http://${camping.website}" target="_blank" style="color: #d2691e; text-decoration: none;">
                        ${camping.website}
                    </a>
                </div>
            </div>
        </div>
        
        <div class="feature-tags">
            <span class="feature-tag ${camping.fireBan ? 'fire-ban' : ''}">
                🔥 ${fireTypeNames[camping.fireType]}
            </span>
            <span class="feature-tag">
                ${woodAvailabilityNames[camping.woodAvailability]}
            </span>
        </div>
        
        <div class="camping-description">
            ${camping.description}
        </div>
        
        ${camping.photos && camping.photos.length > 0 ? `
            <div class="photo-gallery">
                <div class="photo-slider" id="slider-${camping.id}">
                    ${photosHtml}
                    ${camping.photos.length > 1 ? `
                        <button class="slider-nav prev" onclick="prevSlide(${camping.id})">‹</button>
                        <button class="slider-nav next" onclick="nextSlide(${camping.id})">›</button>
                    ` : ''}
                </div>
                ${camping.photos.length > 1 ? `
                    <div class="slider-dots">${dotsHtml}</div>
                ` : ''}
            </div>
        ` : ''}
        
        <div class="action-buttons">
            <button class="action-btn primary" onclick="focusOnCampingOnMap(${JSON.stringify(camping).replace(/"/g, '&quot;')})">
                📍 Centreer op kaart
            </button>
            <button class="action-btn secondary" onclick="getDirections(${camping.lat}, ${camping.lng}, '${camping.name}')">
                🗺️ Route berekenen
            </button>
            <a href="http://${camping.website}" target="_blank" class="action-btn tertiary">
                🌐 Bezoek website
            </a>
            <button class="action-btn share" onclick="shareCamping(${camping.id})">
                📤 Deel camping
            </button>
        </div>
    `;
}

function closeSidebar() {
    const sidebar = document.getElementById('campingSidebar');
    sidebar.classList.remove('open');
    currentCampingId = null;
    
    // Update URL to remove camping detail
    if (window.location.pathname.startsWith('/camping/')) {
        updateURL();
    }
}

// Photo slider functions
function initSlider(campingId) { 
    currentSliders[campingId] = 0; 
}

function nextSlide(campingId) {
    const camping = campings.find(c => c.id === campingId);
    if (!camping?.photos || camping.photos.length <= 1) return;
    currentSliders[campingId] = (currentSliders[campingId] + 1) % camping.photos.length;
    updateSlider(campingId);
}

function prevSlide(campingId) {
    const camping = campings.find(c => c.id === campingId);
    if (!camping?.photos || camping.photos.length <= 1) return;
    currentSliders[campingId] = currentSliders[campingId] === 0 ? camping.photos.length - 1 : currentSliders[campingId] - 1;
    updateSlider(campingId);
}

function goToSlide(campingId, index) {
    currentSliders[campingId] = index;
    updateSlider(campingId);
}

function updateSlider(campingId) {
    const slider = document.getElementById(`slider-${campingId}`);
    if (!slider) return;
    
    slider.querySelectorAll('.photo-slide').forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSliders[campingId]);
    });
    
    slider.parentElement.querySelectorAll('.slider-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSliders[campingId]);
    });
}

// Map interaction
function focusOnCampingOnMap(camping) {
    if (!map) return;

    if (isLeafletMap) {
        map.setView([camping.lat, camping.lng], 12);
    } else {
        map.setCenter({ lat: camping.lat, lng: camping.lng });
        map.setZoom(12);
    }
}

function getDirections(lat, lng, name) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
}

// Share functionality
function shareCamping(campingId) {
    const camping = campings.find(c => c.id === campingId);
    if (!camping) return;
    
    const shareData = {
        title: `${camping.name} - VuurCamping.nl`,
        text: `Check deze camping uit waar je vuur mag maken: ${camping.name} in ${camping.city}`,
        url: `${window.location.origin}/camping/${createSlug(camping.name)}`
    };
    
    // Try native sharing first (mobile)
    if (navigator.share) {
        navigator.share(shareData).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareData.url).then(() => {
            showShareNotification('Link gekopieerd naar klembord!');
        }).catch(() => {
            // Ultimate fallback: show URL in alert
            prompt('Kopieer deze link:', shareData.url);
        });
    }
}

function showShareNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.share-notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'share-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showMapFallback() {
    document.getElementById('map').innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f0f0f0;">
            <div style="text-align: center; padding: 2rem;">
                <h3>🗺️ Kaart tijdelijk niet beschikbaar</h3>
                <p>Bekijk de campings in de lijst hieronder</p>
            </div>
        </div>
    `;
}

function updateCampingList() {
    const container = document.getElementById('campingListContainer');
    container.innerHTML = '';
    
    if (filteredCampings.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #6b6b6b;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                <h3>Geen campings gevonden</h3>
                <p>Probeer je zoekterm aan te passen of selecteer andere filters.</p>
            </div>
        `;
        return;
    }
    
    filteredCampings.forEach(camping => {
        const card = document.createElement('div');
        card.className = `camping-card ${camping.fireBan ? 'banned' : ''}`;
        card.onclick = () => showCampingInSidebar(camping.id);
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                <h3 style="color: #2c2c2c; font-weight: 600; margin: 0;">${camping.fireBan ? '🚫' : '🔥'} ${camping.name}</h3>
                <span style="background: #d2691e; color: white; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">⭐ ${camping.rating}</span>
            </div>
            <div style="color: #6b6b6b; margin-bottom: 0.5rem;">📍 ${camping.address}</div>
            <div style="color: #6b6b6b; margin-bottom: 0.5rem;">📞 ${camping.phone}</div>
            ${camping.fireBan ? '<div style="color: #dc3545; font-weight: 600; margin-bottom: 0.5rem;">⚠️ STOOKVERBOD ACTIEF!</div>' : ''}
            <div style="margin-bottom: 0.5rem;">
                <span style="background: ${camping.fireBan ? '#dc3545' : '#d2691e'}; color: white; padding: 0.3rem 0.6rem; border-radius: 16px; font-size: 0.8rem; margin-right: 0.5rem;">${fireTypeNames[camping.fireType]}</span>
                <span style="background: #6c757d; color: white; padding: 0.3rem 0.6rem; border-radius: 16px; font-size: 0.8rem;">${woodAvailabilityNames[camping.woodAvailability]}</span>
            </div>
            <div style="font-size: 0.9rem; color: #6b6b6b; margin-bottom: 1rem;">${camping.description}</div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button onclick="event.stopPropagation(); showCampingInSidebar(${camping.id})" style="background: #d2691e; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">📍 Bekijk details</button>
                <button onclick="event.stopPropagation(); getDirections(${camping.lat}, ${camping.lng}, '${camping.name}')" style="background: #28a745; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">🗺️ Route</button>
                <a href="http://${camping.website}" target="_blank" onclick="event.stopPropagation()" style="background: #6c757d; color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; font-size: 0.9rem;">🌐 Website</a>
                <button onclick="event.stopPropagation(); shareCamping(${camping.id})" style="background: #007bff; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">📤 Deel</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function checkFireBans() {
    const hasFireBan = campings.some(camping => camping.fireBan);
    if (hasFireBan) {
        document.getElementById('fireBanNotice').style.display = 'block';
    }
}

function filterCampings() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedProvince = document.getElementById('provinceFilter').value;
    const selectedFeature = document.getElementById('featureFilter').value;
    const selectedWood = document.getElementById('woodFilter').value;
    
    // Get selected features from checkboxes
    const selectedFeatures = Array.from(document.querySelectorAll('.advanced-filters input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);

    filteredCampings = campings.filter(camping => {
        const matchesSearch = camping.name.toLowerCase().includes(searchTerm) ||
                            camping.city.toLowerCase().includes(searchTerm) ||
                            camping.address.toLowerCase().includes(searchTerm);
        const matchesProvince = !selectedProvince || camping.province === selectedProvince;
        const matchesFeature = !selectedFeature || camping.fireType === selectedFeature;
        const matchesWood = !selectedWood || camping.woodAvailability === selectedWood;
        
        // Check if camping has all selected features
        const matchesSelectedFeatures = selectedFeatures.length === 0 || 
            selectedFeatures.every(feature => camping.features && camping.features.includes(feature));

        return matchesSearch && matchesProvince && matchesFeature && matchesWood && matchesSelectedFeatures;
    });

    updateMarkers();
    updateStats();
    updateCampingList();
    
    // Close sidebar if current camping is filtered out
    if (currentCampingId && !filteredCampings.find(c => c.id === currentCampingId)) {
        closeSidebar();
    }
}

function toggleAdvancedFilters() {
    const panel = document.getElementById('advancedFilters');
    const button = document.querySelector('.filter-toggle-btn');
    
    panel.classList.toggle('open');
    button.textContent = panel.classList.contains('open') ? '⚙️ Minder filters' : '⚙️ Meer filters';
}

function clearAllFilters() {
    // Clear text input
    document.getElementById('searchInput').value = '';
    
    // Clear select dropdowns
    document.getElementById('provinceFilter').value = '';
    document.getElementById('featureFilter').value = '';
    document.getElementById('woodFilter').value = '';
    
    // Clear all checkboxes
    document.querySelectorAll('.advanced-filters input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Trigger filter update
    filterCampings();
}

function updateStats() {
    document.getElementById('totalCampings').textContent = filteredCampings.length;
    const provinces = new Set(filteredCampings.map(c => c.province));
    document.getElementById('totalProvinces').textContent = provinces.size;
}

function initEventListeners() {
    // Filter event listeners
    document.getElementById('searchInput').addEventListener('input', filterCampings);
    document.getElementById('provinceFilter').addEventListener('change', filterCampings);
    document.getElementById('featureFilter').addEventListener('change', filterCampings);
    document.getElementById('woodFilter').addEventListener('change', filterCampings);

    // Form submission
    const addCampingForm = document.getElementById('addCampingForm');
    if (addCampingForm) {
        addCampingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Bedankt! Je camping is toegevoegd voor goedkeuring.');
            // Reset form
            this.reset();
        });
    }
    
    // Newsletter form
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                alert('Bedankt! We houden je op de hoogte van nieuwe ontwikkelingen.');
                this.reset();
            }
        });
    });
    
    // Close sidebar when clicking outside on desktop
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('campingSidebar');
        const isClickInsideSidebar = sidebar.contains(e.target);
        const isClickOnMarker = e.target.closest('.leaflet-marker-icon') || e.target.closest('[onclick*="showCampingInSidebar"]');
        
        if (!isClickInsideSidebar && !isClickOnMarker && sidebar.classList.contains('open')) {
            // Only close on desktop, not mobile
            if (window.innerWidth >= 768) {
                closeSidebar();
            }
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Escape key closes sidebar
        if (e.key === 'Escape' && currentCampingId) {
            closeSidebar();
        }
        
        // Arrow keys for photo navigation
        if (currentCampingId && document.getElementById('campingSidebar').classList.contains('open')) {
            if (e.key === 'ArrowLeft') {
                prevSlide(currentCampingId);
            } else if (e.key === 'ArrowRight') {
                nextSlide(currentCampingId);
            }
        }
    });
}

// Global functions for onclick handlers
window.showPage = showPage;
window.toggleMobileMenu = toggleMobileMenu;
window.showCampingInSidebar = showCampingInSidebar;
window.closeSidebar = closeSidebar;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.goToSlide = goToSlide;
window.getDirections = getDirections;
window.shareCamping = shareCamping;
window.focusOnCampingOnMap = focusOnCampingOnMap;
window.toggleAdvancedFilters = toggleAdvancedFilters;
window.clearAllFilters = clearAllFilters;
