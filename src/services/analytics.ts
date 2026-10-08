// Google Analytics 4 (GA4) Tracking Service for ZestMart PK

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_TRACKING_ID = 'G-ZESTMARTPK';

export const AnalyticsService = {
  /**
   * Initializes Google Analytics gtag script dynamically if not present
   */
  init(): void {
    if (typeof window === 'undefined') return;

    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer?.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', GA_TRACKING_ID, {
        send_page_view: false // Managed manually for SPA hash changes
      });

      // Inject script tag
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
      document.head.appendChild(script);
    }
  },

  /**
   * Tracks SPA Virtual Page View
   */
  trackPageView(pageTitle: string, pagePath: string): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageTitle,
        page_location: window.location.href,
        page_path: pagePath,
        send_to: GA_TRACKING_ID
      });
    }
  },

  /**
   * Tracks E-Commerce Product View
   */
  trackProductView(product: { id: string; title: string; pricePKR: number; category: string }): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'PKR',
        value: product.pricePKR,
        items: [
          {
            item_id: product.id,
            item_name: product.title,
            item_category: product.category,
            price: product.pricePKR,
            quantity: 1
          }
        ]
      });
    }
  },

  /**
   * Tracks E-Commerce Add to Cart
   */
  trackAddToCart(product: { id: string; title: string; pricePKR: number; category: string }, quantity = 1): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'PKR',
        value: product.pricePKR * quantity,
        items: [
          {
            item_id: product.id,
            item_name: product.title,
            item_category: product.category,
            price: product.pricePKR,
            quantity
          }
        ]
      });
    }
  },

  /**
   * Tracks E-Commerce Purchase
   */
  trackPurchase(order: { id: string; totalPKR: number; shippingFeePKR: number; items: any[] }): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: order.id,
        value: order.totalPKR,
        currency: 'PKR',
        shipping: order.shippingFeePKR,
        items: order.items.map((i) => ({
          item_id: i.product?.id || 'prod',
          item_name: i.product?.title || 'Product',
          price: i.product?.pricePKR || 0,
          quantity: i.quantity || 1
        }))
      });
    }
  }
};
