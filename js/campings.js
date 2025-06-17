// VuurCamping.nl - Camping Data
// Deze data wordt later vervangen door database calls

const campings = [
    {
        id: 1,
        name: "Camping De Bosrand",
        province: "Gelderland",
        city: "Otterlo",
        address: "Bosweg 12, 6731 AA Otterlo",
        lat: 52.1075,
        lng: 5.7969,
        website: "www.campingdebosrand.nl",
        phone: "055-1234567",
        email: "info@campingdebosrand.nl",
        fireType: "vuur-bij-tent",
        woodAvailability: "bepaalde-tijden",
        description: "Prachtige natuurcamping aan de rand van de Hoge Veluwe. Vuurkorven zijn toegestaan bij elke standplaats. Hout verkrijgbaar bij receptie tussen 9:00-18:00.",
        rating: 4.5,
        fireBan: false,
        photos: [
            'https://images.unsplash.com/photo-1502780402662-acc01917692e?w=400&h=200&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=200&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1486022662526-aa4d5c2c4421?w=400&h=200&fit=crop&auto=format'
        ],
        amenities: ['toilet', 'douche', 'speeltuin'],
        openingHours: {
            reception: "10:00-17:00",
            gates: "8:00-20:00"
        },
        priceRange: "€12-20 per nacht",
        lastUpdated: "2024-06-18"
    },
    {
        id: 5,
        name: "Camping Kampvuurzomer",
        province: "Zuid-Holland",
        city: "Gouda",
        address: "Polderweg 22, 2800 BB Gouda",
        lat: 52.0175,
        lng: 4.7073,
        website: "www.kampvuurzomer.nl",
        phone: "0182-654321",
        email: "info@kampvuurzomer.nl",
        fireType: "vuur-bij-tent",
        woodAvailability: "bepaalde-tijden",
        description: "Gezellige familiecamping waar je bij je eigen tent een vuurkorf mag plaatsen. Perfect voor intieme avonden rond het vuur. Hout verkrijgbaar in de campingwinkel.",
        rating: 4.4,
        fireBan: false,
        photos: [
            'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=200&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400&h=200&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=200&fit=crop&auto=format'
        ],
        amenities: ['toilet', 'douche', 'winkel', 'wifi', 'restaurant'],
        openingHours: {
            reception: "8:00-20:00",
            gates: "7:00-22:00"
        },
        priceRange: "€16-24 per nacht",
        lastUpdated: "2024-06-18"
    }
];

// Fire type en wood availability mappings voor display
const fireTypeNames = {
    'vuur-bij-tent': 'Vuur(korf) bij je tent',
    'centrale-vuurplaats': 'Centrale vuurplaats',
    'dagelijks-vuur': 'Dagelijks vuur door campingeigenaar',
    'overig': 'Overige vuuropties'
};

const woodAvailabilityNames = {
    'dag-nacht': '🪵 Hout dag en nacht verkrijgbaar',
    'bepaalde-tijden': '🪵 Hout op bepaalde tijden verkrijgbaar',
    'gratis': '🪵 Gratis hout beschikbaar',
    'geen': '❌ Geen hout verkrijgbaar'
};

