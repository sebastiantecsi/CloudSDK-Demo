"use client";

import { CloudSDK } from "@sitecore-cloudsdk/core/browser";
import "@sitecore-cloudsdk/events/browser";
import "@sitecore-cloudsdk/personalize/browser";
import "@sitecore-cloudsdk/search/browser";
import { useEffect } from "react";
import useEvents from "@/app/hooks/useEvents";

export default function PageView() {
  const { triggerPageViewEvent } = useEvents();
  useEffect(() => {
    CloudSDK({
      sitecoreEdgeContextId: process.env.NEXT_PUBLIC_SITECORE_CONTEXT_ID ?? "",
      siteName: process.env.NEXT_PUBLIC_SITECORE_POS ?? "",
      enableBrowserCookie: true,
    })
      .addEvents() // Initialize the `events` package.
      .addSearch() // Inititalize the 'search' package
      // .addPersonalize({
      //   enablePersonalizeCookie: true,
      //   webPersonalization: true,
      // }) // Initialize the `personalize` package.
      .initialize();

    // Send VIEW event:
    triggerPageViewEvent("VIEW");
  }, [triggerPageViewEvent]);

  return <></>;
}
