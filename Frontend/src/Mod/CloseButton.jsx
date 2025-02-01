import { useSetAtom } from "jotai";
import { uiAtom } from "./state";

const CloseButton = () => {
  const setUi = useSetAtom(uiAtom);

  return (
    <button
      className="absolute top-2 right-4 text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 text-5xl focus:outline-none transition-colors"
      onClick={() =>
        setUi((prev) => ({
          ...prev,
          modal: null,
          analytics: null,
        }))
      }
    >
      &times;
    </button>
  );
};

export default CloseButton;