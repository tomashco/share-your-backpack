import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

import { api } from "../utils/api";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";

export const StandardDropzone = ({ packId }: { packId: string }) => {
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const { mutateAsync: fetchPresignedUrls } =
    api.s3.getStandardUploadPresignedUrl.useMutation();
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const ctx = api.useContext();

  const { toast } = useToast();
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      maxFiles: 1,
      maxSize: 5 * 2 ** 20, // roughly 5MB
      multiple: false,
      accept: {
        file: [".gpx"],
      },
      onDropRejected: (_files, _event) => {
        toast({
          title: "The file is wrong",
          description: "Only gpx files are accepted",
          variant: "destructive",
        });
      },
      onDropAccepted: (files, _event) => {
        const file = files[0] as File;

        fetchPresignedUrls({
          key: file.name,
          packId,
        })
          .then((url) => {
            setPresignedUrl(url);
            setSubmitDisabled(false);
          })
          .catch((err) => console.error(err));
      },
    });

  const files = useMemo(() => {
    if (!submitDisabled)
      return acceptedFiles.map((file) => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ));
    return null;
  }, [acceptedFiles, submitDisabled]);

  const handleSubmit = useCallback(async () => {
    if (acceptedFiles.length > 0 && presignedUrl !== null) {
      const file = acceptedFiles[0]!;

      await axios
        .put(presignedUrl, file.slice(), {
          headers: { "Content-Type": file.type },
        })
        .catch((err) => console.error(err));
      setSubmitDisabled(true);
      await ctx.s3.getObjects.invalidate();
    }
  }, [acceptedFiles, ctx.s3.getObjects, presignedUrl]);

  return (
    <section className="space-y-3">
      <div {...getRootProps()} className="dropzone-container">
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="flex h-full items-center justify-center font-semibold">
            <p>Drop the file here...</p>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center font-semibold">
            <p>Drag&apos;n&apos;drop gpx file here, or click to select files</p>
          </div>
        )}
      </div>
      {acceptedFiles.length > 0 && (
        <aside className="my-2">
          <h4 className="font-semibold text-zinc-400">Pending upload</h4>
          <ul>{files}</ul>
        </aside>
      )}
      <Button
        onClick={() => void handleSubmit()}
        disabled={
          presignedUrl === null || acceptedFiles.length === 0 || submitDisabled
        }
        className="submit-button"
      >
        Upload
      </Button>
    </section>
  );
};
