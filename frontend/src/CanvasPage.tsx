import { useRef, useState } from "react";
import Navbar from "./Navbar"; // Ensure the Navbar component is correctly imported

const CanvasPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prediction, setPrediction] = useState("");

  let drawing = false;
  let lastX = 0;
  let lastY = 0;

  const startDrawing = (e: {
    nativeEvent: { offsetX: number; offsetY: number };
  }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawing = true;
    [lastX, lastY] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
  };

  const draw = (e: { nativeEvent: { offsetX: number; offsetY: number } }) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "white"; // Black strokes for better visibility on white background
    ctx.lineWidth = 18;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
  };

  const stopDrawing = () => {
    drawing = false;
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
      alert("Please draw a digit before predicting!");
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
          alert("Prediction failed. Please try again.");
        }
      } else {
        alert("Failed to capture the drawing. Please try again.");
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

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <h1 className="text-3xl font-semibold text-center mb-6">
          Digit Recognition
        </h1>

        {/* Canvas Box */}
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

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={clearCanvas}
            className="px-5 py-2 text-lg font-medium bg-gray-200 text-black rounded-lg transition hover:bg-gray-300"
          >
            Clear
          </button>
          <button
            onClick={predictDigit}
            className="px-5 py-2 text-lg font-medium bg-black text-white rounded-lg transition hover:bg-gray-800"
          >
            Predict
          </button>
        </div>

        {/* Prediction Output */}
        {prediction && (
          <div className="mt-4 text-xl font-semibold text-center">
            {prediction}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-4">
        Made with ❤️ | AI-powered Digit Recognition
      </footer>
    </div>
  );
};

export default CanvasPage;
