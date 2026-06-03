import Head from "next/head";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { ReactElement } from "react";
import { EventSummaryCard } from "@/components/events/event-summary-card";
import { PublicLayout } from "@/components/layout/public-layout";
import {
  eventCategories,
  eventCategoryLabels,
  isEventCategory,
} from "@/lib/event-categories";
import { getEventSummariesByCategory } from "@/lib/events";
import type { EventCategory, EventSummary } from "@/types/event";
import type { NextPageWithLayout } from "../_app";

type CategoryPageProps = {
  category: EventCategory;
  events: EventSummary[];
};

const CategoryPage: NextPageWithLayout<CategoryPageProps> = ({
  category,
  events,
}) => {
  const title = eventCategoryLabels[category];

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

        {events.length === 0 ? (
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

export const getStaticPaths = (async () => {
  return {
    paths: eventCategories.map((category) => ({
      params: { categoryName: category.value },
    })),
    fallback: false,
  };
}) satisfies GetStaticPaths;

export const getStaticProps = (async ({ params }) => {
  const categoryName = params?.categoryName;

  if (typeof categoryName !== "string" || !isEventCategory(categoryName)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      category: categoryName,
      events: getEventSummariesByCategory(categoryName),
    },
  };
}) satisfies GetStaticProps<CategoryPageProps>;

export default CategoryPage;
