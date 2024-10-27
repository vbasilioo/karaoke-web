"use client";

import Dashboard from "../dashboard-03";
import { TooltipProvider } from "../ui/tooltip";

export function Television(){
  return(
    <TooltipProvider>
      <Dashboard />
    </TooltipProvider>
  );
}
