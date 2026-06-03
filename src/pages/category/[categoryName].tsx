import Head from "next/head";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { EventSummaryCard } from "@/components/events/event-summary-card";
import { PublicLayout } from "@/components/layout/public-layout";
import { eventCategoryLabels, isEventCategory } from "@/lib/event-categories";
import { useEvents } from "@/hooks/use-events";
import type { EventCategory } from "@/types/event";
import type { NextPageWithLayout } from "../_app";

const CategoryPage: NextPageWithLayout = () => {
  const router = useRouter();
  const categoryName = Array.isArray(router.query.categoryName)
    ? router.query.categoryName[0]
    : router.query.categoryName;

  const category: EventCategory | undefined =
    categoryName && isEventCategory(categoryName) ? categoryName : undefined;
  const { events, isLoading, error } = useEvents(category);
  const title = category ? eventCategoryLabels[category] : "Kategori";
  const hasInvalidCategory = router.isReady && categoryName && !category;

  return (
    <>
      <Head>
        <title>{title} Etkinlikleri - Event Lab</title>
        <meta
          name="description"
          content={`${title} kategorisindeki etkinlikleri keşfet.`}
        />
      </Head>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 md:py-12">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{title} Etkinlikleri</h1>
          <p className="text-sm text-muted-foreground">
            Bu kategorideki yaklaşan etkinlikler.
          </p>
        </div>

        {!router.isReady || isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-md border bg-muted"
              />
            ))}
          </div>
        ) : hasInvalidCategory ? (
          <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">
            Bu kategori bulunamadı.
          </div>
        ) : error ? (
          <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">
            Bu kategoride henüz etkinlik yok.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventSummaryCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

CategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <PublicLayout>{page}</PublicLayout>;
};

export default CategoryPage;
