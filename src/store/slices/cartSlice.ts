import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AddBasketItemPayload, BasketItem } from "@/types/checkout";

type CartState = {
  items: BasketItem[];
};

const initialState: CartState = {
  items: [],
};

function createBasketItemId(item: AddBasketItemPayload) {
  return [
    item.eventId,
    item.ticketType,
    item.category,
    item.section,
  ].join("|");
}

function updateLineTotal(item: BasketItem) {
  item.lineTotal = item.unitPrice * item.quantity;
}

export function getBasketItemCount(items: BasketItem[]) {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export function getBasketTotal(items: BasketItem[]) {
  return items.reduce((total, item) => total + item.lineTotal, 0);
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<AddBasketItemPayload>) => {
      const id = createBasketItemId(action.payload);
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        updateLineTotal(existingItem);
        return;
      }

      state.items.push({
        ...action.payload,
        id,
        lineTotal: action.payload.unitPrice * action.payload.quantity,
      });
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((basketItem) => basketItem.id === action.payload);

      if (item) {
        item.quantity += 1;
        updateLineTotal(item);
      }
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((basketItem) => basketItem.id === action.payload);

      if (!item) {
        return;
      }

      if (item.quantity <= 1) {
        state.items = state.items.filter(
          (basketItem) => basketItem.id !== action.payload,
        );
        return;
      }

      item.quantity -= 1;
      updateLineTotal(item);
    },
    clearBasket: (state) => {
      state.items = [];
    },
  },
});

export const {
  addItem,
  clearBasket,
  decreaseQuantity,
  increaseQuantity,
  removeItem,
} = cartSlice.actions;
export default cartSlice.reducer;
