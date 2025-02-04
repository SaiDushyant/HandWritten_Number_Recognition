import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";

const CanvasPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prediction, setPrediction] = useState("");
  const drawingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startDrawing = (e: {
    nativeEvent: { offsetX: number; offsetY: number };
  }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawingRef.current = true;
    lastXRef.current = e.nativeEvent.offsetX;
    lastYRef.current = e.nativeEvent.offsetY;
  };

  const draw = (e: { nativeEvent: { offsetX: number; offsetY: number } }) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(lastXRef.current, lastYRef.current);
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();

    lastXRef.current = e.nativeEvent.offsetX;
    lastYRef.current = e.nativeEvent.offsetY;

    // Reset prediction debounce timer
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      predictDigit();
    }, 500); // Adjust debounce time as needed (500ms)
  };

  const stopDrawing = () => {
    drawingRef.current = false;
    // Trigger final prediction when user stops drawing
    predictDigit();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPrediction("");
  };

  const predictDigit = async () => {
    const canvas = canvasRef.current;
    if (isCanvasBlank(canvas)) {
      setPrediction("");
      return;
    }

    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (blob) {
        const formData = new FormData();
        formData.append("file", blob, "digit.png");

        try {
          const response = await fetch("http://localhost:8000/predict/", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error("Prediction failed");

          const result = await response.json();
          setPrediction(`Predicted Digit: ${result.predicted_class}`);
        } catch (error) {
          console.error("Error:", error);
          setPrediction("Error predicting digit");
        }
      }
    }, "image/png");
  };

  const isCanvasBlank = (canvas: HTMLCanvasElement | null) => {
    const blank = document.createElement("canvas");
    if (!canvas) return true;
    blank.width = canvas.width;
    blank.height = canvas.height;
    return canvas.toDataURL() === blank.toDataURL();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <h1 className="text-3xl font-semibold text-center mb-6">
          Digit Recognition
        </h1>

        <div className="border border-gray-300 rounded-xl shadow-lg p-4 bg-white">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="block bg-black border border-gray-400 rounded-lg"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
          />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={clearCanvas}
            className="px-5 py-2 text-lg font-medium bg-gray-200 text-black rounded-lg transition hover:bg-gray-300"
          >
            Clear
          </button>
        </div>

        {prediction && (
          <div className="mt-4 text-xl font-semibold text-center">
            {prediction}
          </div>
        )}
      </div>

      <footer className="text-center text-gray-500 text-sm py-4">
        Made with ❤️ | AI-powered Digit Recognition
      </footer>
    </div>
  );
};

export default CanvasPage;
