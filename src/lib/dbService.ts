import dbConnect from './dbConnect';
import User from '@/models/User';
import Complaint from '@/models/Complaint';
import News from '@/models/News';
import Event from '@/models/Event';
import Location from '@/models/Location';
import Team from '@/models/Team';

// ==========================================
// RICH SEED/MOCK DATA FOR OFFLINE FALLBACK
// ==========================================

let mockComplaints = [
  {
    _id: 'c1',
    complaintId: 'BAL-58291',
    name: 'Asim Ahmed',
    email: 'asim.ahmed@example.com',
    phone: '0333-1234567',
    category: 'Sewerage & Drainage',
    priority: 'high',
    description: 'Main sewerage pipe has burst, flooding the entire street near the Quetta Public School. Heavy smell and public health hazard.',
    district: 'Quetta',
    city: 'Quetta',
    area: 'Samungli Road',
    coordinates: { lat: 30.1984, lng: 66.9904 },
    images: ['https://images.unsplash.com/photo-1595844737382-7e0404c084bd?auto=format&fit=crop&q=80&w=800'],
    status: 'resolved',
    assignedTo: 'Quetta Metropolitan Corporation (QMC)',
    notes: [
      { text: 'Complaint received and categorized as High Priority.', author: 'System Dispatch', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
      { text: 'Dispatched maintenance team to evaluate Samungli Road pipe.', author: 'QMC Supervisor', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { text: 'Repair crew has replaced the damaged 12-inch drainage line. Street cleanup completed.', author: 'QMC Field Team', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
    ],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'c2',
    complaintId: 'BAL-93210',
    name: 'Zarak Baloch',
    email: 'zarak.b@example.com',
    phone: '0300-9876543',
    category: 'Electricity Outage',
    priority: 'urgent',
    description: 'Unannounced load shedding of over 16 hours daily. Voltage fluctuations are destroying household appliances.',
    district: 'Khuzdar',
    city: 'Khuzdar',
    area: 'Jinnah Colony',
    coordinates: { lat: 27.8119, lng: 66.6042 },
    images: ['https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&q=80&w=800'],
    status: 'in_progress',
    assignedTo: 'Quetta Electric Supply Company (QESCO)',
    notes: [
      { text: 'Urgent ticket opened. Notified QESCO dispatch center.', author: 'Helpdesk Officer', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { text: 'Technicians assigned to inspect the local grid station transformer.', author: 'QESCO Engineer', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'c3',
    complaintId: 'BAL-42819',
    name: 'Yasmeen Bibi',
    email: 'yasmeen.gwadar@example.com',
    phone: '0312-3456789',
    category: 'Road Damage',
    priority: 'medium',
    description: 'Large potholes on the Marine Drive highway near Gwadar Port. Threatens road safety for cars and trucks.',
    district: 'Gwadar',
    city: 'Gwadar',
    area: 'Marine Drive',
    coordinates: { lat: 25.1216, lng: 62.3254 },
    images: ['https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=800'],
    status: 'under_review',
    assignedTo: 'Gwadar Development Authority (GDA)',
    notes: [
      { text: 'Registered and pending officer review.', author: 'System Dispatch', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
    ],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'c4',
    complaintId: 'BAL-12093',
    name: 'Sardar Khan',
    email: 'citizen@balochistan.gov.pk',
    phone: '0321-4445555',
    category: 'Water Supply',
    priority: 'high',
    description: 'Water has not been supplied to Area-B in Ziarat for the past 6 days. Main supply pipeline seems blocked.',
    district: 'Ziarat',
    city: 'Ziarat',
    area: 'Area-B, Juniper Valley',
    coordinates: { lat: 30.3804, lng: 67.7247 },
    images: [],
    status: 'submitted',
    assignedTo: 'Public Health Engineering (PHE) Balochistan',
    notes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

let mockNews = [
  {
    _id: 'n1',
    title: 'Government Announces Gwadar Development Package',
    slug: 'gwadar-development-package-2026',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800',
    content: 'The Government of Balochistan has unveiled a multi-billion rupee developmental package for Gwadar. The initiatives target clean drinking water plants, solar electricity grids for rural fishermen, deep port expansions, and improved high school facilities. Chief Minister Mir Sarfraz Bugti stated that the package will transform Gwadar into a global maritime trade hub while ensuring basic human amenities for the local population first.',
    category: 'Development',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'n2',
    title: 'Balochistan Tourism Festival Starts Next Week in Ziarat',
    slug: 'balochistan-tourism-festival-ziarat',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    content: 'Prepare to explore the scenic juniper valleys of Ziarat! The Annual Balochistan Cultural & Tourism Festival is set to kick off. The 5-day event will feature local embroidery displays, Balochi and Pashtun traditional dances (Attan, Lewa), camel rides, traditional food stalls (Sajji, Khaddi Kebab), and music concerts by local legends. Security and lodging facilities have been upgraded to welcome local and international travelers.',
    category: 'Tourism',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'n3',
    title: 'Digital Complaint Portal Balochistan Connect Launched',
    slug: 'digital-complaint-portal-launched',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    content: 'In line with the vision of digitalizing public administration, the IT Department of Balochistan has launched "Balochistan Connect". Citizens can now lodge civic complaints ranging from sewage and water blockages to power outages directly. The portal features automated tracking, SMS notifications, and an administrative dashboard for direct accountability of municipal and divisional officers.',
    category: 'Announcement',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'n4',
    title: 'Chief Minister Approves Solarization of 30,000 Tube Wells',
    slug: 'solarization-of-30000-tube-wells-balochistan',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800',
    content: 'To tackle the ongoing electricity crisis and support agricultural development, the Balochistan Cabinet has approved a major initiative to convert over 30,000 agricultural tube wells to solar energy. The project, funded jointly by the federal and provincial governments, aims to reduce QESCO load requirements and ensure a steady supply of irrigation water to local farmers across Quetta, Khuzdar, and Mastung.',
    category: 'Development',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'n5',
    title: 'New Marine Conservation Initiative Launched for Astola Island',
    slug: 'astola-island-marine-conservation-initiative',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800',
    content: 'The Wildlife Department, in collaboration with international ecological bodies, has launched a comprehensive marine protection program for Astola Island. The initiative will strictly monitor illegal fishing trawlers, establish turtle nesting protection zones, and train Gwadar fishers in eco-friendly tourism operations. Astola was declared Pakistan’s first Marine Protected Area in 2017.',
    category: 'Community',
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'n6',
    title: 'IT Board Announces Youth Skills Development Program 2026',
    slug: 'youth-skills-development-program-2026',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    content: 'The Information Technology Board of Balochistan has launched a free youth training initiative targeting 10,000 students across the province. The curriculum features courses in web development, graphic design, content writing, and digital marketing. Local IT centers in Quetta, Loralai, Turbat, and Lasbela will host physical workshops with remote mentorship by industry leaders.',
    category: 'Announcement',
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'n7',
    title: 'Government Plans Eco-Resort and Trails at Hingol National Park',
    slug: 'hingol-national-park-eco-resort-trails',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    content: 'The Tourism Development Corporation of Balochistan (TDCB) has finalized plans for eco-friendly hiking trails, camping spots, and info centers inside Hingol National Park near Kund Malir. The project aims to accommodate the growing volume of local tourists visiting the Buzi Pass canyons while protecting the national park’s endangered wildlife including the Sindh Ibex and Balochistan Urial.',
    category: 'Development',
    publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'n8',
    title: 'Master Saffron Farming Project Expansion in Mastung District',
    slug: 'saffron-farming-project-expansion-mastung',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    content: 'Mastung farmers have successfully harvested high-grade saffron as part of an agricultural pilot program. Due to the high commercial value of saffron, the Agriculture Extension Department has announced subsidies on premium bulbs, soil testing, and modern drip irrigation kits for farmers in Kalat, Mastung, and Ziarat. Saffron cultivation is seen as a lucrative alternative to water-intensive traditional orchards.',
    category: 'Community',
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  }
];

let mockEvents = [
  {
    _id: 'e1',
    title: 'Ziarat Juniper Valley Hiking and Eco-Concert',
    description: 'Join local environmentalists for a guided trail hike through the ancient Juniper forests of Ziarat. Learn about forest conservation followed by a traditional acoustic campfire concert featuring regional folk artists.',
    location: 'Juniper Forest Reserve, Ziarat Valley',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=800',
    registrations: [
      { name: 'Ali Khan', email: 'ali@example.com', phone: '0322-1112223', registeredAt: new Date() }
    ],
  },
  {
    _id: 'e2',
    title: 'Gwadar Coastal Maritime Expo 2026',
    description: 'An international shipping and blue economy expo. Explore booths from leading logistics companies, traditional dhow-building workshops, and marine biology seminars detailing the biodiversity of Astola Island.',
    location: 'Gwadar Port Auditorium, Marine Drive, Gwadar',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1541417901776-46654b428d80?auto=format&fit=crop&q=80&w=800',
    registrations: [],
  },
  {
    _id: 'e3',
    title: 'Quetta Cultural Craft & Sajji Mela',
    description: 'Discover the rich heritage of Balochistan. Exhibiting handmade Balochi rugs, exquisite leather crafts, and Quetta special Sajji tasting competitions. Admission is free for families.',
    location: 'Askari Park Exhibition Grounds, Quetta',
    date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800',
    registrations: [],
  }
];

let mockLocations = [
  {
    _id: 'l1',
    title: 'Kund Malir Beach & Princess of Hope',
    district: 'Lasbela',
    coordinates: { lat: 25.3941, lng: 65.4593 },
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Kund Malir is a breathtaking golden sand beach located in Hingol National Park. The road trip along the Makran Coastal Highway is ranked among the most beautiful routes in the region. Nearby stands the "Princess of Hope", a natural rock formation carved by strong coastal winds that resembles a silhouetted royalty.',
    category: 'Coastal Point',
    attractions: ['Makran Coastal Highway Scenic Drive', 'Princess of Hope Rock Structure', 'Golden Sand Beach Swims', 'Hingol Mud Volcanoes'],
    directions: 'Take the Makran Coastal Highway from Karachi towards Gwadar. Kund Malir is located approximately 240km (around 4 hours drive) from Karachi.',
    nearbyPlaces: ['Hingol National Park Reserve', 'Nani Mandir (Hindu Heritage Site)', 'Buzi Pass Canyons'],
  },
  {
    _id: 'l2',
    title: 'Quaid-e-Azam Residency, Ziarat',
    district: 'Ziarat',
    coordinates: { lat: 30.3804, lng: 67.7247 },
    images: [
      'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Constructed in 1892, the Quaid-e-Azam Residency is a wooden heritage building where the founding father of Pakistan, Muhammad Ali Jinnah, spent his final days. Surrounded by lush green lawns and a dense forest of ancient Juniper trees, this monument stands as a historic treasure and a popular hill-station destination.',
    category: 'Historical Place',
    attractions: ['Historical Wooden Architecture Museum', 'Juniper Forest Trails', 'Lush Gardens', 'Scenic Valley Overlooks'],
    directions: 'Located in Ziarat Valley, which is approximately 120km north-east of Quetta (approx. 2.5 hours drive via the Loralai Road).',
    nearbyPlaces: ['Ziarat Cherry Orchards', 'Prospect Point (Panoramic Valley Views)', 'Sandeman Tangi Waterfall'],
  },
  {
    _id: 'l3',
    title: 'Hanna Lake',
    district: 'Quetta',
    coordinates: { lat: 30.2547, lng: 67.1121 },
    images: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1433832597046-4f10e10ac764?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Hanna Lake is a picturesque water reservoir built during the British era in 1894. Nestled amidst towering, arid mountains just on the outskirts of Quetta, the lake offers a beautiful contrast of emerald green waters against rocky hills. It is a favorite picnic spot for families.',
    category: 'Natural Attraction',
    attractions: ['Boating & Water Sports', 'Lakeside Walking Trails', 'Pine Tree Picnic Areas', 'Traditional Food Stands'],
    directions: 'Located just 10km north-east of Quetta city center, easily accessible via Hanna Road in 20 minutes.',
    nearbyPlaces: ['Urak Valley Fruit Orchards', 'Askari Park Quetta', 'Hayat Durrani Water Sports Center'],
  },
  {
    _id: 'l4',
    title: 'Astola Island (Island of Seven Hills)',
    district: 'Gwadar',
    coordinates: { lat: 25.1214, lng: 63.8475 },
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Astola, also known as Jezira Haft Talar, is a small uninhabited Pakistani island in the Arabian Sea. It is Pakistans first Marine Protected Area. Famous for its pristine turquoise waters, coral reefs, and sandy beaches where endangered green turtles nest.',
    category: 'Coastal Point',
    attractions: ['Scuba Diving & Coral Snorkeling', 'Deep Sea Fishing', 'Camping under the Stars', 'Green Turtle Spotting'],
    directions: 'Requires a drive to the coastal town of Pasni (approx 1.5 hours east of Gwadar), followed by a 3-hour boat ride (approx 39km) to the island.',
    nearbyPlaces: ['Pasni Coastal Town', 'Arabian Sea Marine Sanctuary'],
  },
  {
    _id: 'l5',
    title: 'Moola Chotok Oasis',
    district: 'Khuzdar',
    coordinates: { lat: 27.6897, lng: 67.1433 },
    images: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A hidden paradise tucked away in a deep ravine in Khuzdar district. Moola Chotok is a stunning water oasis featuring multiple crystal-clear freshwater springs and waterfalls flowing between high sandstone cliffs, providing a vibrant patch of green and blue in the arid desert terrain.',
    category: 'Natural Attraction',
    attractions: ['Deep Freshwater Pool Swimming', 'Sandstone Cliff Trekking', 'Hidden Waterfalls', 'Night Camping'],
    directions: 'Take the N-25 highway to Khuzdar. From Khuzdar, hire a 4x4 vehicle for a rugged off-road journey of about 4 hours through the Moola gorge to reach the Chotok oasis.',
    nearbyPlaces: ['Khuzdar Valley', 'Moola River Basin'],
  },
  {
    _id: 'l6',
    title: 'Pir Ghaib Waterfall',
    district: 'Bolan',
    coordinates: { lat: 29.8006, lng: 67.3003 },
    images: [
      'https://images.unsplash.com/photo-1433832597046-4f10e10ac764?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Pir Ghaib is a legendary waterfall flowing down a rocky mountainside into a natural blue lagoon, shaded by palm trees in the Bolan Valley. According to local folklore, a saint struck the rock to escape searchers, generating the spring water that flows to this day.',
    category: 'Natural Attraction',
    attractions: ['Natural Blue Lagoon Swims', 'Palm Tree Shaded Picnics', 'Bolan Gorge Hiking', 'Historic Cave Shrines'],
    directions: 'Located about 70km south of Quetta, accessible via the Quetta-Sibi Highway in Bolan Gorge in approximately 2 hours.',
    nearbyPlaces: ['Bolan Pass Canyons', 'Mach Town', 'Sibi Plains'],
  },
  {
    _id: 'l7',
    title: 'Mehrgarh Archaeological Site',
    district: 'Kachhi',
    coordinates: { lat: 29.3872, lng: 67.6167 },
    images: [
      'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Mehrgarh is one of the most important Neolithic archaeological sites in the world, dating back to 7000 BCE. Pre-dating the Indus Valley Civilization, it represents some of the earliest evidence of farming, animal domestication, pottery, and dental surgery in South Asia.',
    category: 'Historical Place',
    attractions: ['Ancient Mud-brick Granaries', 'Archaeological Museum Displays', 'Neolithic Settlements Ruins', 'Kachhi Plain Scenic Drives'],
    directions: 'Located in the Kachhi Plain near the Bolan Pass, approximately 140km south of Quetta. Accessible by 4x4 from Sibi or Quetta.',
    nearbyPlaces: ['Bolan Pass Canyons', 'Sibi Town', 'Dhan River Valley'],
  },
  {
    _id: 'l8',
    title: 'Gadani Cliffs & Beach',
    district: 'Hub',
    coordinates: { lat: 25.1189, lng: 66.7294 },
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Famous for its dramatic rocky coastline, Gadani Beach features golden sandy shores, natural rock arches, and dynamic tides where the Arabian Sea meets the desert cliffs. It is also home to one of the largest ship-breaking yards in the world.',
    category: 'Coastal Point',
    attractions: ['Rock Formations & Arches', 'Coastal Sunsets', 'Beach Combing & Swims', 'Ship-breaking Yards Viewpoints'],
    directions: 'Located just 50km northwest of Karachi, easily accessible via the Hub River Road and Coastal Highway in about 1.5 hours.',
    nearbyPlaces: ['Hub City', 'Sonmiani Beach Lagoon'],
  }
];

let mockTeam = [
  {
    _id: 't1',
    name: 'Mir Sarfraz Bugti',
    role: 'Chief Minister of Balochistan',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    bio: 'Overseeing public reforms, infrastructure expansion, and regional modernization to connect administrative services directly to citizens.',
    socials: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com', email: 'cm@balochistan.gov.pk', facebook: 'https://facebook.com' }
  },
  {
    _id: 't2',
    name: 'Hammad Khan Baloch',
    role: 'Secretary, Information Technology Department',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
    bio: 'Spearheading the digitalization of municipal bodies, e-governance solutions, and citizen feedback portals across all 37 districts.',
    socials: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com', email: 'secretary.it@balochistan.gov.pk', facebook: '' }
  },
  {
    _id: 't3',
    name: 'Dr. Zarlasht Durrani',
    role: 'Director General, Balochistan Connect',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    bio: 'Managing the operations, resolving dispatch escalations, and directing community events and tourism showcases.',
    socials: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com', email: 'dg.connect@balochistan.gov.pk', facebook: 'https://facebook.com' }
  },
  {
    _id: 't4',
    name: 'Sardar Ali Bugti',
    role: 'Deputy Director, Civic Engagement',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
    bio: 'Facilitating public hearings, gathering community feedback, and coordinating the rapid response municipal dispatch teams.',
    socials: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com', email: 'sardar.ali@balochistan.gov.pk', facebook: '' }
  },
  {
    _id: 't5',
    name: 'Nadia Khan Achakzai',
    role: 'Chief Technology Officer, IT Board',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800',
    bio: 'Overseeing the server infrastructure, APIs, database scalability, and security layers of Balochistan Connect.',
    socials: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com', email: 'n.achakzai@balochistan.gov.pk', facebook: 'https://facebook.com' }
  },
  {
    _id: 't6',
    name: 'Lt. Col. (R) Tariq Zehri',
    role: 'Director of Operations, Disaster Response',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800',
    bio: 'Leading emergency response coordination, integration of helplines with PDMA, and road infrastructure rescue ops.',
    socials: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com', email: 'tariq.zehri@balochistan.gov.pk', facebook: '' }
  }
];

let hasSeeded = false;

// Helper to determine if we should use DB or Mock
async function isDbConnected(): Promise<boolean> {
  try {
    const conn = await dbConnect();
    if (conn && !hasSeeded) {
      hasSeeded = true;
      await seedDatabase();
    }
    return !!conn;
  } catch {
    return false;
  }
}

// ==========================================
// COMPLAINTS SERVICES
// ==========================================

export async function getComplaints() {
  if (await isDbConnected()) {
    return await Complaint.find().sort({ createdAt: -1 });
  }
  return [...mockComplaints].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getComplaintById(id: string) {
  if (await isDbConnected()) {
    return await Complaint.findOne({ complaintId: id });
  }
  return mockComplaints.find(c => c.complaintId === id) || null;
}

export async function createComplaint(data: any) {
  const trackingNumber = 'BAL-' + Math.floor(10000 + Math.random() * 90000);
  const newRecord = {
    ...data,
    complaintId: trackingNumber,
    status: 'submitted',
    assignedTo: data.assignedTo || 'Unassigned',
    notes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (await isDbConnected()) {
    const dbRecord = await Complaint.create(newRecord);
    return dbRecord;
  }

  const inMemRecord = { _id: 'temp-' + Date.now(), ...newRecord };
  mockComplaints.push(inMemRecord as any);
  return inMemRecord;
}

export async function updateComplaint(id: string, updates: any) {
  if (await isDbConnected()) {
    return await Complaint.findOneAndUpdate({ complaintId: id }, updates, { new: true });
  }

  const index = mockComplaints.findIndex(c => c.complaintId === id);
  if (index !== -1) {
    const current = mockComplaints[index];
    
    // Process status or assigned updates
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date()
    };
    
    // Special handling for notes: if notes are supplied as a new array, or appended
    if (updates.notes) {
      updated.notes = updates.notes;
    }
    
    mockComplaints[index] = updated as any;
    return updated;
  }
  return null;
}

// ==========================================
// NEWS SERVICES
// ==========================================

export async function getNews() {
  if (await isDbConnected()) {
    return await News.find().sort({ publishedAt: -1 });
  }
  return [...mockNews].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export async function getNewsBySlug(slug: string) {
  if (await isDbConnected()) {
    return await News.findOne({ slug });
  }
  return mockNews.find(n => n.slug === slug) || null;
}

export async function createNews(data: any) {
  const slug = data.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const record = { ...data, slug, publishedAt: new Date() };
  if (await isDbConnected()) {
    return await News.create(record);
  }
  const inMem = { _id: 'n-' + Date.now(), ...record };
  mockNews.push(inMem);
  return inMem;
}

export async function deleteNews(id: string) {
  if (await isDbConnected()) {
    return await News.findByIdAndDelete(id);
  }
  mockNews = mockNews.filter(n => n._id !== id);
  return true;
}

// ==========================================
// EVENTS SERVICES
// ==========================================

export async function getEvents() {
  if (await isDbConnected()) {
    return await Event.find().sort({ date: 1 });
  }
  return [...mockEvents].sort((a, b) => a.date.getTime() - b.date.getTime());
}

export async function createEvent(data: any) {
  const record = { ...data, registrations: [] };
  if (await isDbConnected()) {
    return await Event.create(record);
  }
  const inMem = { _id: 'e-' + Date.now(), ...record };
  mockEvents.push(inMem as any);
  return inMem;
}

export async function registerForEvent(eventId: string, registrationData: any) {
  const newReg = { ...registrationData, registeredAt: new Date() };
  if (await isDbConnected()) {
    return await Event.findByIdAndUpdate(
      eventId,
      { $push: { registrations: newReg } },
      { new: true }
    );
  }

  const idx = mockEvents.findIndex(e => e._id === eventId);
  if (idx !== -1) {
    mockEvents[idx].registrations.push(newReg);
    return mockEvents[idx];
  }
  return null;
}

export async function deleteEvent(id: string) {
  if (await isDbConnected()) {
    return await Event.findByIdAndDelete(id);
  }
  mockEvents = mockEvents.filter(e => e._id !== id);
  return true;
}

// ==========================================
// TOURISM LOCATIONS SERVICES
// ==========================================

export async function getLocations() {
  if (await isDbConnected()) {
    return await Location.find().sort({ title: 1 });
  }
  return [...mockLocations].sort((a, b) => a.title.localeCompare(b.title));
}

export async function getLocationById(id: string) {
  if (await isDbConnected()) {
    return await Location.findById(id);
  }
  return mockLocations.find(l => l._id === id) || null;
}

export async function createLocation(data: any) {
  if (await isDbConnected()) {
    return await Location.create(data);
  }
  const inMem = { _id: 'l-' + Date.now(), ...data };
  mockLocations.push(inMem);
  return inMem;
}

export async function deleteLocation(id: string) {
  if (await isDbConnected()) {
    return await Location.findByIdAndDelete(id);
  }
  mockLocations = mockLocations.filter(l => l._id !== id);
  return true;
}

// ==========================================
// TEAM SERVICES
// ==========================================

export async function getTeam() {
  if (await isDbConnected()) {
    return await Team.find().sort({ createdAt: 1 });
  }
  return [...mockTeam];
}

export async function createTeamMember(data: any) {
  if (await isDbConnected()) {
    return await Team.create(data);
  }
  const inMem = { _id: 't-' + Date.now(), ...data };
  mockTeam.push(inMem);
  return inMem;
}

export async function deleteTeamMember(id: string) {
  if (await isDbConnected()) {
    return await Team.findByIdAndDelete(id);
  }
  mockTeam = mockTeam.filter(t => t._id !== id);
  return true;
}

// ==========================================
// SEEDING HELPER (FOR FIRST LAUNCH IF MONGODB ACTIVE)
// ==========================================
export async function seedDatabase() {
  try {
    const isConnected = await dbConnect();
    if (!isConnected) return;
    
    // Seed News if missing
    for (const article of mockNews) {
      const exists = await News.findOne({ slug: article.slug });
      if (!exists) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...dataWithoutId } = article;
        await News.create(dataWithoutId);
        console.log(`Seeded news article: ${article.title}`);
      }
    }
    
    // Seed Events if missing
    for (const evt of mockEvents) {
      const exists = await Event.findOne({ title: evt.title });
      if (!exists) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...dataWithoutId } = evt;
        await Event.create(dataWithoutId);
        console.log(`Seeded event: ${evt.title}`);
      }
    }

    // Seed Locations if missing
    for (const loc of mockLocations) {
      const exists = await Location.findOne({ title: loc.title });
      if (!exists) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...dataWithoutId } = loc;
        await Location.create(dataWithoutId);
        console.log(`Seeded location: ${loc.title}`);
      }
    }

    // Seed Team if missing
    for (const member of mockTeam) {
      const exists = await Team.findOne({ name: member.name });
      if (!exists) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...dataWithoutId } = member;
        await Team.create(dataWithoutId);
        console.log(`Seeded team member: ${member.name}`);
      }
    }
    
    // Seed default admin in DB if missing
    const userCount = await User.countDocuments({ role: 'admin' });
    if (userCount === 0) {
      await User.create({
        name: 'Balochistan Admin Officer',
        email: 'admin@balochistan.gov.pk',
        password: 'admin123',
        role: 'admin',
      });
      await User.create({
        name: 'Sardar Khan Baloch',
        email: 'citizen@balochistan.gov.pk',
        password: 'citizen123',
        role: 'citizen',
      });
      console.log('Seeded default admin and citizen accounts in database.');
    }
  } catch (err) {
    console.error('Seeding database failed:', err);
  }
}
