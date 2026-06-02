import Head from "next/head";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "./_app";
import { FeaturedEventsSection } from "@/components/home/featured-events-section";
import { HomeHero } from "@/components/home/home-hero";
import { PublicLayout } from "@/components/layout/public-layout";

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Event Lab - Etkinlikleri Keşfet</title>
        <meta
          name="description"
          content="Etkinlikleri keşfet ve yerini ayır."
        />
      </Head>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-8 md:px-6 md:py-12">
        <HomeHero />
        <FeaturedEventsSection />
      </div>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <PublicLayout>{page}</PublicLayout>;
};

export default Home;
