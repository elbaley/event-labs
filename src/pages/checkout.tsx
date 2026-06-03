import Head from "next/head";
import type { ReactElement } from "react";
import { CheckoutWizard } from "@/components/checkout/checkout-wizard";
import { PublicLayout } from "@/components/layout/public-layout";
import type { NextPageWithLayout } from "./_app";

const CheckoutPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Ödeme - EventLabs</title>
        <meta
          name="description"
          content="EventLabs bilet ödemenizi tamamlayın."
        />
      </Head>

      <div className="px-4 py-8 md:px-6 md:py-12">
        <CheckoutWizard />
      </div>
    </>
  );
};

CheckoutPage.getLayout = function getLayout(page: ReactElement) {
  return <PublicLayout>{page}</PublicLayout>;
};

export default CheckoutPage;
