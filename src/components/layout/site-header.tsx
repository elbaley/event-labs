import Link from "next/link";
import { MenuIcon, ShoppingCartIcon } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useAppSelector } from "@/store/hooks";
import { getBasketItemCount } from "@/store/slices/cartSlice";

const navLinks = [
  { href: "/events?category=concerts", label: "Konser" },
  { href: "/events?category=sports", label: "Spor" },
  { href: "/events?category=theatre", label: "Tiyatro" },
];

export function SiteHeader() {
  const { isAuthenticated, logout } = useAuth();
  const basketItemCount = useAppSelector((state) =>
    getBasketItemCount(state.cart.items),
  );

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" aria-label="EventLab home" className="shrink-0">
          <Logo />
        </Link>

        <NavigationMenu
          viewport={false}
          className="hidden justify-start md:flex md:flex-none"
        >
          <NavigationMenuList className="justify-start gap-1">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/basket">
              <ShoppingCartIcon className="size-4" />
              Sepet
              {basketItemCount > 0 ? (
                <span className="ml-0.5 rounded-md bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                  {basketItemCount}
                </span>
              ) : null}
            </Link>
          </Button>

          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/profile">Profil</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                Çıkış
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Giriş</Link>
            </Button>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              aria-label="Menüyü aç"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 max-w-[85vw] gap-0 p-0">
            <SheetHeader className="border-b px-4 py-3 pr-12">
              <SheetClose asChild>
                <Link href="/" aria-label="EventLab home" className="w-fit">
                  <Logo />
                </Link>
              </SheetClose>
              <SheetTitle className="sr-only">Site menüsü</SheetTitle>
              <SheetDescription className="sr-only">
                Ana gezinme bağlantıları ve kullanıcı işlemleri.
              </SheetDescription>
            </SheetHeader>

            <nav className="flex flex-col px-3 py-4" aria-label="Mobile menu">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Link
                  href="/basket"
                  className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <span>Sepet</span>
                  {basketItemCount > 0 ? (
                    <span className="rounded-md bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                      {basketItemCount}
                    </span>
                  ) : null}
                </Link>
              </SheetClose>
            </nav>

            <Separator />

            <div className="mt-auto flex flex-col gap-2 p-4">
              {isAuthenticated ? (
                <>
                  <SheetClose asChild>
                    <Link
                      href="/profile"
                      className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
                    >
                      Profil
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="outline" onClick={logout}>
                      Çıkış
                    </Button>
                  </SheetClose>
                </>
              ) : (
                <SheetClose asChild>
                  <Link
                    href="/login"
                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                  >
                    Giriş
                  </Link>
                </SheetClose>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
