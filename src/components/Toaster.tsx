"use client";

import { Toaster as SonnerToaster } from "sonner";

export default function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "rgba(30, 15, 30, 0.95)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "#f5f0eb",
        },
      }}
    />
  );
}
