import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import PublicHome from "@/components/PublicHome";
import { AuthProvider } from '../Context/AuthContext'
import Auth from "../components/Auth";

export default function Home() {
  return (
    <>
    <AuthProvider>
    <Nav/>
    <Auth/>
    <PublicHome/>
    {/* <Footer/> */}
    </AuthProvider>
    </>
  );
}
