export type UserRole = 'customer' | 'seller' | 'driver';

export type CustomerTab = 'home' | 'locations' | 'discover' | 'orders' | 'profile';

export type DropStatus = 'upcoming' | 'live' | 'sold_out' | 'closed';

export type OrderStatus =
  | 'received'
  | 'preparing'
  | 'ready'
  | 'driver_assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type SGRegion = 'Central' | 'East' | 'West' | 'North' | 'North-East';

export type FoodStatus =
  | 'halal_certified'
  | 'muslim_owned'
  | 'no_pork_no_lard'
  | 'non_halal'
  | 'not_specified';

export interface HalalCertInfo {
  certNumber: string;
  issuingAuthority: string; // e.g. "MUIS (Majlis Ugama Islam Singapura)"
  expiryDate: string;
  verified: boolean;
  notes?: string;
}

export type MainCategory =
  | 'Bakes & Desserts'
  | 'Home-Cooked Food'
  | 'Snacks & Finger Food'
  | 'Gift & Seasonal';

export interface Seller {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage: string;
  images: [string, string, string]; // 3 distinct high-res food images for the listing
  tagline: string;
  bio: string;
  neighborhood: string;
  region: SGRegion;
  fullAddress: string;
  postalCode: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  hygieneGrade: 'A' | 'B' | 'Certified Home Baker';
  badgeText?: string;
  instagram: string;
  website?: string;
  minLeadTime: string;
  deliveryFee: number;
  freeDeliveryThreshold?: number;
  selfCollectionAvailable: boolean;
  selfCollectionAddress?: string;
  groupBuyAvailable?: boolean;
  foodStatus: FoodStatus;
  halalCertInfo?: HalalCertInfo;
  mainCategory: MainCategory;
  subCategories: string[];
  cuisineTags: string[];
  joinedDate: string;
  totalOrdersFulfilled: number;
  latitude?: number;
  longitude?: number;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  mainCategory?: MainCategory;
  subCategory?: string;
  unitLabel: string;
  foodStatus?: FoodStatus;
  dietaryTags: string[];
  isSignature?: boolean;
}

export interface FlashDrop {
  id: string;
  sellerId: string;
  productId: string;
  title: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  totalBatch: number;
  remainingBatch: number;
  openingTime: string; // ISO String
  closingTime: string; // ISO String
  fulfillmentDate: string; // e.g. "Today, 4:30 PM - 7:30 PM" or date
  isVipEarlyAccess?: boolean;
  vipEarlyWindowMinutes?: number;
  status: DropStatus;
  neighborhood: string;
  region: SGRegion;
  deliveryAvailable: boolean;
  selfCollectionAvailable: boolean;
  groupBuyAvailable?: boolean;
  foodStatus: FoodStatus;
  halalCertInfo?: HalalCertInfo;
  mainCategory: MainCategory;
  subCategory?: string;
  dietaryTags: string[];
  flavorNotes: string[];
}

export interface MultiFilterState {
  locations: string[]; // List of selected neighbourhoods
  regions: SGRegion[]; // List of selected whole regions
  nearMe: boolean;
  foodStatuses: FoodStatus[];
  mainCategories: MainCategory[];
  subCategories: string[];
  minPrice: number;
  maxPrice: number;
  fulfilment: Array<'delivery' | 'self_collection' | 'group_buy'>;
  availability: Array<'live' | 'today' | 'tomorrow' | 'preorder'>;
}

export interface CartItem {
  id: string;
  dropId?: string;
  productId: string;
  sellerId: string;
  sellerName: string;
  title: string;
  image: string;
  unitPrice: number;
  quantity: number;
  fulfillmentDate?: string;
  deliveryOption: 'delivery' | 'self_collection';
}

export interface OrderItem {
  productId: string;
  dropId?: string;
  title: string;
  quantity: number;
  price: number;
  image: string;
  unitLabel?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerPostalCode: string;
  deliveryOption: 'delivery' | 'self_collection';
  deliveryTimeslot: string;
  specialInstructions?: string;
  paymentMethod: 'paynow' | 'credit_card' | 'paylah';
  paymentStatus: 'paid' | 'pending';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  vipDiscount: number;
  total: number;
  status: OrderStatus;
  sellerId: string;
  sellerName: string;
  sellerNeighborhood: string;
  sellerAddress: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverPhoto?: string;
  driverVehicle?: string;
  driverRating?: number;
  driverEtaMinutes?: number;
  driverCoordinates?: { lat: number; lng: number };
  createdAt: string;
  estimatedDeliveryTime: string;
  statusTimeline: Array<{
    status: OrderStatus;
    timestamp: string;
    description: string;
  }>;
}

export interface Review {
  id: string;
  sellerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  dishName: string;
  date: string;
  verifiedBuyer: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'drop_live' | 'drop_urgent' | 'order_update' | 'vip_perk' | 'driver_matched' | 'general';
  dropId?: string;
  orderId?: string;
}

export interface DriverProfile {
  id: string;
  name: string;
  phone: string;
  photo: string;
  vehicleType: 'Scooter / Motorcycle' | 'Bicycle / E-bike' | 'Car / Van';
  vehiclePlate: string;
  rating: number;
  totalDeliveries: number;
  isOnline: boolean;
  preferredZones: string[];
  todayEarnings: number;
  activeOrderId?: string;
}

export interface UserPreferences {
  isLoggedIn: boolean;
  name: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  selectedNeighborhood: string;
  isVip: boolean;
  vipExpiryDate?: string;
  dietaryPreference?: string;
  favoriteSellerIds: string[];
  pushNotificationsEnabled: boolean;
  soundAlertsEnabled: boolean;
}
