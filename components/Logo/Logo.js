import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export const Logo = () => {
  const [effect, setEffect] = useState(false);

  return (
    <div className="text-3xl text-center py-4 font-heading">
      Brainium {""}
      <FontAwesomeIcon
        icon={faBrain}
        type="button"
        className={`${
          effect && "animate-wiggle"
        } text-2xl text-slate-400 cursor-pointer animate-pulse hover:scale-125 transition-transform duration-300 ease-in-out`}
        onClick={() => {
          setEffect(true);
        }}
        onAnimationEnd={() => setEffect(false)}
      />
    </div>
  );
};
