"use client";
import { useEffect } from "react";
import { useUserData } from "@/lib/user-store";
export function ThemeSync() {
  const { settings } = useUserData();
  useEffect(() => {
    document.documentElement.dataset.theme = settings.dark ? "dark" : "light";
  }, [settings.dark]);
  return null;
}
