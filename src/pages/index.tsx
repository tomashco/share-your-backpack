import RootLayout from "@/components/layout";
import { Header } from "@/components/header";
import { api } from "@/utils/api";
import { CreatePackForm } from "@/components/PackForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { data: packs } = api.packs.getAll.useQuery();
  return (
    <RootLayout>
      <Header
        pageTitle={
          <>
            <span className="text-[hsl(280,100%,70%)]">Share</span> Your
            Backpack
          </>
        }
      />

      <CreatePackForm />
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
    </RootLayout>
  );
}
