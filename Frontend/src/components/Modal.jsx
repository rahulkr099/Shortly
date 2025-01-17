import { useSetAtom } from "jotai";
import { uiAtom } from "../../state";

const Modal = () => {
  const setUi = useSetAtom(uiAtom);

  const modalStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 10,
    width: "100vw",
    height: "100vh",
    backgroundColor: "#ccccccaa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding:"1rem",
  };

  const modalContentStyles = {
    backgroundColor: "#8ec5fc",
    backgroundImage: "linear-gradient(72deg, #1cc91a2a 40%, #12100e 140%)",
    position: "relative",
    maxWidth: "25rem",
    margin: "0 auto",
    padding: "1rem",
    borderRadius: "0.5rem",
    boxShadow: "0 0 1em #000000aa",
  };

  const closeBtnStyles = {
    
    position: "absolute",
    top: "0.1rem",
    right: "0.9rem",
    color: "orange",
    background: "none",
    border: "none",
    fontSize: "2rem",
    cursor: "pointer",
    transition: "color 0.2s ease",
  };
  const closeBtnHoverStyles = {
    color: "rgb(255, 0, 0)",
  };
  return (
    <div style={modalStyles}>
      <div style={modalContentStyles}>
        <button
          style={closeBtnStyles}
          onMouseEnter={(e) => (e.target.style.color = closeBtnHoverStyles.color)}
          onMouseLeave={(e) => (e.target.style.color = closeBtnStyles.color)}
          onClick={() =>
            setUi((prev) => ({
              ...prev,
              modal: null,
            }))
          }
        >
          &times;
        </button>
        <h2>Modal</h2>
        <p>
          The FitnessGram Pacer Test is a multistage aerobic capacity test that
          progressively gets more difficult as it continues. The running speed
          starts slowly, but gets faster each minute after you hear this signal.
        </p>
      </div>
    </div>
  );
};

export default Modal;
