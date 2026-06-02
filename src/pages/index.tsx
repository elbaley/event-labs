import Head from "next/head";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "./_app";
import { PublicLayout } from "@/components/layout/public-layout";
import { useAuth } from "@/hooks/use-auth";

const Home: NextPageWithLayout = () => {
  const { auth } = useAuth();
  return (
    <>
      <Head>
        <title>Event Lab - Etkinlikleri Keşfet</title>
        <meta
          name="description"
          content="Etkinlikleri keşfet ve yerini ayır."
        />
      </Head>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold">Event Lab</h1>
          <p className="text-muted-foreground">
            Discover events and keep your account details in one place.
          </p>
        </div>

        <pre className="min-h-40 overflow-auto rounded-md border bg-muted p-4 text-sm text-muted-foreground">
          {JSON.stringify(auth, null, 2)}
        </pre>
      </div>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <PublicLayout>{page}</PublicLayout>;
};

export default Home;
