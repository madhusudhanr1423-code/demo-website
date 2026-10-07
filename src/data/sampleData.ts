import type {
  Campaign, Donation, Order, OrderItem, Product,
  Booking, BookingMember, BookingRequest, BookingSession, Faq, FilterOption, GalleryImage,
  Partner, Pooja, SiteSettings, Testimonial,
} from "@/types";

const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/600`;

type Base = Omit<Pooja, "pooja_type" | "pricing_model" | "max_members" | "tag_line" | "subtitle" | "dosha" | "benefit" | "seva_frequency" | "seva_weekday" | "seva_sessions" | "is_featured" | "sort_order" | "translations">;
const one = (b: Base, extra: Partial<Pooja>): Pooja => ({
  pooja_type: "one_time", pricing_model: "per_person", max_members: 20, tag_line: "", subtitle: "",
  dosha: [], benefit: [], seva_frequency: null, seva_weekday: null, seva_sessions: null,
  is_featured: false, sort_order: 0, translations: {}, ...b, ...extra,
});

export const samplePoojas: Pooja[] = [
  one({ id: "p1", title: "Ganesha Sankashti Archana", slug: "ganesha-sankashti-archana", deity: "Ganesha", category: "Archana", temple_name: "Sri Vinayaka Devasthanam", temple_location: "Pune, Maharashtra", description: "A morning archana offered with durva grass and modaka, chanting the 108 names of Lord Ganesha to remove obstacles before new beginnings.", benefits: ["Removes obstacles", "Blessings for new ventures", "Clarity of mind"], image_url: img("ganesha-lamp"), price_per_person: 501, pooja_date: "2026-10-18", max_bookings: 100, is_active: true },
    { is_featured: true, sort_order: 1, tag_line: "Begin with blessings", subtitle: "Clear the path for every new start", dosha: ["ketu"], benefit: ["career", "education"],
      translations: { te: { title: "గణేశ సంకష్టి అర్చన", deity: "గణేశుడు", tag_line: "ఆశీస్సులతో ప్రారంభించండి", subtitle: "ప్రతి కొత్త ఆరంభానికి మార్గం సుగమం", description: "దూర్వా గడ్డి, మోదకాలతో గణేశుని 108 నామాలు జపిస్తూ చేసే ఉదయపు అర్చన. కొత్త పనులకు ముందు అడ్డంకులు తొలగడానికి.", benefits: ["అడ్డంకుల నివారణ", "కొత్త పనులకు ఆశీస్సులు", "మనస్సు స్పష్టత"], temple_name: "శ్రీ వినాయక దేవస్థానం", temple_location: "పుణె, మహారాష్ట్ర" } } }),
  one({ id: "p2", title: "Lakshmi Kubera Homam", slug: "lakshmi-kubera-homam", deity: "Lakshmi", category: "Homam", temple_name: "Sri Mahalakshmi Kshetram", temple_location: "Kolhapur, Maharashtra", description: "A sacred fire ritual invoking Goddess Lakshmi and Lord Kubera for prosperity, abundance and harmony within the household.", benefits: ["Financial stability", "Household harmony", "Abundance"], image_url: img("lakshmi-fire"), price_per_person: 2101, pooja_date: "2026-10-24", max_bookings: 60, is_active: true },
    { is_featured: true, sort_order: 2, pricing_model: "per_booking", max_members: 6, tag_line: "Invite abundance home", subtitle: "A fire ritual for prosperity and peace", dosha: ["shukra"], benefit: ["wealth", "family"],
      translations: { te: { title: "లక్ష్మీ కుబేర హోమం", deity: "లక్ష్మీదేవి", tag_line: "ఇంటికి సమృద్ధిని ఆహ్వానించండి", subtitle: "సంపద, శాంతి కోసం హోమం", description: "ఇంటిలో సంపద, సమృద్ధి, సామరస్యం కోసం లక్ష్మీదేవిని, కుబేరుని ఆవాహన చేసే పవిత్ర హోమం.", benefits: ["ఆర్థిక స్థిరత్వం", "కుటుంబ సామరస్యం", "సమృద్ధి"], temple_name: "శ్రీ మహాలక్ష్మి క్షేత్రం", temple_location: "కొల్హాపూర్, మహారాష్ట్ర" } } }),
  one({ id: "p3", title: "Rudrabhishekam", slug: "rudrabhishekam", deity: "Shiva", category: "Abhishekam", temple_name: "Sri Someshwara Temple", temple_location: "Varanasi, Uttar Pradesh", description: "Holy bathing of the Shiva Lingam with milk, honey, curd and sacred water while the Sri Rudram is recited by trained priests.", benefits: ["Inner peace", "Good health", "Protection from negativity"], image_url: img("shiva-river"), price_per_person: 751, pooja_date: "2026-10-27", max_bookings: 120, is_active: true },
    { is_featured: true, sort_order: 3, tag_line: "Peace through devotion", subtitle: "Sri Rudram chanted by temple priests", dosha: ["shani", "rahu"], benefit: ["health", "peace"],
      translations: { te: { title: "రుద్రాభిషేకం", deity: "శివుడు", tag_line: "భక్తితో శాంతి", subtitle: "ఆలయ అర్చకులచే శ్రీ రుద్ర పఠనం", description: "శ్రీ రుద్రం పఠిస్తూ పాలు, తేనె, పెరుగు, పవిత్ర జలంతో శివలింగానికి అభిషేకం.", benefits: ["అంతర్గత శాంతి", "మంచి ఆరోగ్యం", "ప్రతికూలత నుండి రక్షణ"], temple_name: "శ్రీ సోమేశ్వర ఆలయం", temple_location: "వారణాసి, ఉత్తర ప్రదేశ్" } } }),
  one({ id: "p4", title: "Navagraha Shanti Pooja", slug: "navagraha-shanti-pooja", deity: "Navagraha", category: "Shanti", temple_name: "Sri Navagraha Sannidhi", temple_location: "Kumbakonam, Tamil Nadu", description: "A pooja to the nine celestial bodies to pacify planetary influences and invite balance into one's life.", benefits: ["Planetary balance", "Reduced hardships", "Career growth"], image_url: img("navagraha-stars"), price_per_person: 901, pooja_date: "2026-11-02", max_bookings: 80, is_active: true },
    { sort_order: 4, dosha: ["shani", "rahu", "ketu", "mangal"], benefit: ["career", "peace"], translations: { te: { title: "నవగ్రహ శాంతి పూజ", deity: "నవగ్రహాలు" } } }),
  one({ id: "p5", title: "Hanuman Chalisa Path & Sindoor Seva", slug: "hanuman-chalisa-sindoor-seva", deity: "Hanuman", category: "Seva", temple_name: "Sri Anjaneya Mandir", temple_location: "Hampi, Karnataka", description: "Collective recitation of the Hanuman Chalisa followed by sindoor offering, ideal on Tuesdays and Saturdays.", benefits: ["Courage", "Strength", "Protection"], image_url: img("hanuman-hill"), price_per_person: 351, pooja_date: "2026-11-07", max_bookings: 150, is_active: true },
    { sort_order: 5, dosha: ["shani", "mangal"], benefit: ["protection", "health"], translations: { te: { title: "హనుమాన్ చాలీసా పారాయణం & సింధూర సేవ", deity: "హనుమంతుడు" } } }),
  one({ id: "p6", title: "Satyanarayana Vratham", slug: "satyanarayana-vratham", deity: "Vishnu", category: "Vratham", temple_name: "Sri Venkatesa Perumal Kovil", temple_location: "Tirupati, Andhra Pradesh", description: "A full-moon vratham with katha recitation and prasadam, performed for gratitude and family well-being.", benefits: ["Family well-being", "Fulfilment of wishes", "Gratitude"], image_url: img("vishnu-moon"), price_per_person: 1501, pooja_date: "2026-11-15", max_bookings: 90, is_active: true },
    { sort_order: 6, pricing_model: "per_booking", max_members: 8, benefit: ["family", "peace"], translations: { te: { title: "సత్యనారాయణ వ్రతం", deity: "విష్ణువు" } } }),
  one({ id: "p7", title: "Durga Saptashati Parayanam", slug: "durga-saptashati-parayanam", deity: "Durga", category: "Parayanam", temple_name: "Sri Chamundeshwari Peetham", temple_location: "Mysuru, Karnataka", description: "Recitation of the seven hundred verses glorifying the Divine Mother, offered for strength and protection.", benefits: ["Protection", "Victory over difficulties", "Inner strength"], image_url: img("durga-red"), price_per_person: 1251, pooja_date: "2026-11-20", max_bookings: 50, is_active: true },
    { sort_order: 7, dosha: ["rahu"], benefit: ["protection"], translations: { te: { title: "దుర్గా సప్తశతి పారాయణం", deity: "దుర్గాదేవి" } } }),
  one({ id: "p8", title: "Saraswati Vidya Archana", slug: "saraswati-vidya-archana", deity: "Saraswati", category: "Archana", temple_name: "Sri Sharada Peetham", temple_location: "Sringeri, Karnataka", description: "An archana for students and seekers of knowledge, offered with white flowers and the chanting of Saraswati stotrams.", benefits: ["Focus in studies", "Wisdom", "Success in exams"], image_url: img("saraswati-veena"), price_per_person: 451, pooja_date: "2026-11-28", max_bookings: 200, is_active: true },
    { sort_order: 8, dosha: ["budh"], benefit: ["education"], translations: { te: { title: "సరస్వతీ విద్యా అర్చన", deity: "సరస్వతీదేవి" } } }),
  // Chadhava offerings
  one({ id: "c1", title: "Coconut & Flower Chadhava to Hanuman", slug: "coconut-flower-chadhava-hanuman", deity: "Hanuman", category: "Chadhava", temple_name: "Sri Anjaneya Mandir", temple_location: "Hampi, Karnataka", description: "Offer a coconut, marigold garland and sindoor at the sanctum in your family's name.", benefits: ["Strength", "Protection"], image_url: img("coconut-offering"), price_per_person: 251, pooja_date: "2026-10-20", max_bookings: 300, is_active: true },
    { pooja_type: "chadhava", pricing_model: "per_booking", max_members: 10, sort_order: 20, dosha: ["mangal"], benefit: ["protection"], translations: { te: { title: "హనుమంతునికి కొబ్బరి & పూల చఢావా", deity: "హనుమంతుడు" } } }),
  one({ id: "c2", title: "Lotus Chadhava to Lakshmi", slug: "lotus-chadhava-lakshmi", deity: "Lakshmi", category: "Chadhava", temple_name: "Sri Mahalakshmi Kshetram", temple_location: "Kolhapur, Maharashtra", description: "Fresh lotus flowers and a ghee lamp offered to the Goddess on Friday evening.", benefits: ["Prosperity", "Grace"], image_url: img("lotus-pond"), price_per_person: 351, pooja_date: "2026-10-23", max_bookings: 300, is_active: true },
    { pooja_type: "chadhava", pricing_model: "per_booking", max_members: 10, sort_order: 21, dosha: ["shukra"], benefit: ["wealth"], translations: { te: { title: "లక్ష్మీదేవికి కమల చఢావా", deity: "లక్ష్మీదేవి" } } }),
  // Sevas
  one({ id: "s1", title: "Friday Lakshmi Archana Seva", slug: "friday-lakshmi-archana-seva", deity: "Lakshmi", category: "Archana", temple_name: "Sri Mahalakshmi Kshetram", temple_location: "Kolhapur, Maharashtra", description: "A weekly archana every Friday for five weeks, with your family's names in the sankalpam each time.", benefits: ["Steady prosperity", "Household peace"], image_url: img("friday-lamp"), price_per_person: 2001, pooja_date: "2026-10-09", max_bookings: 100, is_active: true },
    { pooja_type: "seva", pricing_model: "per_booking", max_members: 6, seva_frequency: "weekly", seva_weekday: 5, seva_sessions: 5, sort_order: 30, benefit: ["wealth", "family"], translations: { te: { title: "శుక్రవార లక్ష్మీ అర్చన సేవ", deity: "లక్ష్మీదేవి" } } }),
  one({ id: "s2", title: "Daily Deepam Seva (11 days)", slug: "daily-deepam-seva", deity: "Shiva", category: "Seva", temple_name: "Sri Someshwara Temple", temple_location: "Varanasi, Uttar Pradesh", description: "A ghee lamp lit for your family at the evening aarti for eleven consecutive days.", benefits: ["Inner light", "Peace of mind"], image_url: img("diya-row"), price_per_person: 1101, pooja_date: "2026-10-05", max_bookings: 200, is_active: true },
    { pooja_type: "seva", pricing_model: "per_booking", max_members: 6, seva_frequency: "daily", seva_sessions: 11, sort_order: 31, benefit: ["peace"], translations: { te: { title: "నిత్య దీప సేవ (11 రోజులు)", deity: "శివుడు" } } }),
  one({ id: "s3", title: "Monthly Navagraha Seva", slug: "monthly-navagraha-seva", deity: "Navagraha", category: "Shanti", temple_name: "Sri Navagraha Sannidhi", temple_location: "Kumbakonam, Tamil Nadu", description: "A navagraha pooja on the same date every month for three months.", benefits: ["Planetary balance", "Steady progress"], image_url: img("planet-temple"), price_per_person: 2501, pooja_date: "2026-10-10", max_bookings: 80, is_active: true },
    { pooja_type: "seva", pricing_model: "per_booking", max_members: 6, seva_frequency: "monthly", seva_sessions: 3, sort_order: 32, dosha: ["shani", "rahu", "ketu"], benefit: ["career"], translations: { te: { title: "మాసిక నవగ్రహ సేవ", deity: "నవగ్రహాలు" } } }),
];

const opt = (kind: FilterOption["kind"], slug: string, label: string, te: string, i: number): FilterOption =>
  ({ id: `${kind}-${slug}`, kind, slug, label, translations: { te: { label: te } }, sort_order: i, is_active: true });

export const sampleFilterOptions: FilterOption[] = [
  ...[["ganesha", "Ganesha", "గణేశుడు"], ["lakshmi", "Lakshmi", "లక్ష్మీదేవి"], ["shiva", "Shiva", "శివుడు"], ["navagraha", "Navagraha", "నవగ్రహాలు"], ["hanuman", "Hanuman", "హనుమంతుడు"], ["vishnu", "Vishnu", "విష్ణువు"], ["durga", "Durga", "దుర్గాదేవి"], ["saraswati", "Saraswati", "సరస్వతీదేవి"]].map(([s, l, t], i) => opt("deity", s!, l!, t!, i)),
  ...[["archana", "Archana", "అర్చన"], ["homam", "Homam", "హోమం"], ["abhishekam", "Abhishekam", "అభిషేకం"], ["shanti", "Shanti", "శాంతి"], ["seva", "Seva", "సేవ"], ["vratham", "Vratham", "వ్రతం"], ["parayanam", "Parayanam", "పారాయణం"], ["chadhava", "Chadhava", "చఢావా"]].map(([s, l, t], i) => opt("category", s!, l!, t!, i)),
  ...[["shani", "Shani Dosha", "శని దోషం"], ["rahu", "Rahu Dosha", "రాహు దోషం"], ["ketu", "Ketu Dosha", "కేతు దోషం"], ["mangal", "Mangal Dosha", "కుజ దోషం"], ["shukra", "Shukra Dosha", "శుక్ర దోషం"], ["budh", "Budh Dosha", "బుధ దోషం"]].map(([s, l, t], i) => opt("dosha", s!, l!, t!, i)),
  ...[["wealth", "Wealth", "సంపద"], ["health", "Health", "ఆరోగ్యం"], ["career", "Career", "ఉద్యోగం"], ["education", "Education", "విద్య"], ["family", "Family", "కుటుంబం"], ["peace", "Peace", "శాంతి"], ["protection", "Protection", "రక్షణ"]].map(([s, l, t], i) => opt("benefit", s!, l!, t!, i)),
];

export const sampleBookings: Booking[] = [
  { id: "b1001", user_id: "sample", pooja_id: "p3", contact_name: "Ravi Kumar", phone: "9876543210", email: "ravi@example.com", whatsapp_number: "9876543210", total_amount: 2253, status: "completed", video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", created_at: "2026-09-02T09:30:00Z" },
  { id: "b1002", user_id: "sample", pooja_id: "p4", contact_name: "Ravi Kumar", phone: "9876543210", email: "ravi@example.com", whatsapp_number: "9876543210", total_amount: 1802, status: "confirmed", video_url: null, created_at: "2026-09-20T11:00:00Z" },
  { id: "b1003", user_id: "sample", pooja_id: "s1", contact_name: "Ravi Kumar", phone: "9876543210", email: "ravi@example.com", whatsapp_number: "9876543210", total_amount: 2001, status: "paid", video_url: null, created_at: "2026-09-28T16:45:00Z" },
];

export const sampleMembers: BookingMember[] = [
  { id: "m1", booking_id: "b1001", name: "Ravi Kumar", gotra: "Bharadwaja", relation: "Self" },
  { id: "m2", booking_id: "b1001", name: "Lakshmi Kumar", gotra: "Bharadwaja", relation: "Spouse" },
  { id: "m3", booking_id: "b1001", name: "Arjun Kumar", gotra: "Bharadwaja", relation: "Son" },
  { id: "m4", booking_id: "b1002", name: "Ravi Kumar", gotra: "Bharadwaja", relation: "Self" },
  { id: "m5", booking_id: "b1002", name: "Kamala Devi", gotra: "Kashyapa", relation: "Mother" },
  { id: "m6", booking_id: "b1003", name: "Ravi Kumar", gotra: "Bharadwaja", relation: "Self" },
];

export const sampleSessions: BookingSession[] = [
  { id: "ss1", booking_id: "b1003", session_date: "2026-09-25", status: "completed", video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { id: "ss2", booking_id: "b1003", session_date: "2026-10-02", status: "completed", video_url: null },
  { id: "ss3", booking_id: "b1003", session_date: "2026-10-09", status: "scheduled", video_url: null },
  { id: "ss4", booking_id: "b1003", session_date: "2026-10-16", status: "scheduled", video_url: null },
  { id: "ss5", booking_id: "b1003", session_date: "2026-10-23", status: "scheduled", video_url: null },
];

export const sampleRequests: BookingRequest[] = [];

export const sampleTestimonials: Testimonial[] = [
  { id: "t1", name: "Sravani, Hyderabad", quote: "Our family's names were chanted clearly and the video arrived the same evening. Truly heartfelt.", image_url: "https://i.pravatar.cc/150?img=47", translations: { te: { name: "శ్రావణి, హైదరాబాద్", quote: "మా కుటుంబ సభ్యుల పేర్లు స్పష్టంగా చదివారు, అదే సాయంత్రం వీడియో వచ్చింది. హృదయపూర్వకంగా ఉంది." } }, sort_order: 1, is_active: true },
  { id: "t2", name: "Kiran, Bengaluru", quote: "Living away from home, this was the closest we could be to our temple. Simple to book and very sincere.", image_url: "https://i.pravatar.cc/150?img=12", translations: { te: { name: "కిరణ్, బెంగళూరు", quote: "ఇంటికి దూరంగా ఉన్నా, మా ఆలయానికి దగ్గరగా ఉన్నట్టు అనిపించింది. బుక్ చేయడం సులభం." } }, sort_order: 2, is_active: true },
  { id: "t3", name: "Padma, Vijayawada", quote: "The priests performed the archana beautifully. We will book again for every festival.", image_url: "https://i.pravatar.cc/150?img=32", translations: { te: { name: "పద్మ, విజయవాడ", quote: "అర్చకులు అర్చనను అందంగా నిర్వహించారు. ప్రతి పండుగకు మళ్ళీ బుక్ చేస్తాం." } }, sort_order: 3, is_active: true },
];

export const sampleGallery: GalleryImage[] = Array.from({ length: 9 }, (_, i) => ({
  id: `g${i + 1}`, image_url: `https://picsum.photos/seed/temple-gallery-${i + 1}/1200/700`,
  caption: ["Evening aarti", "Festival decorations", "Morning abhishekam", "Temple courtyard", "Lamp offering", "Flower garlands", "Homam in progress", "Prasadam preparation", "Gopuram at dawn"][i]!,
  sort_order: i, is_active: true,
}));

