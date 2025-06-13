import Hero from "./components/Hero";
import Recommendation from "./components/Recommendation";
import PopularServices from "./components/Popular";
import MadeonTenflex from "./components/MadeonTenflex";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Recommendation />
      <PopularServices />
      <MadeonTenflex />
    </div>
  );
}