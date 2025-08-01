"use client";
import Noise from "@/blocks/Backgrounds/Beams/silk";

export default function Home() {
  return (
    <main className="relative bg-black">
      <div className="w-full h-screen bg-gradient-to-tl relative from-white to-[#0083f5]">
        <div className="w-full h-full absolute z-10">
          <Noise
            patternSize={250}
            patternScaleX={1}
            patternScaleY={1}
            patternRefreshInterval={2}
            patternAlpha={10}
          />
        </div>
        <div className="w-full h-full  overflow-hidden sepia-30 flex justify-center items-center">
          <p className="text-9xl">FeelSystem</p>
        </div>
      </div>
    </main>
  );
}
