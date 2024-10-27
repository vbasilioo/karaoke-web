"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/lib/react-query";
import "@/styles/globals.css";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Helmet, HelmetProvider } from 'react-helmet-async';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ScrollArea className="h-screen w-full">
          <main>
            <SessionProvider refetchInterval={100 * 60}>
              <Toaster
                theme="light"
                richColors
                position="top-center"
              />
              <ThemeProvider attribute="class">
                <HelmetProvider>
                  <Helmet titleTemplate="%s | OpenMic" />
                  <QueryClientProvider client={queryClient}>
                    <TooltipProvider>{children}</TooltipProvider>
                  </QueryClientProvider>
                </HelmetProvider>
              </ThemeProvider>
            </SessionProvider>
          </main>
        </ScrollArea>
      </body>
    </html>
  );
}
