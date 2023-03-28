import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ObjectId } from "mongodb";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AppLayout } from "../../components/AppLayout";
import PostsContext from "../../context/postsContext";

import clientPromise from "../../lib/mongodb";
import { getAppProps } from "../../utils/getAppProps";

export default function Post(props) {
  const router = useRouter();

  const [generating, setGenerating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deletePost } = useContext(PostsContext);

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch("/api/deletePost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: props?.id,
        }),
      });
      const json = await response.json();

      if (json?.success) {
        deletePost(props?.id);
        router.replace("/post/new");
      }
    } catch (error) {
      console.error("\nERROR: ", error);
    }
  };

  // setGenerating(true) on mount
  useEffect(() => {
    setGenerating(true);

    return () => clearTimeout();
  }, []);

  // if theres a post, setGenerating to false
  useEffect(() => {
    if (props?.title) {
      setGenerating(false);

      return () => clearTimeout();
    }
  }, [props?.title]);

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
    <div className="w-fit h-fit m-auto relative">
      {VIDEO_SOURCE}
      <div className="absolute w-full h-full left-0 right-0 top-0 bottom-0">
        {generating && (
          <div className="absolute bg-white bg-opacity-50 flex items-center justify-center">
            <div className="text-2xl font-bold text-slate-800">
              <FontAwesomeIcon icon={faHashtag} /> Getting post...
            </div>
          </div>
        )}

        {!generating && (
          <div className="overflow-auto p-2 h-full md:m-0 py-6 md:px-6 mb-28">
            <div className="mb-32">
              <div className="text-sm font-bold p-2 bg-stone-200 bg-slate-100/80 rounded-sm backdrop-blur-sm">
                SEO title and meta description
              </div>
              <div className="p-4 my-2 border border-stone-200 bg-slate-100/80 rounded-md backdrop-blur-sm">
                <div className="text-blue-600 text-2xl font-bold ">
                  {props?.title}
                </div>
                <div className="mt-2">{props?.metaDescription}</div>
              </div>
              <div className="text-sm font-bold mt-6 p-2 bg-stone-200 bg-slate-100/80 backdrop-blur-sm rounded-sm">
                Keywords
              </div>
              <div className="flex flex-wrap pt-2 gap-1">
                {props?.keywords?.split(",").map((keyword, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-full bg-slate-800 text-white"
                  >
                    <FontAwesomeIcon icon={faHashtag} /> {keyword}
                  </div>
                ))}
              </div>
              <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm bg-slate-100/80 backdrop-blur-sm">
                Blog post
              </div>
              <div
                className="p-6 my-2 border border-stone-200 bg-slate-100/80 backdrop-blur-sm rounded-md "
                dangerouslySetInnerHTML={{ __html: props?.postContent || "" }}
              />
              <div className="my-4">
                {!showDeleteConfirm && (
                  <button
                    className="btn bg-red-600 hover:bg-red-700"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Post
                  </button>
                )}
                {showDeleteConfirm && (
                  <div>
                    <p className="p-2 bg-red-300 text-center">
                      Are you sure you want to delete this post? This action is
                      irreversible.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="btn bg-stone-600 hover:bg-stone-700"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        cancel
                      </button>
                      <button
                        className="btn bg-red-600 hover:bg-red-700"
                        onClick={handleDeleteConfirm}
                      >
                        confirm delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const DESKTOP_VIEW = (
    <div className="w-fit h-fit m-auto relative">
      {VIDEO_SOURCE}
      <div className="absolute w-full h-full left-0 right-0 top-0 bottom-0">
        {generating && (
          <div className="absolute bg-white bg-opacity-50 flex items-center justify-center">
            <div className="text-2xl font-bold text-slate-800">
              <FontAwesomeIcon icon={faHashtag} /> Getting post...
            </div>
          </div>
        )}

        {!generating && (
          <div className="overflow-auto p-2 h-full md:m-0 py-6 md:px-6 mb-24">
            <div className="">
              <div className="text-sm font-bold p-2 bg-stone-200 bg-slate-100/80 rounded-sm backdrop-blur-sm">
                SEO title and meta description
              </div>
              <div className="p-4 my-2 border border-stone-200 bg-slate-100/80 rounded-md backdrop-blur-sm">
                <div className="text-blue-600 text-2xl font-bold ">
                  {props?.title}
                </div>
                <div className="mt-2">{props?.metaDescription}</div>
              </div>
              <div className="text-sm font-bold mt-6 p-2 bg-stone-200 bg-slate-100/80 backdrop-blur-sm rounded-sm">
                Keywords
              </div>
              <div className="flex flex-wrap pt-2 gap-1">
                {props?.keywords?.split(",").map((keyword, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-full bg-slate-800 text-white"
                  >
                    <FontAwesomeIcon icon={faHashtag} /> {keyword}
                  </div>
                ))}
              </div>
              <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm bg-slate-100/80 backdrop-blur-sm">
                Blog post
              </div>
              <div
                className="p-6 my-2 border border-stone-200 bg-slate-100/80 backdrop-blur-sm rounded-md "
                dangerouslySetInnerHTML={{ __html: props?.postContent || "" }}
              />
              <div className="my-4">
                {!showDeleteConfirm && (
                  <button
                    className="btn bg-red-600 hover:bg-red-700"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Post
                  </button>
                )}
                {showDeleteConfirm && (
                  <div>
                    <p className="p-2 bg-red-300 text-center">
                      Are you sure you want to delete this post? This action is
                      irreversible.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="btn bg-stone-600 hover:bg-stone-700"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        cancel
                      </button>
                      <button
                        className="btn bg-red-600 hover:bg-red-700"
                        onClick={handleDeleteConfirm}
                      >
                        confirm delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return <>{isMobile ? MOBILE_VIEW : DESKTOP_VIEW}</>;
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);

    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db("AI-Blog-Generator");
    const user = await db.collection("users").findOne({
      auth0Id: userSession?.user?.sub,
    });

    const post = await db.collection("posts").findOne({
      _id: new ObjectId(ctx?.params?.postId),
      userId: user?._id,
    });

    if (!post) {
      return {
        redirect: {
          destination: "/post/new",
          permanent: false,
        },
      };
    }

    return {
      props: {
        id: ctx?.params?.postId,
        postContent: post?.postContent,
        title: post?.title,
        metaDescription: post?.metaDescription,
        keywords: post?.keywords,
        postCreated: post?.created.toString(),
        ...props,
      },
    };
  },
});
