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
        fireType: "vuur-bij-tent",
        woodAvailability: "bepaalde-tijden",
        description: "Prachtige natuurcamping aan de rand van de Hoge Veluwe. Vuurkorven toegestaan bij elke standplaats.",
        rating: 4.5,
        fireBan: false,
        features: ["huisdieren-welkom", "kindvriendelijk", "met-stroom", "natuurgebied", "middel", "broodjes"],
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
        features: ["geen-huisdieren", "geen-kinderen", "zonder-stroom", "natuurgebied", "klein"],
        photos: [
            'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop'
        ]
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
        fireType: "dagelijks-vuur",
        woodAvailability: "dag-nacht",
        description: "Sfeercamping waar de eigenaar dagelijks een groot kampvuur maakt. Houtautomaat beschikbaar 24/7!",
        rating: 4.7,
        fireBan: false,
        features: ["huisdieren-welkom", "kindvriendelijk", "met-stroom", "zonder-stroom", "natuurgebied", "middel", "broodjes"],
        photos: [
            'https://images.unsplash.com/photo-1537565266759-d30eaf487c2a?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=200&fit=crop'
        ]
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
        fireType: "overig",
        woodAvailability: "geen",
        description: "Rustieke camping met verschillende vuuropties. Eigen hout meenemen verplicht - prachtige bosomgeving!",
        rating: 4.3,
        fireBan: false,
        features: ["huisdieren-welkom", "geen-kinderen", "zonder-stroom", "natuurgebied", "klein"],
        photos: [
            'https://images.unsplash.com/photo-1502780402662-acc01917692e?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=200&fit=crop'
        ]
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
        fireType: "vuur-bij-tent",
        woodAvailability: "bepaalde-tijden",
        description: "Gezellige familiecamping waar je bij je eigen tent een vuurkorf mag plaatsen.",
        rating: 4.4,
        fireBan: false,
        features: ["huisdieren-welkom", "kindvriendelijk", "met-stroom", "nabij-stad", "groot", "broodjes"],
        photos: [
            'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=200&fit=crop'
        ]
    },
    {
        id: 6,
        name: "De Wildhoeve",
        province: "Friesland",
        city: "Heerenveen",
        address: "Wildpark 8, 8441 PV Heerenveen",
        lat: 52.9594,
        lng: 5.9158,
        website: "www.dewildhoeve.nl",
        phone: "0513-654987",
        fireType: "centrale-vuurplaats",
        woodAvailability: "bepaalde-tijden",
        description: "Rustige boerderijcamping met authentieke sfeer. Grote vuurplaats midden op het terrein voor gezellige avonden.",
        rating: 4.6,
        fireBan: false,
        features: ["huisdieren-welkom", "kindvriendelijk", "zonder-stroom", "natuurgebied", "klein", "broodjes"],
        photos: [
            'https://images.unsplash.com/photo-1486022662526-aa4d5c2c4421?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1605538883669-825200433431?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1564415315949-7a0c4c73aeca?w=400&h=200&fit=crop'
        ]
    },
    {
        id: 7,
        name: "Strandcamping Zeezicht",
        province: "Zeeland",
        city: "Domburg",
        address: "Duinweg 45, 4357 AZ Domburg",
        lat: 51.5622,
        lng: 3.4950,
        website: "www.zeezichtdomburg.nl",
        phone: "0118-987321",
        fireType: "vuur-bij-tent",
        woodAvailability: "dag-nacht",
        description: "Direct aan het strand gelegen camping. Vuurkorven toegestaan op het strand bij laag water!",
        fireBan: true,
        features: ["huisdieren-welkom", "kindvriendelijk", "met-stroom", "zonder-stroom", "nabij-stad", "groot", "broodjes"],
        photos: [
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=200&fit=crop'
        ]
    },
    {
        id: 8,
        name: "Bergcamping Veluwe",
        province: "Gelderland",
        city: "Apeldoorn",
        address: "Bergweg 23, 7315 JK Apeldoorn",
        lat: 52.2112,
        lng: 5.9699,
        website: "www.bergcampingveluwe.nl",
        phone: "055-789456",
        fireType: "dagelijks-vuur",
        woodAvailability: "gratis",
        description: "Heuvelachtige camping in het hart van de Veluwe. Elke avond om 20:00 groot kampvuur met verhalen.",
        rating: 4.2,
        fireBan: false,
        features: ["geen-huisdieren", "kindvriendelijk", "met-stroom", "natuurgebied", "middel"],
        photos: [
            'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=200&fit=crop'
        ]
    },
    {
        id: 9,
        name: "Camping Polderland",
        province: "Flevoland",
        city: "Lelystad",
        address: "Polderstraat 156, 8219 PH Lelystad",
        lat: 52.5084,
        lng: 5.4696,
        website: "www.polderland.nl",
        phone: "0320-456789",
        fireType: "overig",
        woodAvailability: "bepaalde-tijden",
        description: "Moderne camping in het nieuwe land. Vuurschalen beschikbaar bij receptie, BBQ altijd toegestaan.",
        rating: 4.1,
        fireBan: false,
        features: ["huisdieren-welkom", "kindvriendelijk", "met-stroom", "nabij-stad", "groot", "broodjes"],
        photos: [
            'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop'
        ]
    },
    {
        id: 10,
        name: "De Groene Weide",
        province: "Utrecht",
        city: "Baarn",
        address: "Weidebaan 78, 3743 KN Baarn",
        lat: 52.2112,
        lng: 5.2877,
        website: "www.groeneweide.nl",
        phone: "035-123789",
        fireType: "centrale-vuurplaats",
        woodAvailability: "gratis",
        description: "Kleinschalige camping met grote wei. Centrale vuurkuil waar iedereen welkom is. Gratis hout uit eigen bos.",
        rating: 4.5,
        fireBan: false,
        features: ["huisdieren-welkom", "kindvriendelijk", "zonder-stroom", "natuurgebied", "klein"],
        photos: [
            'https://images.unsplash.com/photo-1537565266759-d30eaf487c2a?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=200&fit=crop'
        ]
    },
    {
        id: 11,
        name: "Noordzee Camping",
        province: "Noord-Holland",
        city: "Bergen aan Zee",
        address: "Duinzoom 12, 1865 AG Bergen aan Zee",
        lat: 52.6647,
        lng: 4.6392,
        website: "www.noordzeecamping.nl",
        phone: "072-654321",
        fireType: "vuur-bij-tent",
        woodAvailability: "dag-nacht",
        description: "Duincamping op 300m van het strand. Vuurkorven toegestaan, automaat met aanmaakhout 24/7 beschikbaar.",
        rating: 4.7,
        fireBan: false,
        features: ["geen-huisdieren", "kindvriendelijk", "met-stroom", "nabij-stad", "middel", "broodjes"],
        photos: [
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=200&fit=crop'
        ]
    },
    {
        id: 12,
        name: "Camping De Maashof",
        province: "Limburg",
        city: "Venlo",
        address: "Maasboulevard 89, 5911 BD Venlo",
        lat: 51.3704,
        lng: 6.1724,
        website: "www.demaashof.nl",
        phone: "077-321654",
        fireType: "dagelijks-vuur",
        woodAvailability: "geen",
        description: "Camping aan de Maas met dagelijks barbecue en kampvuur. Eigen hout meenemen, prachtige rivier locatie.",
        rating: 4.0,
        fireBan: true,
        features: ["huisdieren-welkom", "geen-kinderen", "met-stroom", "nabij-stad", "middel"],
        photos: [
            'https://images.unsplash.com/photo-1502780402662-acc01917692e?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=200&fit=crop'
        ]
    },
    {
        id: 13,
        name: "Heide Camping Drenthe",
        province: "Drenthe",
        city: "Borger",
        address: "Heidepaadje 34, 9531 TG Borger",
        lat: 52.9247,
        lng: 6.7981,
        website: "www.heidecamping.nl",
        phone: "0599-987123",
        fireType: "overig",
        woodAvailability: "gratis",
        description: "Midden in de paarse heide. Verschillende vuurplaatsen verspreid over terrein. Heide-hout gratis beschikbaar.",
        rating: 4.4,
        fireBan: false,
        features: ["huisdieren-welkom", "kindvriendelijk", "zonder-stroom", "natuurgebied", "middel"],
        photos: [
            'https://images.unsplash.com/photo-1486022662526-aa4d5c2c4421?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1605538883669-825200433431?w=400&h=200&fit=crop'
        ]
    },
    {
        id: 14,
        name: "Waddenzee Camping",
        province: "Groningen",
        city: "Lauwersoog",
        address: "Strandweg 67, 9976 VS Lauwersoog",
        lat: 53.4094,
        lng: 6.2042,
        website: "www.waddenzeecamping.nl",
        phone: "0595-123456",
        fireType: "centrale-vuurplaats",
        woodAvailability: "bepaalde-tijden",
        description: "Unieke locatie aan het Wad. Grote vuurplaats met uitzicht over het water. Hout verkrijgbaar tot 18:00.",
        rating: 4.3,
        fireBan: false,
        features: ["geen-huisdieren", "geen-kinderen", "zonder-stroom", "natuurgebied", "klein"],
        photos: [
            'https://images.unsplash.com/photo-1564415315949-7a0c4c73aeca?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=200&fit=crop'
        ]
    },
    {
        id: 15,
        name: "De Brabantse Hoeve",
        province: "Noord-Brabant",
        city: "Eindhoven",
        address: "Hoefblad 45, 5644 KL Eindhoven",
        lat: 51.4416,
        lng: 5.4697,
        website: "www.brabantsehoeve.nl",
        phone: "040-789123",
        fireType: "vuur-bij-tent",
        woodAvailability: "dag-nacht",
        description: "Authentieke boerderijcamping met eigen bos. Vuurkorven bij elke plek, houtkloofmachine beschikbaar.",
        rating: 4.6,
        fireBan: false,
        features: ["huisdieren-welkom", "kindvriendelijk", "met-stroom", "zonder-stroom", "nabij-stad", "groot", "broodjes"],
        photos: [
            'https://images.unsplash.com/photo-1537565266759-d30eaf487c2a?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400&h=200&fit=crop',
            'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400&h=200&fit=crop'
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

const featureNames = {
    'huisdieren-welkom': '🐕 Huisdieren welkom',
    'geen-huisdieren': '🚫 Geen huisdieren',
    'kindvriendelijk': '👨‍👩‍👧‍👦 Kindvriendelijk',
    'geen-kinderen': '🔞 Geen kinderen',
    'met-stroom': '⚡ Plekken met stroom',
    'zonder-stroom': '🌿 Plekken zonder stroom',
    'natuurgebied': '🏞️ In natuurgebied',
    'nabij-stad': '🏙️ Nabij stad',
    'klein': '🏕️ Minder dan 25 plaatsen',
    'middel': '🏕️ 25-50 plaatsen',
    'groot': '🏕️ Meer dan 50 plaatsen',
    'broodjes': '🥖 Broodjes verkrijgbaar'
};
