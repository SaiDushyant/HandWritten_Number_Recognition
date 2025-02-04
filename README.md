# 🖌️ Handwritten Digit Recognition (FastAPI + React)

A web application for recognizing handwritten digits using a Convolutional Neural Network (CNN) trained on the MNIST dataset. The frontend (React + Vite) allows users to draw digits, and the FastAPI backend processes the drawing and returns predictions.

## 🚀 Features

- 🎨 **Draw a digit** on the canvas.
- 🔍 **Predict the digit** using a trained CNN model.
- ⚡ **FastAPI Backend** for model inference.
- 🖥️ **React + Vite Frontend** for a smooth user experience.

---

## 🛠️ Tech Stack

### **Frontend**

- ⚛️ **React (Vite)**
- 🎨 **Tailwind CSS** for styling
- 🔄 **Fetch API** for communication with backend

### **Backend**

- 🚀 **FastAPI** for handling API requests
- 🧠 **TensorFlow/Keras** for model inference
- 🔬 **MNIST CNN Model** trained for digit recognition

---

## 📂 Project Structure

```
project-root/
│-- frontend/       # React + Vite frontend
│   │-- src/        # Source code
│   │-- public/     # Static assets
│   │-- .env        # Frontend environment variables (ignored in Git)
│   └── package.json
│
│-- backend/        # FastAPI backend
│   │-- main.py     # FastAPI server
│   │-- model.py    # Defines CNN model
│   │-- predict.py  # Prediction logic
│   │-- mnist_cnn_model.h5  # Trained model (ignored in Git)
│   └── .env        # Backend environment variables (ignored in Git)
│
│-- .gitignore      # Git ignore file
│-- README.md       # Project documentation
└── requirements.txt # Python dependencies
```

---

## 🛠️ Installation & Setup

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/yourusername/digit-recognition.git
cd digit-recognition
```

---

### **2️⃣ Backend Setup (FastAPI)**
#### Install dependencies:
```sh
cd backend
python -m venv venv  # Create virtual environment
source venv/bin/activate  # On Windows, use 'venv\Scripts\activate'
pip install -r requirements.txt
```
#### Run the FastAPI Server:
```sh
uvicorn main:app --reload
```
The backend should now be running at **`http://localhost:8000`** 🚀

---

### **3️⃣ Frontend Setup (React + Vite)**
#### Install dependencies:
```sh
cd frontend
npm install
```
#### Start the development server:
```sh
npm run dev
```
The frontend should now be running at **`http://localhost:5173`** 🎨

---

## 🔗 API Endpoints

| Method | Endpoint           | Description               |
|--------|-------------------|---------------------------|
| `POST` | `/predict/`       | Uploads canvas image and returns prediction |

Example usage (via `fetch` in frontend):
```js
const formData = new FormData();
formData.append("file", imageBlob, "digit.png");

fetch("http://localhost:8000/predict/", {
  method: "POST",
  body: formData,
})
  .then((response) => response.json())
  .then((data) => console.log("Predicted digit:", data.predicted_class));
```

---

## 📜 License
This project is **open-source** and available under the **MIT License**.

---

## 🎯 Future Improvements
- ✅ Improve UI with animations.
- ✅ Enhance model accuracy with additional training.
- ✅ Deploy backend to **Render/Vercel** and frontend to **Netlify**.

---

## 🎉 Credits
Made with ❤️ by **Sai Dushyant**  
GitHub: [@SaiDushyant](https://github.com/SaiDushyant)

