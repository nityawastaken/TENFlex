import Hero from "./components/Hero";
import Recommendation from "./components/Recommendation";
import PopularServices from "./components/Popular";
import MadeonTenflex from "./components/MadeonTenflex";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Integration Status Banner */}
      <div className="bg-blue-600 text-white py-2 px-4 text-center">
        <p className="text-sm">
          🚀 Django Backend Integration Complete! 
          <Link href="/test-integration" className="ml-2 underline hover:no-underline">
            Test Integration →
          </Link>
        </p>
      </div>
      
      <Hero />
      <Recommendation />
      <PopularServices />
      <MadeonTenflex />
    </div>
  );
}