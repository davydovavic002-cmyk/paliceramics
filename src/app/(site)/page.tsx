import dynamic from "next/dynamic";
import { Suspense } from "react";
import { HeroDark } from "@/components/hero/HeroDark";

const HomeLookbookSection = dynamic(
  () => import("@/components/shop/HomeLookbookSection").then((m) => m.HomeLookbookSection)
);
const WorkshopsBookingSection = dynamic(
  () => import("@/components/workshops/WorkshopsBookingSection").then((m) => m.WorkshopsBookingSection)
);
const CertificateSection = dynamic(
  () => import("@/components/certificates/CertificateSection").then((m) => m.CertificateSection)
);
const AboutStudioSection = dynamic(
  () => import("@/components/about/AboutStudioSection").then((m) => m.AboutStudioSection)
);
const DeliverySection = dynamic(
  () => import("@/components/content/DeliverySection").then((m) => m.DeliverySection)
);

export default function Home() {
  return (
    <>
      <HeroDark />
      <Suspense fallback={null}>
        <HomeLookbookSection />
        <WorkshopsBookingSection />
        <CertificateSection />
        <AboutStudioSection />
        <DeliverySection />
      </Suspense>
    </>
  );
}
