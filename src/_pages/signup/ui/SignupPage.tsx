import { redirect } from "next/navigation";
import { routes } from "@/shared/config";

export function SignupPage() {
  redirect(routes.login);
}
