export type UserRole = 'CUSTOMER' | 'SELLER' | 'STAFF' | 'MANAGER' | 'ADMIN';

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  vendorId?: string;
  token?: string;
  authenticatedAt?: string;
}

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  city: string;
  province: string;
  rating: number;
  ratingCount: number;
  isVerified: boolean;
  joinedYear: number;
  responseRate: string;
  deliveryPerformance: string;
  badge?: string;
  description?: string;
  bannerUrl?: string;
  ntnNumber?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userCity: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Product {
  id: string;
  sku?: string;
  title: string;
  slug: string;
  brand: string;
  vendorId: string;
  vendor: Vendor;
  category: string;
  subcategory?: string;
  condition?: 'Brand New' | 'Open Box' | 'Certified Refurbished';
  pricePKR: number;
  originalPricePKR?: number;
  discountPercent?: number;
  images: string[];
  thumbnail: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isFlashDeal?: boolean;
  isOfficial?: boolean;
  codAvailable: boolean;
  estimatedDeliveryDays: string;
  shortDescription: string;
  description: string;
  specifications: Record<string, string>;
  colors?: string[];
  sizes?: string[];
  tags: string[];
  warranty?: string;
  reviews?: Review[];
}

export interface CartItem {
  id?: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Address {
  id?: string;
  label?: string; // 'Home' | 'Office' | 'Other'
  fullName: string;
  phone: string;
  alternativePhone?: string;
  streetAddress: string;
  areaLandmark: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault?: boolean;
}

export type PaymentMethod = 'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'card';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotalPKR: number;
  shippingFeePKR: number;
  discountPKR: number;
  totalPKR: number;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending_cod' | 'refunded';
  status: 'confirmed' | 'processing' | 'dispatched' | 'in_transit' | 'delivered' | 'cancelled';
  trackingNumber: string;
  courierProvider: string;
  estimatedDelivery: string;
  cancelReason?: string;
  timeline: {
    status: string;
    description: string;
    timestamp: string;
    done: boolean;
  }[];
}

export interface OrderSummary {
  orderId: string;
  items: CartItem[];
  subtotalPKR: number;
  shippingFeePKR: number;
  discountPKR: number;
  totalPKR: number;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  trackingNumber: string;
  courierProvider: string;
  placedAt: string;
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered';
}

export interface CustomerNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'order' | 'shipping' | 'promo';
}

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  avatarUrl?: string;
  joinedDate: string;
  savedAddresses: Address[];
}

export interface FilterState {
  category: string;
  subcategory?: string;
  brand?: string;
  condition?: string;
  searchQuery: string;
  minPrice?: number;
  maxPrice?: number;
  onlyInStock: boolean;
  onlyCOD: boolean;
  onlyVerifiedVendors: boolean;
  selectedVendorId?: string;
  minRating?: number;
  sortBy: 'featured' | 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest' | 'discount';
}

export type AppView =
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'thank-you'
  | 'account'
  | 'track-order'
  | 'vendor-store'
  | 'faq'
  | 'privacy'
  | 'sitemap'
  | '404';
