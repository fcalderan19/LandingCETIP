import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { apiVersion, dataset, projectId } from "./sanity/env";

export default defineConfig({
  name: "default",
  title: "CETIP — Admin",
  basePath: "/admin",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })]
});
