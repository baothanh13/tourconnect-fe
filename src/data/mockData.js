// src/data/mockData.js

// Enhanced mock data for TourConnect system

export const mockGuides = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "an.nguyen@example.com",
    phone: "+84901234567",
    city: "Hà Nội",
    rating: 4.9,
    reviewCount: 47,
    avatar: "https://placehold.co/300x300/EFEFEFF/333333?text=An",
    isVerified: true,
    languages: ["Vietnamese", "English", "Chinese"],
    specialties: ["Cultural Tours", "Food Tours", "Historical Sites"],
    experienceYears: 5,
    pricePerHour: 300000, // VND
    bio: "5 năm kinh nghiệm hướng dẫn tour ẩm thực và văn hóa phố cổ. Sẵn sàng mang đến cho bạn những trải nghiệm chân thực nhất về Hà Nội!",
    description:
      "Chuyên gia về văn hóa và ẩm thực Hà Nội với hơn 5 năm kinh nghiệm. Tôi đã hướng dẫn cho hơn 500 khách du lịch khám phá những nét đẹp ẩn giấu của thủ đô.",
    availability: {
      monday: { available: true, timeSlots: ["09:00-12:00", "14:00-17:00"] },
      tuesday: { available: true, timeSlots: ["09:00-12:00", "14:00-17:00"] },
      wednesday: { available: true, timeSlots: ["09:00-12:00"] },
      thursday: { available: true, timeSlots: ["09:00-12:00", "14:00-17:00"] },
      friday: { available: true, timeSlots: ["09:00-12:00", "14:00-17:00"] },
      saturday: { available: true, timeSlots: ["08:00-12:00", "14:00-18:00"] },
      sunday: { available: false, timeSlots: [] },
    },
    tours: [
      {
        id: 101,
        title: "Khám phá Phố cổ Hà Nội",
        duration: "3 giờ",
        price: 800000,
        description:
          "Tham quan các di tích lịch sử và thưởng thức ẩm thực đường phố",
      },
    ],
    totalEarnings: 45000000,
    joinedDate: "2019-03-15",
  },
  {
    id: 2,
    name: "Trần Thị Bích",
    email: "bich.tran@example.com",
    phone: "+84912345678",
    city: "Đà Nẵng",
    rating: 4.8,
    reviewCount: 32,
    avatar: "https://placehold.co/300x300/F9D4D4/333333?text=Bich",
    isVerified: true,
    languages: ["Vietnamese", "English", "Japanese"],
    specialties: ["Beach Tours", "Mountain Hiking", "Photography Tours"],
    experienceYears: 3,
    pricePerHour: 250000,
    bio: "Chuyên gia về các tour biển đảo và khám phá Ngũ Hành Sơn. Tôi yêu Đà Nẵng và muốn chia sẻ tình yêu đó với bạn.",
    description:
      "Hướng dẫn viên trẻ năng động, chuyên về các tour khám phá thiên nhiên và chụp ảnh tại Đà Nẵng.",
    availability: {
      monday: { available: true, timeSlots: ["08:00-12:00", "13:00-17:00"] },
      tuesday: { available: true, timeSlots: ["08:00-12:00", "13:00-17:00"] },
      wednesday: { available: true, timeSlots: ["08:00-12:00", "13:00-17:00"] },
      thursday: { available: true, timeSlots: ["08:00-12:00", "13:00-17:00"] },
      friday: { available: true, timeSlots: ["08:00-12:00", "13:00-17:00"] },
      saturday: { available: true, timeSlots: ["07:00-12:00", "13:00-18:00"] },
      sunday: { available: true, timeSlots: ["07:00-12:00", "13:00-18:00"] },
    },
    tours: [
      {
        id: 201,
        title: "Tour Ngũ Hành Sơn & Bãi biển Mỹ Khê",
        duration: "4 giờ",
        price: 900000,
        description:
          "Khám phá hang động và thư giãn tại bãi biển đẹp nhất Đà Nẵng",
      },
    ],
    totalEarnings: 28000000,
    joinedDate: "2021-06-20",
  },
  {
    id: 3,
    name: "Lê Văn Cường",
    email: "cuong.le@example.com",
    phone: "+84923456789",
    city: "Hồ Chí Minh",
    rating: 4.9,
    reviewCount: 68,
    avatar: "https://placehold.co/300x300/D4F0F9/333333?text=Cuong",
    isVerified: true,
    languages: ["Vietnamese", "English", "French"],
    specialties: ["Historical Tours", "War History", "Architecture"],
    experienceYears: 7,
    pricePerHour: 350000,
    bio: "Hướng dẫn viên chuyên nghiệp với các tour khám phá lịch sử Sài Gòn, từ Địa đạo Củ Chi đến Dinh Độc Lập.",
    description:
      "Chuyên gia lịch sử với kiến thức sâu rộng về cuộc chiến tranh Việt Nam và kiến trúc Sài Gòn.",
    availability: {
      monday: { available: true, timeSlots: ["09:00-12:00", "14:00-17:00"] },
      tuesday: { available: true, timeSlots: ["09:00-12:00", "14:00-17:00"] },
      wednesday: { available: true, timeSlots: ["09:00-12:00", "14:00-17:00"] },
      thursday: { available: true, timeSlots: ["09:00-12:00", "14:00-17:00"] },
      friday: { available: true, timeSlots: ["09:00-12:00", "14:00-17:00"] },
      saturday: { available: true, timeSlots: ["08:00-12:00", "14:00-18:00"] },
      sunday: { available: true, timeSlots: ["08:00-12:00", "14:00-18:00"] },
    },
    tours: [
      {
        id: 301,
        title: "Lịch sử Sài Gòn & Địa đạo Củ Chi",
        duration: "6 giờ",
        price: 1500000,
        description: "Khám phá lịch sử hào hùng của dân tộc Việt Nam",
      },
    ],
    totalEarnings: 72000000,
    joinedDate: "2017-11-08",
  },
];

