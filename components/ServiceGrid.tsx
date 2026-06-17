import {
  ServiceGridRender,
  ServiceGridDefaults,
} from "./sections/ServiceGrid";

export default function ServiceGrid() {
  return <ServiceGridRender {...ServiceGridDefaults} />;
}
