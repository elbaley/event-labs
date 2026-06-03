import { useCallback, useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { EventSummaryCard } from "@/components/events/event-summary-card";
import type { EventSummary } from "@/types/event";

type FeaturedEventsCarouselProps = {
  events: EventSummary[];
};

export function FeaturedEventsCarousel({
  events,
}: FeaturedEventsCarouselProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  const updateCarouselState = useCallback((api: CarouselApi) => {
    if (!api) return;

    setSelectedSlide(api.selectedScrollSnap());
    setSlideCount(api.scrollSnapList().length);
  }, []);

  useEffect(() => {
    if (!carouselApi) return;

    queueMicrotask(() => updateCarouselState(carouselApi));
    carouselApi.on("select", updateCarouselState);
    carouselApi.on("reInit", updateCarouselState);

    return () => {
      carouselApi.off("select", updateCarouselState);
      carouselApi.off("reInit", updateCarouselState);
    };
  }, [carouselApi, updateCarouselState]);

  return (
    <Carousel
      setApi={setCarouselApi}
      opts={{ align: "start", loop: true }}
      plugins={[
        Autoplay({
          delay: 3000,
          stopOnInteraction: true,
        }),
      ]}
      className="px-0"
    >
      <CarouselContent>
        {events.map((event) => (
          <CarouselItem
            key={event.id}
            className="basis-full sm:basis-1/2 md:basis-1/3"
          >
            <EventSummaryCard event={event} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {slideCount > 1 ? (
        <div className="mt-5 flex justify-center gap-3">
          {Array.from({ length: slideCount }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`${index + 1}. slayta git`}
              onClick={() => carouselApi?.scrollTo(index)}
              className={
                selectedSlide === index
                  ? "size-3 rounded-full bg-foreground/25 transition-colors"
                  : "size-3 rounded-full bg-muted transition-colors hover:bg-foreground/15"
              }
            />
          ))}
        </div>
      ) : null}
    </Carousel>
  );
}
