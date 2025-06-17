// VuurCamping.nl - Main JavaScript
// OpenStreetMap (Leaflet) + Google Maps fallback + Photo Slider

let map;
let markers = [];
let filteredCampings = [...campings];
let currentSliders = {};
let isLeafletMap = false;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    updateCampingList();
    checkFireBans();
    initEventListeners();
    
    // Try OpenStreetMap first, then Google Maps fallback
    initOpenStreetMap();
});

// Initialize OpenStreetMap with Leaflet
function initOpenStreetMap() {
    try {
        // Load Leaflet CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        cssLink.onload = () => {
            console.log('Leaflet CSS loaded');
            loadLeafletScript();
        };
        cssLink.onerror = () => {
            console.log('Leaflet CSS failed, trying Google Maps...');
            initGoogleMaps();
        };
        document.head.appendChild(cssLink);
    } catch (error) {
        console.error('Error loading Leaflet CSS:', error);
        initGoogleMaps();
    }
}

// Load Leaflet JavaScript
function loadLeafletScript() {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    
    script.onload = () => {
        if (typeof L !== 'undefined') {
            console.log('✅ OpenStreetMap (Leaflet) loaded successfully');
            initLeafletMap();
        } else {
            console.log('Leaflet object not found, trying Google Maps...');
            initGoogleMaps();
        }
    };
    
    script.onerror = () => {
        console.log('❌ Leaflet failed to load, using Google Maps fallback...');
        initGoogleMaps();
    };
    
    document.head.appendChild(script);
}

// Initialize Leaflet map
function initLeafletMap() {
    try {
        isLeafletMap = true;
        
        map = L.map('map').setView([52.2, 5.5], 7);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        updateLeafletMarkers();
        console.log('🗺️ OpenStreetMap initialized successfully');
        
    } catch (error) {
        console.error('Error initializing Leaflet map:', error);
        initGoogleMaps();
    }
}

// Initialize Google Maps (fallback)
function initGoogleMaps() {
    console.log('🔄 Loading Google Maps as fallback...');
    
    if (typeof google === 'undefined') {
        showMapFallback();
        return;
    }

    try {
        isLeafletMap = false;
        
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            center: { lat: 52.2, lng: 5.5 },
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ],
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true
        });

        updateGoogleMarkers();
        console.log('🗺️ Google Maps initialized successfully');
        
    } catch (error) {
        console.error('Error initializing Google Maps:', error);
        showMapFallback();
    }
}

