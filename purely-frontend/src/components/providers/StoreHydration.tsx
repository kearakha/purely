"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function StoreHydration() {
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  return null;
}
