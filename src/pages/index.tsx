import RootLayout from "@/components/layouts/RootLayout";
import { Header } from "@/components/header";
import { api } from "@/utils/api";
import { CreatePackForm } from "@/components/PackForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/components/layouts/PageLayout";

export default function Home() {
  const { data: packs } = api.packs.getAll.useQuery();
  return (
    <RootLayout>
      <Header
        pageTitle={
          <>
            <span className="text-sagegreen">Share</span> Your Backpack
          </>
        }
      />
      <PageLayout>
        <div className="space-y-8 rounded-md border p-3 shadow-md">
          <CreatePackForm />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">The list of Packs</h2>
        {packs ? (
          packs.map(({ pack, author }) => (
            <Button variant={"link"} key={pack.id}>
              {author.profileImageUrl && (
                <div className="relative m-2 h-6 w-6">
                  <Image
                    className="rounded-full"
                    src={author.profileImageUrl}
                    alt="profile photo"
                    layout={"fill"}
                    objectFit={"contain"}
                  />
                </div>
              )}
              <Link href={`/pack/${pack.id}`}>{pack.name}</Link>
            </Button>
          ))
        ) : (
          <></>
        )}
      </PageLayout>
    </RootLayout>
  );
}
