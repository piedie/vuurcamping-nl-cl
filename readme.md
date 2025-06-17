# 🔥 VuurCamping.nl

**Vind campings waar je een gezellig vuurtje mag maken**

Een overzichtelijke website voor kampeerders die op zoek zijn naar campings in Nederland waar vuurkorven, kampvuren of andere vuuropties toegestaan zijn.

## ✨ Features

- 🗺️ **Interactieve Google Maps** met camping locaties
- 🔍 **Geavanceerd zoeken** op naam, plaats, provincie en kenmerken
- 📸 **Foto slideshow** in elke camping popup
- 🚫 **Stookverbod waarschuwingen** real-time
- 📱 **Responsive design** voor mobiel en desktop
- 🎨 **Scandinavische warme uitstraling**

## 🏕️ Vuurmogelijkheden

- **Vuur(korf) bij je tent** - Eigen vuurkorf bij standplaats
- **Centrale vuurplaats** - Gedeelde vuurplaats voor alle gasten  
- **Dagelijks vuur door campingeigenaar** - Georganiseerde kampvuren
- **Overig** - Diverse andere vuuropties

## 🪵 Hout beschikbaarheid

- Hout dag en nacht verkrijgbaar
- Hout op bepaalde tijden verkrijgbaar  
- Gratis hout beschikbaar
- Geen hout verkrijgbaar (eigen meenemen)

## 🚀 Quick Start

### 1. Repository clonen
```bash
git clone https://github.com/jouwusername/vuurcamping-nl.git
cd vuurcamping-nl
```

