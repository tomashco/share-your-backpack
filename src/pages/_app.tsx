import { type AppProps } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";

import { api } from "@/utils/api";

import "@/styles/globals.css";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default api.withTRPC(MyApp);
