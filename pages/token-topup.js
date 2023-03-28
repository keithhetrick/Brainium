import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import { AppLayout } from "../components/AppLayout";
import { getAppProps } from "../utils/getAppProps";

export default function TokenTopup() {
  const [isMobile, setIsMobile] = useState(false);

  const handleClick = async () => {
    const result = await fetch(`/api/addTokens`, {
      method: "POST",
    });
    const json = await result.json();
    window.location.href = json.session.url;
  };

  const VIDEO_SOURCE = (
    <video
      aria-hidden="true"
      muted
      className="z-20 h-screen w-screen object-cover transition-opacity duration-300 pointer visible opacity-100"
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

  const MOBILE_VIEW = (
    <div className="w-full h-full flex flex-col relative mb-14">
      {VIDEO_SOURCE}
      <div
        className="z-50 w-11/12 h-fit absolute left-0 right-0 top-0 bottom-0 m-auto backdrop-blur-sm max-w-screen-sm bg-slate-100/80 p-4 rounded-md shadow-lg border border-slate-200 shadow-gray-800
      "
      >
        <h1 className="text-4xl font-bold text-center -mb-2 ">How it works:</h1>
        <div>
          <ol className="list-decimal list-inside text-normal text-left p-4">
            <li>
              Click the button below to be redirected to the payment page.
            </li>
            <li>Enter your card details and click &lsquo;Pay&rsquo;.</li>
            <li>
              3 You will be redirected back to the app and your tokens will be
              added.
            </li>
            <li>You can use the tokens to generate posts.</li>
          </ol>
        </div>
        <button className="btn " onClick={handleClick}>
          Add tokens
        </button>
      </div>
    </div>
  );

  const DESKTOP_VIEW = (
    <div className="w-full h-full flex flex-col relative">
      {VIDEO_SOURCE}
      <div
        className="z-50 w-11/12 h-fit absolute left-0 right-0 top-0 bottom-0 m-auto backdrop-blur-sm max-w-screen-sm bg-slate-100/80 p-4 rounded-md shadow-lg border border-slate-200 shadow-gray-800
      "
      >
        <h1 className="text-4xl font-bold text-center -mb-2 ">How it works:</h1>
        <div>
          <ol className="list-decimal list-inside text-normal p-4">
            <li>
              Click the button below to be redirected to the payment page.
            </li>
            <li>Enter your card details and click &lsquo;Pay&rsquo;.</li>
            <li>
              You will be redirected back to the app and your tokens will be
              added.
            </li>
            <li>You can use the tokens to generate posts.</li>
          </ol>
        </div>
        <button className="btn " onClick={handleClick}>
          Add tokens
        </button>
      </div>
    </div>
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

  return <>{isMobile ? MOBILE_VIEW : DESKTOP_VIEW}</>;
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});
