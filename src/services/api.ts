import { Product, Order, Review, CustomerNotification, Address, CartItem, CustomerUser, AuthSession, UserRole, Vendor } from '../types';
import { PRODUCTS, INITIAL_ORDERS, INITIAL_NOTIFICATIONS, DEMO_USER, VENDORS } from '../config/data';

const STORAGE_KEYS = {
  PRODUCTS: 'zestmart_products_v3_electronics',
  ORDERS: 'zestmart_orders_v3_electronics',
  NOTIFICATIONS: 'zestmart_notifications_v3_electronics',
  USER: 'zestmart_user_v3_electronics',
  REGISTERED_USERS: 'zestmart_registered_users_v3',
  REGISTERED_VENDORS: 'zestmart_registered_vendors_v3',
  WISHLIST: 'zestmart_wishlist_v3_electronics',
  CART: 'zestmart_cart_v3_electronics',
  AUTH_SESSION: 'zestmart_auth_session_v3'
};

// Helper for safe localStorage access with memory store fallback
const memoryStorage: Record<string, string> = {};

function getStored<T>(key: string, fallback: T): T {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    }
    const memItem = memoryStorage[key];
    return memItem ? JSON.parse(memItem) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, serialized);
    }
    memoryStorage[key] = serialized;
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

export function getCartItemKey(productId: string, color?: string, size?: string): string {
  const normColor = color ? color.trim().toLowerCase() : '';
  const normSize = size ? size.trim().toLowerCase() : '';
  return `${productId}::${normColor}::${normSize}`;
}

