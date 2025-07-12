import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";


const AuthRedirectWrapper = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession();
  if (!session) {
    redirect("/home");
  }
  return <>{children}</>;
};

export default AuthRedirectWrapper;