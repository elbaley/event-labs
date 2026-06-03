import Head from "next/head";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { ReactElement } from "react";
import { EventDetail } from "@/components/events/event-detail";
import { PublicLayout } from "@/components/layout/public-layout";
import events from "@/data/events.json";
import type { Event } from "@/types/event";
import type { NextPageWithLayout } from "../_app";

type EventPageProps = {
  event: Event;
};

const allEvents = events as Event[];

const EventPage: NextPageWithLayout<EventPageProps> = ({ event }) => {
  return (
    <>
      <Head>
        <title>{event.title} - Event Labs</title>
        <meta name="description" content={event.description} />
      </Head>

      <EventDetail event={event} />
    </>
  );
};

EventPage.getLayout = function getLayout(page: ReactElement) {
  return <PublicLayout>{page}</PublicLayout>;
};

export const getStaticPaths = (async () => {
  return {
    paths: allEvents.map((event) => ({
      params: { slug: event.slug },
    })),
    fallback: false,
  };
}) satisfies GetStaticPaths;

export const getStaticProps = (async ({ params }) => {
  const slug = params?.slug;

  if (typeof slug !== "string") {
    return {
      notFound: true,
    };
  }

  const event = allEvents.find((event) => event.slug === slug);

  if (!event) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      event,
    },
  };
}) satisfies GetStaticProps<EventPageProps>;

export default EventPage;
