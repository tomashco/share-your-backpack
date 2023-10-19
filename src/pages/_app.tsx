import { type AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

import { api } from "@/utils/api";

import "@/styles/globals.css";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
      <Toaster />
    </ClerkProvider>
  );
}

export default api.withTRPC(MyApp);
