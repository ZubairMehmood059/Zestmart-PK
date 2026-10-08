export const PAKISTAN_CITIES = [
  { name: 'Karachi', province: 'Sindh', deliveryDays: '1-2 Days', shippingFee: 150 },
  { name: 'Lahore', province: 'Punjab', deliveryDays: '1-2 Days', shippingFee: 150 },
  { name: 'Islamabad', province: 'Federal', deliveryDays: '1-2 Days', shippingFee: 150 },
  { name: 'Rawalpindi', province: 'Punjab', deliveryDays: '1-2 Days', shippingFee: 150 },
  { name: 'Faisalabad', province: 'Punjab', deliveryDays: '2-3 Days', shippingFee: 180 },
  { name: 'Multan', province: 'Punjab', deliveryDays: '2-3 Days', shippingFee: 180 },
  { name: 'Peshawar', province: 'KPK', deliveryDays: '2-3 Days', shippingFee: 180 },
  { name: 'Quetta', province: 'Balochistan', deliveryDays: '3-4 Days', shippingFee: 220 },
  { name: 'Sialkot', province: 'Punjab', deliveryDays: '2-3 Days', shippingFee: 180 },
  { name: 'Gujranwala', province: 'Punjab', deliveryDays: '2-3 Days', shippingFee: 180 },
  { name: 'Hyderabad', province: 'Sindh', deliveryDays: '2-3 Days', shippingFee: 180 },
  { name: 'Abbottabad', province: 'KPK', deliveryDays: '2-3 Days', shippingFee: 180 },
  { name: 'Bahawalpur', province: 'Punjab', deliveryDays: '3-4 Days', shippingFee: 200 },
  { name: 'Sukkur', province: 'Sindh', deliveryDays: '3-4 Days', shippingFee: 200 },
  { name: 'Gilgit', province: 'GB', deliveryDays: '4-5 Days', shippingFee: 250 },
  { name: 'Muzaffarabad', province: 'AJK', deliveryDays: '3-4 Days', shippingFee: 220 }
] as const;

export const CATEGORIES = [
  { id: 'all', name: 'All Electronics', icon: 'Grid' },
  {
    id: 'smartphones',
    name: 'Smartphones',
    icon: 'Smartphone',
    count: 10,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'laptops',
    name: 'Laptops',
    icon: 'Laptop',
    count: 10,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'tablets',
    name: 'Tablets',
    icon: 'Tablet',
    count: 8,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'pc-components',
    name: 'PC Components',
    icon: 'Cpu',
    count: 12,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'monitors',
    name: 'Monitors',
    icon: 'Monitor',
    count: 8,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: 'Headphones',
    count: 11,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: 'Gamepad2',
    count: 10,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'cameras',
    name: 'Cameras',
    icon: 'Camera',
    count: 8,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'smart-watches',
    name: 'Smart Watches',
    icon: 'Watch',
    count: 8,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: 'Zap',
    count: 10,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'networking',
    name: 'Networking',
    icon: 'Wifi',
    count: 7,
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'smart-home',
    name: 'Smart Home',
    icon: 'Radio',
    count: 7,
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=400&q=80'
  }
] as const;

export const POPULAR_BRANDS = [
  'Apple',
  'Samsung',
  'Xiaomi',
  'Sony',
  'HP',
  'Dell',
  'Lenovo',
  'Asus',
  'Logitech',
  'Anker',
  'JBL',
  'Google',
  'OnePlus',
  'Canon',
  'DJI',
  'TP-Link',
  'MSI',
  'Razer',
  'Bose',
  'Corsair'
] as const;

export const CONDITIONS = [
  'Brand New',
  'Open Box',
  'Certified Refurbished'
] as const;

export const COURIER_PARTNERS = [
  { id: 'tcs', name: 'TCS Express', eta: 'Express 24-48 hrs', trackingPrefix: 'TCS' },
  { id: 'leopards', name: 'Leopards Courier', eta: 'Standard 48-72 hrs', trackingPrefix: 'LCS' },
  { id: 'trax', name: 'Trax Logistics', eta: 'Economy Nationwide', trackingPrefix: 'TRX' }
] as const;

export const FREE_SHIPPING_THRESHOLD_PKR = 2999;
export const DEFAULT_SHIPPING_FEE_PKR = 199;
export const ACTIVE_COUPONS: Record<string, { discountPercent: number; maxDiscountPKR: number; label: string }> = {
  ZESTPK10: { discountPercent: 10, maxDiscountPKR: 5000, label: '10% Off Electronics' },
  TECH5000: { discountPercent: 12, maxDiscountPKR: 10000, label: 'Rs. 10,000 Off Flagships' },
  WELCOMEPK: { discountPercent: 15, maxDiscountPKR: 3000, label: '15% Off First Tech Order' }
};

export const TRUST_PILLARS = [
  {
    title: 'Nationwide Cash on Delivery',
    subtitle: 'Inspect on delivery across 250+ Pakistani cities',
    icon: 'Banknote'
  },
  {
    title: '100% PTA Approved & Genuine',
    subtitle: 'Direct from authorized electronics distributors & official brand stores',
    icon: 'ShieldCheck'
  },
  {
    title: 'Official Local Warranty',
    subtitle: '7-Day replacement guarantee & manufacturer service centers',
    icon: 'RotateCcw'
  },
  {
    title: 'Tracked Insured Courier',
    subtitle: 'Tamper-proof flyer with live TCS, Leopards & Trax tracking',
    icon: 'Truck'
  }
] as const;
