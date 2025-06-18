// VuurCamping.nl - OpenStreetMap + Google Maps fallback
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
    initOpenStreetMap();
});

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

function createGoogleMap() {
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
        updateMarkers();
        console.log('✅ Google Maps loaded as fallback');
    } catch (error) {
        console.error('Error creating Google Maps:', error);
        showMapFallback();
    }
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
        marker.bindPopup(createPopupContent(camping), { maxWidth: 400, minWidth: 350 });
        marker.on('popupopen', () => setTimeout(() => initSlider(camping.id), 200));
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
        
        const infoWindow = new google.maps.InfoWindow({
            content: createPopupContent(camping),
            maxWidth: 400
        });
        
        marker.addListener('click', () => {
            markers.forEach(m => m.infoWindow && m.infoWindow.close());
            infoWindow.open(map, marker);
            setTimeout(() => initSlider(camping.id), 200);
        });
        
        marker.infoWindow = infoWindow;
        markers.push(marker);
    });
}

function createPopupContent(camping) {
    const photosHtml = camping.photos ? camping.photos.map((photo, index) => 
        `<div class="photo-slide ${index === 0 ? 'active' : ''}" style="background-image: url('${photo}'); position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; opacity: ${index === 0 ? '1' : '0'}; transition: opacity 0.3s ease;"></div>`
    ).join('') : '';

    const dotsHtml = camping.photos ? camping.photos.map((_, index) => 
        `<div class="slider-dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${camping.id}, ${index})" style="width: 8px; height: 8px; border-radius: 50%; background: ${index === 0 ? 'white' : 'rgba(255,255,255,0.5)'}; cursor: pointer; margin: 0 2px;"></div>`
    ).join('') : '';

    return `
        <div style="max-width: 380px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
            <div style="background: ${camping.fireBan ? '#dc3545' : '#d2691e'}; color: white; padding: 1.2rem; text-align: center; border-radius: 8px 8px 0 0;">
                <div style="width: 45px; height: 45px; background: white; border-radius: 50%; margin: 0 auto 0.7rem; display: flex; align-items: center; justify-content: center; font-size: 26px;">
                    ${camping.fireBan ? '🚫' : '🔥'}
                </div>
                <h3 style="margin: 0; font-size: 1.2rem; font-weight: 600;">${camping.name}</h3>
                ${camping.fireBan ? '<div style="margin-top: 0.5rem; font-weight: 600; font-size: 0.95rem;">⚠️ STOOKVERBOD ACTIEF!</div>' : ''}
            </div>
            <div style="padding: 1.2rem; background: white; line-height: 1.5;">
                <div style="margin-bottom: 0.6rem; color: #6b6b6b; font-size: 0.95rem;">📍 ${camping.address}</div>
                <div style="margin-bottom: 0.6rem; color: #6b6b6b; font-size: 0.95rem;">📞 ${camping.phone}</div>
                <div style="margin-bottom: 0.6rem; color: #6b6b6b; font-size: 0.95rem;">🌐 <a href="http://${camping.website}" target="_blank" style="color: #d2691e; text-decoration: none;">${camping.website}</a></div>
                <div style="margin-bottom: 0.8rem; color: #6b6b6b; font-size: 0.95rem;">⭐ ${camping.rating}/5</div>
                
                <div style="margin: 1rem 0;">
                    <span style="background: ${camping.fireBan ? '#dc3545' : '#d2691e'}; color: white; padding: 0.4rem 0.8rem; border-radius: 16px; font-size: 0.85rem; margin-right: 0.5rem; display: inline-block; margin-bottom: 0.3rem;">
                        🔥 ${fireTypeNames[camping.fireType]}
                    </span>
                    <span style="background: #6c757d; color: white; padding: 0.4rem 0.8rem; border-radius: 16px; font-size: 0.85rem; display: inline-block; margin-bottom: 0.3rem;">
                        ${woodAvailabilityNames[camping.woodAvailability]}
                    </span>
                </div>
                
                <div style="font-size: 0.95rem; color: #6b6b6b; margin-bottom: 1.2rem; line-height: 1.4;">
                    ${camping.description}
                </div>
                
                ${camping.photos && camping.photos.length > 0 ? `
                <div style="position: relative; height: 140px; background: #f8f9fa; border-radius: 8px; overflow: hidden; margin-bottom: 1rem;" id="slider-${camping.id}">
                    ${photosHtml}
                    ${camping.photos.length > 1 ? `
                        <button onclick="prevSlide(${camping.id})" style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.6); color: white; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;">‹</button>
                        <button onclick="nextSlide(${camping.id})" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.6); color: white; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;">›</button>
                        <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px;">${dotsHtml}</div>
                    ` : ''}
                </div>
                ` : ''}
                
                <div style="text-align: center;">
                    <button onclick="getDirections(${camping.lat}, ${camping.lng}, '${camping.name}')" 
                            style="background: #28a745; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 500;">
                        🗺️ Route berekenen
                    </button>
                </div>
            </div>
        </div>
    `;
}

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
        slide.style.opacity = index === currentSliders[campingId] ? '1' : '0';
    });
    slider.querySelectorAll('.slider-dot').forEach((dot, index) => {
        dot.style.background = index === currentSliders[campingId] ? 'white' : 'rgba(255,255,255,0.5)';
    });
}

