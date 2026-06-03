import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import {
  CalendarDaysIcon,
  MapPinIcon,
  TicketIcon,
  TagIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import type { Event } from "@/types/event";

const categoryLabels: Record<Event["category"], string> = {
  concert: "Konser",
  theatre: "Tiyatro",
  sport: "Spor",
};

function formatEventDate(date: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

const ticketTypes = [
  { value: "general", label: "Genel Giriş", priceModifier: 0 },
  { value: "student", label: "Öğrenci", priceModifier: -120 },
  { value: "vip", label: "VIP", priceModifier: 450 },
];

const ticketCategories = [
  { value: "category-1", label: "Kategori 1", priceModifier: 240 },
  { value: "category-2", label: "Kategori 2", priceModifier: 120 },
  { value: "category-3", label: "Kategori 3", priceModifier: 0 },
];

const ticketSections = [
  { value: "block-a", label: "Blok A", priceModifier: 120 },
  { value: "block-b", label: "Blok B", priceModifier: 60 },
  { value: "block-c", label: "Blok C", priceModifier: 0 },
];

type EventDetailProps = {
  event: Event;
};

export function EventDetail({ event }: EventDetailProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isBasketEmpty = useAppSelector((state) => state.cart.items.length === 0);
  const [ticketType, setTicketType] = useState("");
  const [category, setCategory] = useState("");
  const [section, setSection] = useState("");
  const [quantity, setQuantity] = useState(1);

  const selectedTicketType = useMemo(
    () => ticketTypes.find((option) => option.value === ticketType),
    [ticketType],
  );
  const selectedCategory = useMemo(
    () => ticketCategories.find((option) => option.value === category),
    [category],
  );
  const selectedSection = useMemo(
    () => ticketSections.find((option) => option.value === section),
    [section],
  );
  const unitPrice = Math.max(
    0,
    event.basePrice +
      (selectedTicketType?.priceModifier ?? 0) +
      (selectedCategory?.priceModifier ?? 0) +
      (selectedSection?.priceModifier ?? 0),
  );
  const canAddToBasket = Boolean(
    selectedTicketType && selectedCategory && selectedSection,
  );

  const handleTicketTypeChange = (value: string) => {
    setTicketType(value);
    setCategory("");
    setSection("");
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setSection("");
  };

  const handleQuantityChange = (value: string) => {
    const nextQuantity = Number(value);

    if (!Number.isFinite(nextQuantity)) {
      return;
    }

    setQuantity(Math.max(1, Math.min(10, Math.floor(nextQuantity))));
  };

  const addSelectedTicketToBasket = () => {
    if (
      !canAddToBasket ||
      !selectedTicketType ||
      !selectedCategory ||
      !selectedSection
    ) {
      return false;
    }

    dispatch(
      addItem({
        eventId: event.id,
        eventSlug: event.slug,
        eventTitle: event.title,
        ticketType: selectedTicketType.label,
        category: selectedCategory.label,
        section: selectedSection.label,
        unitPrice,
        quantity,
      }),
    );

    return true;
  };

  const handleAddToBasket = () => {
    if (addSelectedTicketToBasket()) {
      router.push("/basket");
    }
  };

  const handleQuickBuy = () => {
    if (addSelectedTicketToBasket()) {
      router.push("/checkout");
    }
  };

  return (
    <article className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="space-y-6">
          <div className="relative aspect-16/10 overflow-hidden rounded-md bg-muted">
            <Image
              src={event.cover}
              alt={event.title}
              fill
              priority
              sizes="(min-width: 1024px) 736px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                {categoryLabels[event.category]}
              </span>
              <span className="text-sm text-muted-foreground">
                Başlangıç fiyatı {formatPrice(event.basePrice)}
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl leading-tight font-semibold md:text-4xl">
                {event.title}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-muted-foreground">
                {event.description}
              </p>
            </div>

            <Card className="rounded-md">
              <CardContent className="space-y-5 p-5">
                <div>
                  <h2 className="text-xl font-semibold">Bilet seçimi</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Bilet tipini, kategoriyi ve bloku seçerek sepetine ekle.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bilet tipi</label>
                    <Select
                      value={ticketType}
                      onValueChange={handleTicketTypeChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Bilet tipi seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {ticketTypes.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Kategori</label>
                    <Select
                      value={category}
                      onValueChange={handleCategoryChange}
                      disabled={!selectedTicketType}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {ticketCategories.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Blok</label>
                    <Select
                      value={section}
                      disabled={!selectedCategory}
                      onValueChange={setSection}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Blok seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {ticketSections.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {canAddToBasket ? (
                  <div className="flex flex-col gap-4 rounded-md border bg-background p-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Birim fiyat
                        </p>
                        <p className="mt-1 text-2xl font-semibold">
                          {formatPrice(unitPrice)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium"
                          htmlFor="quantity"
                        >
                          Adet
                        </label>
                        <Input
                          id="quantity"
                          type="number"
                          min={1}
                          max={10}
                          value={quantity}
                          onChange={(event) =>
                            handleQuantityChange(event.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:items-end">
                      <Button type="button" onClick={handleAddToBasket}>
                        <TicketIcon className="size-4" />
                        Sepete At
                      </Button>
                      {isBasketEmpty ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleQuickBuy}
                        >
                          Hızlı Satın Al
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="rounded-md py-0">
          <CardContent className="space-y-5 p-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Etkinlik detayı</p>
              <p className="text-2xl font-semibold">
                {formatPrice(event.basePrice)}
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <CalendarDaysIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Tarih</p>
                  <p className="text-muted-foreground">
                    {formatEventDate(event.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Konum</p>
                  <p className="text-muted-foreground">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TagIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">Kategori</p>
                  <p className="text-muted-foreground">
                    {categoryLabels[event.category]}
                  </p>
                </div>
              </div>
            </div>

            <Button className="w-full" asChild>
              <Link href="/basket">Sepete git</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </article>
  );
}
