import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility", () => {
  it("concatenates basic class names", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4");
  });

  it("handles conditional classes correctly", () => {
    expect(cn("px-2", true && "py-4", false && "hidden")).toBe("px-2 py-4");
    expect(cn("px-2", undefined, null, "py-4")).toBe("px-2 py-4");
  });

  it("merges Tailwind classes correctly", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("p-4", "pt-2")).toBe("p-4 pt-2");
    expect(cn("px-2 py-2", "p-4")).toBe("p-4");
  });

  it("handles arrays and objects", () => {
    expect(cn(["px-2", "py-4"])).toBe("px-2 py-4");
    expect(cn({ "px-2": true, "py-4": false })).toBe("px-2");
    expect(cn(["px-2", { "py-4": true }])).toBe("px-2 py-4");
  });

  it("returns an empty string when no arguments are provided", () => {
    expect(cn()).toBe("");
  });
});
