import { z } from "zod/v4";

export const checkoutSchema = z.object({
  fullName: z.string().min(3, "Ad soyad en az 3 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  phone: z.string().min(10, "Telefon en az 10 karakter olmalıdır"),
  termsAccepted: z.literal(true, {
    error: "Devam etmek için satış koşullarını kabul etmelisiniz",
  }),
  cardHolder: z
    .string()
    .min(3, "Kart üzerindeki isim en az 3 karakter olmalıdır"),
  cardNumber: z.string().min(12, "Kart numarası en az 12 karakter olmalıdır"),
  expiryDate: z
    .string()
    .min(4, "Son kullanma tarihi en az 4 karakter olmalıdır"),
  cvv: z.string().min(3, "CVV en az 3 karakter olmalıdır"),
});

export const customerFields = ["fullName", "email", "phone"] as const;
export const reviewFields = ["termsAccepted"] as const;
export const paymentFields = [
  "cardHolder",
  "cardNumber",
  "expiryDate",
  "cvv",
] as const;