// Update markers for Leaflet (OpenStreetMap)
function updateLeafletMarkers() {
    if (!map || !isLeafletMap) return;

    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Add new markers for filtered campings
    filteredCampings.forEach(camping => {
        const icon = L.divIcon({
            html: `<div style="
                background: ${camping.fireBan ? '#dc3545' : '#d2691e'};
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                cursor: pointer;
            ">${camping.fireBan ? '🚫' : '🔥'}</div>`,
            className: 'custom-fire-icon',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        const marker = L.marker([camping.lat, camping.lng], { icon }).addTo(map);
        
        const popupContent = createLeafletPopupContent(camping);
        marker.bindPopup(popupContent, { maxWidth: 350 });
        
        marker.on('popupopen', () => {
            setTimeout(() => initSlider(camping.id), 200);
        });
        
        markers.push(marker);
    });
}

// Update markers for Google Maps (fallback)
function updateGoogleMarkers() {
    if (!map || isLeafletMap) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    // Add new markers for filtered campings
    filteredCampings.forEach(camping => {
        const icon = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: camping.fireBan ? '#dc3545' : '#d2691e',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 3
        };

        const marker = new google.maps.Marker({
            position: { lat: camping.lat, lng: camping.lng },
            map: map,
            icon: icon,
            title: camping.name
        });

        const infoWindow = new google.maps.InfoWindow({
            content: createGoogleInfoWindowContent(camping),
            maxWidth: 350
        });

        marker.addListener('click', () => {
            markers.forEach(m => {
                if (m.infoWindow) m.infoWindow.close();
            });
            
            infoWindow.open(map, marker);
            setTimeout(() => initSlider(camping.id), 200);
        });

        marker.infoWindow = infoWindow;
        markers.push(marker);
    });
}

// Create popup content for Leaflet
function createLeafletPopupContent(camping) {
    const photosHtml = camping.photos.map((photo, index) => 
        `<div class="photo-slide ${index === 0 ? 'active' : ''}" style="background-image: url('${photo}')"></div>`
    ).join('');

    const dotsHtml = camping.photos.map((_, index) => 
        `<div class="slider-dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${camping.id}, ${index})"></div>`
    ).join('');

    return `
        <div class="custom-info-window">
            <div class="info-header ${camping.fireBan ? 'banned' : ''}">
                <div class="info-logo">${camping.fireBan ? '🚫' : '🔥'}</div>
                <h3 class="info-title">${camping.name}</h3>
                ${camping.fireBan ? '<div style="font-size: 0.9rem; margin-top: 0.5rem; font-weight: 600;">⚠️ STOOKVERBOD ACTIEF!</div>' : ''}
            </div>
            
            <div class="info-content">
                <div class="info-detail">📍 ${camping.address}</div>
                <div class="info-detail">📞 ${camping.phone}</div>
                <div class="info-detail">🌐 <a href="http://${camping.website}" target="_blank" style="color: #d2691e;">${camping.website}</a></div>
                <div class="info-detail">⭐ ${camping.rating}/5</div>
                
                <div style="margin: 0.75rem 0;">
                    <span class="feature-tag ${camping.fireBan ? 'warning-tag' : ''}">🔥 ${fireTypeNames[camping.fireType]}</span>
                    <span class="feature-tag">${woodAvailabilityNames[camping.woodAvailability]}</span>
                </div>
                
                <div style="font-size: 0.9rem; color: #6b6b6b; margin-bottom: 1rem;">
                    ${camping.description}
                </div>
                
                ${camping.photos && camping.photos.length > 0 ? `
                <div class="photo-slider" id="slider-${camping.id}">
                    ${photosHtml}
                    ${camping.photos.length > 1 ? `
                        <button class="slider-nav prev" onclick="prevSlide(${camping.id})">‹</button>
                        <button class="slider-nav next" onclick="nextSlide(${camping.id})">›</button>
                        <div class="slider-dots">${dotsHtml}</div>
                    ` : ''}
                </div>
                ` : ''}
                
                <div style="margin-top: 1rem; text-align: center;">
                    <button onclick="getDirections(${camping.lat}, ${camping.lng}, '${camping.name}')" 
                            style="background: #d2691e; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
                        🗺️ Route berekenen
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Create info window content for Google Maps (reuse same content)
function createGoogleInfoWindowContent(camping) {
    return createLeafletPopupContent(camping);
}

// Update markers (universal function)
function updateMarkers() {
    if (isLeafletMap) {
        updateLeafletMarkers();
    } else {
        updateGoogleMarkers();
    }
}

// Show fallback when both maps fail
function showMapFallback() {
    document.getElementById('map').innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); color: #666;">
            <div style="text-align: center; background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <h3 style="color: #8b4513; margin-bottom: 1rem;">🗺️ Kaart tijdelijk niet beschikbaar</h3>
                <p style="margin-bottom: 1rem;">Bekijk de campings in de lijst hieronder</p>
                <div style="font-size: 2rem; margin: 1rem 0;">🇳🇱</div>
                <p style="font-size: 0.9rem; color: #999;">Voor route-informatie, klik op een camping in de lijst</p>
            </div>
        </div>
    `;
}

// Photo slider functions (unchanged)
function initSlider(campingId) {
    currentSliders[campingId] = 0;
}

function nextSlide(campingId) {
    const camping = campings.find(c => c.id === campingId);
    if (!camping || !camping.photos || camping.photos.length <= 1) return;
    
    currentSliders[campingId] = (currentSliders[campingId] + 1) % camping.photos.length;
    updateSlider(campingId);
}

function prevSlide(campingId) {
    const camping = campings.find(c => c.id === campingId);
    if (!camping || !camping.photos || camping.photos.length <= 1) return;
    
    currentSliders[campingId] = currentSliders[campingId] === 0 ? 
        camping.photos.length - 1 : currentSliders[campingId] - 1;
    updateSlider(campingId);
}

function goToSlide(campingId, index) {
    currentSliders[campingId] = index;
    updateSlider(campingId);
}

function updateSlider(campingId) {
    const slider = document.getElementById(`slider-${campingId}`);
    if (!slider) return;

    const slides = slider.querySelectorAll('.photo-slide');
    const dots = slider.querySelectorAll('.slider-dot');
    
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSliders[campingId]);
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSliders[campingId]);
    });
}

