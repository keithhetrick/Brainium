import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "../components/Logo";
import HeroImage from "../public/hero.webp";
import Pexels1 from "/public/pexels1.jpeg";
import Pexels2 from "/public/pexels2.jpeg";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  const VIDEO_SOURCE = (
    <video
      aria-hidden="true"
      muted
      className="z-20 h-screen w-screen object-cover relative transition-opacity duration-300 pointer visible opacity-100"
      autoPlay
      loop
      playsInline
    >
      <source
        src="https://res.cloudinary.com/dwn6kesnb/video/upload/v1678987222/samples/landing-page-vids/3224100290_fdmt8b.mp4"
        type="video/mp4"
      />
      Your browser does not support the video tag.{" "}
    </video>
  );

  // isMobile state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const MOBILE_VIEW = (
    <div className="w-screen h-screen static">
      {VIDEO_SOURCE}
      <div className="overflow-hidden flex justify-center items-center">
        <div className="z-50 text-white w-11/12 px-10 pb-10 pt-2 m-auto h-fit text-center max-w-screen-sm rounded-lg bg-slate-900/80 backdrop-blur-md absolute left-0 right-0 top-0 bottom-0">
          <Logo />
          <p>
            The AI-powered SAAS solution to generate SEO-optimized blog posts in
            minutes. Get high-quality content, without sacrificing your time.
          </p>
          <Link
            href="/post/new"
            className="btn mt-3 hover:transform hover:scale-105 transition-all duration-400 ease-in-out"
          >
            Begin
          </Link>
        </div>
      </div>
    </div>
  );

  const DESKTOP_VIEW = (
    <div className="w-screen h-screen static">
      {VIDEO_SOURCE}
      <div className="overflow-hidden flex justify-center items-center">
        <div className="z-50 text-white px-10 pb-10 pt-2 m-auto h-fit text-center max-w-screen-sm rounded-lg bg-slate-900/80 backdrop-blur-md absolute left-0 right-0 top-0 bottom-0">
          <Logo />
          <p>
            The AI-powered SAAS solution to generate SEO-optimized blog posts in
            minutes. Get high-quality content, without sacrificing your time.
          </p>
          <Link
            href="/post/new"
            className="btn mt-3 hover:transform hover:scale-105 transition-all duration-400 ease-in-out"
          >
            Begin
          </Link>
        </div>
      </div>
    </div>
  );

  return <>{isMobile ? MOBILE_VIEW : DESKTOP_VIEW}</>;
}
