import RootLayout from "@/components/layout";
import { Header } from "@/components/header";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import { PackForm } from "@/components/PackForm";

export default function Home() {
  const { data: packs } = api.packs.getAll.useQuery();
  const ctx = api.useContext();

  const { mutate: createPack } = api.packs.create.useMutation({
    onSuccess: () => {
      void ctx.packs.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.code;
      console.log("ERROR MESSAGE: ", e.data);
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("Failed to delete! Please try again later.");
      }
    },
  });

  return (
    <RootLayout>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <Header
          pageTitle={
            <>
              <span className="text-[hsl(280,100%,70%)]">Share</span> Your
              Backpack
            </>
          }
        />
        <PackForm />
        {packs ? packs.map((pack) => <p key={pack.id}>{pack.name}</p>) : <></>}
      </div>
    </RootLayout>
  );
}
