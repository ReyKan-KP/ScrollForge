import fitz
import os
import re
import math
import random
import string
import json
from fastapi import FastAPI, File, UploadFile, HTTPException, Header, Depends
from fastapi.responses import JSONResponse, HTMLResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from typing import List, Dict, Any, Optional
import uvicorn
import uuid
from dotenv import load_dotenv
import logging
# from mangum import Mangum

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI(title="ScrollForge API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase setup
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")  # Add service key for admin access

# Log Supabase configuration (without sensitive values)
logger.info(f"Supabase URL configured: {'Yes' if SUPABASE_URL else 'No'}")
logger.info(f"Supabase Anon Key configured: {'Yes' if SUPABASE_KEY else 'No'}")
logger.info(f"Supabase Service Key configured: {'Yes' if SUPABASE_SERVICE_KEY else 'No'}")

# Create client with anon key for public operations
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Create admin client with service key for operations that need higher privileges
admin_supabase: Client = None
if SUPABASE_SERVICE_KEY:
    admin_supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
else:
    logger.warning("SUPABASE_SERVICE_KEY not set. Some operations may fail due to RLS policies.")

# Storage bucket name
STORAGE_BUCKET = "html-pages"

# Ensure storage bucket exists
def ensure_bucket_exists():
    try:
        # Check if bucket exists
        response = supabase.storage.list_buckets()
        buckets = response.data if hasattr(response, 'data') else []
        
        bucket_exists = any(bucket.get('name') == STORAGE_BUCKET for bucket in buckets)
        
        if not bucket_exists:
            # Create the bucket with public access
            supabase.storage.create_bucket(STORAGE_BUCKET, {'public': True})
            logger.info(f"Created storage bucket: {STORAGE_BUCKET}")
    except Exception as e:
        logger.error(f"Could not verify storage bucket: {e}")

# Call this at startup
ensure_bucket_exists()

# Generate a secure random token
def generate_token(length=32):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

# Dependency to get a valid token
async def get_token(x_access_token: Optional[str] = Header(None)):
    if x_access_token is None:
        raise HTTPException(status_code=401, detail="Access token is required")
    return x_access_token

@app.post("/api/pdftohtml")
async def convert_pdf_to_html(pdf: UploadFile = File(...)):
    doc = None
    temp_path = None
    
    try:
        # Check if the file is a PDF
        if not pdf.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Read the PDF file
        content = await pdf.read()
        
        # Create a temporary file to save the uploaded PDF
        temp_path = f"temp_{pdf.filename}"
        with open(temp_path, "wb") as temp_file:
            temp_file.write(content)
            
        # Process the PDF
        doc = fitz.open(temp_path)
        
        # Extract all paragraphs from all pages
        all_paragraphs = []
        pdf_page_count = len(doc)
        
        for page_number in range(pdf_page_count):
            page = doc[page_number]
            blocks = page.get_text("blocks")
            
            for block in blocks:
                paragraph_text = block[4]
                
                # Skip empty paragraphs or those with just whitespace/special characters
                if not paragraph_text.strip() or len(re.sub(r'\W+', '', paragraph_text)) < 10:
                    continue
                    
                all_paragraphs.append({
                    'text': paragraph_text,
                })
        
        # Group paragraphs into batches of 80
        paragraphs_per_page = 80
        total_html_pages = math.ceil(len(all_paragraphs) / paragraphs_per_page)
        
        # Generate a unique access token for the document
        access_token = generate_token()
        
        # Create HTML pages and store each in Supabase Storage
        page_urls = []
        for html_page in range(total_html_pages):
            start_idx = html_page * paragraphs_per_page
            end_idx = min((html_page + 1) * paragraphs_per_page, len(all_paragraphs))
            page_paragraphs = all_paragraphs[start_idx:end_idx]
            
            # Create HTML content with multiple paragraphs
            html_content = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #1a1a2e;
            color: #e0e0e0;
        }}
        .content-container {{
            padding: 0;
        }}
        .content-card {{
            background-color: #16213e;
            border: 1px solid #0f3460;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }}
        .card-header {{
            padding: 0;
            border-bottom: 1px solid #0f3460;
            background-color: #0f3460;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        .card-title {{
            font-size: 1.25rem;
            font-weight: 600;
            color: white;
            margin: 0;
        }}
        .card-body {{
            padding: 1.5rem;
        }}
        .paragraph {{
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }}
        .paragraph p {{
            margin: 0;
        }}
        a {{
            color: #4dabf7;
            text-decoration: none;
        }}
        a:hover {{
            text-decoration: underline;
        }}
    </style>
</head>
<body>
    <div class="content-container">
        <div class="content-card">
            <div class="card-body">"""
            
            # Add each paragraph to the HTML
            for i, para in enumerate(page_paragraphs):
                html_content += f"""
                <div class="paragraph">
                    <p>{para['text']}</p>
                </div>"""
            
            html_content += """
            </div>
        </div>
    </div>
</body>
</html>"""
            
            # Create the file path in storage
            file_path = f"{access_token}/page_{html_page + 1}.html"
            
            # Convert HTML string to bytes
            html_bytes = html_content.encode('utf-8')
            
            # Upload the HTML file to Supabase Storage
            upload_response = supabase.storage.from_(STORAGE_BUCKET).upload(
                file_path,
                html_bytes,
                {"content-type": "text/html; charset=utf-8"}
            )
            
            if hasattr(upload_response, 'error') and upload_response.error:
                raise Exception(f"Failed to upload HTML file: {upload_response.error}")
                
            # Get public URL for the file
            url_response = supabase.storage.from_(STORAGE_BUCKET).get_public_url(file_path)
            page_url = url_response.data if hasattr(url_response, 'data') else url_response
            
            page_urls.append(page_url)
        
        # Close the document
        doc.close()
        doc = None
        
        # Remove temporary file
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
            temp_path = None
        
        # Store only metadata in the database
        data = {
            "pdf_name": pdf.filename,
            "page_count": pdf_page_count,
            "access_token": access_token,
            "total_pages": total_html_pages,
            "paragraphs": None  # Not storing HTML content in DB anymore
        }
        
        # Insert into Supabase using admin client if available (to bypass RLS)
        client_to_use = admin_supabase if admin_supabase else supabase
        response = client_to_use.table("pdf_documents").insert(data).execute()
        
        # Check if the insert was successful
        if hasattr(response, 'error') and response.error is not None:
            raise Exception(f"Supabase error: {response.error}")
            
        logger.info(f"Successfully processed PDF: {pdf.filename}, token: {access_token}")
        return JSONResponse({
            "success": True,
            "message": f"Processed {len(all_paragraphs)} paragraphs into {total_html_pages} HTML pages",
            "token": access_token,
            "total_pages": total_html_pages
        })
            
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        
        # Clean up resources in case of error
        if doc is not None:
            try:
                doc.close()
            except:
                pass
                
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except:
                pass
                
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to process PDF: {str(e)}"}
        )

@app.get("/api/pages/{token}")
async def get_pages(token: str):
    try:
        logger.info(f"Retrieving document with token: {token}")
        
        # Try with admin client first if available
        client_to_use = admin_supabase if admin_supabase else supabase
        
        # Query Supabase for the document with the given token
        response = client_to_use.table("pdf_documents").select("*").eq("access_token", token).execute()
        
        # Log the response for debugging
        logger.info(f"Supabase response: {response}")
        
        # Check for errors
        if hasattr(response, 'error') and response.error is not None:
            logger.error(f"Supabase error: {response.error}")
            raise HTTPException(status_code=404, detail=f"Document not found: {response.error}")
        
        # Check if we got any data
        data = response.data
        if not data or len(data) == 0:
            logger.error(f"No document found with token: {token}")
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Get the first document (should be only one with this token)
        document = data[0]
        
        logger.info(f"Successfully retrieved document: {document['pdf_name']}")
        return JSONResponse({
            "success": True,
            "pdf_name": document["pdf_name"],
            "page_count": document["page_count"],
            "total_pages": document["total_pages"]
        })
    
    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    
    except Exception as e:
        logger.error(f"Error retrieving document: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to retrieve document: {str(e)}"}
        )

@app.get("/api/page/{token}/{page_number}")
async def get_page(token: str, page_number: int):
    try:
        logger.info(f"Retrieving page {page_number} for token: {token}")
        
        # Try with admin client first if available
        client_to_use = admin_supabase if admin_supabase else supabase
        
        # Query Supabase for the document with the given token to verify it exists
        response = client_to_use.table("pdf_documents").select("total_pages").eq("access_token", token).execute()
        
        # Check for errors
        if hasattr(response, 'error') and response.error is not None:
            logger.error(f"Supabase error: {response.error}")
            raise HTTPException(status_code=404, detail="Document not found")
            
        data = response.data
        if not data or len(data) == 0:
            logger.error(f"No document found with token: {token}")
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Get the first document (should be only one with this token)
        document = data[0]
        
        # Check if the requested page is valid
        if page_number < 1 or page_number > document["total_pages"]:
            logger.error(f"Invalid page number: {page_number} for document with {document['total_pages']} pages")
            raise HTTPException(status_code=404, detail="Page not found")
        
        # Get the URL to the HTML file in storage
        file_path = f"{token}/page_{page_number}.html"
        url_response = supabase.storage.from_(STORAGE_BUCKET).get_public_url(file_path)
        
        # Get the public URL
        public_url = url_response.data if hasattr(url_response, 'data') else url_response
        
        logger.info(f"Redirecting to: {public_url}")
        # Return the HTML content from Supabase Storage
        return RedirectResponse(url=public_url, status_code=307)
    
    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    
    except Exception as e:
        logger.error(f"Error retrieving page: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Failed to retrieve page: {str(e)}"}
        )

@app.get("/")
async def root():
    return {"message": "ScrollForge API is running. Upload PDFs at /upload or view them at /page"}

# handler = Mangum(app)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
