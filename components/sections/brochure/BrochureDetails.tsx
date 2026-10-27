import BrochureServiceDetail from "@/components/sections/brochure/BrochureServiceDetail";
import { BROCHURE_SERVICES } from "@/lib/brochure";

/** Brochure · una pantalla de detalle por servicio */
export default function BrochureDetails() {
  return BROCHURE_SERVICES.map((base) => <BrochureServiceDetail key={base.id} base={base} />);
}
