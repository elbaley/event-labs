import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { createElement } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { EventDetail } from "./event-detail";
import cartReducer from "@/store/slices/cartSlice";
import type { Event } from "@/types/event";

const routerPush = vi.hoisted(() => vi.fn());

vi.mock("next/router", () => ({
  useRouter: () => ({
    push: routerPush,
  }),
}));

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
  }: {
    alt: string;
    src: string;
  }) => createElement("img", { alt, src }),
}));

const event: Event = {
  id: "event-1",
  slug: "sample-event",
  title: "Sample Event",
  location: "Istanbul",
  date: "2026-07-12T20:00:00.000Z",
  city_id: 34,
  category: "concert",
  description: "Sample event description",
  cover: "/sample-cover.jpg",
  basePrice: 500,
};

function renderEventDetail() {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
    },
  });

  render(
    <Provider store={store}>
      <EventDetail event={event} />
    </Provider>,
  );

  return store;
}

async function selectOption(index: number, optionName: string) {
  const user = userEvent.setup();

  await user.click(screen.getAllByRole("combobox")[index]);
  await user.click(screen.getByRole("option", { name: optionName }));
}

describe("EventDetail", () => {
  beforeEach(() => {
    routerPush.mockClear();
  });

  test("adds the selected ticket to basket and navigates to basket", async () => {
    const user = userEvent.setup();
    const store = renderEventDetail();

    await selectOption(0, "VIP");
    await selectOption(1, "Kategori 1");
    await selectOption(2, "Blok A");

    fireEvent.change(screen.getByLabelText("Adet"), {
      target: { value: "3" },
    });

    await user.click(screen.getByRole("button", { name: /sepete at/i }));

    expect(store.getState().cart.items).toEqual([
      {
        id: "event-1|VIP|Kategori 1|Blok A",
        eventId: "event-1",
        eventSlug: "sample-event",
        eventTitle: "Sample Event",
        ticketType: "VIP",
        category: "Kategori 1",
        section: "Blok A",
        unitPrice: 1310,
        quantity: 3,
        lineTotal: 3930,
      },
    ]);
    expect(routerPush).toHaveBeenCalledWith("/basket");
  });
});