function getDirections(lat, lng, name) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
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
                <button onclick="focusOnCamping(${camping.id})" style="background: #d2691e; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">📍 Toon op kaart</button>
                <button onclick="getDirections(${camping.lat}, ${camping.lng}, '${camping.name}')" style="background: #28a745; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">🗺️ Route</button>
                <a href="http://${camping.website}" target="_blank" style="background: #6c757d; color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; font-size: 0.9rem;">🌐 Website</a>
            </div>
        `;
        container.appendChild(card);
    });
}

function focusOnCamping(campingId) {
    const camping = campings.find(c => c.id === campingId);
    if (!camping || !map) return;

    if (isLeafletMap) {
        map.setView([camping.lat, camping.lng], 12);
        const marker = markers.find(m => m.getLatLng && 
            m.getLatLng().lat === camping.lat && m.getLatLng().lng === camping.lng);
        if (marker) {
            marker.openPopup();
        }
    } else {
        map.setCenter({ lat: camping.lat, lng: camping.lng });
        map.setZoom(12);
        const marker = markers.find(m => m.getTitle && m.getTitle() === camping.name);
        if (marker) {
            google.maps.event.trigger(marker, 'click');
        }
    }
    
    document.querySelector('.map-container').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
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
    const selectedFireBan = document.getElementById('fireBanFilter').value;

    filteredCampings = campings.filter(camping => {
        const matchesSearch = camping.name.toLowerCase().includes(searchTerm) ||
                            camping.city.toLowerCase().includes(searchTerm) ||
                            camping.address.toLowerCase().includes(searchTerm);
        const matchesProvince = !selectedProvince || camping.province === selectedProvince;
        const matchesFeature = !selectedFeature || camping.fireType === selectedFeature;
        const matchesWood = !selectedWood || camping.woodAvailability === selectedWood;
        
        const matchesFireBan = !selectedFireBan || 
                             (selectedFireBan === 'allow' && !camping.fireBan) ||
                             (selectedFireBan === 'ban' && camping.fireBan);

        return matchesSearch && matchesProvince && matchesFeature && matchesWood && matchesFireBan;
    });

    updateMarkers();
    updateStats();
    updateCampingList();
}

function updateStats() {
    document.getElementById('totalCampings').textContent = filteredCampings.length;
    const provinces = new Set(filteredCampings.map(c => c.province));
    document.getElementById('totalProvinces').textContent = provinces.size;
}

function openModal() {
    document.getElementById('addCampingModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('addCampingModal').style.display = 'none';
}

function initEventListeners() {
    document.getElementById('searchInput').addEventListener('input', filterCampings);
    document.getElementById('provinceFilter').addEventListener('change', filterCampings);
    document.getElementById('featureFilter').addEventListener('change', filterCampings);
    document.getElementById('woodFilter').addEventListener('change', filterCampings);
    document.getElementById('fireBanFilter').addEventListener('change', filterCampings);

    window.onclick = function(event) {
        const modal = document.getElementById('addCampingModal');
        if (event.target === modal) closeModal();
    };

    document.getElementById('addCampingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Bedankt! Je camping is toegevoegd voor goedkeuring.');
        closeModal();
    });
}

// Global functions
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.goToSlide = goToSlide;
window.openModal = openModal;
window.closeModal = closeModal;
window.getDirections = getDirections;
window.focusOnCamping = focusOnCamping;
window.initMap = function() { console.log('Google Maps callback ready'); };