export const sampleFaqs: Faq[] = [
  { id: "f1", question: "How do I book a pooja?", answer: "Choose a pooja, enter contact details and family members, then pay online. Your booking appears in My Bookings.", translations: { te: { question: "పూజను ఎలా బుక్ చేయాలి?", answer: "పూజను ఎంచుకుని, సంప్రదింపు వివరాలు, కుటుంబ సభ్యులను నమోదు చేసి ఆన్‌లైన్‌లో చెల్లించండి. మీ బుకింగ్ 'నా బుకింగ్‌లు'లో కనిపిస్తుంది." } }, sort_order: 1, is_active: true },
  { id: "f2", question: "When will I receive the video?", answer: "Videos are shared on WhatsApp within 48 hours of the pooja.", translations: { te: { question: "వీడియో ఎప్పుడు వస్తుంది?", answer: "పూజ జరిగిన 48 గంటల్లోపు వీడియో వాట్సాప్‌లో పంపబడుతుంది." } }, sort_order: 2, is_active: true },
  { id: "f3", question: "What is a seva subscription?", answer: "A seva repeats daily, weekly or monthly for a fixed number of sessions. Each session gets its own video.", translations: { te: { question: "సేవ సబ్‌స్క్రిప్షన్ అంటే ఏమిటి?", answer: "సేవ నిర్ణీత సెషన్ల పాటు రోజువారీ, వారానికి లేదా నెలకు ఒకసారి జరుగుతుంది. ప్రతి సెషన్‌కు వీడియో వస్తుంది." } }, sort_order: 3, is_active: true },
  { id: "f4", question: "Can I cancel or reschedule?", answer: "Yes, until 48 hours before the pooja. After the sankalpam is taken it cannot be cancelled.", translations: { te: { question: "రద్దు లేదా వాయిదా వేయవచ్చా?", answer: "అవును, పూజకు 48 గంటల ముందు వరకు. సంకల్పం తీసుకున్న తర్వాత రద్దు చేయలేరు." } }, sort_order: 4, is_active: true },
  { id: "f5", question: "I don't know my gotra. What should I enter?", answer: "It is customary to use 'Shiva gotra' when the family gotra is unknown.", translations: { te: { question: "నా గోత్రం తెలియదు. ఏమి నమోదు చేయాలి?", answer: "గోత్రం తెలియనప్పుడు 'శివ గోత్రం' వాడటం ఆనవాయితీ." } }, sort_order: 5, is_active: true },
];

