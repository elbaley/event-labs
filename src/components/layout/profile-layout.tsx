import Link from "next/link";
import { useRouter } from "next/router";
import type { PropsWithChildren } from "react";
import { PublicLayout } from "./public-layout";
import { useAuth } from "@/hooks/use-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sidebarLinks = [
  { href: "/profile", label: "Özet" },
  { href: "/profile#tickets", label: "Biletlerim" },
  { href: "/profile#settings", label: "Ayarlar" },
];

export function ProfileLayout({ children }: PropsWithChildren) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const activeLink =
    sidebarLinks.find((link) => link.href === router.asPath) ?? sidebarLinks[0];

  return (
    <PublicLayout>
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-8 md:grid-cols-[220px_1fr]">
        <div className="space-y-3 md:hidden">
          {isAuthenticated && user ? (
            <div className="text-sm text-muted-foreground">
              <p className="truncate font-medium text-foreground">
                {user.name}
              </p>
              <p className="truncate">{user.email}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Checking account</p>
          )}

          <Select
            value={activeLink.href}
            onValueChange={(href) => router.push(href)}
          >
            <SelectTrigger className="w-full" aria-label="Profil bölümü seç">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              {sidebarLinks.map((link) => (
                <SelectItem key={link.href} value={link.href}>
                  {link.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <aside className="hidden rounded-md border bg-card p-4 md:block">
          <div className="border-b pb-4">
            {isAuthenticated && user ? (
              <div className="mt-2 text-sm text-muted-foreground">
                <p className="truncate font-medium text-foreground">
                  {user.name}
                </p>
                <p className="truncate">{user.email}</p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Checking account
              </p>
            )}
          </div>

          <nav className="mt-4 flex flex-col gap-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="min-w-0">{children}</section>
      </div>
    </PublicLayout>
  );
}
