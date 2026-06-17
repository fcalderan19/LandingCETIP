import type { ComponentType } from "react";
import type { ZodTypeAny, infer as ZodInfer } from "zod";

export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "image"
  | "link"
  | "color"
  | "boolean"
  | "array";

export type SelectOption = { value: string; label: string };

export interface FieldDef {
  name: string;
  kind: FieldKind;
  label: string;
  description?: string;
  options?: SelectOption[];
  itemFields?: FieldDef[];
}

export interface FieldGroup {
  name: string;
  label: string;
  description?: string;
  fields: FieldDef[];
}

export interface SectionEditorMeta {
  label: string;
  description?: string;
  icon?: string;
  fieldGroups: FieldGroup[];
}

export interface SectionDef<TSchema extends ZodTypeAny = ZodTypeAny> {
  type: string;
  schema: TSchema;
  defaults: ZodInfer<TSchema>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render: ComponentType<any>;
  editor: SectionEditorMeta;
}
