import Image from "next/image";
import Link from "next/link";
import PostsContext from "../../context/postsContext";
import { useUser } from "@auth0/nextjs-auth0/client";
import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { Logo } from "../Logo";

export const AppLayout = ({
  children,
  availableTokens,
  posts: postsFromSSR,
  postId,
  postCreated,
}) => {
  const { user } = useUser();

  const [isMobile, setIsMobile] = useState(false);

  const { setPostsFromSSR, posts, getPosts, noMorePosts } =
    useContext(PostsContext);

  useEffect(() => {
    setPostsFromSSR(postsFromSSR);

    if (postId) {
      const exists = postsFromSSR.find((post) => post._id === postId);
      if (!exists) {
        getPosts({ getNewerPosts: true, lastPostDate: postCreated });
      }
    }
  }, [postsFromSSR, setPostsFromSSR, postId, getPosts, postCreated]);

  const PostCard = ({ post }) => {
    return (
      <Link
        key={post?._id}
        href={`/post/${post?._id}`}
        className={`py-1 border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm ${
          postId === post?._id ? "bg-white/20 border-white" : ""
        }`}
      >
        {post?.topic}
      </Link>
    );
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

  const MOBILE_VIEW = (
    <aside className="h-screen relative">
      <main className="h-full overflow-y-auto">
        {/* Header Container - 1x */}
        <div className="text-center justify-center items-center">
          <section className="flex flex-col text-white overflow-hidden">
            <div className="bg-slate-800 px-2">
              <header className="flex flex-row justify-between items-center">
                <Logo />
                <div className="bg-slate-800 flex items-center gap-2 h-20 px-2 align-center">
                  {!!user ? (
                    <>
                      {/* <button
                        data-dropdown-toggle="dropdownAvatarName"
                        className="flex items-center text-sm font-medium text-gray-900 rounded-full hover:text-blue-600 dark:hover:text-blue-500 md:mr-0 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-white"
                        type="button"
                      >
                        <span className="sr-only">Open user menu</span>
                        <Image
                          src={user?.picture}
                          alt={user?.name}
                          height={30}
                          width={30}
                          className="w-8 h-8 mr-2 rounded-full"
                        />
                        <p className="text-xs">{user?.name}</p>
                        <svg
                          className="w-4 h-4 mx-1.5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>

                      <div
                        data-dropdown-menu="dropdownAvatarName"
                        className="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu"
                      > */}
                      <Link
                        href="/api/auth/logout"
                        className="block px-4 py-2 text-sm text-right text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        <div className="flex">
                          <Image
                            src={user?.picture}
                            alt={user?.name}
                            height={20}
                            width={20}
                            className="w-7 h-7 mr-2 rounded-full"
                          />
                          <p className="text-xs">{user?.name}</p>
                        </div>
                        Sign out
                      </Link>
                      {/* </div> */}
                    </>
                  ) : (
                    <Link href="/api/auth/login" className="btn">
                      Login
                    </Link>
                  )}
                </div>
              </header>

              <div>
                <div className="flex flex-col text-white overflow-hidden">
                  <div className="bg-slate-800 py-2">
                    <Link href="/post/new" className="btn">
                      New post
                    </Link>
                    <Link
                      href="/token-topup"
                      className="block mt-2 text-center"
                    >
                      <FontAwesomeIcon
                        icon={faCoins}
                        className="text-yellow-500"
                      />
                      <span className="pl-1">
                        {availableTokens} tokens avaliable
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Child Container - 2x */}
        <div className="flex text-center justify-center items-center">
          <section id="children__props" className="flex-1">
            {children
              ? React.cloneElement(children, { availableTokens })
              : null}
          </section>
        </div>

        {/* Posts Container - 1x */}
        <div className="text-center justify-center items-center w-full max-h-[132px] overflow-y-auto absolute bottom-0 z-50">
          <main className="bg-gray-800 text-white shadow-xl w-full content-center overflow-auto">
            {posts.map((post) => (
              <PostCard post={post} key={post._id} />
            ))}
            {!noMorePosts && (
              <div
                onClick={() =>
                  getPosts({
                    lastPostDate: posts[posts.length - 1]?.created,
                  })
                }
                className="hover:underline text-sm text-slate-400 text-center cursor-pointer m-4"
              >
                {posts.length === 0 ? "No Posts" : "Load more posts"}
              </div>
            )}
          </main>
        </div>
      </main>
    </aside>
  );

  const DESKTOP_VIEW = (
    <aside className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      {/* Sidebar Container - 1x */}
      <section className="flex flex-col text-white overflow-hidden">
        <div className="bg-slate-800 px-2">
          <Logo />
          <Link href="/post/new" className="btn">
            New post
          </Link>
          <Link href="/token-topup" className="block mt-2 text-center">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-1">{availableTokens} tokens avaliable</span>
          </Link>
        </div>
        <main className="px-4 flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-[#8dadbe]">
          {posts.map((post) => (
            <PostCard post={post} key={post._id} />
          ))}
          {!noMorePosts && (
            <div
              onClick={() =>
                getPosts({
                  lastPostDate: posts[posts.length - 1]?.created,
                })
              }
              className="hover:underline text-sm text-slate-400 text-center cursor-pointer mt-4"
            >
              Load more posts
            </div>
          )}
        </main>
        <div className="bg-[#8dadbe] flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
          {!!user ? (
            <>
              <div className="min-w-[50px]">
                <Image
                  src={user?.picture}
                  alt={user?.name}
                  height={50}
                  width={50}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="font-bold">{user?.email}</div>
                <Link href="/api/auth/logout" className="text-sm">
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </div>
      </section>

      {/* Child Container - 1x */}
      {children ? React.cloneElement(children, { availableTokens }) : null}
    </aside>
  );

  return <>{isMobile ? MOBILE_VIEW : DESKTOP_VIEW}</>;
};
