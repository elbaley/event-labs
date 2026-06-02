import Head from "next/head";
import type { ReactElement } from "react";
import { ProfileLayout } from "@/components/layout/profile-layout";
import { useAuth } from "@/hooks/use-auth";
import type { NextPageWithLayout } from "./_app";

const ProfilePage: NextPageWithLayout = () => {
  const { user, token } = useAuth();
  const tokenPreview = token ? `${token.slice(0, 12)}...` : "No token";

  if (!user) {
    return (
      <>
        <Head>
          <title>Profile - EventLabs</title>
        </Head>
        <div className="rounded-md border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Checking account access...
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Profil - EventLabs</title>
      </Head>

      <div className="rounded-md border bg-card p-6">
        <div>
          <h1 className="text-2xl font-semibold">Profil</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            EventLabs hesap detayların.
          </p>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border bg-background p-4">
            <dt className="text-sm text-muted-foreground">İsim</dt>
            <dd className="mt-1 font-medium">{user.name}</dd>
          </div>
          <div className="rounded-md border bg-background p-4">
            <dt className="text-sm text-muted-foreground">Email</dt>
            <dd className="mt-1 font-medium">{user.email}</dd>
          </div>
          <div className="rounded-md border bg-background p-4">
            <dt className="text-sm text-muted-foreground">Hesap Durumu</dt>
            <dd className="mt-1 font-medium">Aktif</dd>
          </div>
          <div className="rounded-md border bg-background p-4">
            <dt className="text-sm text-muted-foreground">Token</dt>
            <dd className="mt-1 font-mono text-sm">{tokenPreview}</dd>
          </div>
        </dl>
      </div>
    </>
  );
};

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

export default ProfilePage;
