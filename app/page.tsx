import HeroSlider from "@/components/HeroSlider";
import ServiceGrid from "@/components/ServiceGrid";
import FeaturedStrip from "@/components/FeaturedStrip";
import AboutPreview from "@/components/AboutPreview";
import PageRenderer from "@/components/PageRenderer";

export default function Home() {
  return (
    <PageRenderer
      slug="home"
      fallback={
        <>
          <HeroSlider />
          <ServiceGrid />
          <AboutPreview />
          <FeaturedStrip />
        </>
      }
    />
  );
}
