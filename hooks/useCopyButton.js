import {
  faClipboard,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

export const useCopyButton = () => {
  const [copied, setCopied] = useState(false);

  const copyPost = () => {
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
