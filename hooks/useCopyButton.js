import {
  faClipboard,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import copy from "copy-text-to-clipboard";

export const useCopyButton = () => {
  const [copied, setCopied] = useState(false);

  const copyPost = () => {
    // console.log("copying post to clipboard");
    // const post = `
    // <div className="text-blue-600 text-2xl font-bold">
    //   ${props?.title}
    // </div>
    // <div className="mt-2">${props?.metaDescription}</div>
    // <div className="flex flex-wrap pt-2 gap-1">
    //   ${props?.keywords?.split(",").map((keyword, i) => (
    //     <div key={i} className="text-sm font-bold p-2 bg-stone-200 rounded-sm">
    //       ${keyword}
    //     </div>
    //   ))}
    // </div>
    // <div className="mt-2">
    //   <a
    //     href="https://www.thesocialcomment.com/post/${props?.id}"
    //     className="text-blue-600"
    //   >
    //     https://www.thesocialcomment.com/post/${props?.id}
    //   </a>
    // </div>
    // `;

    // copy(post);

    // console.log("\nPost", post);

    // return () => clearTimeout();
    // const post = document.getElementById("post");
    // const postHTML = post.innerHTML;

    // copy(postHTML);

    setCopied((prev) => !prev);
    console.log("Copied post to clipboard");
  };

  return (
    <button onClick={() => copyPost()}>
      <div className="text-sm font-bold p-2 bg-stone-200 rounded-sm">
        {copied ? (
          <FontAwesomeIcon icon={faClipboardCheck}></FontAwesomeIcon>
        ) : (
          <FontAwesomeIcon icon={faClipboard}></FontAwesomeIcon>
        )}
      </div>
    </button>
  );
};
