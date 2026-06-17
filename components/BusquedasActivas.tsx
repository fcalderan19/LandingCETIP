import {
  JobOpeningsListRender,
  JobOpeningsListDefaults,
} from "./sections/JobOpeningsList";

export default function BusquedasActivas() {
  return <JobOpeningsListRender {...JobOpeningsListDefaults} />;
}
