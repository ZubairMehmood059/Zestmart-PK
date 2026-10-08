import { useState, useMemo, useEffect, useCallback } from 'react';
import { Product, CartItem, AppView, Order, OrderSummary, AuthSession } from './types';
import { PAKISTAN_CITIES, ACTIVE_COUPONS } from './config/constants';
import { ApiService, getCartItemKey } from './services/api';
import { SEOService } from './services/seo';
import { AnalyticsService } from './services/analytics';

import { PortalMode } from './components/layout/PortalBar';
import { TopBanner } from './components/layout/TopBanner';
import { Header } from './components/layout/Header';
import { CategoryNav } from './components/layout/CategoryNav';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';

import { HeroBanner } from './components/storefront/HeroBanner';
import { CategoryShowcase } from './components/storefront/CategoryShowcase';
import { TrustBar } from './components/storefront/TrustBar';
import { ProductGrid } from './components/storefront/ProductGrid';
import { VendorSpotlight } from './components/storefront/VendorSpotlight';
import { ShopDiscovery } from './components/storefront/ShopDiscovery';
import { FAQSection } from './components/storefront/FAQSection';
import { TestimonialsSection } from './components/storefront/TestimonialsSection';

import { ProductDetailPage } from './components/pdp/ProductDetailPage';
import { ProductDetailModal } from './components/pdp/ProductDetailModal';
import { CartPage } from './components/cart/CartPage';
import { CartDrawer } from './components/cart/CartDrawer';
import { MultiStepCheckoutPage } from './components/checkout/MultiStepCheckoutPage';
import { ThankYouPage } from './components/checkout/ThankYouPage';
import { CustomerAccountPage } from './components/account/CustomerAccountPage';
import { NotFoundPage } from './components/common/NotFoundPage';