// API simulation functions - later vervangen door echte API calls
const API = {
    // Haal alle campings op
    getCampings: () => {
        return Promise.resolve(campings);
    },
    
    // Haal camping op by ID
    getCamping: (id) => {
        const camping = campings.find(c => c.id === parseInt(id));
        return Promise.resolve(camping);
    },
    
    // Voeg nieuwe camping toe (simulatie)
    addCamping: (campingData) => {
        const newCamping = {
            id: Math.max(...campings.map(c => c.id)) + 1,
            ...campingData,
            rating: 0,
            fireBan: false,
            photos: [],
            amenities: [],
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        // In echte app: POST naar backend
        console.log('Nieuwe camping zou worden toegevoegd:', newCamping);
        return Promise.resolve(newCamping);
    },
    
    // Check fire bans (simulatie - later van overheid API)
    getFireBans: () => {
        // Simuleer data van overheids-API
        const fireBans = {
            'Noord-Brabant': true, // Voorbeeldverbod
            'Gelderland': false,
            'Overijssel': false,
            'Drenthe': false,
            'Zuid-Holland': false
        };
        return Promise.resolve(fireBans);
    },
    
    // Update fire ban status voor camping
    updateFireBan: (campingId, banned) => {
        const camping = campings.find(c => c.id === campingId);
        if (camping) {
            camping.fireBan = banned;
            camping.lastUpdated = new Date().toISOString().split('T')[0];
        }
        return Promise.resolve(camping);
    }
};

// Export voor gebruik in andere bestanden
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { campings, fireTypeNames, woodAvailabilityNames, API };
}1504851149312-7a075b496cc7?w=400&h=200&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=400&h=200&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1534880606858-29b0e8a24e8d?w=400&h=200&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=200&fit=crop&auto=format'
        ],
        amenities: ['toilet', 'douche', 'speeltuin', 'wifi'],
        openingHours: {
            reception: "9:00-18:00",
            gates: "24/7"
        },
        priceRange: "€15-25 per nacht",
        lastUpdated: "2024-06-18"
    },
    {
        id: 2,
        name: "Natuurkamping Het Bos",
        province: "Noord-Brabant",
        city: "Tilburg",
        address: "Natuurlaan 5, 5000 AB Tilburg",
        lat: 51.5555,
        lng: 5.0913,
        website: "www.natuurkampinghetbos.nl",
        phone: "013-9876543",
        email: "contact@natuurkampinghetbos.nl",
        fireType: "centrale-vuurplaats",
        woodAvailability: "gratis",
        description: "Kleinschalige camping met grote centrale vuurplaats waar iedereen samen kan genieten van het vuur. Gratis hout beschikbaar bij de receptie!",
        rating: 4.8,
        fireBan: true, // Tijdelijk stookverbod actief
        photos: [
            'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?w=400&h=200&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop&auto=format'
        ],
        amenities: ['toilet', 'douche', 'restaurant', 'winkel'],
        openingHours: {
            reception: "8:00-20:00",
            gates: "7:00-22:00"
        },
        priceRange: "€18-28 per nacht",
        lastUpdated: "2024-06-18"
    },
    {
        id: 3,
        name: "Camping Vuurgloed",
        province: "Overijssel",
        city: "Ommen",
        address: "Vuurweg 15, 7731 XY Ommen",
        lat: 52.5167,
        lng: 6.4167,
        website: "www.campingvuurgloed.nl",
        phone: "0529-123456",
        email: "info@campingvuurgloed.nl",
        fireType: "dagelijks-vuur",
        woodAvailability: "dag-nacht",
        description: "Sfeercamping waar de eigenaar dagelijks een groot kampvuur maakt met verhalen en marshmallows. Houtautomaat beschikbaar 24/7!",
        rating: 4.7,
        fireBan: false,
        photos: [
            'https://images.unsplash.com/photo-1537565266759-d30eaf487c2a?w=400&h=200&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=200&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=200&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1564415315949-7a0c4c73aeca?w=400&h=200&fit=crop&auto=format'
        ],
        amenities: ['toilet', 'douche', 'speeltuin', 'wifi', 'zwembad'],
        openingHours: {
            reception: "9:00-19:00",
            gates: "24/7"
        },
        priceRange: "€20-30 per nacht",
        lastUpdated: "2024-06-18"
    },
    {
        id: 4,
        name: "Boscamping De Vlam",
        province: "Drenthe",
        city: "Assen",
        address: "Bospad 8, 9400 CD Assen",
        lat: 53.0031,
        lng: 6.5619,
        website: "www.boscampingdevlam.nl",
        phone: "0592-987654",
        email: "info@boscampingdevlam.nl",
        fireType: "overig",
        woodAvailability: "geen",
        description: "Rustieke camping met verschillende vuuropties. Eigen hout meenemen verplicht - prachtige bosomgeving om te zoeken naar geschikt hout!",
        rating: 4.3,
        fireBan: false,
        photos: [
            'https://images.unsplash.com/photo-
