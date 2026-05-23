import HeroSlider from "@/components/HeroSlider";
import ServiceGrid from "@/components/ServiceGrid";
import FeaturedStrip from "@/components/FeaturedStrip";
import AboutPreview from "@/components/AboutPreview";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <ServiceGrid />
      <AboutPreview />
      <FeaturedStrip />
    </>
  );
}