export const samplePartners: Partner[] = [
  { id: "pa1", name: "Deepa Lamps Co.", logo_url: "https://picsum.photos/seed/brand-lamp/300/300", website_url: "https://example.com", description: "Handcrafted brass lamps and pooja vessels.", sort_order: 1, is_active: true },
  { id: "pa2", name: "Pushpa Garlands", logo_url: "https://picsum.photos/seed/brand-flower/300/300", website_url: "https://example.com", description: "Fresh flower garlands delivered to temples daily.", sort_order: 2, is_active: true },
  { id: "pa3", name: "Annapurna Prasadam", logo_url: "https://picsum.photos/seed/brand-food/300/300", website_url: "https://example.com", description: "Traditional prasadam prepared in temple kitchens.", sort_order: 3, is_active: true },
  { id: "pa4", name: "Veda Books", logo_url: "https://picsum.photos/seed/brand-book/300/300", website_url: "https://example.com", description: "Stotram books and devotional literature.", sort_order: 4, is_active: true },
];

export const sampleSiteSettings: SiteSettings = {
  whatsapp_number: "919000000000",
  support_email: "support@example.org",
  address: "Temple Road, Your City",
  social_links: [
    { platform: "facebook", url: "https://facebook.com" },
    { platform: "instagram", url: "https://instagram.com" },
    { platform: "youtube", url: "https://youtube.com" },
    { platform: "twitter", url: "https://x.com" },
  ],
  trust_badges: [
    { label: "Verified temple priests", translations: { te: { label: "ధృవీకృత ఆలయ అర్చకులు" } } },
    { label: "Video within 48 hours", translations: { te: { label: "48 గంటల్లో వీడియో" } } },
    { label: "Secure payments", translations: { te: { label: "సురక్షిత చెల్లింపులు" } } },
    { label: "Family names in sankalpam", translations: { te: { label: "సంకల్పంలో కుటుంబ పేర్లు" } } },
  ],
};

