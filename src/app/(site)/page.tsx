import { HeroDark } from "@/components/hero/HeroDark";
import { HomeLookbookSection } from "@/components/shop/HomeLookbookSection";
import { WorkshopsBookingSection } from "@/components/workshops/WorkshopsBookingSection";
import { CertificateSection } from "@/components/certificates/CertificateSection";
import { AboutStudioSection } from "@/components/about/AboutStudioSection";
import { DeliverySection } from "@/components/content/DeliverySection";

export default function Home() {
  return (
    <>
      <HeroDark />
      <HomeLookbookSection />
      <WorkshopsBookingSection />
      <CertificateSection />
      <AboutStudioSection />
      <DeliverySection />
    </>
  );
}
