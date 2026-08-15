import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  Seller,
  Product,
  FlashDrop,
  Order,
  CartItem,
  Review,
  DriverProfile,
  NotificationItem,
  UserPreferences,
  OrderStatus,
  MultiFilterState,
  FoodStatus,
  MainCategory,
  SGRegion,
  CustomerTab,
} from '../types';
import {
  INITIAL_SELLERS,
  INITIAL_PRODUCTS,
  INITIAL_FLASH_DROPS,
  INITIAL_ORDERS,
  INITIAL_DRIVERS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

const DEFAULT_MULTI_FILTERS: MultiFilterState = {
  locations: [],
  regions: [],
  nearMe: false,
  foodStatuses: [],
  mainCategories: [],
  subCategories: [],
  minPrice: 0,
  maxPrice: 100,
  fulfilment: [],
  availability: [],
};

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeCustomerTab: CustomerTab;
  setActiveCustomerTab: (tab: CustomerTab) => void;
  activeSellerTab: 'dashboard' | 'products' | 'drops' | 'orders' | 'analytics' | 'profile';
  setActiveSellerTab: (tab: 'dashboard' | 'products' | 'drops' | 'orders' | 'analytics' | 'profile') => void;
  activeDriverTab: 'available' | 'active' | 'deliveries' | 'earnings' | 'history' | 'profile';
  setActiveDriverTab: (tab: 'available' | 'active' | 'deliveries' | 'earnings' | 'history' | 'profile') => void;

  sellers: Seller[];
  products: Product[];
  drops: FlashDrop[];
  orders: Order[];
  drivers: DriverProfile[];
  reviews: Review[];
  notifications: NotificationItem[];
  cart: CartItem[];
  userPrefs: UserPreferences;

  selectedNeighborhood: string;
  setSelectedNeighborhood: (n: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;

  // Multi-select filters
  multiFilters: MultiFilterState;
  setMultiFilters: React.Dispatch<React.SetStateAction<MultiFilterState>>;
  resetMultiFilters: () => void;
  isFilterModalOpen: boolean;
  setIsFilterModalOpen: (open: boolean) => void;

  // Filtered results
  filteredDrops: FlashDrop[];
  filteredSellers: Seller[];
  filteredDropsCount: number;
  filteredSellersCount: number;

  viewingSellerId: string | null;
  setViewingSellerId: (id: string | null) => void;
  viewingDropId: string | null;
  setViewingDropId: (id: string | null) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;

  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isVipModalOpen: boolean;
  setIsVipModalOpen: (open: boolean) => void;
  isCreateDropModalOpen: boolean;
  setIsCreateDropModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Actions
  login: (userData?: Partial<UserPreferences>) => void;
  logout: () => void;
  updateUserPrefs: (prefs: Partial<UserPreferences>) => void;
  addToCart: (drop: FlashDrop, quantity: number, deliveryOption?: 'delivery' | 'self_collection') => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  placeOrder: (formData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerPostalCode: string;
    deliveryOption: 'delivery' | 'self_collection';
    deliveryTimeslot: string;
    specialInstructions?: string;
    paymentMethod: 'paynow' | 'credit_card' | 'paylah';
  }) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, description?: string) => void;
  driverAcceptOrder: (orderId: string, driverId: string) => void;
  driverPickupOrder: (orderId: string) => void;
  driverCompleteDelivery: (orderId: string) => void;
  createFlashDrop: (dropData: Omit<FlashDrop, 'id' | 'remainingBatch' | 'status'>) => void;
  addProduct: (productData: Omit<Product, 'id'>) => void;
  toggleVipPass: () => void;
  toggleFavoriteSeller: (sellerId: string) => void;
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  triggerSimulatedDropAlert: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('cd_role') as UserRole) || 'customer';
  });

  const [activeCustomerTab, setActiveCustomerTab] = useState<'home' | 'discover' | 'drops' | 'orders' | 'profile'>('home');
  const [activeSellerTab, setActiveSellerTab] = useState<'dashboard' | 'products' | 'drops' | 'orders' | 'analytics' | 'profile'>('dashboard');
  const [activeDriverTab, setActiveDriverTab] = useState<'available' | 'active' | 'deliveries' | 'earnings' | 'history' | 'profile'>('available');

  const [sellers, setSellers] = useState<Seller[]>(() => {
    const saved = localStorage.getItem('cd_v5_sellers');
    return saved ? JSON.parse(saved) : INITIAL_SELLERS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('cd_v5_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [drops, setDrops] = useState<FlashDrop[]>(() => {
    const saved = localStorage.getItem('cd_v5_drops');
    return saved ? JSON.parse(saved) : INITIAL_FLASH_DROPS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('cd_v5_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [drivers, setDrivers] = useState<DriverProfile[]>(() => {
    const saved = localStorage.getItem('cd_v5_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('cd_v6_reviews');
    if (saved) {
      try {
        const parsed: Review[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_REVIEWS.length) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REVIEWS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('cd_v5_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cd_v6_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [userPrefs, setUserPrefs] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('cd_v6_user_prefs');
    return saved
      ? JSON.parse(saved)
      : {
          isLoggedIn: false,
          name: 'Guest Customer',
          email: '',
          phone: '',
          address: '',
          postalCode: '',
          selectedNeighborhood: 'All Singapore',
          isVip: false,
          favoriteSellerIds: [],
          pushNotificationsEnabled: true,
          soundAlertsEnabled: true,
        };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('All Singapore');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

  // Multi-select filters state
  const [multiFilters, setMultiFilters] = useState<MultiFilterState>(() => {
    const saved = localStorage.getItem('cd_multi_filters');
    return saved ? JSON.parse(saved) : DEFAULT_MULTI_FILTERS;
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('cd_multi_filters', JSON.stringify(multiFilters));
  }, [multiFilters]);

  const resetMultiFilters = () => {
    setMultiFilters(DEFAULT_MULTI_FILTERS);
    setSelectedNeighborhood('All Singapore');
    setSelectedCategory('All Categories');
  };

  // Filtered drops calculation
  const filteredDrops = useMemo(() => {
    return drops.filter((drop) => {
      const seller = sellers.find((s) => s.id === drop.sellerId);

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = drop.title.toLowerCase().includes(q);
        const matchTagline = drop.tagline.toLowerCase().includes(q);
        const matchDesc = drop.description.toLowerCase().includes(q);
        const matchSeller = seller?.name.toLowerCase().includes(q);
        const matchTags = drop.dietaryTags?.some((t) => t.toLowerCase().includes(q));
        const matchSub = drop.subCategory?.toLowerCase().includes(q);
        if (!matchTitle && !matchTagline && !matchDesc && !matchSeller && !matchTags && !matchSub) {
          return false;
        }
      }

      // Location / Near Me Filter
      if (multiFilters.nearMe) {
        // "Near me" matches North-East or Central or default close regions
        const isNear = drop.neighborhood === 'Punggol' || drop.neighborhood === 'Tampines' || drop.neighborhood === 'River Valley';
        if (!isNear) return false;
      } else if (multiFilters.locations.length > 0) {
        if (!multiFilters.locations.includes(drop.neighborhood)) {
          return false;
        }
      } else if (selectedNeighborhood && selectedNeighborhood !== 'All Singapore') {
        if (drop.neighborhood !== selectedNeighborhood) return false;
      }

      // Food Status Filter (Halal / Muslim-Owned / No Pork No Lard / Non-Halal)
      if (multiFilters.foodStatuses.length > 0) {
        const dropStatus = drop.foodStatus || seller?.foodStatus || 'not_specified';
        if (!multiFilters.foodStatuses.includes(dropStatus)) {
          return false;
        }
      }

      // Main Category Filter
      if (multiFilters.mainCategories.length > 0) {
        const dropMainCat = drop.mainCategory || seller?.mainCategory;
        if (!dropMainCat || !multiFilters.mainCategories.includes(dropMainCat)) {
          return false;
        }
      }

      // Subcategory Filter
      if (multiFilters.subCategories.length > 0) {
        const hasSubMatch =
          (drop.subCategory && multiFilters.subCategories.includes(drop.subCategory)) ||
          seller?.subCategories.some((sc) => multiFilters.subCategories.includes(sc));
        if (!hasSubMatch) return false;
      }

      // Single Selected Category (from top chips)
      if (selectedCategory && selectedCategory !== 'All Categories') {
        const matchMain = drop.mainCategory === selectedCategory || seller?.mainCategory === selectedCategory;
        const matchSub = drop.subCategory === selectedCategory;
        const matchCuisine = seller?.cuisineTags.includes(selectedCategory);
        if (!matchMain && !matchSub && !matchCuisine) {
          return false;
        }
      }

      // Price Range Filter
      if (drop.price < multiFilters.minPrice) return false;
      if (multiFilters.maxPrice < 100 && drop.price > multiFilters.maxPrice) return false;

      // Fulfilment Filter
      if (multiFilters.fulfilment.length > 0) {
        const matchesFulfilment = multiFilters.fulfilment.some((f) => {
          if (f === 'delivery') return drop.deliveryAvailable;
          if (f === 'self_collection') return drop.selfCollectionAvailable;
          if (f === 'group_buy') return drop.groupBuyAvailable;
          return true;
        });
        if (!matchesFulfilment) return false;
      }

      // Availability Filter
      if (multiFilters.availability.length > 0) {
        const matchesAvail = multiFilters.availability.some((a) => {
          if (a === 'live') return drop.status === 'live';
          if (a === 'today') return drop.fulfillmentDate.toLowerCase().includes('today');
          if (a === 'tomorrow') return drop.fulfillmentDate.toLowerCase().includes('tomorrow');
          if (a === 'preorder') return drop.status === 'upcoming' || drop.fulfillmentDate.toLowerCase().includes('pre-order');
          return true;
        });
        if (!matchesAvail) return false;
      }

      return true;
    });
  }, [drops, sellers, searchQuery, multiFilters, selectedNeighborhood, selectedCategory]);

  // Filtered sellers calculation
  const filteredSellers = useMemo(() => {
    return sellers.filter((seller) => {
      // Comprehensive Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = seller.name?.toLowerCase().includes(q);
        const matchTagline = seller.tagline?.toLowerCase().includes(q);
        const matchBio = seller.bio?.toLowerCase().includes(q);
        const matchNeigh = seller.neighborhood?.toLowerCase().includes(q);
        const matchRegion = seller.region?.toLowerCase().includes(q);
        const matchPostal = seller.postalCode?.toLowerCase().includes(q);
        const matchAddr = seller.fullAddress?.toLowerCase().includes(q);
        const matchMainCat = seller.mainCategory?.toLowerCase().includes(q);
        const matchTags = seller.cuisineTags?.some((t) => t.toLowerCase().includes(q));
        const matchSubs = seller.subCategories?.some((sc) => sc.toLowerCase().includes(q));
        const matchFoodStatus = seller.foodStatus?.toLowerCase().includes(q);

        // Check if any product of this seller matches
        const sellerProducts = products.filter((p) => p.sellerId === seller.id);
        const matchProduct = sellerProducts.some((p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subCategory?.toLowerCase().includes(q) ||
          p.dietaryTags?.some((t) => t.toLowerCase().includes(q))
        );

        // Check if any flash drop of this seller matches
        const sellerDrops = drops.filter((d) => d.sellerId === seller.id);
        const matchDrop = sellerDrops.some((d) =>
          d.title.toLowerCase().includes(q) ||
          d.tagline.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.subCategory?.toLowerCase().includes(q) ||
          d.dietaryTags?.some((t) => t.toLowerCase().includes(q))
        );

        if (
          !matchName &&
          !matchTagline &&
          !matchBio &&
          !matchNeigh &&
          !matchRegion &&
          !matchPostal &&
          !matchAddr &&
          !matchMainCat &&
          !matchTags &&
          !matchSubs &&
          !matchFoodStatus &&
          !matchProduct &&
          !matchDrop
        ) {
          return false;
        }
      }

      // Location
      if (multiFilters.nearMe) {
        const isNear = seller.neighborhood === 'Punggol' || seller.neighborhood === 'Tampines' || seller.neighborhood === 'River Valley';
        if (!isNear) return false;
      } else if (multiFilters.locations.length > 0) {
        if (!multiFilters.locations.includes(seller.neighborhood)) return false;
      } else if (selectedNeighborhood && selectedNeighborhood !== 'All Singapore') {
        if (seller.neighborhood !== selectedNeighborhood) return false;
      }

      // Food Status
      if (multiFilters.foodStatuses.length > 0) {
        if (!multiFilters.foodStatuses.includes(seller.foodStatus)) return false;
      }

      // Main Category
      if (multiFilters.mainCategories.length > 0) {
        if (!seller.mainCategory || !multiFilters.mainCategories.includes(seller.mainCategory)) {
          return false;
        }
      }

      // Sub Category
      if (multiFilters.subCategories.length > 0) {
        const hasSub = seller.subCategories.some((sc) => multiFilters.subCategories.includes(sc));
        if (!hasSub) return false;
      }

      // Legacy category filter
      if (selectedCategory && selectedCategory !== 'All Categories') {
        const matchMain = seller.mainCategory === selectedCategory;
        const matchSub = seller.subCategories.includes(selectedCategory);
        const matchCuisine = seller.cuisineTags.includes(selectedCategory);
        if (!matchMain && !matchSub && !matchCuisine) return false;
      }

      // Fulfilment
      if (multiFilters.fulfilment.length > 0) {
        const matchesFulfilment = multiFilters.fulfilment.some((f) => {
          if (f === 'delivery') return true;
          if (f === 'self_collection') return seller.selfCollectionAvailable;
          if (f === 'group_buy') return seller.groupBuyAvailable;
          return true;
        });
        if (!matchesFulfilment) return false;
      }

      return true;
    });
  }, [sellers, searchQuery, multiFilters, selectedNeighborhood, selectedCategory]);

  const filteredDropsCount = filteredDrops.length;
  const filteredSellersCount = filteredSellers.length;

  const [viewingSellerId, setViewingSellerId] = useState<string | null>(null);
  const [viewingDropId, setViewingDropId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState<boolean>(false);
  const [isCreateDropModalOpen, setIsCreateDropModalOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('cd_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('cd_v3_sellers', JSON.stringify(sellers));
  }, [sellers]);

  useEffect(() => {
    localStorage.setItem('cd_v3_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cd_v3_drops', JSON.stringify(drops));
  }, [drops]);

  useEffect(() => {
    localStorage.setItem('cd_v3_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cd_v3_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('cd_v6_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('cd_v3_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('cd_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cd_user_prefs', JSON.stringify(userPrefs));
  }, [userPrefs]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const addToCart = (drop: FlashDrop, quantity: number, deliveryOption: 'delivery' | 'self_collection' = 'delivery') => {
    const seller = sellers.find((s) => s.id === drop.sellerId);
    setCart((prev) => {
      const existing = prev.find((item) => item.dropId === drop.id);
      if (existing) {
        return prev.map((item) =>
          item.dropId === drop.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, drop.remainingBatch) }
            : item
        );
      }
      const newItem: CartItem = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        dropId: drop.id,
        productId: drop.productId,
        sellerId: drop.sellerId,
        sellerName: seller ? seller.name : 'Home Baker',
        title: drop.title,
        image: drop.image,
        unitPrice: drop.price,
        quantity: Math.min(quantity, drop.remainingBatch),
        fulfillmentDate: drop.fulfillmentDate,
        deliveryOption,
      };
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const login = (userData?: Partial<UserPreferences>) => {
    const updated: UserPreferences = {
      isLoggedIn: true,
      name: userData?.name || 'Shermaine Wong',
      email: userData?.email || 'shermaine.wong@gmail.com',
      phone: userData?.phone || '+65 9123 4567',
      address: userData?.address || 'Blk 248 Tampines Street 21, #08-112',
      postalCode: userData?.postalCode || '520248',
      selectedNeighborhood: userData?.selectedNeighborhood || 'Tampines',
      isVip: userData?.isVip ?? true,
      vipExpiryDate: userData?.vipExpiryDate || '2026-12-31',
      dietaryPreference: userData?.dietaryPreference || 'Halal & No Pork/Lard',
      favoriteSellerIds: userData?.favoriteSellerIds || ['seller_makcik_salmah', 'seller_bishan_botanical'],
      pushNotificationsEnabled: true,
      soundAlertsEnabled: true,
    };
    setUserPrefs(updated);
    localStorage.setItem('cd_v6_user_prefs', JSON.stringify(updated));

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `👋 Welcome back, ${updated.name}!`,
      message: `Signed in successfully. Explore fresh local bakeries in ${updated.selectedNeighborhood}.`,
      timestamp: 'Just now',
      read: false,
      type: 'general',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const logout = () => {
    const guestState: UserPreferences = {
      isLoggedIn: false,
      name: 'Guest Customer',
      email: '',
      phone: '',
      address: '',
      postalCode: '',
      selectedNeighborhood: 'All Singapore',
      isVip: false,
      favoriteSellerIds: [],
      pushNotificationsEnabled: true,
      soundAlertsEnabled: true,
    };
    setUserPrefs(guestState);
    localStorage.setItem('cd_v6_user_prefs', JSON.stringify(guestState));

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Logged Out',
      message: 'You are now browsing as a Guest. Sign in anytime to access VIP perks.',
      timestamp: 'Just now',
      read: false,
      type: 'general',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const updateUserPrefs = (prefs: Partial<UserPreferences>) => {
    setUserPrefs((prev) => {
      const updated = { ...prev, ...prefs };
      localStorage.setItem('cd_v6_user_prefs', JSON.stringify(updated));
      return updated;
    });
  };

  const placeOrder = (formData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerPostalCode: string;
    deliveryOption: 'delivery' | 'self_collection';
    deliveryTimeslot: string;
    specialInstructions?: string;
    paymentMethod: 'paynow' | 'credit_card' | 'paylah';
  }): Order => {
    const firstItem = cart[0];
    const seller = sellers.find((s) => s.id === (firstItem ? firstItem.sellerId : 'seller_anytime_bake')) || sellers[0];

    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const deliveryFee = formData.deliveryOption === 'delivery' ? (userPrefs.isVip ? 0 : seller.deliveryFee) : 0;
    const vipDiscount = userPrefs.isVip ? 2.50 : 0;
    const total = Math.max(0, subtotal + deliveryFee - vipDiscount);

    const randomOrderNum = `CD-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: randomOrderNum,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerAddress: formData.customerAddress,
      customerPostalCode: formData.customerPostalCode,
      deliveryOption: formData.deliveryOption,
      deliveryTimeslot: formData.deliveryTimeslot,
      specialInstructions: formData.specialInstructions,
      paymentMethod: formData.paymentMethod,
      paymentStatus: 'paid',
      items: cart.map((item) => ({
        productId: item.productId,
        dropId: item.dropId,
        title: item.title,
        quantity: item.quantity,
        price: item.unitPrice,
        image: item.image,
      })),
      subtotal,
      deliveryFee,
      vipDiscount,
      total,
      status: 'received',
      sellerId: seller.id,
      sellerName: seller.name,
      sellerNeighborhood: seller.neighborhood,
      sellerAddress: seller.fullAddress,
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: 'Today, ~' + new Date(Date.now() + 1000 * 60 * 60).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      statusTimeline: [
        {
          status: 'received',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: `Order received & ${formData.paymentMethod.toUpperCase()} payment verified`,
        },
      ],
    };

    // Update remaining inventory on drops
    setDrops((prev) =>
      prev.map((drop) => {
        const matchingCartItem = cart.find((c) => c.dropId === drop.id);
        if (matchingCartItem) {
          const newRemaining = Math.max(0, drop.remainingBatch - matchingCartItem.quantity);
          return {
            ...drop,
            remainingBatch: newRemaining,
            status: newRemaining === 0 ? 'sold_out' : drop.status,
          };
        }
        return drop;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);

    // Send notifications
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `🎉 Order Confirmed (${randomOrderNum})`,
      message: `Your secret drop from ${seller.name} has been placed. The baker is preparing your batch!`,
      timestamp: 'Just now',
      read: false,
      type: 'order_update',
      orderId: newOrder.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#d97706', '#10b981', '#6366f1'],
      });
    } catch {
      // ignore
    }

    clearCart();
    setIsCheckoutOpen(false);
    setTrackingOrderId(newOrder.id);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, description?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const defaultDescs: Record<OrderStatus, string> = {
            received: 'Order confirmed and paid',
            preparing: 'Baker is currently packaging and baking batch',
            ready: 'Order is packed in thermal bag and ready for collection/courier',
            driver_assigned: 'Delivery driver matched and en route to bakery',
            out_for_delivery: 'Driver has picked up the bakes and is heading to customer',
            delivered: 'Bakes successfully delivered to customer doorstep',
            cancelled: 'Order cancelled',
          };

          const newTimelineItem = {
            status: newStatus,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            description: description || defaultDescs[newStatus],
          };

          let driverDetails = {};
          if (newStatus === 'driver_assigned' && !order.driverId) {
            const primaryDriver = drivers[0];
            driverDetails = {
              driverId: primaryDriver.id,
              driverName: primaryDriver.name,
              driverPhone: primaryDriver.phone,
              driverPhoto: primaryDriver.photo,
              driverVehicle: primaryDriver.vehicleType + ' (' + primaryDriver.vehiclePlate + ')',
              driverRating: primaryDriver.rating,
              driverEtaMinutes: 14,
              driverCoordinates: { lat: 1.3521, lng: 103.8198 },
            };
          }

          return {
            ...order,
            status: newStatus,
            ...driverDetails,
            statusTimeline: [...order.statusTimeline, newTimelineItem],
          };
        }
        return order;
      })
    );

    // Notify customer
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      const notif: NotificationItem = {
        id: `notif_${Date.now()}`,
        title: `📦 Order ${order.orderNumber} Update: ${newStatus.replace(/_/g, ' ').toUpperCase()}`,
        message: description || `Your order status changed to ${newStatus.replace(/_/g, ' ')}.`,
        timestamp: 'Just now',
        read: false,
        type: 'order_update',
        orderId: order.id,
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const driverAcceptOrder = (orderId: string, driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId) || drivers[0];
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'driver_assigned',
            driverId: driver.id,
            driverName: driver.name,
            driverPhone: driver.phone,
            driverPhoto: driver.photo,
            driverVehicle: driver.vehicleType + ' (' + driver.vehiclePlate + ')',
            driverRating: driver.rating,
            driverEtaMinutes: 12,
            driverCoordinates: { lat: 1.3521, lng: 103.8198 },
            statusTimeline: [
              ...order.statusTimeline,
              {
                status: 'driver_assigned',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                description: `Driver ${driver.name} accepted dispatch order`,
              },
            ],
          };
        }
        return order;
      })
    );

    setDrivers((prev) =>
      prev.map((d) => (d.id === driver.id ? { ...d, activeOrderId: orderId } : d))
    );
  };

  const driverPickupOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'out_for_delivery', 'Driver picked up parcel from baker. Riding to customer location.');
  };

  const driverCompleteDelivery = (orderId: string) => {
    updateOrderStatus(orderId, 'delivered', 'Driver delivered parcel to doorstep. Handover complete.');
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.activeOrderId === orderId) {
          return {
            ...d,
            activeOrderId: undefined,
            todayEarnings: d.todayEarnings + 9.50,
            totalDeliveries: d.totalDeliveries + 1,
          };
        }
        return d;
      })
    );
  };

  const createFlashDrop = (dropData: Omit<FlashDrop, 'id' | 'remainingBatch' | 'status'>) => {
    const newDrop: FlashDrop = {
      ...dropData,
      id: `drop_${Date.now()}`,
      remainingBatch: dropData.totalBatch,
      status: 'live',
    };
    setDrops((prev) => [newDrop, ...prev]);

    // Send blast notification
    const blastNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `🔥 NEW SECRET DROP: ${newDrop.title}`,
      message: `${newDrop.tagline} - Only ${newDrop.totalBatch} boxes available! Pre-order now.`,
      timestamp: 'Just now',
      read: false,
      type: 'drop_live',
      dropId: newDrop.id,
    };
    setNotifications((prev) => [blastNotif, ...prev]);
    setIsCreateDropModalOpen(false);
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const toggleVipPass = () => {
    setUserPrefs((prev) => {
      const nextVip = !prev.isVip;
      if (nextVip) {
        try {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#fbbf24', '#f59e0b', '#d97706'],
          });
        } catch {
          // ignore
        }
      }
      return {
        ...prev,
        isVip: nextVip,
        vipExpiryDate: nextVip ? '2026-12-31' : undefined,
      };
    });
  };

  const toggleFavoriteSeller = (sellerId: string) => {
    setUserPrefs((prev) => {
      const exists = prev.favoriteSellerIds.includes(sellerId);
      return {
        ...prev,
        favoriteSellerIds: exists
          ? prev.favoriteSellerIds.filter((id) => id !== sellerId)
          : [...prev.favoriteSellerIds, sellerId],
      };
    });
  };

  const addReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      date: 'Just now',
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const triggerSimulatedDropAlert = () => {
    const randomDrop = drops[Math.floor(Math.random() * drops.length)];
    const simulatedNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: `⚡ FLASH ALERT: ${randomDrop.title}`,
      message: `Only ${randomDrop.remainingBatch} slots left! Pre-order closing soon.`,
      timestamp: 'Just now',
      read: false,
      type: 'drop_urgent',
      dropId: randomDrop.id,
    };
    setNotifications((prev) => [simulatedNotif, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeCustomerTab,
        setActiveCustomerTab,
        activeSellerTab,
        setActiveSellerTab,
        activeDriverTab,
        setActiveDriverTab,
        sellers,
        products,
        drops,
        orders,
        drivers,
        reviews,
        notifications,
        cart,
        userPrefs,
        selectedNeighborhood,
        setSelectedNeighborhood,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        multiFilters,
        setMultiFilters,
        resetMultiFilters,
        isFilterModalOpen,
        setIsFilterModalOpen,
        filteredDrops,
        filteredSellers,
        filteredDropsCount,
        filteredSellersCount,
        viewingSellerId,
        setViewingSellerId,
        viewingDropId,
        setViewingDropId,
        trackingOrderId,
        setTrackingOrderId,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isVipModalOpen,
        setIsVipModalOpen,
        isCreateDropModalOpen,
        setIsCreateDropModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        logout,
        updateUserPrefs,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
        driverAcceptOrder,
        driverPickupOrder,
        driverCompleteDelivery,
        createFlashDrop,
        addProduct,
        toggleVipPass,
        toggleFavoriteSeller,
        addReview,
        markNotificationRead,
        markAllNotificationsRead,
        triggerSimulatedDropAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
