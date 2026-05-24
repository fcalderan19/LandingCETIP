import type { SchemaTypeDefinition } from "sanity";
import { profesional } from "./profesional";
import { taller } from "./taller";
import { busqueda } from "./busqueda";

export const schemaTypes: SchemaTypeDefinition[] = [profesional, taller, busqueda];