export const mockBookings = [
  {
    id: 1,
    touristId: 1,
    guideId: 1,
    tourId: 101,
    date: "2025-08-15",
    timeSlot: "09:00-12:00",
    status: "confirmed", // pending, confirmed, completed, cancelled
    totalPrice: 800000,
    numberOfPeople: 2,
    specialRequests: "Có trẻ em 5 tuổi",
    paymentStatus: "paid", // pending, paid, refunded
    createdAt: "2025-08-01T10:00:00Z",
  },
];

export const mockReviews = [
  {
    id: 1,
    bookingId: 1,
    touristId: 1,
    guideId: 1,
    rating: 5,
    comment:
      "Anh An rất nhiệt tình và hiểu biết sâu về lịch sử Hà Nội. Tour rất thú vị!",
    createdAt: "2025-08-01T15:00:00Z",
  },
];

export const mockUsers = [
  {
    id: 1,
    email: "tourist@example.com",
    name: "Nguyễn Thị Mai",
    userType: "tourist",
    phone: "+84987654321",
    avatar: "https://placehold.co/150x150/FFE4E1/333333?text=Mai",
    joinedDate: "2025-01-15",
  },
  {
    id: 2,
    email: "admin@tourconnect.com",
    name: "Admin System",
    userType: "admin",
    phone: "+84999999999",
    avatar: "https://placehold.co/150x150/E6E6FA/333333?text=Admin",
    joinedDate: "2024-01-01",
  },
];

// City and location data
export const mockCities = [
  { id: 1, name: "Hà Nội", region: "Miền Bắc" },
  { id: 2, name: "Đà Nẵng", region: "Miền Trung" },
  { id: 3, name: "Hồ Chí Minh", region: "Miền Nam" },
  { id: 4, name: "Huế", region: "Miền Trung" },
  { id: 5, name: "Hội An", region: "Miền Trung" },
  { id: 6, name: "Nha Trang", region: "Miền Trung" },
  { id: 7, name: "Cần Thơ", region: "Miền Nam" },
  { id: 8, name: "Vũng Tàu", region: "Miền Nam" },
];

export const mockSpecialties = [
  "Cultural Tours",
  "Food Tours",
  "Historical Sites",
  "Beach Tours",
  "Mountain Hiking",
  "Photography Tours",
  "War History",
  "Architecture",
  "Nightlife Tours",
  "Shopping Tours",
  "Adventure Tours",
  "Eco Tours",
];
