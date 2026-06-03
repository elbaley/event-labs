import Image from "next/image";
import Link from "next/link";
import { CalendarDaysIcon, MapPinIcon, TicketIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { eventCategoryLabels } from "@/lib/event-categories";
import type { EventSummary } from "@/types/event";

function formatEventDate(date: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
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

type EventSummaryCardProps = {
  event: EventSummary;
};

export function EventSummaryCard({ event }: EventSummaryCardProps) {
  return (
    <Link
      href={`/event/${encodeURIComponent(event.slug)}`}
      className="group block h-full"
    >
      <Card className="h-full gap-0 rounded-md border bg-card py-0 shadow-xs ring-0">
        <div className="relative aspect-16/10 overflow-hidden bg-muted">
          <Image
            src={event.cover}
            alt={event.title}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="flex min-h-56 flex-col gap-4 p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              {eventCategoryLabels[event.category]}
            </span>
            <span className="text-sm font-semibold">
              {formatPrice(event.basePrice)}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="line-clamp-2 text-base leading-snug font-semibold">
              {event.title}
            </h3>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPinIcon className="mt-0.5 size-4 shrink-0" />
              <span className="line-clamp-2">{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDaysIcon className="size-4 shrink-0" />
              <span>{formatEventDate(event.date)}</span>
            </div>
          </div>

          <div className="mt-auto flex items-center gap-2 text-sm font-medium text-primary">
            <TicketIcon className="size-4" />
            <span>Detayları görüntüle</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
