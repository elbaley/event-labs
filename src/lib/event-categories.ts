import type { EventCategory } from "@/types/event";

export const eventCategories = [
  { value: "concert", label: "Konser" },
  { value: "sport", label: "Spor" },
  { value: "theatre", label: "Tiyatro" },
] as const satisfies readonly { value: EventCategory; label: string }[];

export const eventCategoryLabels = eventCategories.reduce(
  (labels, category) => {
    labels[category.value] = category.label;
    return labels;
  },
  {} as Record<EventCategory, string>,
);

export function isEventCategory(value: string): value is EventCategory {
  return eventCategories.some((category) => category.value === value);
}
