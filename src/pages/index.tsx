import RootLayout from "@/components/layout";
import { Header } from "@/components/header";
import { api } from "@/utils/api";
import toast from "react-hot-toast";

export default function Home() {
  const ctx = api.useContext();
  const { mutate: createTeam } = api.team.create.useMutation({
    onSuccess: () => null,
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
  const { mutate: createPack } = api.packs.create.useMutation({
    onSuccess: () => null,
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
        <button
          className="ml-3 w-24 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => createTeam()}
        >
          create a team!
        </button>
        <button
          className="ml-3 w-24 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => createPack({ name: "a new pack just to do" })}
        >
          create a pack!
        </button>
      </div>
    </RootLayout>
  );
}
