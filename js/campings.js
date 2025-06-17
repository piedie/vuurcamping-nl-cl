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
        description: "Prachtige natuurcamping aan de rand van de Hoge Veluwe. Vuurkorven toegestaan bij elke standplaats.",
        rating: 4.5,
        fireBan: false,
        photos: [
            'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1534880606858-29b0e8a24e8d?w=400&h=200&fit=crop'
        ]
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
        fireType: "centrale-vuurplaats",
        woodAvailability: "gratis",
        description: "Kleinschalige camping met grote centrale vuurplaats. Gratis hout beschikbaar!",
        rating: 4.8,
        fireBan: true,
        photos: [
            'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop'
        ]
    }
];

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
