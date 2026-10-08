import { Product, Vendor, Order, CustomerNotification, CustomerUser } from '../types';
import { ALL_ELECTRONICS_PRODUCTS, ELECTRONICS_VENDORS } from './products';

export const VENDORS: Vendor[] = ELECTRONICS_VENDORS;
export const PRODUCTS: Product[] = ALL_ELECTRONICS_PRODUCTS;

export const DEMO_USER: CustomerUser = {
  id: 'cust_01',
  name: 'Muhammad Usman',
  phone: '0300-1234567',
  email: 'usman.tech@gmail.com',
  city: 'Karachi',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  joinedDate: 'January 2024',
  savedAddresses: [
    {
      id: 'addr_1',
      label: 'Home',
      fullName: 'Muhammad Usman',
      phone: '0300-1234567',
      alternativePhone: '0321-9876543',
      streetAddress: 'Apartment 402, Al-Razi Heights, Block 13-D',
      areaLandmark: 'Opposite Expo Centre, Gulshan-e-Iqbal',
      city: 'Karachi',
      province: 'Sindh',
      postalCode: '75300',
      isDefault: true
    },
    {
      id: 'addr_2',
      label: 'Office',
      fullName: 'Muhammad Usman',
      phone: '0300-1234567',
      streetAddress: 'Tech Tower, Level 5, Suite 502',
      areaLandmark: 'Main Shahrah-e-Faisal near Baloch Colony',
      city: 'Karachi',
      province: 'Sindh',
      postalCode: '75400',
      isDefault: false
    },
    {
      id: 'addr_3',
      label: 'Parents House',
      fullName: 'Haji Mehmood Alam',
      phone: '0321-9876543',
      streetAddress: 'House 18-B, Sector C, Bahria Town',
      areaLandmark: 'Near Talwar Chowk',
      city: 'Lahore',
      province: 'Punjab',
      postalCode: '53720',
      isDefault: false
    }
  ]
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ZM-98102',
    date: '2026-03-28',
    items: [
      {
        product: PRODUCTS[0], // iPhone 16 Pro Max
        quantity: 1,
        selectedColor: 'Natural Titanium'
      }
    ],
    subtotalPKR: 489999,
    shippingFeePKR: 0,
    discountPKR: 10000,
    totalPKR: 479999,
    shippingAddress: DEMO_USER.savedAddresses[0],
    paymentMethod: 'cod',
    paymentStatus: 'pending_cod',
    status: 'in_transit',
    trackingNumber: 'TCS-PK-774920',
    courierProvider: 'TCS Express Courier',
    estimatedDelivery: 'Tomorrow by 4:00 PM',
    timeline: [
      {
        status: 'Order Placed',
        description: 'Order confirmed with Cash on Delivery (PTA Approved verified)',
        timestamp: '28 Mar, 02:15 PM',
        done: true
      },
      {
        status: 'Dispatched by TechHaven Karachi',
        description: 'Quality inspected, IMEI logged and tamper-proof bagged',
        timestamp: '29 Mar, 10:30 AM',
        done: true
      },
      {
        status: 'Handed over to TCS Express',
        description: 'Transit scan at Saddar Hub, Karachi',
        timestamp: '29 Mar, 06:45 PM',
        done: true
      },
      {
        status: 'Out for Doorstep Delivery',
        description: 'Assigned to courier rider for secure verification',
        timestamp: 'Pending arrival at Gulshan Station',
        done: false
      }
    ]
  },
  {
    id: 'ZM-94301',
    date: '2026-03-12',
    items: [
      {
        product: PRODUCTS.find((p) => p.id === 'aud_1') || PRODUCTS[1], // Sony WH-1000XM5
        quantity: 1,
        selectedColor: 'Silver'
      }
    ],
    subtotalPKR: 98999,
    shippingFeePKR: 0,
    discountPKR: 5000,
    totalPKR: 93999,
    shippingAddress: DEMO_USER.savedAddresses[0],
    paymentMethod: 'jazzcash',
    paymentStatus: 'paid',
    status: 'delivered',
    trackingNumber: 'TCS-PK-651049',
    courierProvider: 'TCS Express Courier',
    estimatedDelivery: 'Delivered on 14 Mar',
    timeline: [
      {
        status: 'Order Placed',
        description: 'Paid via JazzCash Wallet',
        timestamp: '12 Mar, 11:20 AM',
        done: true
      },
      {
        status: 'Dispatched from Lahore Audio Labs',
        description: 'Handed to TCS Gulberg Hub',
        timestamp: '13 Mar, 01:10 PM',
        done: true
      },
      {
        status: 'Delivered',
        description: 'Received by Muhammad Usman at Karachi with inspection pass',
        timestamp: '14 Mar, 03:45 PM',
        done: true
      }
    ]
  },
  {
    id: 'ZM-88942',
    date: '2026-02-18',
    items: [
      {
        product: PRODUCTS.find((p) => p.id === 'acc_1') || PRODUCTS[2], // Anker 737 Power Bank
        quantity: 1
      },
      {
        product: PRODUCTS.find((p) => p.id === 'acc_2') || PRODUCTS[3], // Anker Prime 67W Charger
        quantity: 1
      }
    ],
    subtotalPKR: 49998,
    shippingFeePKR: 0,
    discountPKR: 3000,
    totalPKR: 46998,
    shippingAddress: DEMO_USER.savedAddresses[1],
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    status: 'delivered',
    trackingNumber: 'LCS-PK-430911',
    courierProvider: 'Leopards Courier Service',
    estimatedDelivery: 'Delivered on 21 Feb',
    timeline: [
      {
        status: 'Delivered',
        description: 'Delivered to Shahrah-e-Faisal office reception',
        timestamp: '21 Feb, 02:10 PM',
        done: true
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: CustomerNotification[] = [
  {
    id: 'notif_1',
    title: 'Consignment In Transit (TCS #774920)',
    message: 'Your Apple iPhone 16 Pro Max (PTA Approved) is out for delivery in Gulshan-e-Iqbal, Karachi today.',
    date: '2 hours ago',
    read: false,
    type: 'shipping'
  },
  {
    id: 'notif_2',
    title: 'Official Warranty Registered',
    message: 'Your Sony WH-1000XM5 headphones local warranty has been activated with Sony Pakistan authorized service.',
    date: '1 day ago',
    read: true,
    type: 'promo'
  },
  {
    id: 'notif_3',
    title: 'Flash Sale: NVIDIA RTX 40-Series & Gaming Rigs',
    message: 'Hall Road Gaming & Components launched exclusive weekend deals up to Rs. 25,000 off with code TECH5000.',
    date: '3 days ago',
    read: true,
    type: 'promo'
  }
];
