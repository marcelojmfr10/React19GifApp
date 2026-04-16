import { act, renderHook } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { useGifs } from "./useGifs";
import * as gifActions from "../actions/get-gifs-by-query.action";

describe("useGifs", () => {
  test("should return default values and methos", () => {
    const { result } = renderHook(() => useGifs());
    expect(result.current.previousTerms).toEqual([]);
    expect(result.current.gifs.length).toBe(0);
    expect(result.current.handleSearch).toBeDefined();
    expect(result.current.handleTermClicked).toBeDefined();
  });

  test("should return a list of gifs", async () => {
    const { result } = renderHook(() => useGifs());
    await act(async () => await result.current.handleSearch("burguer"));
    expect(result.current.gifs.length).toBe(10);
  });

  test("should return a list of gifs when handleTermClicked is called", async () => {
    const { result } = renderHook(() => useGifs());
    await act(async () => await result.current.handleTermClicked("burguer"));
    expect(result.current.gifs.length).toBe(10);
  });

  test("should return a list of gifs from cache", async () => {
    const { result } = renderHook(() => useGifs());
    await act(async () => await result.current.handleTermClicked("burguer"));
    expect(result.current.gifs.length).toBe(10);
    vi.spyOn(gifActions, "getGifsByQuery").mockRejectedValue(
      new Error(`This is my custom error`),
    );
    await act(async () => await result.current.handleTermClicked("burguer"));
    expect(result.current.gifs.length).toBe(10);
  });

  test("should return no more than 8 previous terms", async () => {
    const { result } = renderHook(() => useGifs());

    vi.spyOn(gifActions, "getGifsByQuery").mockResolvedValue([]);

    await act(async () => {
      await result.current.handleSearch("burguer");
    });
    await act(async () => {
      await result.current.handleSearch("burguer2");
    });
    await act(async () => {
      await result.current.handleSearch("burguer3");
    });
    await act(async () => {
      await result.current.handleSearch("burguer4");
    });
    await act(async () => {
      await result.current.handleSearch("burguer5");
    });
    await act(async () => {
      await result.current.handleSearch("burguer6");
    });
    await act(async () => {
      await result.current.handleSearch("burguer7");
    });
    await act(async () => {
      await result.current.handleSearch("burguer8");
    });
    await act(async () => {
      await result.current.handleSearch("burguer9");
    });

    expect(result.current.previousTerms.length).toBe(8);
    expect(result.current.previousTerms).toStrictEqual([
      "burguer9",
      "burguer8",
      "burguer7",
      "burguer6",
      "burguer5",
      "burguer4",
      "burguer3",
      "burguer2",
    ]);
  });
});