// Get directions to camping
function getDirections(lat, lng, name) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
}

// Update camping list (unchanged from previous version)
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
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                <h3 style="color: #2c2c2c; font-weight: 600; margin: 0;">${camping.fireBan ? '🚫' : '🔥'} ${camping.name}</h3>
                <span style="background: #d2691e; color: white; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">⭐ ${camping.rating}</span>
            </div>
            <div style="color: #6b6b6b; margin-bottom: 0.5rem;">📍 ${camping.address}</div>
            <div style="color: #6b6b6b; margin-bottom: 0.5rem;">📞 ${camping.phone}</div>
            ${camping.fireBan ? '<div style="color: #dc3545; font-weight: 600; margin-bottom: 0.5rem;">⚠️ STOOKVERBOD ACTIEF!</div>' : ''}
            <div style="margin-bottom: 0.5rem;">
                <span class="feature-tag ${camping.fireBan ? 'warning-tag' : ''}">${fireTypeNames[camping.fireType]}</span>
                <span class="feature-tag" style="background: #6c757d;">${woodAvailabilityNames[camping.woodAvailability]}</span>
            </div>
            <div style="font-size: 0.9rem; color: #6b6b6b; margin-bottom: 1rem;">${camping.description}</div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button onclick="focusOnCamping(${camping.id})" style="background: #d2691e; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
                    📍 Toon op kaart
                </button>
                <button onclick="getDirections(${camping.lat}, ${camping.lng}, '${camping.name}')" style="background: #28a745; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
                    🗺️ Route berekenen
                </button>
                <a href="http://${camping.website}" target="_blank" style="background: #6c757d; color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; font-size: 0.9rem;">
                    🌐 Website
                </a>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Focus on specific camping on map
function focusOnCamping(campingId) {
    const camping = campings.find(c => c.id === campingId);
    if (!camping || !map) return;

    if (isLeafletMap) {
        // Leaflet map
        map.setView([camping.lat, camping.lng], 12);
        // Find and open popup
        const marker = markers.find(m => m.getLatLng && 
            m.getLatLng().lat === camping.lat && m.getLatLng().lng === camping.lng);
        if (marker) {
            marker.openPopup();
        }
    } else {
        // Google Maps
        map.setCenter({ lat: camping.lat, lng: camping.lng });
        map.setZoom(12);
        // Find and click the marker
        const marker = markers.find(m => m.getTitle && m.getTitle() === camping.name);
        if (marker) {
            google.maps.event.trigger(marker, 'click');
        }
    }
    
    // Scroll to map
    document.querySelector('.map-container').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
}

// Check for fire bans (unchanged)
function checkFireBans() {
    const hasFireBan = campings.some(camping => camping.fireBan);
    const notice = document.getElementById('fireBanNotice');
    
    if (hasFireBan) {
        notice.style.display = 'block';
    }
}

// Filter campings (unchanged)
function filterCampings() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedProvince = document.getElementById('provinceFilter').value;
    const selectedFeature = document.getElementById('featureFilter').value;
    const selectedWood = document.getElementById('woodFilter').value;

    filteredCampings = campings.filter(camping => {
        const matchesSearch = camping.name.toLowerCase().includes(searchTerm) ||
                            camping.city.toLowerCase().includes(searchTerm) ||
                            camping.address.toLowerCase().includes(searchTerm) ||
                            camping.description.toLowerCase().includes(searchTerm);
        
        const matchesProvince = !selectedProvince || camping.province === selectedProvince;
        const matchesFeature = !selectedFeature || camping.fireType === selectedFeature;
        const matchesWood = !selectedWood || camping.woodAvailability === selectedWood;

        return matchesSearch && matchesProvince && matchesFeature && matchesWood;
    });

    updateMarkers();
    updateStats();
    updateCampingList();
}

