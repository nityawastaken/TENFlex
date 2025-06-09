import Image from "next/image";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Recommendation from "./components/Recommendation";
import PopularServices from "./components/Popular";
import MadeonTenflex from "./components/MadeonTenflex";


export default function Home() {
  return (<>

    < Navbar />
    < Hero />
    <Recommendation />
    < PopularServices />
    < MadeonTenflex />
    < Footer />
  </>
  );
}
