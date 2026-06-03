import Image from "next/image";
import Link from "next/link";
import {
  CalendarDaysIcon,
  MapPinIcon,
  TicketIcon,
  TagIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

type EventDetailProps = {
  event: Event;
};

export function EventDetail({ event }: EventDetailProps) {
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
              <Link href="/login">
                <TicketIcon className="size-4" />
                Bilet al
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </article>
  );
}
