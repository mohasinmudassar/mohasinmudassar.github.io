"use client";

import { useEffect } from "react";
import { initializeBehaviors } from "@/lib/behaviors";

export default function SiteEffects() {
  useEffect(initializeBehaviors, []);
  return null;
}
