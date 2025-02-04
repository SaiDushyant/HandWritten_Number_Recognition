import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import mnist
from tensorflow.keras.utils import to_categorical

# -------------------------------
# 1. Load and Preprocess MNIST Data
# -------------------------------
# Load the MNIST dataset
(x_train, y_train), (x_test, y_test) = mnist.load_data()

# Reshape the data to add a channel dimension (grayscale images have 1 channel)
# and normalize pixel values to the range [0, 1]
x_train = x_train.reshape(-1, 28, 28, 1).astype("float32") / 255.0
x_test = x_test.reshape(-1, 28, 28, 1).astype("float32") / 255.0

# Convert labels to one-hot encoded vectors (10 classes for digits 0-9)
y_train = to_categorical(y_train, num_classes=10)
y_test = to_categorical(y_test, num_classes=10)

# -------------------------------
# 2. Build the CNN Model
# -------------------------------
model = models.Sequential(
    [
        # First Convolutional Block
        layers.Conv2D(
            filters=32,
            kernel_size=(3, 3),
            activation="relu",
            padding="same",  # preserves the spatial dimensions
            input_shape=(28, 28, 1),
        ),
        layers.MaxPooling2D(pool_size=(2, 2)),
        # Second Convolutional Block
        layers.Conv2D(
            filters=64, kernel_size=(3, 3), activation="relu", padding="same"
        ),
        layers.MaxPooling2D(pool_size=(2, 2)),
        # Third Convolutional Block (optional, for deeper features)
        layers.Conv2D(
            filters=128, kernel_size=(3, 3), activation="relu", padding="same"
        ),
        layers.MaxPooling2D(pool_size=(2, 2)),
        # Flatten the output and add Dense layers
        layers.Flatten(),
        layers.Dense(128, activation="relu"),
        layers.Dropout(0.5),  # Dropout to reduce overfitting
        layers.Dense(10, activation="softmax"),  # 10 classes for classification
    ]
)

# Compile the model with the Adam optimizer and categorical crossentropy loss
model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

# Print the model summary to review the architecture
model.summary()

# -------------------------------
# 3. Train the Model
# -------------------------------
history = model.fit(
    x_train,
    y_train,
    epochs=10,  # Adjust epochs as needed
    batch_size=128,  # Batch size for training
    validation_split=0.1,
)  # Reserve 10% of training data for validation

# -------------------------------
# 4. Evaluate the Model on Test Data
# -------------------------------
test_loss, test_accuracy = model.evaluate(x_test, y_test)
print(f"Test accuracy: {test_accuracy:.4f}")

# Save the entire model to an HDF5 file
model.save("mnist_cnn_model.h5")
