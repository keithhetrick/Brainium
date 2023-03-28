import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import { AppLayout } from "../components/AppLayout";
import { getAppProps } from "../utils/getAppProps";

export default function Success(props) {
  const tokens = props?.availableTokens;

  const [isMobile, setIsMobile] = useState(false);

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
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Thank you for your purchase!</h1>
      <p className="text-sm px-2">
        You have {tokens} tokens available. You can use these tokens to generate
        posts.
      </p>
      <p className="text-xs">
        Navigate to the dashboard to start generating posts.
      </p>
    </div>
  );

  const DESKTOP_VIEW = (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Thank you for your purchase!</h1>
      <p className="text-normal px-4">
        You have {tokens} tokens available. You can use these tokens to generate
        posts.
      </p>
      <p className="text-sm">
        Navigate to the dashboard to start generating posts.
      </p>
    </div>
  );

  return <>{isMobile ? MOBILE_VIEW : DESKTOP_VIEW}</>;
}

Success.getLayout = function getLayout(page, pageProps) {
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