import { SellerDashboard } from './components/seller/SellerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PortalAuthModal } from './components/auth/PortalAuthModal';
import { TrackOrderModal } from './components/account/TrackOrderModal';
import { WishlistModal } from './components/wishlist/WishlistModal';
import { PrivacyPolicyModal } from './components/legal/PrivacyPolicyModal';
import { SitemapModal } from './components/legal/SitemapModal';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // E-Commerce Data State (Connected to ApiService)
  const [allProducts, setAllProducts] = useState<Product[]>(ApiService.getProducts());
  const [cart, setCart] = useState<CartItem[]>(ApiService.getCart());
  const [wishlist, setWishlist] = useState<string[]>(ApiService.getWishlist());
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('ZESTPK10');

  // Auth Session State
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => ApiService.getAuthSession());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTarget, setAuthModalTarget] = useState<'storefront' | 'seller' | 'admin' | 'customer'>('seller');

  // Portal Mode (Multi-tenant: Storefront | Seller Centre | Super Admin)
  const [currentPortal, setCurrentPortal] = useState<PortalMode>('storefront');

  // Navigation View State (within Storefront)
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedCity, setSelectedCity] = useState<string>('Karachi');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilterTab, setActiveFilterTab] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');
  const [activeMobileTab, setActiveMobileTab] = useState<
    'home' | 'categories' | 'wishlist' | 'cart' | 'account'
  >('home');

  // Active PDP Product & Last Order
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(() => {
    const orders = ApiService.getOrders();
    return orders.length > 0 ? orders[0] : null;
  });

  // Modals & Legal Overlays
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isSitemapModalOpen, setIsSitemapModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Initialize Analytics on mount
  useEffect(() => {
    AnalyticsService.init();
  }, []);

  // Synchronize cart & wishlist with ApiService
  useEffect(() => {
    ApiService.setCart(cart);
  }, [cart]);

  useEffect(() => {
    ApiService.setWishlist(wishlist);
  }, [wishlist]);

  // Route Synchronization Helper with Protected Portal Barriers
  const syncFromHash = useCallback(() => {
    const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
    if (!rawHash || rawHash === 'home') {
      setCurrentPortal('storefront');
      setCurrentView('home');
      setActiveMobileTab('home');
      return;
    }

    if (rawHash === 'seller') {
      const session = ApiService.getAuthSession();
      if (ApiService.canAccessPortal('seller', session)) {
        setCurrentPortal('seller');
      } else {
        setCurrentPortal('storefront');
        setCurrentView('home');
        window.location.hash = 'home';
        setAuthModalTarget('seller');
        setIsAuthModalOpen(true);
        showToast('Access Denied: Please sign in with an authorized Seller account.');
      }
      return;
    }

    if (rawHash === 'admin') {
      const session = ApiService.getAuthSession();
      if (ApiService.canAccessPortal('admin', session)) {
        setCurrentPortal('admin');
      } else {
        setCurrentPortal('storefront');
        setCurrentView('home');
        window.location.hash = 'home';
        setAuthModalTarget('admin');
        setIsAuthModalOpen(true);
        showToast('Access Denied: Super Admin or Staff credentials required.');
      }
      return;
    }

    setCurrentPortal('storefront');

    if (rawHash.startsWith('product')) {
      const parts = rawHash.split(/[=/]/);
      const prodId = parts[1];
      const found = allProducts.find((p) => p.id === prodId || p.slug === prodId);
      if (found) {
        setSelectedProduct(found);
        setCurrentView('product');
      } else {
        setCurrentView('404');
      }
      return;
    }

    if (rawHash.startsWith('category') || rawHash.startsWith('cat=')) {
      const cat = rawHash.replace(/^(?:category|cat)[=/]/, '').trim();
      if (cat) setSelectedCategory(cat);
      setCurrentView('shop');
      setActiveMobileTab('categories');
      return;
    }

    if (rawHash === 'shop' || rawHash === 'catalog') {
      setCurrentView('shop');
      setActiveMobileTab('categories');
      return;
    }

    if (rawHash === 'cart') {
      setCurrentView('cart');
      setActiveMobileTab('cart');
      return;
    }

    if (rawHash === 'checkout') {
      setCurrentView('checkout');
      return;
    }

    if (rawHash === 'thank-you' || rawHash === 'order-confirmed') {
      setCurrentView('thank-you');
      return;
    }

    if (rawHash === 'account' || rawHash === 'orders') {
      setCurrentView('account');
      setActiveMobileTab('account');
      return;
    }

    if (rawHash === 'faq') {
      setCurrentView('faq');
      return;
    }

    if (rawHash === 'privacy') {
      setIsPrivacyModalOpen(true);
      setCurrentView('home');
      return;
    }

    if (rawHash === 'sitemap') {
      setIsSitemapModalOpen(true);
      setCurrentView('home');
      return;
    }

    if (rawHash === '404') {
      setCurrentView('404');
      return;
    }

    // Unrecognized URL -> Custom 404
    setCurrentView('404');
  }, [allProducts]);

  // Initial route parsing and hash listener
  useEffect(() => {
    syncFromHash();
    const handleHashChange = () => {
      syncFromHash();
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [syncFromHash]);

  // Dynamic SEO Page Title, Meta Description, and OpenGraph Synchronizer
  useEffect(() => {
    let pageTitle = "Pakistan's Ultimate Electronics Marketplace";
    let metaDescription =
      "Pakistan's premier multi-vendor electronics marketplace. Official PTA approved flagships, laptops, PC gaming rigs, and computing hardware with nationwide COD.";
    let pageImage = '/og-image.svg';

    if (currentPortal === 'seller') {
      pageTitle = 'Seller Centre — Tech Importers & Brand Stores Portal';
      metaDescription = 'Manage products, fulfill nationwide customer orders, and scale electronics sales across Pakistan.';
    } else if (currentPortal === 'admin') {
      pageTitle = 'Super Admin Console & Operations Gateway';
      metaDescription = 'Centralized electronics marketplace operations, merchant compliance, and catalog governance.';
    } else {
      switch (currentView) {
        case 'home':
          pageTitle = "Pakistan's Ultimate Electronics Marketplace";
          metaDescription = "Shop 100% PTA-approved smartphones, premium laptops, GPUs, and PC components with nationwide Cash on Delivery in Pakistan.";
          break;
        case 'shop':
          pageTitle = selectedCategory !== 'all' 
            ? `${selectedCategory.toUpperCase().replace('-', ' ')} Deals & Listings | ZestMart PK` 
            : 'Explore All Tech Deals & Electronics Catalog';
          metaDescription = `Browse verified computing hardware, smartphones, laptops, and audio gear available across Pakistan with express shipping.`;
          break;
        case 'product':
          if (selectedProduct) {
            pageTitle = `${selectedProduct.title} — Buy Online with Official Warranty`;
            metaDescription = selectedProduct.shortDescription || `Order ${selectedProduct.title} at Rs. ${selectedProduct.pricePKR.toLocaleString()} with official warranty and nationwide COD.`;
            pageImage = selectedProduct.thumbnail || selectedProduct.images[0] || pageImage;
          }
          break;
        case 'cart':
          pageTitle = 'Shopping Cart & Bag';
          metaDescription = 'Review your selected tech hardware items, apply discount coupons, and proceed to secure checkout.';
          break;
        case 'checkout':
          pageTitle = 'Secure Multi-Step Checkout & Doorstep Delivery';
          metaDescription = 'Complete your Pakistani electronics order with 256-bit SSL encryption, Cloud fraud shield, and Cash on Delivery.';
          break;
        case 'thank-you':
          pageTitle = 'Order Confirmed — Thank You for Shopping';
          metaDescription = 'Your consignment has been recorded with official importer warranty and express courier dispatch.';
          break;
        case 'account':
          pageTitle = 'Customer Account & Order History';
          metaDescription = 'Manage your saved delivery addresses, track live courier shipments, and view previous hardware invoices.';
          break;
        case 'faq':
          pageTitle = 'Frequently Asked Questions & Customer Help Center';
          metaDescription = 'Get answers on PTA DIRBS approvals, Cash on Delivery doorstep inspection, warranty claims, and courier timelines.';
          break;
        case '404':
          pageTitle = '404 Page Not Found — Hardware Listing';
          metaDescription = 'The electronics listing or page you requested could not be found. Explore our latest flagship deals and categories.';
          break;
      }
    }

    SEOService.update({
      title: pageTitle,
      description: metaDescription,
      image: pageImage,
      canonicalUrl: window.location.href,
      type: currentView === 'product' ? 'product' : 'website'
    });

    AnalyticsService.trackPageView(pageTitle, window.location.hash || '#home');
  }, [currentPortal, currentView, selectedCategory, selectedProduct]);

  // Navigate view helper with hash update
  const navigateTo = (view: AppView, newCategory?: string, product?: Product) => {
    if (newCategory) setSelectedCategory(newCategory);
    if (product) setSelectedProduct(product);
    setCurrentView(view);
    setCurrentPortal('storefront');

    if (view === 'home') {
      window.location.hash = 'home';
      setActiveMobileTab('home');
    } else if (view === 'shop') {
      window.location.hash = newCategory && newCategory !== 'all' ? `category=${newCategory}` : 'shop';
      setActiveMobileTab('categories');
    } else if (view === 'product') {
      const targetProd = product || selectedProduct;
      if (targetProd) {
        window.location.hash = `product=${targetProd.id}`;
      }
    } else if (view === 'cart') {
      window.location.hash = 'cart';
      setActiveMobileTab('cart');
    } else if (view === 'checkout') {
      window.location.hash = 'checkout';
    } else if (view === 'thank-you') {
      window.location.hash = 'thank-you';
    } else if (view === 'account') {
      window.location.hash = 'account';
      setActiveMobileTab('account');
    } else if (view === 'faq') {
      window.location.hash = 'faq';
    } else if (view === 'privacy') {
      setIsPrivacyModalOpen(true);
    } else if (view === 'sitemap') {
      setIsSitemapModalOpen(true);
    } else if (view === '404') {
      window.location.hash = '404';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchPortal = (portal: PortalMode) => {
    if (portal === 'storefront') {
      setCurrentPortal('storefront');
      window.location.hash = 'home';
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const currentSession = ApiService.getAuthSession();
    if (ApiService.canAccessPortal(portal, currentSession)) {
      setCurrentPortal(portal);
      window.location.hash = portal;
    } else {
      setAuthModalTarget(portal);
      setIsAuthModalOpen(true);
      showToast(
        `Authentication Required: Sign in to access ${
          portal === 'seller' ? 'Seller Centre' : 'Admin Portal'
        }.`
      );
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    ApiService.logout();
    setAuthSession(null);
    if (currentPortal !== 'storefront') {
      setCurrentPortal('storefront');
      setCurrentView('home');
      window.location.hash = 'home';
    }
    showToast('Signed out of portal session');
  };

  const handleLoginSuccess = (session: AuthSession) => {
    setAuthSession(session);
    if (authModalTarget === 'seller' && ApiService.canAccessPortal('seller', session)) {
      setCurrentPortal('seller');
      window.location.hash = 'seller';
      showToast(`Welcome to Seller Centre, ${session.name}!`);
    } else if (authModalTarget === 'admin' && ApiService.canAccessPortal('admin', session)) {
      setCurrentPortal('admin');
      window.location.hash = 'admin';
      showToast(`Welcome to Admin Console, ${session.name}!`);
    } else {
      showToast(`Signed in as ${session.role}: ${session.name}`);
    }
  };

  // Filter & Search Logic for Homepage Picks
  const homepageProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      if (activeFilterTab === 'deals' && (!product.discountPercent || product.discountPercent < 8)) {
        return false;
      }
      if (activeFilterTab === 'smartphones' && product.category !== 'smartphones') {
        return false;
      }
      if (activeFilterTab === 'laptops' && product.category !== 'laptops') {
        return false;
      }
      if (activeFilterTab === 'pc-components' && product.category !== 'pc-components') {
        return false;
      }
      if (activeFilterTab === 'audio' && product.category !== 'audio') {
        return false;
      }
      if (activeFilterTab === 'gaming' && product.category !== 'gaming') {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesVendor = product.vendor.name.toLowerCase().includes(query);
        const matchesTags = product.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesVendor && !matchesTags) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.pricePKR - b.pricePKR;
      if (sortBy === 'price_high') return b.pricePKR - a.pricePKR;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [allProducts, selectedCategory, activeFilterTab, searchQuery, sortBy]);

  // Cart Operations
  const handleAddToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    const resolvedColor = color !== undefined ? color : (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
    const resolvedSize = size !== undefined ? size : (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    const targetKey = getCartItemKey(product.id, resolvedColor, resolvedSize);

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => (item.id || getCartItemKey(item.product.id, item.selectedColor, item.selectedSize)) === targetKey
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }

      return [
        ...prev,
        {
          id: targetKey,
          product,
          quantity: Math.max(1, quantity),
          selectedColor: resolvedColor,
          selectedSize: resolvedSize
        }
      ];
    });

    AnalyticsService.trackAddToCart(product, quantity);
    showToast(`Added "${product.title.slice(0, 24)}..." to cart`);
  };

  const handleBuyNow = (product: Product, quantity = 1, color?: string, size?: string) => {
    handleAddToCart(product, quantity, color, size);
    navigateTo('checkout');
  };

  const handleUpdateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        const key = item.id || getCartItemKey(item.product.id, item.selectedColor, item.selectedSize);
        return key === cartItemId ? { ...item, quantity } : item;
      })
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) =>
      prev.filter((item) => {
        const key = item.id || getCartItemKey(item.product.id, item.selectedColor, item.selectedSize);
        return key !== cartItemId;
      })
    );
  };

  const handleMoveToWishlist = (cartItemId: string) => {
    const targetItem = cart.find(
      (item) => (item.id || getCartItemKey(item.product.id, item.selectedColor, item.selectedSize)) === cartItemId
    );
    if (targetItem && !wishlist.includes(targetItem.product.id)) {
      setWishlist((prev) => [...prev, targetItem.product.id]);
    }
    handleRemoveItem(cartItemId);
    showToast('Saved to wishlist');
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist');
        return [...prev, productId];
      }
    });
  };

  const handleApplyCoupon = (code: string): boolean => {
    if (ACTIVE_COUPONS[code]) {
      setAppliedCoupon(code);
      showToast(`Coupon "${code}" applied: ${ACTIVE_COUPONS[code].label}`);
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  const handleOrderSuccess = (order: Order | OrderSummary) => {
    setCart([]);
    const fullOrder = 'timeline' in order ? (order as Order) : ApiService.getOrders()[0] || null;
    if (fullOrder) {
      setLastPlacedOrder(fullOrder);
    }
    const id = 'orderId' in order ? order.orderId : order.id;
    showToast(`Order #${id} booked successfully with ${order.courierProvider}!`);
    navigateTo('thank-you');
  };

  const handleProductCreated = (newProduct: Product) => {
    setAllProducts((prev) => [newProduct, ...prev.filter((p) => p.id !== newProduct.id)]);
  };

  const wishlistedProducts = useMemo(() => {
    return allProducts.filter((p) => wishlist.includes(p.id));
  }, [allProducts, wishlist]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 right-4 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* RENDER ACTIVE PORTAL */}
      {currentPortal === 'seller' ? (
        <SellerDashboard
          onSwitchPortal={handleSwitchPortal}
          products={allProducts}
          onProductCreated={handleProductCreated}
          authSession={authSession}
          onOpenAuthModal={(target) => {
            setAuthModalTarget(target || 'seller');
            setIsAuthModalOpen(true);
          }}
          onLogout={handleLogout}
        />
      ) : currentPortal === 'admin' ? (
        <AdminDashboard
          onSwitchPortal={handleSwitchPortal}
          authSession={authSession}
          onOpenAuthModal={(target) => {
            setAuthModalTarget(target || 'admin');
            setIsAuthModalOpen(true);
          }}
          onLogout={handleLogout}
        />
      ) : (
        /* CUSTOMER STOREFRONT PORTAL */
        <>
          {/* Top Banner (City selector, delivery notice, SSL indicator, sell on ZestMart, admin link, track order) */}
          <TopBanner
            selectedCity={selectedCity}
            onSelectCity={(city) => {
              setSelectedCity(city);
              showToast(`Delivery location updated to ${city}`);
            }}
            onOpenSellerPortal={() => handleSwitchPortal('seller')}
            onOpenAdminPortal={() => handleSwitchPortal('admin')}
            onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
          />

          {/* Header Contract */}
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              navigateTo('shop', cat);
            }}
            cartCount={totalCartCount}
            wishlistCount={wishlist.length}
            onOpenCart={() => setIsCartDrawerOpen(true)}
            onOpenWishlist={() => setIsWishlistModalOpen(true)}
            onOpenAccount={() => navigateTo('account')}
            onNavigate={navigateTo}
            activeView={currentView}
            authSession={authSession}
            onLogout={handleLogout}
            onOpenAuthModal={(target) => {
              setAuthModalTarget(target || 'customer');
              setIsAuthModalOpen(true);
            }}
          />

          {/* Horizontal Category Strip (Shown on Home and Shop) */}
          {(currentView === 'home' || currentView === 'shop') && (
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                if (currentView !== 'shop') navigateTo('shop', catId);
              }}
            />
          )}

          {/* Main View Router */}
          <main className="flex-1 pb-16 md:pb-0">
            {/* VIEW 1: HOME */}
            {currentView === 'home' && (
              <div className="space-y-4">
                <HeroBanner
                  onExploreDeals={() => {
                    setActiveFilterTab('deals');
                    navigateTo('shop');
                  }}
                  onExploreSellers={() => handleSwitchPortal('seller')}
                />

                <CategoryShowcase
                  selectedCategory={selectedCategory}
                  onSelectCategory={(catId) => {
                    setSelectedCategory(catId);
                    navigateTo('shop', catId);
                  }}
                />

                <TrustBar />

                <div id="marketplace-grid">
                  <ProductGrid
                    products={homepageProducts}
                    activeFilter={activeFilterTab}
                    onFilterChange={setActiveFilterTab}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    onAddToCart={handleAddToCart}
                    onOpenQuickView={(product) => {
                      setSelectedProduct(product);
                      navigateTo('product', undefined, product);
                    }}
                    wishlist={wishlist}
                    onToggleWishlist={handleToggleWishlist}
                    onClearFilters={() => {
                      setSelectedCategory('all');
                      setActiveFilterTab('all');
                      setSearchQuery('');
                    }}
                  />
                </div>

                <VendorSpotlight
                  onSelectVendor={(vendor) => {
                    setSearchQuery(vendor.name);
                    navigateTo('shop');
                  }}
                />

                {/* Testimonials Section */}
                <TestimonialsSection />

                {/* FAQ Section */}
                <FAQSection />
              </div>
            )}

            {/* VIEW 2: FULL SHOP / DISCOVERY */}
            {currentView === 'shop' && (
              <ShopDiscovery
                products={allProducts}
                category={selectedCategory}
                searchQuery={searchQuery}
                onCategoryChange={(cat) => {
                  setSelectedCategory(cat);
                  window.location.hash = cat && cat !== 'all' ? `category=${cat}` : 'shop';
                }}
                onSearchChange={(q) => {
                  setSearchQuery(q);
                }}
                onSelectProduct={(product) => {
                  setSelectedProduct(product);
                  navigateTo('product', undefined, product);
                }}
                onAddToCart={handleAddToCart}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onBackToHome={() => navigateTo('home')}
              />
            )}

            {/* VIEW 3: PRODUCT DETAIL PAGE (PDP) */}
            {currentView === 'product' && selectedProduct && (
              <ProductDetailPage
                key={selectedProduct.id}
                product={selectedProduct}
                allProducts={allProducts}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                isWishlisted={wishlist.includes(selectedProduct.id)}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                selectedCity={selectedCity}
                onBack={() => navigateTo('shop')}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  window.location.hash = `product=${p.id}`;
                }}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  navigateTo('shop', cat);
                }}
              />
            )}

            {/* VIEW 4: CART PAGE */}
            {currentView === 'cart' && (
              <CartPage
                items={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onMoveToWishlist={handleMoveToWishlist}
                onProceedToCheckout={() => navigateTo('checkout')}
                onContinueShopping={() => navigateTo('shop')}
                selectedCity={selectedCity}
                onSelectCity={setSelectedCity}
                appliedCoupon={appliedCoupon}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
              />
            )}

            {/* VIEW 5: MULTI-STEP CHECKOUT */}
            {currentView === 'checkout' && (
              <MultiStepCheckoutPage
                items={cart}
                selectedCity={selectedCity}
                appliedCoupon={appliedCoupon}
                onOrderComplete={(order) => {
                  handleOrderSuccess(order);
                  setAllProducts(ApiService.getProducts());
                }}
                onBackToCart={() => navigateTo('cart')}
                onViewAccountOrders={() => navigateTo('account')}
              />
            )}

            {/* VIEW 6: THANK YOU PAGE */}
            {currentView === 'thank-you' && (
              <ThankYouPage
                order={lastPlacedOrder}
                onNavigate={navigateTo}
                onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
              />
            )}

            {/* VIEW 7: CUSTOMER ACCOUNT PORTAL */}
            {currentView === 'account' && (
              <CustomerAccountPage
                onBackToHome={() => navigateTo('home')}
                onAddToCart={handleAddToCart}
                allProducts={allProducts}
                onProductsChange={setAllProducts}
                authSession={authSession}
                onAuthSuccess={handleLoginSuccess}
                onLogout={handleLogout}
                onOpenAuthModal={(target) => {
                  setAuthModalTarget(target || 'customer');
                  setIsAuthModalOpen(true);
                }}
              />
            )}

            {/* VIEW 8: DEDICATED FAQ PAGE */}
            {currentView === 'faq' && (
              <div className="py-8 animate-fade-in">
                <FAQSection />
              </div>
            )}

            {/* VIEW 9: 404 NOT FOUND PAGE */}
            {currentView === '404' && (
              <NotFoundPage
                onNavigate={navigateTo}
                onSearch={(q) => {
                  setSearchQuery(q);
                  navigateTo('shop');
                }}
              />
            )}
          </main>

          {/* Comprehensive Pakistani Ecommerce Footer */}
          <Footer
            onNavigate={navigateTo}
            onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
            onSwitchPortal={handleSwitchPortal}
            onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
            onOpenSitemap={() => setIsSitemapModalOpen(true)}
          />

          {/* Mobile Bottom Navigation Bar */}
          <MobileNav
            activeTab={activeMobileTab}
            onSelectTab={(tab) => {
              setActiveMobileTab(tab);
              if (tab === 'home') navigateTo('home');
              if (tab === 'categories') navigateTo('shop');
              if (tab === 'cart') navigateTo('cart');
              if (tab === 'wishlist') setIsWishlistModalOpen(true);
              if (tab === 'account') navigateTo('account');
            }}
            cartCount={totalCartCount}
            wishlistCount={wishlist.length}
          />

          {/* Quick View Product Modal */}
          <ProductDetailModal
            product={quickViewProduct}
            isOpen={!!quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            onAddToCart={handleAddToCart}
            isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
            onToggleWishlist={handleToggleWishlist}
            selectedCity={selectedCity}
          />

          {/* Slide-over Cart Drawer */}
          <CartDrawer
            isOpen={isCartDrawerOpen}
            onClose={() => setIsCartDrawerOpen(false)}
            items={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onMoveToWishlist={handleMoveToWishlist}
            onProceedToCheckout={() => {
              setIsCartDrawerOpen(false);
              navigateTo('checkout');
            }}
            selectedCity={selectedCity}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
          />

          {/* Track Consignment Modal (TCS/Leopards) */}
          <TrackOrderModal
            isOpen={isTrackOrderOpen}
            onClose={() => setIsTrackOrderOpen(false)}
          />

          {/* Wishlist Drawer/Modal */}
          <WishlistModal
            isOpen={isWishlistModalOpen}
            onClose={() => setIsWishlistModalOpen(false)}
            wishlistedProducts={wishlistedProducts}
            onRemoveFromWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
          />

          {/* Privacy Policy Legal Modal */}
          <PrivacyPolicyModal
            isOpen={isPrivacyModalOpen}
            onClose={() => setIsPrivacyModalOpen(false)}
          />

          {/* HTML Site Map Directory Modal */}
          <SitemapModal
            isOpen={isSitemapModalOpen}
            onClose={() => setIsSitemapModalOpen(false)}
            onNavigate={navigateTo}
          />
        </>
      )}

      {/* Portal Authentication & RBAC Modal */}
      <PortalAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        targetPortal={authModalTarget}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
