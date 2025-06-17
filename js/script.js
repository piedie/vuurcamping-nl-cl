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
    if (typeof google === 'undefined') {
        showMapFallback();
        return;
    }
    try {
        isLeafletMap = false;
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            center: { lat: 52.2, lng: 5.5 }
        });
        updateMarkers();
        console.log('✅ Google Maps loaded');
    } catch (error) {
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
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        
        const marker = L.marker([camping.lat, camping.lng], { icon }).addTo(map);
        marker.bindPopup(createPopupContent(camping));
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
            content: createPopupContent(camping)
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
        `<div class="photo-slide ${index === 0 ? 'active' : ''}" style="background-image: url('${photo}')"></div>`
    ).join('') : '';

    const dotsHtml = camping.photos ? camping.photos.map((_, index) => 
        `<div class="slider-dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${camping.id}, ${index})"></div>`
    ).join('') : '';

    return `
        <div style="max-width: 300px;">
            <div style="background: ${camping.fireBan ? '#dc3545' : '#d2691e'}; color: white; padding: 1rem; text-align: center; border-radius: 8px 8px 0 0;">
                <div style="width: 40px; height: 40px; background: white; border-radius: 50%; margin: 0 auto 0.5rem; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                    ${camping.fireBan ? '🚫' : '🔥'}
                </div>
                <h3 style="margin: 0; font-size: 1.1rem;">${camping.name}</h3>
                ${camping.fireBan ? '<div style="margin-top: 0.5rem; font-weight: 600;">⚠️ STOOKVERBOD ACTIEF!</div>' : ''}
            </div>
            <div style="padding: 1rem; background: white;">
                <div style="margin-bottom: 0.5rem; color: #6b6b6b;">📍 ${camping.address}</div>
                <div style="margin-bottom: 0.5rem; color: #6b6b6b;">📞 ${camping.phone}</div>
                <div style="margin-bottom: 0.5rem; color: #6b6b6b;">⭐ ${camping.rating}/5</div>
                <div style="margin: 0.75rem 0;">
                    <span style="background: ${camping.fireBan ? '#dc3545' : '#d2691e'}; color: white; padding: 0.3rem 0.6rem; border-radius: 16px; font-size: 0.8rem; margin-right: 0.5rem;">
                        🔥 ${fireTypeNames[camping.fireType]}
                    </span>
                    <span style="background: #d2691e; color: white; padding: 0.3rem 0.6rem; border-radius: 16px; font-size: 0.8rem;">
                        ${woodAvailabilityNames[camping.woodAvailability]}
                    </span>
                </div>
                <div style="font-size: 0.9rem; color: #6b6b6b; margin-bottom: 1rem;">${camping.description}</div>
                ${camping.photos && camping.photos.length > 0 ? `
                <div style="position: relative; height: 120px; background: #f8f9fa; border-radius: 8px; overflow: hidden;" id="slider-${camping.id}">
                    ${photosHtml}
                    ${camping.photos.length > 1 ? `
                        <button onclick="prevSlide(${camping.id})" style="position: absolute; left: 5px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">‹</button>
                        <button onclick="nextSlide(${camping.id})" style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">›</button>
                        <div style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); display: flex; gap: 5px;">${dotsHtml}</div>
                    ` : ''}
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

function initSlider(campingId) { currentSliders[campingId] = 0; }

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
    filteredCampings.forEach(camping => {
        const card = document.createElement('div');
        card.className = `camping-card ${camping.fireBan ? 'banned' : ''}`;
        card.innerHTML = `
            <h3>${camping.fireBan ? '🚫' : '🔥'} ${camping.name}</h3>
            <p>📍 ${camping.address}</p>
            <p>📞 ${camping.phone}</p>
            <p>${camping.description}</p>
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

    filteredCampings = campings.filter(camping => {
        const matchesSearch = camping.name.toLowerCase().includes(searchTerm) ||
                            camping.city.toLowerCase().includes(searchTerm) ||
                            camping.address.toLowerCase().includes(searchTerm);
        const matchesProvince = !selectedProvince || camping.province === selectedProvince;
        const matchesFeature = !selectedFeature || camping.fireType === selectedFeature;
        const matchesWood = !selectedWood || camping.woodAvailability === selectedWood;

        return matchesSearch && matchesProvince && matchesFeature && matchesWood;
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
window.initMap = function() { console.log('Google Maps callback ready'); };
