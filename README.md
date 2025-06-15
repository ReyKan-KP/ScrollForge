# 📚 ScrollForge PDF Reader

<div align="center">

<!-- ![ScrollForge Logo](https://via.placeholder.com/200x200?text=ScrollForge) -->

[![Next.js](https://img.shields.io/badge/Next.js-13.x-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95.0-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

### Transform PDF documents into interactive web pages with a modern, accessible interface

[View Demo](https://scrollforge-demo.vercel.app) | [Report Bug](https://github.com/yourusername/scrollforge/issues) | [Request Feature](https://github.com/yourusername/scrollforge/issues)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup) 
- [📖 Usage Guide](#-usage-guide)
- [🔌 API Documentation](#-api-documentation)
- [🛠️ Technology Stack](#-technology-stack)
- [🔄 Contributing](#-contributing)
- [📜 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)

---

## ✨ Features

- **🔄 PDF Upload & Conversion**: Upload PDF documents and convert them to web-friendly format
- **🔒 Secure Access**: Access your documents using unique tokens
- **🧭 Intuitive Navigation**: Easily navigate between pages with keyboard shortcuts and UI controls
- **🔍 Zoom Controls**: Adjust zoom levels for comfortable reading
- **📱 Mobile Responsive**: Optimized for all screen sizes
- **🖥️ Fullscreen Mode**: Distraction-free reading experience
- **✨ Modern UI/UX**: Beautiful interface with animations and transitions
- **🔑 Token-based Authentication**: Return to your documents later with access tokens

---

<!-- ## 🖼️ Screenshots

<div align="center">

### Home Page
![Home Page](https://via.placeholder.com/800x450?text=ScrollForge+Home+Page)

### PDF Viewer
![PDF Viewer](https://via.placeholder.com/800x450?text=ScrollForge+PDF+Viewer)

### Mobile View
![Mobile View](https://via.placeholder.com/400x800?text=ScrollForge+Mobile)

</div>

--- -->

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or later
- Python 3.8+ (for FastAPI backend)
- NPM or Yarn
- A modern web browser

### Frontend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/scrollforge.git
cd scrollforge
```

2. Install frontend dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Start the frontend development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application.

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install backend dependencies:
```bash
pip install -r requirements.txt
```

4. Start the FastAPI server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

5. The API will be available at [http://localhost:8000](http://localhost:8000).

---

## 📖 Usage Guide

### Uploading a PDF

1. Navigate to the home page
2. Click on "Upload New PDF"
3. Select or drag-and-drop your PDF file
4. Wait for the conversion process to complete
5. Save the access token for future reference

### Accessing Previous Documents

1. Click on "Load Previous" on the home page
2. Enter your access token
3. Your document will be loaded with all pages accessible

### Reading Features

- **Page Navigation**: 
  - Use arrow buttons or keyboard shortcuts (← →) to move between pages
  - Enter a page number to jump directly to that page
  - Use Home/End keys to go to first/last page
- **Zoom**: 
  - Adjust zoom level with + and - controls (50% to 200%)
  - Reset zoom with the 100% button
- **Fullscreen**: 
  - Toggle fullscreen mode with the expand button or press F key
  - Controls auto-hide in fullscreen mode (move mouse to show)
- **Mobile**: 
  - Swipe left/right to navigate pages
  - Pinch to zoom in/out

---

## 🔌 API Documentation

The ScrollForge backend is built with FastAPI, providing a robust and high-performance API for PDF processing and management.

### API Endpoints

#### PDF Processing

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/pdftohtml` | `POST` | Upload and convert PDF to HTML | PDF file (form-data) | `{"token": "uuid", "total_pages": int, "message": "success"}` |
| `/api/pages/{token}` | `GET` | Get document metadata | None | `{"pdf_name": "string", "total_pages": int}` |
| `/api/page/{token}/{page_number}` | `GET` | Get HTML content for a specific page | None | HTML content |

#### Example: Upload PDF

```bash
curl -X POST http://localhost:8000/api/pdftohtml \
  -F "pdf=@/path/to/document.pdf" \
  -H "Content-Type: multipart/form-data"
```

Response:
```json
{
  "success": true,
  "token": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "total_pages": 42,
  "message": "PDF processed successfully"
}
```

#### Example: Get Page Content

```bash
curl -X GET http://localhost:8000/api/page/a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6/1
```

Response: HTML content of page 1

### API Documentation

The complete API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Setting Up FastAPI Backend

The backend requires the following dependencies:
- FastAPI
- Uvicorn
- PyMuPDF (for PDF processing)
- Python-multipart (for file uploads)

Install them using:

```bash
pip install fastapi uvicorn python-multipart pymupdf
```

A sample FastAPI implementation:

```python
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import HTMLResponse
import uuid
import fitz  # PyMuPDF
import os

app = FastAPI(title="ScrollForge API", description="API for PDF processing")

@app.post("/api/pdftohtml")
async def convert_pdf_to_html(pdf: UploadFile = File(...)):
    # Generate a unique token
    token = str(uuid.uuid4())
    
    # Save the uploaded PDF
    pdf_path = f"storage/{token}/document.pdf"
    os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
    
    with open(pdf_path, "wb") as f:
        f.write(await pdf.read())
    
    # Process the PDF
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    
    # Convert pages to HTML
    for page_num in range(total_pages):
        page = doc.load_page(page_num)
        html = page.get_text("html")
        
        # Save HTML content
        html_path = f"storage/{token}/page_{page_num + 1}.html"
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html)
    
    return {
        "success": True,
        "token": token,
        "total_pages": total_pages,
        "message": "PDF processed successfully",
        "pdf_name": pdf.filename
    }

@app.get("/api/pages/{token}")
async def get_document_info(token: str):
    # Check if document exists
    pdf_path = f"storage/{token}/document.pdf"
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Get document info
    doc = fitz.open(pdf_path)
    
    return {
        "pdf_name": os.path.basename(pdf_path),
        "total_pages": len(doc)
    }

@app.get("/api/page/{token}/{page_number}", response_class=HTMLResponse)
async def get_page_html(token: str, page_number: int):
    # Check if page exists
    html_path = f"storage/{token}/page_{page_number}.html"
    if not os.path.exists(html_path):
        raise HTTPException(status_code=404, detail="Page not found")
    
    # Return HTML content
    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read()
    
    return html_content
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Context API

### Backend
- **API Framework**: FastAPI
- **PDF Processing**: PyMuPDF (Fitz)
- **Server**: Uvicorn (ASGI)
- **File Storage**: Local filesystem (can be extended to cloud storage)

---

## 🔄 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [Framer Motion](https://www.framer.com/motion/) - For animations
- [FastAPI](https://fastapi.tiangolo.com/) - For backend API
- [PyMuPDF](https://pymupdf.readthedocs.io/) - For PDF processing
- [Font Awesome](https://fontawesome.com/) - For icons
