import {
  PageHeroRender,
  PageHeroSchema,
  type PageHeroProps,
} from "./sections/PageHero";

type Crumb = { href: string; label: string };

export default function PageHero({
  title,
  subtitle,
  image,
  crumbs = [],
}: {
  title: string;
  subtitle?: string;
  image?: string;
  crumbs?: Crumb[];
}) {
  const props: PageHeroProps = PageHeroSchema.parse({
    title,
    subtitle,
    image,
    crumbs,
  });
  return <PageHeroRender {...props} />;
}
