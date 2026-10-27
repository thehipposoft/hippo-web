import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Reemplazos con locale de next/link y next/navigation
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
