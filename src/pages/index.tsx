import RootLayout from "@/components/layouts/RootLayout";
import { Header } from "@/components/header";
import { RouterOutputs, api } from "@/utils/api";
import { CreatePackForm } from "@/components/PackForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/components/layouts/PageLayout";
import { useUser } from "@clerk/nextjs";
import { StandardDropzone } from "@/components/StandardDropzone";
import axios from "axios";

// Lists the objects that have been uploaded to S3
const UploadedObjects = ({
  objects,
}: {
  objects: RouterOutputs["s3"]["getObjects"];
}) => {
  if (!objects || objects.length === 0)
    return <div>No objects uploaded yet.</div>;

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Uploaded Objects</h2>
      {objects.map((object) => (
        <div key={object.Key}>
          <button
            onClick={async () => {
              await axios({
                url: `https://share-your-backpack.s3.eu-west-1.amazonaws.com/${object.Key!}`,
                method: "GET",
                responseType: "blob",
              }).then((response) => {
                console.log(response);
                const url = window.URL.createObjectURL(
                  new Blob([response.data]),
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute(
                  "download",
                  `https://share-your-backpack.s3.eu-west-1.amazonaws.com/${object.Key!}`,
                );
                document.body.appendChild(link);
                link.click();
              });
            }}
          >
            {object.Key}
          </button>
        </div>
      ))}
    </div>
  );
};

export default function Home() {
  const { data: packs } = api.packs.getAll.useQuery();
  const { data: s3Objects, isLoading } = api.s3.getObjects.useQuery();
  const user = useUser();
  const isEditable = !!user?.user?.id;

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
        <div className="flex flex-col space-y-6">
          {isEditable && (
            <div className="space-y-8 rounded-md border p-3 shadow-md">
              <CreatePackForm />
            </div>
          )}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">
              The list of Packs
            </h2>
            <div className="">
              {packs ? (
                packs.map(({ pack, author }) => (
                  <Button variant="link" className="pl-0" key={pack.id}>
                    {author.profileImageUrl && (
                      <div className="relative mr-2 h-6 w-6">
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
            </div>
          </div>
          {isEditable && (
            <div>
              <StandardDropzone />
            </div>
          )}
          <div className="mt-12 flex justify-center">
            {!isLoading && s3Objects && <UploadedObjects objects={s3Objects} />}
          </div>
        </div>
      </PageLayout>
    </RootLayout>
  );
}