export const sampleProducts: Product[] = [
  { id: "pr1", name: "Temple Prasadam Box", slug: "temple-prasadam-box", description: "Laddu, pulihora mix and dry fruits prepared in the temple kitchen and packed fresh.", price: 351, stock: 40, image_url: img("prasadam-box"), is_active: true },
  { id: "pr2", name: "Sandalwood Incense Sticks", slug: "sandalwood-incense", description: "Hand-rolled agarbatti with a gentle sandalwood fragrance. Pack of 100.", price: 149, stock: 120, image_url: img("incense-smoke"), is_active: true },
  { id: "pr3", name: "Brass Diya (Pair)", slug: "brass-diya-pair", description: "Traditional brass oil lamps, polished by hand. Set of two.", price: 899, stock: 15, image_url: img("brass-diya"), is_active: true },
  { id: "pr4", name: "Rudraksha Mala", slug: "rudraksha-mala", description: "108-bead five-faced rudraksha mala, energised at the temple.", price: 1299, stock: 0, image_url: img("rudraksha"), is_active: true },
  { id: "pr5", name: "Kumkum & Turmeric Set", slug: "kumkum-turmeric-set", description: "Pure kumkum and turmeric powder in reusable containers.", price: 199, stock: 60, image_url: img("kumkum"), is_active: true },
  { id: "pr6", name: "Camphor Tablets", slug: "camphor-tablets", description: "Clean-burning camphor for aarti. 100 g pack.", price: 99, stock: 200, image_url: img("camphor-flame"), is_active: true },
];

