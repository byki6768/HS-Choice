import { LoginPage } from "@/_pages/login";

export default async function Page({
  searchParams,
}: PageProps<"/login">) {
  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const mode = Array.isArray(params.mode) ? params.mode[0] : params.mode;

  return <LoginPage error={error} mode={mode} />;
}