// Update statistics (unchanged)
function updateStats() {
    document.getElementById('totalCampings').textContent = filteredCampings.length;
    const provinces = new Set(filteredCampings.map(c => c.province));
    document.getElementById('totalProvinces').textContent = provinces.size;
}

// Modal functions (unchanged)
function openModal() {
    document.getElementById('addCampingModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('addCampingModal').style.display = 'none';
    document.getElementById('addCampingForm').reset();
}

// Initialize event listeners (unchanged)
function initEventListeners() {
    // Filter events
    document.getElementById('searchInput').addEventListener('input', filterCampings);
    document.getElementById('provinceFilter').addEventListener('change', filterCampings);
    document.getElementById('featureFilter').addEventListener('change', filterCampings);
    document.getElementById('woodFilter').addEventListener('change', filterCampings);

    // Modal events
    window.onclick = function(event) {
        const modal = document.getElementById('addCampingModal');
        if (event.target === modal) {
            closeModal();
        }
    };

    // Form submission
    document.getElementById('addCampingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('campingName').value,
            address: document.getElementById('campingAddress').value,
            province: document.getElementById('campingProvince').value,
            website: document.getElementById('campingWebsite').value,
            phone: document.getElementById('campingPhone').value,
            fireType: document.getElementById('campingFireType').value,
            woodAvailability: document.getElementById('campingWoodAvailability').value,
            description: document.getElementById('campingNotes').value
        };

        alert('Bedankt! Je camping is toegevoegd voor goedkeuring. We nemen binnen 2 werkdagen contact op.');
        closeModal();
    });
}

// Make functions globally available
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.goToSlide = goToSlide;
window.getDirections = getDirections;
window.focusOnCamping = focusOnCamping;
window.openModal = openModal;
window.closeModal = closeModal;iders[campingId] = index;
    updateSlider(campingId);
}

function updateSlider(campingId) {
    const slider = document.getElementById(`slider-${campingId}`);
    if (!slider) return;

    const slides = slider.querySelectorAll('.photo-slide');
    const dots = slider.querySelectorAll('.slider-dot');
    
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSliders[campingId]);
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSliders[campingId]);
    });
}

// Get directions to camping
function getDirections(lat, lng, name) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
}

// Update camping list
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
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                <h3 style="color: #2c2c2c; font-weight: 600; margin: 0;">${camping.fireBan ? '🚫' : '🔥'} ${camping.name}</h3>
                <span style="background: #d2691e; color: white; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">⭐ ${camping.rating}</span>
            </div>
            <div style="color: #6b6b6b; margin-bottom: 0.5rem;">📍 ${camping.address}</div>
            <div style="color: #6b6b6b; margin-bottom: 0.5rem;">📞 ${camping.phone} • ${camping.priceRange}</div>
            ${camping.fireBan ? '<div style="color: #dc3545; font-weight: 600; margin-bottom: 0.5rem;">⚠️ STOOKVERBOD ACTIEF!</div>' : ''}
            <div style="margin-bottom: 0.5rem;">
                <span class="feature-tag ${camping.fireBan ? 'warning-tag' : ''}">${fireTypeNames[camping.fireType]}</span>
                <span class="feature-tag" style="background: #6c757d;">${woodAvailabilityNames[camping.woodAvailability]}</span>
            </div>
            <div style="font-size: 0.9rem; color: #6b6b6b; margin-bottom: 1rem;">${camping.description}</div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button onclick="focusOnCamping(${camping.id})" style="background: #d2691e; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
                    📍 Toon op kaart
                </button>
                <button onclick="getDirections(${camping.lat}, ${camping.lng}, '${camping.name}')" style="background: #28a745; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">
                    🗺️ Route berekenen
                </button>
                <a href="http://${camping.website}" target="_blank" style="background: #6c757d; color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; font-size: 0.9rem;">
                    🌐 Website
                </a>
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Focus on specific camping on map
function focusOnCamping(campingId) {
    const camping = campings.find(c => c.id === campingId);
    if (!camping || !map) return;

    map.setCenter({ lat: camping.lat, lng: camping.lng });
    map.setZoom(12);
    
    // Find and click the marker
    const marker = markers.find(m => m.getTitle() === camping.name);
    if (marker) {
        google.maps.event.trigger(marker, 'click');
    }
    
    // Scroll to map
    document.querySelector('.map-container').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
}