export const sampleOrders: Order[] = [
  { id: "o5001", user_id: "sample", full_name: "Ravi Kumar", phone: "9876543210", email: "ravi@example.com", address: "12 Temple Street", city: "Hyderabad", state: "Telangana", pincode: "500001", shipping_amount: 50, total_amount: 1098, status: "shipped", tracking_number: "IN1234567890", created_at: "2026-09-15T10:00:00Z" },
];
export const sampleOrderItems: OrderItem[] = [
  { id: "oi1", order_id: "o5001", product_id: "pr3", quantity: 1, unit_price: 899 },
  { id: "oi2", order_id: "o5001", product_id: "pr2", quantity: 1, unit_price: 149 },
];

export const sampleCampaigns: Campaign[] = [
  { id: "ca1", title: "Annadanam for Karthika Masam", slug: "annadanam-karthika", story: "Every day of Karthika Masam the temple serves free meals to devotees and pilgrims. Your contribution helps feed hundreds of people each day with simple, sattvic food prepared in the temple kitchen.", image_url: img("annadanam-meal"), goal_amount: 500000, raised_amount: 468000, end_date: "2026-11-30", is_active: true },
  { id: "ca2", title: "Gopuram Restoration", slug: "gopuram-restoration", story: "The temple gopuram needs careful restoration of its plaster figures and painted panels. Skilled artisans will repair the structure using traditional materials.", image_url: img("gopuram-repair"), goal_amount: 2500000, raised_amount: 640000, end_date: "2027-03-31", is_active: true },
  { id: "ca3", title: "Goshala Fodder Drive", slug: "goshala-fodder", story: "Our goshala cares for over sixty cows. This drive collected funds for a full year of fodder and veterinary care.", image_url: img("goshala-cow"), goal_amount: 300000, raised_amount: 312500, end_date: "2026-08-31", is_active: true },
];

