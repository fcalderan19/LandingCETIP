import { describe, it, expect } from "vitest";
import { registry, listSectionTypes, getSection } from "@/lib/sections";

describe("section registry", () => {
  const types = Object.keys(registry);

  it("has at least the 4 home sections", () => {
    expect(types).toEqual(
      expect.arrayContaining([
        "hero_slider",
        "service_grid",
        "about_preview",
        "featured_strip",
      ]),
    );
  });

  it.each(types)("entry %s has consistent shape", (type) => {
    const def = (registry as Record<string, unknown>)[type] as {
      type: string;
      schema: { safeParse: (v: unknown) => { success: boolean } };
      defaults: unknown;
      render: unknown;
      editor: { label: string; fieldGroups: unknown[] };
    };
    expect(def.type).toBe(type);
    expect(typeof def.render).toBe("function");
    expect(typeof def.editor.label).toBe("string");
    expect(Array.isArray(def.editor.fieldGroups)).toBe(true);
  });

  it.each(types)("%s defaults validate against its schema", (type) => {
    const def = (registry as Record<string, { schema: { safeParse: (v: unknown) => { success: boolean; error?: unknown } }; defaults: unknown }>)[type];
    const r = def.schema.safeParse(def.defaults);
    if (!r.success) {
      // surface the issue
      console.error(type, r.error);
    }
    expect(r.success).toBe(true);
  });

  it("getSection returns undefined for unknown type", () => {
    expect(getSection("does_not_exist")).toBeUndefined();
  });

  it("listSectionTypes returns palette items", () => {
    const items = listSectionTypes();
    expect(items.length).toBe(types.length);
    for (const item of items) {
      expect(typeof item.label).toBe("string");
      expect(typeof item.type).toBe("string");
    }
  });
});