// Check for fire bans
function checkFireBans() {
    const hasFireBan = campings.some(camping => camping.fireBan);
    const notice = document.getElementById('fireBanNotice');
    
    if (hasFireBan) {
        notice.style.display = 'block';
    }
    
    // In productie: real-time check via API
    // API.getFireBans().then(bans => {
    //     campings.forEach(camping => {
    //         camping.fireBan = bans[camping.province] || false;
    //     });
    //     updateMarkers();
    //     updateCampingList();
    // });
}

// Filter campings
function filterCampings() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedProvince = document.getElementById('provinceFilter').value;
    const selectedFeature = document.getElementById('featureFilter').value;
    const selectedWood = document.getElementById('woodFilter').value;

    filteredCampings = campings.filter(camping => {
        const matchesSearch = camping.name.toLowerCase().includes(searchTerm) ||
                            camping.city.toLowerCase().includes(searchTerm) ||
                            camping.address.toLowerCase().includes(searchTerm) ||
                            camping.description.toLowerCase().includes(searchTerm);
        
        const matchesProvince = !selectedProvince || camping.province === selectedProvince;
        const matchesFeature = !selectedFeature || camping.fireType === selectedFeature;
        const matchesWood = !selectedWood || camping.woodAvailability === selectedWood;

        return matchesSearch && matchesProvince && matchesFeature && matchesWood;
    });

    updateMarkers();
    updateStats();
    updateCampingList();
}

// Update statistics
function updateStats() {
    document.getElementById('totalCampings').textContent = filteredCampings.length;
    const provinces = new Set(filteredCampings.map(c => c.province));
    document.getElementById('totalProvinces').textContent = provinces.size;
}

// Modal functions
function openModal() {
    document.getElementById('addCampingModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('addCampingModal').style.display = 'none';
    document.getElementById('addCampingForm').reset();
}

// Initialize event listeners
function initEventListeners() {
    // Filter events
    document.getElementById('searchInput').addEventListener('input', filterCampings);
    document.getElementById('provinceFilter').addEventListener('change', filterCampings);
    document.getElementById('featureFilter').addEventListener('change', filterCampings);
    document.getElementById('woodFilter').addEventListener('change', filterCampings);

    // Modal events
    window.onclick = function(event) {
        const modal = document.getElementById('addCampingModal');
        if (event.target === modal) {
            closeModal();
        }
    };

    // Form submission
    document.getElementById('addCampingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('campingName').value,
            address: document.getElementById('campingAddress').value,
            province: document.getElementById('campingProvince').value,
            website: document.getElementById('campingWebsite').value,
            phone: document.getElementById('campingPhone').value,
            fireType: document.getElementById('campingFireType').value,
            woodAvailability: document.getElementById('campingWoodAvailability').value,
            description: document.getElementById('campingNotes').value
        };

        // In productie: verstuur naar backend
        API.addCamping(formData).then(newCamping => {
            alert('Bedankt! Je camping is toegevoegd voor goedkeuring. We nemen binnen 2 werkdagen contact op.');
            closeModal();
        }).catch(error => {
            alert('Er is een fout opgetreden. Probeer het later opnieuw.');
            console.error('Error adding camping:', error);
        });
    });
}

// Make functions globally available
window.initMap = initMap;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.goToSlide = goToSlide;
window.getDirections = getDirections;
window.focusOnCamping = focusOnCamping;
window.openModal = openModal;
window.closeModal = closeModal;
