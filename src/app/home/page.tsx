import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import HomeClientPage from "./homeClientPage";

const HomePage = async () => {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
    return null;
  }
  return <HomeClientPage />;
};

export default HomePage;