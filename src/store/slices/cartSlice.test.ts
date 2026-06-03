import { describe, expect, test } from "vitest";
import cartReducer, {
  addItem,
  decreaseQuantity,
  getBasketItemCount,
  getBasketTotal,
  increaseQuantity,
} from "./cartSlice";
import type { AddBasketItemPayload } from "@/types/checkout";

const ticket: AddBasketItemPayload = {
  eventId: "event-1",
  eventSlug: "sample-event",
  eventTitle: "Sample Event",
  ticketType: "Genel Giris",
  category: "Kategori 1",
  section: "Blok A",
  unitPrice: 250,
  quantity: 2,
};

describe("cartSlice", () => {
  test("adds a ticket to the basket with a stable id and line total", () => {
    const state = cartReducer(undefined, addItem(ticket));

    expect(state.items).toEqual([
      {
        ...ticket,
        id: "event-1|Genel Giris|Kategori 1|Blok A",
        lineTotal: 500,
      },
    ]);
    expect(getBasketItemCount(state.items)).toBe(2);
    expect(getBasketTotal(state.items)).toBe(500);
  });

  test("merges matching tickets and recalculates totals", () => {
    const stateWithTicket = cartReducer(undefined, addItem(ticket));
    const state = cartReducer(
      stateWithTicket,
      addItem({
        ...ticket,
        quantity: 1,
      }),
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0]?.quantity).toBe(3);
    expect(state.items[0]?.lineTotal).toBe(750);
    expect(getBasketItemCount(state.items)).toBe(3);
    expect(getBasketTotal(state.items)).toBe(750);
  });

  test("updates quantity and removes the line when quantity reaches zero", () => {
    const addedState = cartReducer(undefined, addItem({ ...ticket, quantity: 1 }));
    const itemId = addedState.items[0]?.id ?? "";

    const increasedState = cartReducer(addedState, increaseQuantity(itemId));
    expect(increasedState.items[0]?.quantity).toBe(2);
    expect(increasedState.items[0]?.lineTotal).toBe(500);

    const decreasedState = cartReducer(increasedState, decreaseQuantity(itemId));
    expect(decreasedState.items[0]?.quantity).toBe(1);
    expect(decreasedState.items[0]?.lineTotal).toBe(250);

    const emptiedState = cartReducer(decreasedState, decreaseQuantity(itemId));
    expect(emptiedState.items).toEqual([]);
  });
});
