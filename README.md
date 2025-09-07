# 📜 ScrollForge - Open Source PDF to Website Converter

<div align="center">
  
  [![Live Demo](https://img.shields.io/badge/Live%20Demo-ScrollForge-blue?style=for-the-badge&logo=vercel)](https://scroll-forge.vercel.app/)
  [![GitHub Stars](https://img.shields.io/github/stars/ReyKan-KP/ScrollForge?style=for-the-badge&logo=github)](https://github.com/ReyKan-KP/ScrollForge)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
  [![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red?style=for-the-badge)](https://github.com/ReyKan-KP/ScrollForge)
  
  <h3>Transform PDFs into Interactive Web Pages ✨</h3>
  
  <p>
    <strong>Created by <a href="https://github.com/ReyKan-KP">ReyKan-KP (Kanishaka Pranjal)</a></strong>
  </p>
  
  <p>
    ⭐ <strong>If you find this project useful, please star the repository!</strong> ⭐<br>
    👤 <strong>Follow <a href="https://github.com/ReyKan-KP">@ReyKan-KP</a> for more awesome projects!</strong>
  </p>
  
  ### 🌐 [Live Demo](https://scroll-forge.vercel.app/) | 📂 [GitHub Repository](https://github.com/ReyKan-KP/ScrollForge) | 👨‍💻 [Creator Profile](https://github.com/ReyKan-KP)

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

## 🚀 About This Open Source Project

**ScrollForge** is a powerful, **100% free and open-source** PDF to website converter that transforms your PDF documents into interactive, responsive HTML web pages instantly. Built with modern web technologies by **[ReyKan-KP (Kanishaka Pranjal)](https://github.com/ReyKan-KP)**, it provides a seamless experience for viewing and sharing PDF content online.

### Why ScrollForge?
- ✅ **Completely Free** - No hidden costs, no premium tiers
- ✅ **Open Source** - Contribute, modify, and learn from the code
- ✅ **No Watermarks** - Clean output every time
- ✅ **Privacy First** - Your documents stay secure with unique tokens
- ✅ **Modern Tech Stack** - Built with Next.js 15, TypeScript, and FastAPI

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
git clone https://github.com/ReyKan-KP/ScrollForge.git
cd ScrollForge
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

## 🤝 Contributing

**We love contributions!** This is an open-source project created by **[ReyKan-KP](https://github.com/ReyKan-KP)** and we welcome all kinds of contributions.

### How to Contribute

1. ⭐ **Star the repository** - Show your support for the project!
2. 👤 **Follow [@ReyKan-KP](https://github.com/ReyKan-KP)** - Stay updated with new features
3. 🍴 **Fork the repository**
4. 🔧 **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
5. 💻 **Make your changes**
6. 📝 **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
7. 📤 **Push to the branch** (`git push origin feature/AmazingFeature`)
8. 🎉 **Open a Pull Request**

### Areas for Contribution
- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🌍 Internationalization
- ⚡ Performance improvements
- 🧪 Test coverage

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgements

- **Created with ❤️ by [ReyKan-KP (Kanishaka Pranjal)](https://github.com/ReyKan-KP)**
- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [Framer Motion](https://www.framer.com/motion/) - For animations
- [FastAPI](https://fastapi.tiangolo.com/) - For backend API
- [PyMuPDF](https://pymupdf.readthedocs.io/) - For PDF processing
- Thanks to all contributors who help make ScrollForge better!

---

## ⭐ Support the Project

If you find ScrollForge useful, please consider:

1. **⭐ Starring the repository** on [GitHub](https://github.com/ReyKan-KP/ScrollForge)
2. **👥 Following [@ReyKan-KP](https://github.com/ReyKan-KP)** for updates
3. **🐛 Reporting bugs** or suggesting features
4. **📢 Sharing the project** with others
5. **🤝 Contributing** to the codebase

Your support helps keep this project alive and growing!

---

<div align="center">
  
  **[⭐ Star on GitHub](https://github.com/ReyKan-KP/ScrollForge)** | **[🚀 Try Live Demo](https://scroll-forge.vercel.app/)** | **[👤 Follow Creator](https://github.com/ReyKan-KP)**
  
  Made with ❤️ by [ReyKan-KP (Kanishaka Pranjal)](https://github.com/ReyKan-KP)
  
</div>
