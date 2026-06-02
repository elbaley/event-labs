import Head from "next/head";
import { useRouter } from "next/router";
import { type FormEvent, type ReactElement, useEffect, useState } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import type { NextPageWithLayout } from "./_app";

const demoCredentials = {
  email: "demo@eventlab.com",
  password: "123456",
};

function getRedirectPath(redirect: string | string[] | undefined) {
  const path = Array.isArray(redirect) ? redirect[0] : redirect;

  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/profile";
  }

  return path;
}

const LoginPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { isAuthenticated, isLoggingIn, loginError, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const redirectPath = getRedirectPath(router.query.redirect);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectPath);
    }
  }, [isAuthenticated, redirectPath, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await login({ email, password });
      router.push(redirectPath);
    } catch {
      // The hook stores loginError for rendering.
    }
  };

  const fillDemoCredentials = () => {
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
  };

  return (
    <>
      <Head>
        <title>Login - EventLab</title>
        <meta name="description" content="Sign in to your EventLab account." />
      </Head>

      <div className="mx-auto flex w-full max-w-md px-6 py-12">
        <div className="w-full rounded-md border bg-card p-6">
          <div>
            <h1 className="text-2xl font-semibold">Giriş Yap</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Profilini yönetmek ve bilet satın almak için giriş yap.
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isLoggingIn}
                required
                aria-invalid={Boolean(loginError)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Şifre
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isLoggingIn}
                required
                aria-invalid={Boolean(loginError)}
              />
            </div>

            {loginError ? (
              <p className="text-sm text-destructive">{loginError}</p>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" disabled={isLoggingIn}>
                {isLoggingIn ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={fillDemoCredentials}
                disabled={isLoggingIn}
              >
                Doldur
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return <PublicLayout>{page}</PublicLayout>;
};

export default LoginPage;
