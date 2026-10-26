import { Outlet, useLocation } from "react-router-dom";
import CursorFollower from "../components/CursorFollower";
import FloatingActions from "../components/FloatingActions";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <main className="route-main" key={location.pathname}>
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
      <CursorFollower />
    </>
  );
}