### 2. Google Maps API Key instellen
1. Ga naar [Google Cloud Console](https://console.cloud.google.com)
2. Maak een nieuw project of selecteer bestaand project
3. Schakel de **Maps JavaScript API** in
4. Maak een API key aan
5. Vervang `YOUR_API_KEY` in `index.html` met je echte key:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=JOUW_API_KEY&callback=initMap" async defer></script>
```

### 3. Deployment naar Netlify

#### Via GitHub (aanbevolen):
1. Push naar GitHub repository
2. Ga naar [netlify.com](https://netlify.com)
3. Klik "New site from Git"
4. Selecteer je GitHub repository
5. Deploy settings:
   - **Build command**: (leeg laten)
   - **Publish directory**: `/` (root)
6. Klik "Deploy site"

#### Via drag & drop:
1. Upload alle bestanden naar Netlify via drag & drop
2. Site is direct live!

## 📁 Bestandenstructuur

```
vuurcamping-nl/
├── index.html              # Hoofdpagina
├── css/
│   └── style.css           # Alle styling
├── js/
│   ├── campings.js         # Camping data & API simulatie
│   └── script.js           # Hoofdlogica & Google Maps
├── images/                 # (Voor later: camping foto's)
└── README.md              # Deze documentatie
```

## 🔧 Development

### Local development
Open `index.html` in je browser. Voor HTTPS (nodig voor Google Maps):
```bash
# Met Python
python -m http.server 8000

# Met Node.js
npx serve .

# Of gebruik VS Code Live Server extensie
```

### Environment Variables
Voor productie met eigen API keys:
```javascript
// In js/config.js (niet in git)
const CONFIG = {
    GOOGLE_MAPS_API_KEY: 'jouw_google_maps_key',
    API_BASE_URL: 'https://api.vuurcamping.nl'
};
```

## 🗄️ Backend (toekomst)

De huidige versie gebruikt statische data. Voor productie implementeren:

### Database Schema
```sql
-- Campings tabel
CREATE TABLE campings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    province VARCHAR(100) NOT NULL,
    fire_type ENUM('vuur-bij-tent', 'centrale-vuurplaats', 'dagelijks-vuur', 'overig'),
    wood_availability ENUM('dag-nacht', 'bepaalde-tijden', 'gratis', 'geen'),
    description TEXT,
    rating DECIMAL(2,1) DEFAULT 0,
    fire_ban BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Foto's tabel
CREATE TABLE camping_photos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    camping_id INT REFERENCES campings(id),
    photo_url VARCHAR(500) NOT NULL,
    photo_order INT DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints
```javascript
// RESTful API design
GET    /api/campings                    # Alle campings
GET    /api/campings/:id               # Specifieke camping
POST   /api/campings                   # Nieuwe camping (voor goedkeuring)
PUT    /api/campings/:id               # Update camping (admin)
DELETE /api/campings/:id               # Verwijder camping (admin)

GET    /api/campings/:id/photos        # Camping foto's
POST   /api/campings/:id/photos        # Upload foto (admin)
DELETE /api/photos/:id                 # Verwijder foto (admin)

GET    /api/fire-bans                  # Actuele stookverboden
POST   /api/fire-bans                  # Update stookverbod (admin)
```

## 🌐 Hosting Migratie naar Strato

### Van Netlify naar Strato:
1. **Download** je Netlify site bestanden
2. **FTP upload** naar Strato webhosting
3. **Database setup** op Strato MySQL
4. **Domain configuratie** vuurcamping.nl
5. **SSL certificaat** instellen
6. **Backend implementatie** (PHP/MySQL of Node.js)

### Strato specifieke setup:
```bash
# .htaccess voor clean URLs
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]

# HTTPS redirect
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## 🔄 Data Updates

### Fire Ban Integration
Integreer met officiële bronnen:
```javascript
// Voorbeeld integratie KNMI/overheid API
async function updateFireBans() {
    try {
        const response = await fetch('https://api.knmi.nl/fire-warnings/v1');
        const data = await response.json();
        
        // Update campings op basis van provinciale verboden
        campings.forEach(camping => {
            camping.fireBan = data.provinces[camping.province]?.fireBan || false;
        });
        
        updateMarkers();
        updateCampingList();
    } catch (error) {
        console.error('Fire ban update failed:', error);
    }
}

// Check elke 30 minuten
setInterval(updateFireBans, 30 * 60 * 1000);
```

## 📊 Analytics & SEO

### Google Analytics
Voeg toe aan `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### SEO Optimalisatie
```html
<!-- Meta tags in <head> -->
<meta name="description" content="Vind campings in Nederland waar vuurkorven en kampvuren toegestaan zijn. Met kaart, foto's en actuele stookverboden.">
<meta name="keywords" content="camping, vuurkorf, kampvuur, nederland, stookverbod, natuurkamping">
<meta property="og:title" content="VuurCamping.nl - Campings waar vuur maken mag">
<meta property="og:description" content="Ontdek campings waar je een gezellig vuurtje mag maken">
<meta property="og:image" content="https://vuurcamping.nl/images/og-image.jpg">
<meta property="og:url" content="https://vuurcamping.nl">
<meta name="twitter:card" content="summary_large_image">

<!-- Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "VuurCamping.nl",
  "url": "https://vuurcamping.nl",
  "description": "Vind campings waar vuur maken is toegestaan"
}
</script>
```

## 🔒 Security Considerations

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://maps.googleapis.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https://*.googleapis.com https://*.gstatic.com https://images.unsplash.com;
    connect-src 'self' https://maps.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
">
```

### API Rate Limiting
```javascript
// Voor backend API calls
const API_RATE_LIMIT = {
    requests: 100,
    window: 900000, // 15 minuten
    cleanup: 3600000 // 1 uur
};
```

## 📱 Progressive Web App (PWA)

### Service Worker voor offline functionaliteit:
```javascript
// sw.js
const CACHE_NAME = 'vuurcamping-v1';
const urlsToCache = [
    '/',
    '/css/style.css',
    '/js/script.js',
    '/js/campings.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});
```

### Manifest.json:
```json
{
    "name": "VuurCamping.nl",
    "short_name": "VuurCamping",
    "description": "Vind campings waar vuur maken mag",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#f7f5f3",
    "theme_color": "#8b4513",
    "icons": [
        {
            "src": "/images/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/images/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

## 🤝 Contributing

1. **Fork** het project
2. **Maak een feature branch** (`git checkout -b feature/nieuwe-functie`)
3. **Commit** je wijzigingen (`git commit -am 'Voeg nieuwe functie toe'`)
4. **Push** naar de branch (`git push origin feature/nieuwe-functie`)
5. **Open een Pull Request**

### Code Style
- Gebruik **Nederlands** voor comments en variabelen waar mogelijk
- **2 spaties** voor indentation
- **ESLint** configuratie volgen
- **Semantische commit messages**

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/jouwusername/vuurcamping-nl/issues)
- **Email**: info@vuurcamping.nl
- **Website**: [vuurcamping.nl](https://vuurcamping.nl)

## 📄 License

MIT License - zie [LICENSE](LICENSE) bestand voor details.

## 🙏 Credits

- **Kaarten**: Google Maps API
- **Foto's**: Unsplash.com (voorbeeldfoto's)
- **Icons**: Unicode Emoji
- **Hosting**: Netlify (development), Strato (productie)

## 🗓️ Roadmap

### v1.0 (Huidige versie)
- ✅ Basis kaart functionaliteit
- ✅ Foto slideshow in popups
- ✅ Responsive design
- ✅ Stookverbod waarschuwingen

### v1.1 (Volgende release)
- 🔄 Backend API implementatie
- 🔄 Admin panel voor camping beheer
- 🔄 User reviews en ratings
- 🔄 Email notificaties bij nieuwe campings

### v2.0 (Toekomst)
- 📅 Beschikbaarheid kalender
- 🏕️ Reserveringssysteem
- 📊 Analytics dashboard
- 🌍 Uitbreiding naar België/Duitsland

---

**Happy camping! 🏕️🔥**