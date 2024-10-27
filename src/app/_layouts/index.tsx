"use client";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { ReactNode } from "react";

interface ILayout {
  children: ReactNode;
  className?: string;
}

export default function Layout({ children, className }: ILayout) {
  return(
    <div
      suppressHydrationWarning={true}
      className={`grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ${className}`}
    >
      <Sidebar />
      <div className="flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
