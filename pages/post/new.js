import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AppLayout } from "../../components/AppLayout";
import { getAppProps } from "../../utils/getAppProps";

export default function NewPost(props) {
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [generating, setGenerating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const response = await fetch(`/api/generatePost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          keywords,
        }),
      });

      const json = await response.json();

      if (json?.postId) {
        router.push(`/post/${json?.postId}`);
      }
    } catch (error) {
      console.error("\nERROR: ", error);
      setGenerating(false);
    }
  };

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
    <main className="h-1/2 overflow-hidden">
      {!!generating && (
        <div className="text-green-500 mt-3 flex h-full animate-pulse w-full flex-col justify-center items-center">
          <FontAwesomeIcon icon={faBrain} className="text-8xl" />
          <h6>Generating...</h6>
        </div>
      )}

      {!generating && (
        <div className="w-full h-fit flex flex-col relative overflow-auto">
          {VIDEO_SOURCE}
          <div className="p-2 w-full z-20 m-auto absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <form
              onSubmit={handleSubmit}
              className="m-auto w-full backdrop-blur-sm max-w-screen-sm bg-slate-100/80 p-4 rounded-md shadow-lg border border-slate-200 shadow-gray-800"
            >
              <div>
                <label>
                  <strong>Generate a blog post on the topic of:</strong>
                </label>
                <textarea
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  maxLength={80}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div>
                <label>
                  <strong>Targeting the following keywords:</strong>
                </label>
                <textarea
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={keywords}
                  maxLength={80}
                  onChange={(e) => setKeywords(e.target.value)}
                />
                <small className="block mb-2">
                  * Separate keywords with a comma
                </small>
              </div>

              <button
                type="submit"
                className="btn"
                disabled={!topic.trim() || !keywords.trim()}
              >
                Generate
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );

  const DESKTOP_VIEW = (
    <main className="h-full overflow-hidden">
      {!!generating && (
        <div className="text-green-500 flex h-full animate-pulse w-full flex-col justify-center items-center">
          <FontAwesomeIcon icon={faBrain} className="text-8xl" />
          <h6>Generating...</h6>
        </div>
      )}

      {!generating && (
        <div className="w-full h-full flex flex-col relative overflow-auto">
          {VIDEO_SOURCE}
          <div className="p-2 h-auto w-full z-20 m-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <form
              onSubmit={handleSubmit}
              className="m-auto w-full max-w-screen-sm backdrop-blur-sm bg-slate-100/80 p-4 rounded-md shadow-lg border border-slate-200 shadow-gray-00"
            >
              <div>
                <label>
                  <strong>Generate a blog post on the topic of:</strong>
                </label>
                <textarea
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  maxLength={80}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div>
                <label>
                  <strong>Targeting the following keywords:</strong>
                </label>
                <textarea
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={keywords}
                  maxLength={80}
                  onChange={(e) => setKeywords(e.target.value)}
                />
                <small className="block mb-2">
                  * Separate keywords with a comma
                </small>
              </div>

              <button
                type="submit"
                className="btn"
                disabled={!topic.trim() || !keywords.trim()}
              >
                Generate
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );

  return isMobile ? MOBILE_VIEW : DESKTOP_VIEW;
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);

    if (!props.availableTokens) {
      return {
        redirect: {
          destination: "/token-topup",
          permanent: false,
        },
      };
    }

    return {
      props,
    };
  },
});