export const sampleDonations: Donation[] = [
  { id: "d1", campaign_id: "ca1", user_id: null, donor_name: "Sita R.", donor_email: "sita@example.com", donor_phone: "9000000001", donor_pan: null, amount: 2501, is_anonymous: false, status: "paid", receipt_number: "RCPT-2026-000001", created_at: "2026-09-29T08:00:00Z" },
  { id: "d2", campaign_id: "ca1", user_id: null, donor_name: "Hidden", donor_email: "a@example.com", donor_phone: "9000000002", donor_pan: null, amount: 1001, is_anonymous: true, status: "paid", receipt_number: "RCPT-2026-000002", created_at: "2026-09-30T12:00:00Z" },
  { id: "d3", campaign_id: "ca2", user_id: null, donor_name: "Venkat P.", donor_email: "v@example.com", donor_phone: "9000000003", donor_pan: null, amount: 5001, is_anonymous: false, status: "paid", receipt_number: "RCPT-2026-000003", created_at: "2026-09-25T09:00:00Z" },
  { id: "d4", campaign_id: "ca3", user_id: null, donor_name: "Lakshmi N.", donor_email: "l@example.com", donor_phone: "9000000004", donor_pan: null, amount: 501, is_anonymous: false, status: "paid", receipt_number: "RCPT-2026-000004", created_at: "2026-08-20T09:00:00Z" },
];
