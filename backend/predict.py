import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model

# Load the trained CNN model
model = load_model("mnist_cnn_model.h5")


def preprocess_image(image_path):
    """Preprocess input image to match the model's expected format."""
    img = Image.open(image_path).convert("L")  # Convert to grayscale
    img = img.resize((28, 28))  # Resize to 28x28
    img_array = np.array(img)

    # Invert colors if the background is black and digits are white
    if np.mean(img_array) > 127:
        img_array = 255 - img_array

    img_array = img_array.astype("float32") / 255.0  # Normalize
    img_array = np.expand_dims(img_array, axis=-1)  # Add channel dimension
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

    return img_array


def predict_digit(image_path):
    """Predicts the digit from the given image path."""
    img_array = preprocess_image(image_path)
    predictions = model.predict(img_array)

    print(f"Raw predictions: {predictions}")  # Print raw probabilities

    predicted_digit = np.argmax(predictions)
    print(f"Predicted Digit: {predicted_digit}")

    return predicted_digit


import matplotlib.pyplot as plt


def show_preprocessed_image(image_path):
    img = Image.open(image_path).convert("L")
    img = img.resize((28, 28))
    img_array = np.array(img)

    print("Raw Pixel Values:")
    print(img_array)  # Show the original grayscale pixel values

    plt.imshow(img_array, cmap="gray")
    plt.title("Original Grayscale Image")
    plt.colorbar()
    plt.show()

    processed_img = preprocess_image(image_path)
    processed_array = processed_img[0, :, :, 0]  # Remove batch & channel dimension

    print("Preprocessed Pixel Values:")
    print(processed_array)  # Show normalized pixel values

    plt.imshow(processed_array, cmap="gray")
    plt.title("Preprocessed Image")
    plt.colorbar()
    plt.show()

    return processed_img


preprocessed_img = show_preprocessed_image(
    "/Users/saidushyant/Downloads/canvas-drawing-3.png"
)


# Example usage
if __name__ == "__main__":
    image_path = input("Enter the path of the image: ")
    predicted_digit = predict_digit(image_path)
    print(f"The predicted digit is: {predicted_digit}")
