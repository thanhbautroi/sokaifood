import Hero from "@/components/sections/Hero";
import BrandIntro from "@/components/sections/BrandIntro";
import CollectionsPreview from "@/components/sections/CollectionsPreview";
import FeaturedProducts from "@/components/sections/FeaturedProducts";

export default function Home() {
  return (
    <>
      <Hero />
      <BrandIntro />
      <CollectionsPreview />
      <FeaturedProducts />
    </>
  );
}
