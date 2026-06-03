export type BasketItem = {
  id: string;
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  ticketType: string;
  category: string;
  section: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type AddBasketItemPayload = Omit<BasketItem, "id" | "lineTotal">;

export type CustomerFormValues = {
  fullName: string;
  email: string;
  phone: string;
};

export type PaymentFormValues = {
  cardHolder: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};

export type CheckoutFormValues = CustomerFormValues &
  PaymentFormValues & {
    termsAccepted: boolean;
  };

export type CheckoutCompleteRequest = {
  basketItems: BasketItem[];
  totalPrice: number;
  customer: CustomerFormValues;
  payment: PaymentFormValues;
};

export type CheckoutCompleteResponse = {
  success: boolean;
  orderId: string;
  message: string;
};
