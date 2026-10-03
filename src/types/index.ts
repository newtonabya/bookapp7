export type UserRole = 'SYSTEM_ADMIN' | 'FINANCE' | 'PUBLISHER' | 'CUSTOMER';

export type BookStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'ARCHIVED';

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';

export type BookFormat = 'Hardcover' | 'Paperback' | 'E-book';

export interface Book {
  id: string;
  publisherId: string;
  publisherName: string;
  title: string;
  isbn: string;
  author: string;
  description: string;
  price: number;
  stockQuantity: number;
  coverImageUrl: string;
  fileUrl?: string; // Digital asset ePub/PDF
  isFeatured: boolean;
  status: BookStatus;
  format: BookFormat;
  genres: string[];
  publicationYear: number;
  pages: number;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: 'ACTIVE' | 'SUSPENDED';
  joinedAt: string;
  avatarUrl?: string;
  organization?: string;
}

export interface OrderItem {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  price: number;
  quantity: number;
  format: BookFormat;
  fileUrl?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: OrderStatus;
  txRef: string; // Flutterwave Tx Ref e.g. FLW-TX-1791053
  flwTransactionId?: string; // e.g. 8839219
  paymentMethod: 'card' | 'mobile_money' | 'bank_transfer';
  createdAt: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  items: OrderItem[];
}

export interface SystemSettings {
  flutterwavePublicKey: string;
  flutterwaveSecretKey: string;
  flutterwaveEncryptionKey: string;
  webhookSecretHash: string;
  isLiveMode: boolean;
  updatedAt: string;
  updatedBy: string;
  encryptionAlgorithm: 'AES-256-GCM';
  encryptedRecordPreview: {
    iv: string;
    ciphertext: string;
    authTag: string;
  };
}

export interface PayoutRequest {
  id: string;
  publisherId: string;
  publisherName: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
  bankName: string;
  accountNumber: string;
  accountName: string;
  requestedAt: string;
  approvedAt?: string;
  flwTransferId?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  category: 'SECURITY' | 'PAYMENT' | 'CATALOG' | 'USER_MANAGEMENT';
  userId: string;
  userEmail: string;
  userRole: UserRole;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
  selectedFormat: BookFormat;
}

export type ActiveAppView =
  | 'store_home'
  | 'store_catalog'
  | 'store_book_detail'
  | 'store_cart'
  | 'store_checkout'
  | 'store_order_success'
  | 'navigation_flow_diagram'
  | 'admin_dashboard'
  | 'finance_dashboard'
  | 'publisher_dashboard'
  | 'customer_portal';
