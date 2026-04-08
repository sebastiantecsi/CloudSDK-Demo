import { NextRequest, NextResponse } from "next/server";
import { CloudSDK } from "@sitecore-cloudsdk/core/server";
import "@sitecore-cloudsdk/events/server";
import {
  Context,
  getWidgetData,
  SearchWidgetItem,
  WidgetRequestData,
} from "@sitecore-cloudsdk/search/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json(
      { error: "Missing search query param `?q=`" },
      { status: 400 }
    );
  }

  try {
    // Initialize Cloud SDK in the API route context.
    // Middleware runs in a separate execution context and its initialization
    // does not carry over to API route handlers.
    
    const response = NextResponse.next();
    await CloudSDK(request, response, {
      sitecoreEdgeContextId: process.env.NEXT_PUBLIC_SITECORE_CONTEXT_ID ?? "",
      siteName: process.env.NEXT_PUBLIC_SITECORE_POS ?? "",
      enableServerCookie: true,
    })
      .addEvents()
      .addSearch()
      .initialize();

    const context = new Context({
      locale: { language: "en", country: "gb" },
    });

    // Create a widget request with the entity "product" and widget ID "rfkid_7":
    const widgetRequest = new SearchWidgetItem("content", "rfkid_442");
    widgetRequest.content = {}; // Request all attributes for the entity
    widgetRequest.limit = 10; // Limit the number of results to 10
    widgetRequest.sources = ["1050047"]; // Search in a sources
    widgetRequest.query = {
      keyphrase: q,
    };

    widgetRequest.facet = { all: true, types: [{ name: "news_type" }] };

    // Call the getWidgetData function with the widget request and the context to retrieve the data:
    const result = await getWidgetData(
      new WidgetRequestData([widgetRequest]),
      context
    );

    // Process the API data as needed
    return NextResponse.json({ search: result });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: error.message ?? "Search failed" },
      { status: 500 }
    );
  }
  //  return apiData;
}