export const ApiService = {
  // Products
  getProducts(): Product[] {
    const stored = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, PRODUCTS);
    return stored.map((p) => {
      const canonical = PRODUCTS.find((c) => c.id === p.id);
      if (canonical && (!p.thumbnail || p.thumbnail !== canonical.thumbnail || !p.images || p.images.length === 0)) {
        return {
          ...p,
          thumbnail: canonical.thumbnail,
          images: canonical.images
        };
      }
      return p;
    });
  },

  getProductById(id: string): Product | undefined {
    const list = this.getProducts();
    return list.find((p) => p.id === id);
  },

  addProduct(product: Product): void {
    const list = this.getProducts();
    const updated = [product, ...list];
    setStored(STORAGE_KEYS.PRODUCTS, updated);
  },

  addReview(productId: string, review: Omit<Review, 'id' | 'date' | 'helpfulCount'>): Review {
    const products = this.getProducts();
    const newReview: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      date: 'Just now',
      helpfulCount: 0
    };

    const updated = products.map((p) => {
      if (p.id === productId) {
        const existingReviews = p.reviews || [];
        const newReviews = [newReview, ...existingReviews];
        const newCount = p.reviewCount + 1;
        const totalRating = existingReviews.reduce((sum, r) => sum + r.rating, 0) + review.rating;
        const newRating = Number((totalRating / newCount).toFixed(1));

        return {
          ...p,
          reviews: newReviews,
          reviewCount: newCount,
          rating: newRating
        };
      }
      return p;
    });

    setStored(STORAGE_KEYS.PRODUCTS, updated);
    return newReview;
  },

  // Orders
  getOrders(): Order[] {
    return getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  createOrder(orderData: Omit<Order, 'id' | 'date' | 'timeline' | 'status'>): Order {
    const currentOrders = this.getOrders();
    const newOrder: Order = {
      ...orderData,
      id: `ZM-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'confirmed',
      timeline: [
        {
          status: 'Order Placed',
          description: `Order successfully booked with ${orderData.paymentMethod.toUpperCase()}`,
          timestamp: 'Just now',
          done: true
        },
        {
          status: 'Fulfillment Handover',
          description: 'Awaiting packing and dispatch by merchant',
          timestamp: 'Estimated 2-4 hours',
          done: false
        },
        {
          status: 'Handed to Courier',
          description: `Dispatch via ${orderData.courierProvider}`,
          timestamp: 'Next working cycle',
          done: false
        },
        {
          status: 'Delivered',
          description: 'Doorstep delivery at destination address',
          timestamp: orderData.estimatedDelivery,
          done: false
        }
      ]
    };

    const updated = [newOrder, ...currentOrders];
    setStored(STORAGE_KEYS.ORDERS, updated);

    // Create a confirmation notification
    this.addNotification({
      title: `Order #${newOrder.id} Placed`,
      message: `Your consignment has been booked with ${newOrder.courierProvider}. Tracking ID: ${newOrder.trackingNumber}`,
      type: 'order'
    });

    return newOrder;
  },

  cancelOrder(orderId: string, reason: string): boolean {
    const orders = this.getOrders();
    const target = orders.find((o) => o.id === orderId);
    if (!target) return false;

    // Business rule: only cancel if still confirmed or processing (prevent duplicate cancellation or cancelled/dispatched/delivered)
    if (
      target.status === 'cancelled' ||
      target.status === 'dispatched' ||
      target.status === 'in_transit' ||
      target.status === 'delivered'
    ) {
      return false;
    }

    // 1. Inventory Restocking: calculate quantities to restore per product
    if (target.items && target.items.length > 0) {
      const restockMap: Record<string, number> = {};
      for (const item of target.items) {
        if (item && item.product && item.product.id) {
          const pid = item.product.id;
          const qty = item.quantity || 1;
          restockMap[pid] = (restockMap[pid] || 0) + qty;
        }
      }

      const products = this.getProducts();
      const updatedProducts = products.map((p) => {
        const toRestore = restockMap[p.id];
        if (toRestore) {
          const newStock = (p.stockQuantity || 0) + toRestore;
          return {
            ...p,
            stockQuantity: newStock,
            inStock: newStock > 0
          };
        }
        return p;
      });

      setStored(STORAGE_KEYS.PRODUCTS, updatedProducts);
    }

    // 2. Transition Order Status to cancelled
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'cancelled' as const,
          cancelReason: reason,
          timeline: [
            ...o.timeline,
            {
              status: 'Cancelled by Customer',
              description: `Reason: ${reason}. Inventory restocked to catalog.`,
              timestamp: 'Just now',
              done: true
            }
          ]
        };
      }
      return o;
    });

    setStored(STORAGE_KEYS.ORDERS, updated);
    this.addNotification({
      title: `Order #${orderId} Cancelled`,
      message: `Cancellation processed successfully. Reason: ${reason}. Items restored to available stock.`,
      type: 'order'
    });

    return true;
  },

  // Registered Vendors & Importers
  getVendors(): Vendor[] {
    const custom = getStored<Vendor[]>(STORAGE_KEYS.REGISTERED_VENDORS, []);
    // Combine base VENDORS with custom registered vendors
    const map = new Map<string, Vendor>();
    VENDORS.forEach((v) => map.set(v.id, v));
    custom.forEach((v) => map.set(v.id, v));
    return Array.from(map.values());
  },

  addVendor(vendor: Vendor): void {
    const custom = getStored<Vendor[]>(STORAGE_KEYS.REGISTERED_VENDORS, []);
    const updated = [vendor, ...custom.filter((v) => v.id !== vendor.id)];
    setStored(STORAGE_KEYS.REGISTERED_VENDORS, updated);
  },

  // Customer Profiles & Registered Accounts
  getRegisteredUsers(): CustomerUser[] {
    return getStored<CustomerUser[]>(STORAGE_KEYS.REGISTERED_USERS, [DEMO_USER]);
  },

  saveRegisteredUsers(users: CustomerUser[]): void {
    setStored(STORAGE_KEYS.REGISTERED_USERS, users);
  },

  getUser(): CustomerUser {
    const session = this.getAuthSession();
    const users = this.getRegisteredUsers();

    if (session && session.role === 'CUSTOMER') {
      const found = users.find(
        (u) =>
          u.id === session.userId ||
          u.email.toLowerCase() === session.email.toLowerCase() ||
          (session.phone && u.phone === session.phone)
      );
      if (found) return found;
    }

    // Default to the first registered user or stored user
    return getStored<CustomerUser>(STORAGE_KEYS.USER, DEMO_USER);
  },

  updateUser(data: Partial<CustomerUser>): CustomerUser {
    const current = this.getUser();
    const updated: CustomerUser = { ...current, ...data };
    setStored(STORAGE_KEYS.USER, updated);

    // Also update in registered users list
    const users = this.getRegisteredUsers();
    const idx = users.findIndex((u) => u.id === updated.id || u.email.toLowerCase() === updated.email.toLowerCase());
    if (idx >= 0) {
      users[idx] = updated;
    } else {
      users.push(updated);
    }
    this.saveRegisteredUsers(users);

    // Update active session if customer
    const session = this.getAuthSession();
    if (session && session.role === 'CUSTOMER') {
      this.setAuthSession({
        ...session,
        name: updated.name,
        email: updated.email,
        phone: updated.phone
      });
    }

    return updated;
  },

  addAddress(address: Omit<Address, 'id'>): Address {
    const user = this.getUser();
    const newAddress: Address = {
      ...address,
      id: `addr_${Date.now()}`
    };

    let updatedAddresses = [...user.savedAddresses];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(newAddress);

    this.updateUser({ savedAddresses: updatedAddresses });
    return newAddress;
  },

  deleteAddress(addressId: string): void {
    const user = this.getUser();
    const updated = user.savedAddresses.filter((a) => a.id !== addressId);
    this.updateUser({ savedAddresses: updated });
  },

  setDefaultAddress(addressId: string): void {
    const user = this.getUser();
    const updated = user.savedAddresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId
    }));
    this.updateUser({ savedAddresses: updated });
  },

  // Notifications
  getNotifications(): CustomerNotification[] {
    return getStored<CustomerNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },

  addNotification(notif: Omit<CustomerNotification, 'id' | 'date' | 'read'>): void {
    const current = this.getNotifications();
    const newNotif: CustomerNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      date: 'Just now',
      read: false
    };
    setStored(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...current]);
  },

  markAllNotificationsRead(): void {
    const current = this.getNotifications();
    const updated = current.map((n) => ({ ...n, read: true }));
    setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  // Wishlist
  getWishlist(): string[] {
    return getStored<string[]>(STORAGE_KEYS.WISHLIST, ['prod_3']);
  },

  setWishlist(ids: string[]): void {
    setStored(STORAGE_KEYS.WISHLIST, ids);
  },

  // Cart
  getCart(): CartItem[] {
    const raw = getStored<CartItem[]>(STORAGE_KEYS.CART, [
      {
        id: getCartItemKey(PRODUCTS[0].id, 'Obsidian Black'),
        product: PRODUCTS[0],
        quantity: 1,
        selectedColor: 'Obsidian Black'
      }
    ]);

    // Normalize keys and consolidate any legacy duplicates
    const merged: Record<string, CartItem> = {};
    for (const item of raw) {
      if (!item || !item.product) continue;
      const key = item.id || getCartItemKey(item.product.id, item.selectedColor, item.selectedSize);
      if (merged[key]) {
        merged[key].quantity += (item.quantity || 1);
      } else {
        merged[key] = {
          ...item,
          id: key,
          quantity: Math.max(1, item.quantity || 1)
        };
      }
    }

    return Object.values(merged);
  },

  setCart(cart: CartItem[]): void {
    const normalized = cart.map((item) => ({
      ...item,
      id: item.id || getCartItemKey(item.product.id, item.selectedColor, item.selectedSize)
    }));
    setStored(STORAGE_KEYS.CART, normalized);
  },

  // Authentication & RBAC Session Management
  getAuthSession(): AuthSession | null {
    return getStored<AuthSession | null>(STORAGE_KEYS.AUTH_SESSION, null);
  },

  setAuthSession(session: AuthSession | null): void {
    setStored(STORAGE_KEYS.AUTH_SESSION, session);
  },

  // Customer Login
  loginCustomer(identifier: string, _password?: string): { success: boolean; user?: CustomerUser; session?: AuthSession; message?: string } {
    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId) {
      return { success: false, message: 'Please enter your registered email or Pakistani mobile number.' };
    }

    const users = this.getRegisteredUsers();
    let found = users.find(
      (u) => u.email.toLowerCase() === cleanId || u.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '')
    );

    // If not found, check if it's the demo email or create an on-the-fly customer account
    if (!found) {
      if (cleanId === 'usman.tech@gmail.com' || cleanId === '0300-1234567' || cleanId === '03001234567') {
        found = DEMO_USER;
      } else {
        // Automatically provision account for new user or let them know
        const newCustomer: CustomerUser = {
          id: `usr_${Date.now()}`,
          name: identifier.includes('@') ? identifier.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : `Customer (${identifier})`,
          email: identifier.includes('@') ? identifier : `${cleanId.replace(/[^0-9]/g, '')}@zestmart-user.pk`,
          phone: identifier.includes('@') ? '0300-9876543' : identifier,
          city: 'Karachi',
          joinedDate: new Date().toLocaleDateString('en-PK', { month: 'long', year: 'numeric' }),
          savedAddresses: [
            {
              id: `addr_${Date.now()}`,
              label: 'Primary Delivery Address',
              fullName: identifier.includes('@') ? identifier.split('@')[0] : 'Customer',
              phone: identifier.includes('@') ? '0300-9876543' : identifier,
              streetAddress: 'House / Apartment, Block 4',
              areaLandmark: 'Gulshan-e-Iqbal',
              city: 'Karachi',
              province: 'Sindh',
              postalCode: '75300',
              isDefault: true
            }
          ]
        };
        users.push(newCustomer);
        this.saveRegisteredUsers(users);
        found = newCustomer;
      }
    }

    setStored(STORAGE_KEYS.USER, found);
    const session: AuthSession = {
      userId: found.id,
      name: found.name,
      email: found.email,
      phone: found.phone,
      role: 'CUSTOMER',
      token: `zm_jwt_${Math.random().toString(36).substring(2)}_${Date.now()}`,
      authenticatedAt: new Date().toISOString()
    };
    this.setAuthSession(session);
    return { success: true, user: found, session };
  },

  // Customer Registration
  registerCustomer(data: {
    name: string;
    email: string;
    phone: string;
    city: string;
    password?: string;
  }): { success: boolean; user?: CustomerUser; session?: AuthSession; message?: string } {
    if (!data.name.trim()) return { success: false, message: 'Please provide your full name.' };
    if (!data.email.trim() || !data.email.includes('@')) return { success: false, message: 'Please provide a valid email address.' };
    if (!data.phone.trim()) return { success: false, message: 'Please provide a valid Pakistani mobile number.' };

    const users = this.getRegisteredUsers();
    const existing = users.find(
      (u) => u.email.toLowerCase() === data.email.trim().toLowerCase() || u.phone.replace(/[^0-9]/g, '') === data.phone.replace(/[^0-9]/g, '')
    );

    if (existing) {
      // Log in existing account
      return this.loginCustomer(existing.email, data.password);
    }

    const newUser: CustomerUser = {
      id: `usr_${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      city: data.city.trim() || 'Karachi',
      joinedDate: new Date().toLocaleDateString('en-PK', { month: 'long', year: 'numeric' }),
      savedAddresses: [
        {
          id: `addr_${Date.now()}`,
          label: 'Home Address',
          fullName: data.name.trim(),
          phone: data.phone.trim(),
          streetAddress: 'Main Residence, Street 1',
          areaLandmark: 'City Center',
          city: data.city.trim() || 'Karachi',
          province: data.city.toLowerCase() === 'lahore' ? 'Punjab' : data.city.toLowerCase() === 'islamabad' ? 'Federal' : 'Sindh',
          postalCode: '75300',
          isDefault: true
        }
      ]
    };

    users.push(newUser);
    this.saveRegisteredUsers(users);
    setStored(STORAGE_KEYS.USER, newUser);

    const session: AuthSession = {
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: 'CUSTOMER',
      token: `zm_jwt_${Math.random().toString(36).substring(2)}_${Date.now()}`,
      authenticatedAt: new Date().toISOString()
    };
    this.setAuthSession(session);

    this.addNotification({
      title: `Welcome to ZestMart PK, ${newUser.name.split(' ')[0]}!`,
      message: 'Your Pakistani electronics buyer account is ready. Enjoy official warranty and insured COD.',
      type: 'promo'
    });

    return { success: true, user: newUser, session };
  },

  // Seller Registration
  registerSeller(data: {
    storeName: string;
    ownerName: string;
    email: string;
    phone: string;
    city: string;
    ntn?: string;
  }): { success: boolean; vendor?: Vendor; session?: AuthSession; message?: string } {
    if (!data.storeName.trim()) return { success: false, message: 'Please provide your store name.' };
    if (!data.email.trim() || !data.email.includes('@')) return { success: false, message: 'Please provide a business email.' };

    const newVendor: Vendor = {
      id: `vendor_${Date.now()}`,
      name: data.storeName.trim(),
      slug: data.storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      city: data.city || 'Karachi',
      province: data.city.toLowerCase() === 'lahore' ? 'Punjab' : data.city.toLowerCase() === 'islamabad' ? 'Federal' : 'Sindh',
      rating: 5.0,
      ratingCount: 1,
      isVerified: true,
      joinedYear: new Date().getFullYear(),
      responseRate: '99%',
      deliveryPerformance: '100% on-time',
      badge: 'Verified Importer',
      description: `Official Pakistani electronics merchant - ${data.storeName}`,
      ntnNumber: data.ntn || `NTN-${Math.floor(1000000 + Math.random() * 9000000)}`
    };

    this.addVendor(newVendor);

    const session: AuthSession = {
      userId: `usr_seller_${Date.now()}`,
      name: `${data.ownerName || 'Merchant'} (${data.storeName})`,
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim() || '0300-9876543',
      role: 'SELLER',
      vendorId: newVendor.id,
      token: `zm_jwt_seller_${Date.now()}`,
      authenticatedAt: new Date().toISOString()
    };
    this.setAuthSession(session);

    return { success: true, vendor: newVendor, session };
  },

  // Seller Login
  loginSeller(vendorIdOrEmail: string, _password?: string): { success: boolean; session?: AuthSession; message?: string } {
    const vendors = this.getVendors();
    const found = vendors.find(
      (v) => v.id === vendorIdOrEmail || v.slug === vendorIdOrEmail || v.name.toLowerCase().includes(vendorIdOrEmail.toLowerCase())
    ) || vendors[0];

    const session: AuthSession = {
      userId: `usr_seller_${found.id}`,
      name: `Seller: ${found.name}`,
      email: `seller@${found.slug}.pk`,
      phone: '0300-8765432',
      role: 'SELLER',
      vendorId: found.id,
      token: `zm_jwt_seller_${Date.now()}`,
      authenticatedAt: new Date().toISOString()
    };
    this.setAuthSession(session);
    return { success: true, session };
  },

  // Admin Login
  loginAdmin(email: string, _password?: string, role: 'ADMIN' | 'MANAGER' | 'STAFF' = 'ADMIN'): { success: boolean; session?: AuthSession; message?: string } {
    const session: AuthSession = {
      userId: `usr_admin_${Date.now()}`,
      name:
        role === 'ADMIN'
          ? 'Super Admin (Pakistan HQ)'
          : role === 'MANAGER'
          ? 'Regional Operations Manager'
          : 'Catalog Compliance Staff',
      email: email.trim() || `${role.toLowerCase()}@zestmart.pk`,
      phone: '0321-7654321',
      role,
      token: `zm_jwt_admin_${Date.now()}`,
      authenticatedAt: new Date().toISOString()
    };
    this.setAuthSession(session);
    return { success: true, session };
  },

  loginAs(
    role: UserRole,
    options?: { name?: string; email?: string; vendorId?: string; phone?: string }
  ): AuthSession {
    const session: AuthSession = {
      userId: `usr_${Date.now()}`,
      name:
        options?.name ||
        (role === 'ADMIN'
          ? 'Super Admin (Pakistan HQ)'
          : role === 'MANAGER'
          ? 'Regional Operations Manager'
          : role === 'STAFF'
          ? 'Catalog Compliance Staff'
          : role === 'SELLER'
          ? 'Verified Seller (TechHaven PK)'
          : 'Muhammad Usman'),
      email:
        options?.email ||
        (role === 'ADMIN'
          ? 'admin@zestmart.pk'
          : role === 'MANAGER'
          ? 'operations@zestmart.pk'
          : role === 'STAFF'
          ? 'staff@zestmart.pk'
          : role === 'SELLER'
          ? 'seller@techhaven.pk'
          : 'usman.tech@gmail.com'),
      phone: options?.phone || '0300-1234567',
      role,
      vendorId: role === 'SELLER' ? options?.vendorId || 'vendor_1' : undefined,
      token: `zm_jwt_${Math.random().toString(36).substring(2)}_${Date.now()}`,
      authenticatedAt: new Date().toISOString()
    };
    this.setAuthSession(session);
    return session;
  },

  logout(): void {
    this.setAuthSession(null);
  },

  canAccessPortal(portal: 'storefront' | 'seller' | 'admin', session: AuthSession | null): boolean {
    if (portal === 'storefront') return true;
    if (!session) return false;
    if (portal === 'seller') {
      return session.role === 'SELLER' || session.role === 'ADMIN';
    }
    if (portal === 'admin') {
      return session.role === 'ADMIN' || session.role === 'MANAGER' || session.role === 'STAFF';
    }
    return false;
  }
};
