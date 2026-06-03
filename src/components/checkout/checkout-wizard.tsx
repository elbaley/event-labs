import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import {
  checkoutSchema,
  customerFields,
  reviewFields,
} from "@/schemas/checkout.schema";
import { completeCheckout } from "@/services/checkout.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearBasket, getBasketTotal } from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type {
  CheckoutCompleteResponse,
  CheckoutFormValues,
} from "@/types/checkout";

const steps = ["Müşteri bilgileri", "Sipariş özeti", "Ödeme"];

const mockCheckoutValues = {
  fullName: "Demo Kullanıcı",
  email: "demo@eventlab.com",
  phone: "5551234567",
  cardHolder: "Demo Kullanıcı",
  cardNumber: "424242424242",
  expiryDate: "12/30",
  cvv: "123",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
}

function getFieldError(
  errors: ReturnType<typeof useForm<CheckoutFormValues>>["formState"]["errors"],
  name: keyof CheckoutFormValues,
) {
  return errors[name]?.message;
}

type FieldProps = {
  error?: string;
  label: string;
  children: React.ReactNode;
};

function Field({ children, error, label }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

export function CheckoutWizard() {
  const dispatch = useAppDispatch();
  const basketItems = useAppSelector((state) => state.cart.items);
  const totalPrice = getBasketTotal(basketItems);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] =
    useState<CheckoutCompleteResponse | null>(null);

  const {
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    setValue,
    trigger,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema) as Resolver<CheckoutFormValues>,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      termsAccepted: false,
      cardHolder: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const fillMockFormValues = () => {
    setValue("fullName", mockCheckoutValues.fullName, { shouldValidate: true });
    setValue("email", mockCheckoutValues.email, { shouldValidate: true });
    setValue("phone", mockCheckoutValues.phone, { shouldValidate: true });
    setValue("cardHolder", mockCheckoutValues.cardHolder, {
      shouldValidate: true,
    });
    setValue("cardNumber", mockCheckoutValues.cardNumber, {
      shouldValidate: true,
    });
    setValue("expiryDate", mockCheckoutValues.expiryDate, {
      shouldValidate: true,
    });
    setValue("cvv", mockCheckoutValues.cvv, { shouldValidate: true });
  };

  const goToReviewStep = async () => {
    const isValid = await trigger(customerFields);

    if (isValid) {
      setStep(2);
    }
  };

  const goToPaymentStep = async () => {
    const isValid = await trigger(reviewFields);

    if (isValid) {
      setStep(3);
    }
  };

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!basketItems.length) {
      setSubmitError("Ödemeyi tamamlamak için sepete bilet ekleyin.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await completeCheckout({
        basketItems,
        totalPrice,
        customer: {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
        },
        payment: {
          cardHolder: values.cardHolder,
          cardNumber: values.cardNumber,
          expiryDate: values.expiryDate,
          cvv: values.cvv,
        },
      });
      setConfirmation(response);
      dispatch(clearBasket());
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Ödeme isteği başarısız oldu";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <Card className="mx-auto w-full max-w-2xl rounded-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckIcon className="size-5 text-primary" />
            Ödeme tamamlandı
          </CardTitle>
          <CardDescription>{confirmation.message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border bg-background p-4">
            <p className="text-sm text-muted-foreground">Sipariş numarası</p>
            <p className="mt-1 text-2xl font-semibold">
              {confirmation.orderId}
            </p>
          </div>
          <Button asChild>
            <Link href="/">Ana sayfaya dön</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!basketItems.length) {
    return (
      <Card className="mx-auto w-full max-w-2xl rounded-md">
        <CardHeader>
          <CardTitle>Sepetiniz boş</CardTitle>
          <CardDescription>
            Ödeme adımına geçmek için önce sepetinize bilet ekleyin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/">Etkinliklere dön</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form
      className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {steps.map((label, index) => {
            const value = index + 1;
            const isActive = value === step;
            const isComplete = value < step;

            return (
              <div
                className="flex min-w-0 items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm"
                key={label}
              >
                <span
                  className={
                    isActive || isComplete
                      ? "flex size-6 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground"
                      : "flex size-6 items-center justify-center rounded-md bg-muted text-xs font-semibold"
                  }
                >
                  {isComplete ? <CheckIcon className="size-3" /> : value}
                </span>
                <span
                  className={isActive ? "font-medium" : "text-muted-foreground"}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {step === 1 ? (
          <Card className="rounded-md">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>Müşteri bilgileri</CardTitle>
                  <CardDescription>
                    Bu bilgiler sipariş ve bilet teslimi için kullanılacak.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillMockFormValues}
                >
                  Formu Doldur
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Field label="Ad soyad" error={getFieldError(errors, "fullName")}>
                <Input
                  autoComplete="name"
                  aria-invalid={Boolean(errors.fullName)}
                  {...register("fullName")}
                />
              </Field>
              <Field label="E-posta" error={getFieldError(errors, "email")}>
                <Input
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
              </Field>
              <Field label="Telefon" error={getFieldError(errors, "phone")}>
                <Input
                  type="tel"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  {...register("phone")}
                />
              </Field>
            </CardContent>
          </Card>
        ) : null}

        {step === 2 ? (
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle>Sipariş özeti</CardTitle>
              <CardDescription>
                Seçtiğiniz biletleri ve toplam tutarı kontrol edin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {basketItems.map((item) => (
                  <div
                    className="rounded-md border bg-background p-4"
                    key={item.id}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-medium">{item.eventTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.ticketType} · {item.category} · {item.section}
                        </p>
                      </div>
                      <div className="text-sm sm:text-right">
                        <p>{item.quantity} adet</p>
                        <p className="font-medium">
                          {formatPrice(item.lineTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex items-center justify-between font-semibold">
                <span>Toplam</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <label className="flex items-start gap-3 rounded-md border bg-background p-4 text-sm">
                <input
                  type="checkbox"
                  className="mt-1 size-4 accent-primary"
                  aria-invalid={Boolean(errors.termsAccepted)}
                  {...register("termsAccepted")}
                />
                <span>
                  Satış koşullarını ve mesafeli satış bilgilendirmesini kabul
                  ediyorum.
                </span>
              </label>
              {errors.termsAccepted?.message ? (
                <p className="text-sm text-destructive">
                  {errors.termsAccepted.message}
                </p>
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        {step === 3 ? (
          <Card className="rounded-md">
            <CardHeader>
              <CardTitle>Ödeme</CardTitle>
              <CardDescription>
                Bu bir mock ödeme adımıdır. Gerçek ödeme alınmaz.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Kart üzerindeki isim"
                  error={getFieldError(errors, "cardHolder")}
                >
                  <Input
                    autoComplete="cc-name"
                    aria-invalid={Boolean(errors.cardHolder)}
                    {...register("cardHolder")}
                  />
                </Field>
                <Field
                  label="Kart numarası"
                  error={getFieldError(errors, "cardNumber")}
                >
                  <Input
                    inputMode="numeric"
                    autoComplete="cc-number"
                    aria-invalid={Boolean(errors.cardNumber)}
                    {...register("cardNumber")}
                  />
                </Field>
                <Field
                  label="Son kullanma tarihi"
                  error={getFieldError(errors, "expiryDate")}
                >
                  <Input
                    placeholder="AA/YY"
                    autoComplete="cc-exp"
                    aria-invalid={Boolean(errors.expiryDate)}
                    {...register("expiryDate")}
                  />
                </Field>
                <Field label="CVV" error={getFieldError(errors, "cvv")}>
                  <Input
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    aria-invalid={Boolean(errors.cvv)}
                    {...register("cvv")}
                  />
                </Field>
              </div>

              <div className="rounded-md border bg-background p-4">
                <p className="font-medium">Ödenecek tutar</p>
                <p className="mt-1 text-2xl font-semibold">
                  {formatPrice(totalPrice)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Alıcı: {getValues("fullName")}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {submitError ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {submitError}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            disabled={step === 1 || isSubmitting}
            onClick={() => setStep((current) => Math.max(1, current - 1))}
          >
            Geri
          </Button>

          {step === 1 ? (
            <Button type="button" onClick={goToReviewStep}>
              Devam et
            </Button>
          ) : null}

          {step === 2 ? (
            <Button type="button" onClick={goToPaymentStep}>
              Devam et
            </Button>
          ) : null}

          {step === 3 ? (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Tamamlanıyor...
                </>
              ) : (
                "Ödemeyi tamamla"
              )}
            </Button>
          ) : null}
        </div>
      </div>

      <Card className="h-fit rounded-md">
        <CardHeader>
          <CardTitle>Sepet özeti</CardTitle>
          <CardDescription>
            {basketItems.length} farklı bilet seçimi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {basketItems.map((item) => (
              <div
                className="rounded-md border bg-background p-3 text-sm"
                key={item.id}
              >
                <p className="font-medium">{item.eventTitle}</p>
                <p className="mt-1 text-muted-foreground">
                  {item.ticketType} · {item.category} · {item.section}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span>{item.quantity} adet</span>
                  <span className="font-medium">
                    {formatPrice(item.lineTotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex items-center justify-between text-base font-semibold">
            <span>Toplam</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
