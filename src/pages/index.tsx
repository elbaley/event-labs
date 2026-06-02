import Head from "next/head";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { auth, isAuthenticated, isLoggingIn, loginError, login, logout } =
    useAuth();

  const handleMockLogin = async () => {
    try {
      await login({ email: "demo@eventlab.com", password: "123456" });
    } catch {
      // The hook stores loginError for rendering.
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Head>
        <title>Event Lab - Etkinlikleri Keşfet</title>
        <meta
          name="description"
          content="Etkinlikleri keşfet ve yerini ayır."
        />
      </Head>
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-6 py-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold">Event Lab</h1>
          <div className="flex flex-wrap gap-3">
            {isAuthenticated ? (
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button onClick={handleMockLogin} disabled={isLoggingIn}>
                {isLoggingIn ? "Logging in..." : "Mock Login"}
              </Button>
            )}
          </div>
          {loginError ? (
            <p className="text-sm text-destructive">{loginError}</p>
          ) : null}
        </div>

        <pre className="min-h-40 overflow-auto rounded-md border bg-muted p-4 text-sm text-muted-foreground">
          {JSON.stringify(auth, null, 2)}
        </pre>
      </main>
    </>
  );
}
