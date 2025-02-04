import { useEffect, useRef, useState } from "react";
import Navbar from "./NavBar";

const CanvasPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prediction, setPrediction] = useState(
    "Draw a number to get prediction"
  );
  const drawingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set initial canvas background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const x =
      "touches" in e
        ? e.touches[0].clientX - rect.left
        : (e as React.MouseEvent).nativeEvent.offsetX;
    const y =
      "touches" in e
        ? e.touches[0].clientY - rect.top
        : (e as React.MouseEvent).nativeEvent.offsetY;

    lastXRef.current = x;
    lastYRef.current = y;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x =
      "touches" in e
        ? e.touches[0].clientX - rect.left
        : (e as React.MouseEvent).nativeEvent.offsetX;
    const y =
      "touches" in e
        ? e.touches[0].clientY - rect.top
        : (e as React.MouseEvent).nativeEvent.offsetY;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(lastXRef.current, lastYRef.current);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastXRef.current = x;
    lastYRef.current = y;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      predictDigit();
    }, 500);
  };

  const stopDrawing = () => {
    drawingRef.current = false;
    predictDigit();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setPrediction("Draw a number to get prediction");
  };

  const isCanvasBlank = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return true;

    // Create reference canvas with black background
    const blank = document.createElement("canvas");
    blank.width = canvas.width;
    blank.height = canvas.height;
    const ctx = blank.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, blank.width, blank.height);
    }

    return canvas.toDataURL() === blank.toDataURL();
  };

  const predictDigit = async () => {
    const canvas = canvasRef.current;
    if (!canvas || isCanvasBlank(canvas)) {
      setPrediction("Draw a number to get prediction");
      return;
    }

    // Additional check for white pixels
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasDrawing = imageData.data.some((_, index) => {
      // Check RGB channels for white pixels (255,255,255)
      return (
        imageData.data[index] === 255 &&
        imageData.data[index + 1] === 255 &&
        imageData.data[index + 2] === 255
      );
    });

    if (!hasDrawing) {
      setPrediction("Draw a number to get prediction");
      return;
    }

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
          setPrediction("Error predicting digit - please try again");
        }
      }
    }, "image/png");
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
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={clearCanvas}
            className="px-5 py-2 text-lg font-medium bg-indigo-600 text-white rounded-lg transition hover:bg-indigo-700"
          >
            Clear
          </button>
        </div>

        <div
          className={`mt-4 text-xl font-semibold text-center ${
            prediction.startsWith("Draw") || prediction.startsWith("Error")
              ? "text-gray-400"
              : "text-black"
          }`}
        >
          {prediction}
        </div>
      </div>

      <footer className="text-center text-gray-500 text-sm py-4">
        Made with ❤️ | AI-powered Digit Recognition
      </footer>
    </div>
  );
};

export default CanvasPage;
