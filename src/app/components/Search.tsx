"use client";

import SearchResultCard from "./SearchResultCard";
import Spinner from "./Spinner";
import useSearch, { SUGGESION_KEY, WIDGET_ID } from "../hooks/useSearch";
import { useState } from "react";
import { Context, getWidgetData, SearchWidgetItem, WidgetRequestData, widgetSuggestionClick } from "@sitecore-cloudsdk/search/browser";
import { usePathname } from "next/navigation";
import {
  SearchFacet,
  SearchResult,
  SearchResultElement,
} from "../types/search";

export default function Search() {
  const [query, setQuery] = useState<string>("");
  const [filter, setFilter] = useState<SearchFacet>({});
  const [queryField, setQueryField] = useState<string>("");
  const { data, isLoading } = useSearch<
    SearchResult<SearchResultElement>,
    SearchResultElement
  >(query, filter);
  const pathName = usePathname();

  async function handleFieldChange(val: string) {
    if (val.length >= 3) {
      setQuery(val);
    } else if (query != "") {
      setQuery("");
    }

    setQueryField(val);
  }

  async function searchSuggestionClicked(val: string) {
    setQueryField(val);
    setQuery(val);
    widgetSuggestionClick({
      request: {
        keyword: val,
      },
      pathname: pathName,
      widgetId: WIDGET_ID,
    });
  }

  async function filterClicked(section: string, element: string) {
    const currentFilter = filter;
    const isIn = currentFilter?.[section]?.includes(element) ?? false;
    if (isIn) {
      currentFilter[section] = currentFilter[section].filter(
        (element) => element != element
      );
    } else {
      if (!currentFilter?.[section]) {
        currentFilter[section] = [];
      }

      currentFilter[section].push(element);
    }

    const clone = JSON.parse(JSON.stringify(currentFilter));
    setFilter(clone);
  }

  return (
    <div className="text-white">
      <h2 className="font-bold text-4xl pb-4 pt-2 text-center">
        You are looking for something specific?
      </h2>
      <div className="grid grid-cols-6 pt-14">
        <div className="col-span-1 pl-8">
          {data?.facet?.map((section) => {
            return (
              <div
                key={section.name}
                className="col-2 py-10 first:pt-0 last:pb-0"
              >
                <fieldset>
                  <legend className="block text-3xl text-white">
                    {section.label}
                  </legend>
                  <div className="space-y-3 pt-6">
                    {section.value.map((option) => (
                      <div key={option.id} className="flex gap-3">
                        <div className="flex h-5 shrink-0 items-center">
                          <div className="group grid size-4 grid-cols-1">
                            <input
                              id={`${section.name}-${option.id}`}
                              name={`${section.name}[]`}
                              type="checkbox"
                              checked={
                                filter?.[section.name]?.includes(option.text) ??
                                false
                              }
                              onChange={() => {
                                filterClicked(section.name, option.text);
                              }}
                              className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                            />
                            <svg
                              fill="none"
                              viewBox="0 0 14 14"
                              className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                            >
                              <path
                                d="M3 8L6 11L11 3.5"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-0 group-has-[:checked]:opacity-100"
                              />
                              <path
                                d="M3 7H11"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-0 group-has-[:indeterminate]:opacity-100"
                              />
                            </svg>
                          </div>
                        </div>
                        <label
                          htmlFor={`${section.name}-${option.id}`}
                          className="text-sm text-gray-400"
                        >
                          {option.text} ({option.count})
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            );
          })}
        </div>
        <div className="col-span-5">
          <div className="m-2 pb-4">
            <input
              id="query"
              name="query"
              type="text"
              value={queryField}
              onChange={(e) => handleFieldChange(e.target.value)}
              placeholder="Enter your search query"
              className="bg-gray-900 block w-full rounded-md px-3 py-1.5 text-base text-gray-600 outline outline-1 -outline-offset-1 outline-indigo-900 placeholder:text-gray-300 focus:outline focus:outline-2 focus:bg-gray-800 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            {/* <p className="text-gray-400 text-sm pl-2 pt-1">
              Enter more than 3 characters to trigger search...
            </p> */}
            {!isLoading && (data?.content?.length ?? 0) == 0 ? (
              <>
                <div className="pl-2 pt-6">
                  <div className="inline-block"> Sorry no results...</div>
                  <div></div>
                  {(data?.suggestion?.[SUGGESION_KEY]?.length ?? 0) > 0 ? (
                    <div className="inline-block">
                      Did you mean{" "}
                      {data?.suggestion?.[SUGGESION_KEY]?.map((element) => {
                        return (
                          <>
                            {" "}
                            <div
                              onClick={() => {
                                searchSuggestionClicked(element.text);
                              }}
                              className="cursor-pointer bg-slate-600 rounded-full py-1 px-2 right-0 text-sm inline-block"
                            >
                              {element.text}{" "}
                            </div>
                          </>
                        );
                      })}
                      <div className="h-[400px]"></div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          {isLoading ? (
            <>
              <Spinner />
              <div className="h-[400px]"></div>
            </>
          ) : (
            data && (
              <div className="grid grid-cols-4">
                {data?.content?.map((element) => (
                  <SearchResultCard
                    key={element.id}
                    title={element.title}
                    description={element.description}
                    image={element.image_url}
                    link={element.url}
                    type={element.tags}
                  />
                )) ?? <></>}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
