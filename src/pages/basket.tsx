import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  decreaseQuantity,
  getBasketTotal,
  increaseQuantity,
  removeItem,
} from "@/store/slices/cartSlice";
import type { NextPageWithLayout } from "./_app";

function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

const BasketPage: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const items = useAppSelector((state) => state.cart.items);
  const total = getBasketTotal(items);

  const handleProceedToCheckout = () => {
    if (!items.length) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }

    router.push("/checkout");
  };

  return (
    <>
      <Head>
        <title>Sepet - EventLabs</title>
        <meta name="description" content="EventLabs bilet sepetiniz." />
      </Head>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Sepet</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Seçtiğiniz biletleri kontrol edin ve ödeme adımına geçin.
          </p>
        </div>

        {!items.length ? (
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle>Sepetiniz boş</CardTitle>
              <CardDescription>
                Bilet eklemek için etkinlikleri inceleyin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/">Etkinliklere dön</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <Card className="rounded-md">
              <CardHeader>
                <CardTitle>Seçili biletler</CardTitle>
                <CardDescription>{items.length} farklı bilet seçimi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div className="rounded-md border bg-background p-4" key={item.id}>
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0 space-y-2">
                        <Link
                          href={`/event/${item.eventSlug}`}
                          className="font-medium underline-offset-4 hover:underline"
                        >
                          {item.eventTitle}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {item.ticketType} · {item.category} · {item.section}
                        </p>
                        <div className="grid gap-2 text-sm sm:grid-cols-2">
                          <p>
                            <span className="text-muted-foreground">
                              Birim fiyat:
                            </span>{" "}
                            {formatPrice(item.unitPrice)}
                          </p>
                          <p>
                            <span className="text-muted-foreground">
                              Satır toplamı:
                            </span>{" "}
                            {formatPrice(item.lineTotal)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onClick={() => dispatch(decreaseQuantity(item.id))}
                          aria-label={`${item.eventTitle} adedini azalt`}
                        >
                          <MinusIcon className="size-4" />
                        </Button>
                        <span className="flex h-8 min-w-10 items-center justify-center rounded-md border px-3 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onClick={() => dispatch(increaseQuantity(item.id))}
                          aria-label={`${item.eventTitle} adedini artır`}
                        >
                          <PlusIcon className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => dispatch(removeItem(item.id))}
                          aria-label={`${item.eventTitle} biletini kaldır`}
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="h-fit rounded-md">
              <CardHeader>
                <CardTitle>Sepet özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Toplam</span>
                  <span className="text-xl font-semibold">
                    {formatPrice(total)}
                  </span>
                </div>
                <Separator />
                <Button
                  type="button"
                  className="w-full"
                  disabled={!items.length}
                  onClick={handleProceedToCheckout}
                >
                  Ödemeye geç
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

BasketPage.getLayout = function getLayout(page: ReactElement) {
  return <PublicLayout>{page}</PublicLayout>;
};

export default BasketPage;
