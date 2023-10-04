import RootLayout from "@/components/layout";
import { Header } from "@/components/header";
import { api } from "@/utils/api";
import { PackForm } from "@/components/PackForm";

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

      <PackForm />
      <h2 className="text-3xl font-bold tracking-tight">The list of Packs</h2>
      {packs ? packs.map((pack) => <p key={pack.id}>{pack.name}</p>) : <></>}
    </RootLayout>
  );
}
