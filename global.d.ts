import type messages from "./messages/es.json";
import type { routing } from "./i18n/routing";

// Claves de mensajes y locales tipados (es.json es la referencia; en.json debe tener las mismas)
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
