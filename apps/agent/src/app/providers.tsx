"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { ThemeProvider } from "next-themes";
import * as React from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function Providers(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={true}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryStreamedHydration>
            <NuqsAdapter>{props.children}</NuqsAdapter>
          </ReactQueryStreamedHydration>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
