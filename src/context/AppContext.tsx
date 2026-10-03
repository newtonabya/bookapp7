import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ActiveAppView,
  AuditLog,
  Book,
  BookFormat,
  BookStatus,
  CartItem,
  Order,
  OrderStatus,
  PayoutRequest,
  SystemSettings,
  User,
  UserRole,
} from '../types';
import {
  INITIAL_AUDIT_LOGS,
  INITIAL_BOOKS,
  INITIAL_ORDERS,
  INITIAL_PAYOUTS,
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_USERS,
} from '../data/mockData';

interface AppContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  activeView: ActiveAppView;
  setActiveView: (view: ActiveAppView) => void;
  navigateTo: (view: ActiveAppView, bookId?: string) => void;
  
  // Catalog & Books
  books: Book[];
  selectedBookId: string | null;
  setSelectedBookId: (id: string | null) => void;
  submitBook: (newBook: Omit<Book, 'id' | 'createdAt' | 'reviewsCount' | 'rating'>) => void;
  updateBookStatus: (bookId: string, status: BookStatus, reviewNote?: string) => void;
  
  // Cart
  cartItems: CartItem[];
  addToCart: (book: Book, format: BookFormat, quantity?: number) => void;
  removeFromCart: (bookId: string, format: BookFormat) => void;
  updateCartQuantity: (bookId: string, format: BookFormat, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  
  // Orders & Flutterwave Checkout
  orders: Order[];
  recentOrderId: string | null;
  processCheckoutOrder: (params: {
    customerName: string;
    customerEmail: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    paymentMethod: 'card' | 'mobile_money' | 'bank_transfer';
    flwTxRef: string;
    flwTransactionId: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // System Settings (Dynamic Secret Injection)
  settings: SystemSettings;
  updatePaymentSettings: (updated: {
    publicKey: string;
    secretKey: string;
    encryptionKey: string;
    webhookSecretHash: string;
    isLiveMode: boolean;
  }) => void;
  testPaymentConnection: () => Promise<{ success: boolean; message: string; latencyMs: number }>;
  
  // Payouts
  payouts: PayoutRequest[];
  requestPayout: (amount: number, bankName: string, accountNumber: string, accountName: string) => void;
  updatePayoutStatus: (payoutId: string, status: 'APPROVED' | 'PAID' | 'REJECTED') => void;
  
  // Users & RBAC
  users: User[];
  updateUserRole: (userId: string, newRole: UserRole) => void;
  toggleUserStatus: (userId: string) => void;
  
  // Audit Logs
  auditLogs: AuditLog[];
  logAction: (action: string, category: AuditLog['category'], details: string) => void;
  
  // Toast notifications
  toast: { text: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
  
  // User Flow Diagram Jump
  jumpToNode: (targetRole: UserRole, targetView: ActiveAppView, bookId?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setRoleState] = useState<UserRole>('CUSTOMER');
  const [activeView, setActiveView] = useState<ActiveAppView>('store_home');
  const [selectedBookId, setSelectedBookId] = useState<string | null>('book-001');
  const [recentOrderId, setRecentOrderId] = useState<string | null>('ord-8821');
  
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [payouts, setPayouts] = useState<PayoutRequest[]>(INITIAL_PAYOUTS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SYSTEM_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      book: INITIAL_BOOKS[0],
      quantity: 1,
      selectedFormat: 'Hardcover',
    },
  ]);
  
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    // Contextual routing when role changes
    if (newRole === 'SYSTEM_ADMIN' && !activeView.startsWith('admin_') && activeView !== 'navigation_flow_diagram') {
      setActiveView('admin_dashboard');
    } else if (newRole === 'FINANCE' && !activeView.startsWith('finance_') && activeView !== 'navigation_flow_diagram') {
      setActiveView('finance_dashboard');
    } else if (newRole === 'PUBLISHER' && !activeView.startsWith('publisher_') && activeView !== 'navigation_flow_diagram') {
      setActiveView('publisher_dashboard');
    } else if (newRole === 'CUSTOMER' && (activeView.startsWith('admin_') || activeView.startsWith('finance_') || activeView.startsWith('publisher_'))) {
      setActiveView('store_home');
    }
    showToast(`Switched active view persona to: ${newRole.replace('_', ' ')}`, 'info');
  };

  const navigateTo = (view: ActiveAppView, bookId?: string) => {
    if (bookId) {
      setSelectedBookId(bookId);
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logAction = (action: string, category: AuditLog['category'], details: string) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      action,
      category,
      userId: currentRole === 'SYSTEM_ADMIN' ? 'user-admin-1' : currentRole === 'FINANCE' ? 'user-fin-1' : 'user-pub-1',
      userEmail: currentRole === 'SYSTEM_ADMIN' ? 'admin@folio-spine.com' : currentRole === 'FINANCE' ? 'finance@folio-spine.com' : 'publisher@atelierpress.org',
      userRole: currentRole,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '194.72.18.91',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Cart operations
  const addToCart = (book: Book, format: BookFormat, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.book.id === book.id && item.selectedFormat === format);
      if (existing) {
        return prev.map((item) =>
          item.book.id === book.id && item.selectedFormat === format
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { book, selectedFormat: format, quantity }];
    });
    showToast(`Added "${book.title}" to bag`);
  };

  const removeFromCart = (bookId: string, format: BookFormat) => {
    setCartItems((prev) => prev.filter((item) => !(item.book.id === bookId && item.selectedFormat === format)));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (bookId: string, format: BookFormat, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId, format);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.book.id === bookId && item.selectedFormat === format ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Books
  const submitBook = (newBookData: Omit<Book, 'id' | 'createdAt' | 'reviewsCount' | 'rating'>) => {
    const newBook: Book = {
      ...newBookData,
      id: `book-${Date.now()}`,
      createdAt: new Date().toISOString(),
      reviewsCount: 0,
      rating: 5.0,
      status: 'PENDING_APPROVAL',
    };
    setBooks((prev) => [newBook, ...prev]);
    logAction(
      'SUBMIT_BOOK_FOR_APPROVAL',
      'CATALOG',
      `Submitted title "${newBook.title}" (ISBN: ${newBook.isbn}) for review.`
    );
    showToast(`"${newBook.title}" submitted to Admin for catalog approval!`);
  };

  const updateBookStatus = (bookId: string, status: BookStatus, reviewNote?: string) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, status } : b))
    );
    const book = books.find((b) => b.id === bookId);
    logAction(
      'CATALOG_MODERATION',
      'CATALOG',
      `Updated status for "${book?.title || bookId}" to ${status}${reviewNote ? ` (Note: ${reviewNote})` : ''}.`
    );
    showToast(`Book status updated to ${status}`);
  };

  // Orders & Flutterwave Checkout
  const processCheckoutOrder = ({
    customerName,
    customerEmail,
    street,
    city,
    state,
    country,
    zipCode,
    paymentMethod,
    flwTxRef,
    flwTransactionId,
  }: {
    customerName: string;
    customerEmail: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    paymentMethod: 'card' | 'mobile_money' | 'bank_transfer';
    flwTxRef: string;
    flwTransactionId: string;
  }): Order => {
    const orderItems = cartItems.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      bookId: item.book.id,
      bookTitle: item.book.title,
      bookAuthor: item.book.author,
      bookCover: item.book.coverImageUrl,
      price: item.book.price,
      quantity: item.quantity,
      format: item.selectedFormat,
      fileUrl: item.book.fileUrl,
    }));

    const newOrder: Order = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: 'user-cust-1',
      customerName,
      customerEmail,
      totalAmount: cartTotal,
      status: 'PAID',
      txRef: flwTxRef,
      flwTransactionId,
      paymentMethod,
      createdAt: new Date().toISOString(),
      deliveryAddress: {
        street,
        city,
        state,
        country,
        zipCode,
      },
      items: orderItems,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setRecentOrderId(newOrder.id);
    clearCart();

    // Decrement physical stock
    setBooks((prev) =>
      prev.map((b) => {
        const matchingItem = orderItems.find((oi) => oi.bookId === b.id);
        if (matchingItem && b.stockQuantity > 0) {
          return { ...b, stockQuantity: Math.max(0, b.stockQuantity - matchingItem.quantity) };
        }
        return b;
      })
    );

    logAction(
      'FLW_PAYMENT_SUCCESS',
      'PAYMENT',
      `Flutterwave transaction verified: Order #${newOrder.id} for $${newOrder.totalAmount.toFixed(2)} (TxRef: ${flwTxRef}). Decrypted DB secret key utilized for signature verification.`
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    logAction('ORDER_STATUS_CHANGED', 'PAYMENT', `Updated order #${orderId} status to ${status}.`);
    showToast(`Order #${orderId} marked as ${status}`);
  };

  // Payment Settings (Dynamic DB Secret Key Injection)
  const updatePaymentSettings = ({
    publicKey,
    secretKey,
    encryptionKey,
    webhookSecretHash,
    isLiveMode,
  }: {
    publicKey: string;
    secretKey: string;
    encryptionKey: string;
    webhookSecretHash: string;
    isLiveMode: boolean;
  }) => {
    // Generate pseudo AES-256-GCM ciphertext preview
    const randomHex = (len: number) => Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const previewIv = randomHex(24);
    const previewCipher = randomHex(72);
    const previewTag = randomHex(32);

    const updatedSettings: SystemSettings = {
      flutterwavePublicKey: publicKey,
      flutterwaveSecretKey: secretKey,
      flutterwaveEncryptionKey: encryptionKey,
      webhookSecretHash,
      isLiveMode,
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin@folio-spine.com',
      encryptionAlgorithm: 'AES-256-GCM',
      encryptedRecordPreview: {
        iv: previewIv,
        ciphertext: previewCipher,
        authTag: previewTag,
      },
    };

    setSettings(updatedSettings);
    logAction(
      'UPDATE_DYNAMIC_FLW_KEYS',
      'SECURITY',
      `Injected new encrypted Flutterwave API credentials into PostgreSQL system_settings table (Mode: ${isLiveMode ? 'LIVE' : 'TEST'}, Algorithm: AES-256-GCM).`
    );
    showToast('Flutterwave Secret Keys securely encrypted and stored in PostgreSQL database!');
  };

  const testPaymentConnection = async (): Promise<{ success: boolean; message: string; latencyMs: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Flutterwave v3 API connection verified. Decrypted runtime merchant signature authenticated successfully.',
          latencyMs: 142,
        });
      }, 700);
    });
  };

  // Payouts
  const requestPayout = (amount: number, bankName: string, accountNumber: string, accountName: string) => {
    const newPayout: PayoutRequest = {
      id: `payout-${Date.now().toString().slice(-4)}`,
      publisherId: 'user-pub-1',
      publisherName: 'Atelier Press & Co.',
      amount,
      status: 'PENDING',
      bankName,
      accountNumber,
      accountName,
      requestedAt: new Date().toISOString(),
    };
    setPayouts((prev) => [newPayout, ...prev]);
    logAction('REQUEST_PAYOUT', 'PAYMENT', `Publisher requested withdrawal of $${amount.toFixed(2)} to ${bankName}.`);
    showToast(`Withdrawal request for $${amount.toFixed(2)} submitted to Finance!`);
  };

  const updatePayoutStatus = (payoutId: string, status: 'APPROVED' | 'PAID' | 'REJECTED') => {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? {
              ...p,
              status,
              approvedAt: status === 'APPROVED' || status === 'PAID' ? new Date().toISOString() : p.approvedAt,
              flwTransferId: status === 'PAID' ? `FLW-TRF-${Math.floor(100000 + Math.random() * 900000)}` : p.flwTransferId,
            }
          : p
      )
    );
    const payout = payouts.find((p) => p.id === payoutId);
    logAction(
      'PAYOUT_PROCESSED',
      'PAYMENT',
      `Finance updated payout #${payoutId} for ${payout?.publisherName} ($${payout?.amount.toFixed(2)}) to ${status}.`
    );
    showToast(`Payout #${payoutId} marked as ${status}`);
  };

  // Users & RBAC
  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    const targetUser = users.find((u) => u.id === userId);
    logAction(
      'USER_ROLE_UPDATED',
      'USER_MANAGEMENT',
      `Modified role for user "${targetUser?.fullName || userId}" (${targetUser?.email}) to ${newRole}.`
    );
    showToast(`Role for ${targetUser?.fullName || 'user'} updated to ${newRole}`);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          logAction(
            'USER_STATUS_TOGGLED',
            'USER_MANAGEMENT',
            `Changed user status for ${u.email} to ${nextStatus}.`
          );
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    showToast('User status updated');
  };

  const jumpToNode = (targetRole: UserRole, targetView: ActiveAppView, bookId?: string) => {
    setRoleState(targetRole);
    if (bookId) setSelectedBookId(bookId);
    setActiveView(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Navigated to ${targetView.replace('_', ' ')} as ${targetRole}`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setRole,
        activeView,
        setActiveView,
        navigateTo,
        books,
        selectedBookId,
        setSelectedBookId,
        submitBook,
        updateBookStatus,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        orders,
        recentOrderId,
        processCheckoutOrder,
        updateOrderStatus,
        settings,
        updatePaymentSettings,
        testPaymentConnection,
        payouts,
        requestPayout,
        updatePayoutStatus,
        users,
        updateUserRole,
        toggleUserStatus,
        auditLogs,
        logAction,
        toast,
        showToast,
        jumpToNode,
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
