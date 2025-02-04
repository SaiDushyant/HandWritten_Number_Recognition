from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io
import uvicorn

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your model
model = load_model("mnist_cnn_model.h5")


@app.get("/")
def read_root():
    return {"message": "MNIST Prediction API"}


@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("L")  # Convert to grayscale
        image = image.resize((28, 28))  # Resize to MNIST input size
        image = np.array(image)
        image = image.astype(np.float32) / 255.0  # Normalize
        image = image.reshape(1, 28, 28, 1)  # Reshape for model input

        prediction = model.predict(image)
        predicted_class = int(np.argmax(prediction, axis=1)[0])

        return JSONResponse(content={"predicted_class": predicted_class})

    except Exception as e:
        return JSONResponse(
            status_code=500, content={"message": f"Error processing image: {str(e)}"}
        )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
