from fastapi import APIRouter, File, UploadFile, Header, HTTPException
from docx import Document
import PyPDF2
import os
from .config import get_gemini_api_key
import google.generativeai as genai

router = APIRouter()

RESULTS_DIR = os.path.join(os.path.dirname(__file__), 'results')
os.makedirs(RESULTS_DIR, exist_ok=True)

def read_docx(file_path: str) -> str:
    doc = Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs if para.text])

def read_pdf(file_path: str) -> str:
    text = ""
    with open(file_path, "rb") as f:
        pdf_reader = PyPDF2.PdfReader(f)
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
    return text

def ask_gemini(api_key: str, content: str, question: str) -> str:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash')
    prompt = f"Nội dung tài liệu:\n{content}\n\nCâu hỏi: {question}"
    response = model.generate_content(prompt)
    return response.text

@router.post("/api/v1/ai-processing/ocr", summary="Nhận diện ký tự quang học (OCR)", tags=["AI Processing"])
async def ocr_api(
    file: UploadFile = File(..., description="File ảnh, PDF hoặc DOCX cần OCR"),
    gemini_api_key: str = Header(None, description="Gemini API Key (tùy chọn)")
):
    temp_path = os.path.join(RESULTS_DIR, file.filename)
    with open(temp_path, "wb") as f:
        f.write(await file.read())
    # Đọc nội dung file
    if file.filename.endswith(".docx"):
        content = read_docx(temp_path)
    elif file.filename.endswith(".pdf"):
        content = read_pdf(temp_path)
    else:
        os.remove(temp_path)
        return {
            "apiVersion": "v1",
            "statusCode": 204,
            "shortMessage": "No Content",
            "description": "Chỉ hỗ trợ file docx hoặc pdf ở bản này.",
            "data": None,
            "path": "/api/v1/ai-processing/ocr"
        }
    os.remove(temp_path)
    if not content.strip():
        return {
            "apiVersion": "v1",
            "statusCode": 204,
            "shortMessage": "No Content",
            "description": "Không có nội dung văn bản để gửi cho AI.",
            "data": None,
            "path": "/api/v1/ai-processing/ocr"
        }
    api_key = gemini_api_key or get_gemini_api_key()
    try:
        answer = ask_gemini(api_key, content, "Hãy trích xuất toàn bộ nội dung văn bản từ file này.")
        if not answer or "không thể trích xuất" in answer.lower():
            return {
                "apiVersion": "v1",
                "statusCode": 204,
                "shortMessage": "No Content",
                "description": "AI không thể trích xuất nội dung từ file này.",
                "data": None,
                "path": "/api/v1/ai-processing/ocr"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi AI/OCR: {str(e)}")
    return {
        "apiVersion": "v1",
        "statusCode": 200,
        "shortMessage": "Success",
        "description": "Kết quả OCR thành công.",
        "data": {"text": answer},
        "path": "/api/v1/ai-processing/ocr"
    }

@router.post("/api/v1/ai-processing/extract", summary="Trích xuất thông tin hợp đồng", tags=["AI Processing"])
async def extract_api(
    file: UploadFile = File(..., description="File hợp đồng (docx, pdf, txt)"),
    gemini_api_key: str = Header(None, description="Gemini API Key (tùy chọn)")
):
    temp_path = os.path.join(RESULTS_DIR, file.filename)
    with open(temp_path, "wb") as f:
        f.write(await file.read())
    content = read_docx(temp_path) if file.filename.endswith(".docx") else "(Demo: chỉ hỗ trợ docx demo)"
    os.remove(temp_path)
    api_key = gemini_api_key or get_gemini_api_key()
    try:
        answer = ask_gemini(api_key, content, "Hãy trích xuất các điều khoản chính của hợp đồng này.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi AI/Extract: {str(e)}")
    return {
        "apiVersion": "v1",
        "statusCode": 200,
        "shortMessage": "Success",
        "description": "Trích xuất điều khoản thành công.",
        "data": {"extracted": answer},
        "path": "/api/v1/ai-processing/extract"
    }

@router.post("/api/v1/ai-processing/classify", summary="Phân loại hợp đồng", tags=["AI Processing"])
async def classify_api(
    file: UploadFile = File(..., description="File hợp đồng (docx, pdf, txt)"),
    gemini_api_key: str = Header(None, description="Gemini API Key (tùy chọn)")
):
    temp_path = os.path.join(RESULTS_DIR, file.filename)
    with open(temp_path, "wb") as f:
        f.write(await file.read())
    content = read_docx(temp_path) if file.filename.endswith(".docx") else "(Demo: chỉ hỗ trợ docx demo)"
    os.remove(temp_path)
    api_key = gemini_api_key or get_gemini_api_key()
    try:
        answer = ask_gemini(api_key, content, "Hãy phân loại loại hợp đồng này.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi AI/Classify: {str(e)}")
    return {
        "apiVersion": "v1",
        "statusCode": 200,
        "shortMessage": "Success",
        "description": "Phân loại hợp đồng thành công.",
        "data": {"classify": answer},
        "path": "/api/v1/ai-processing/classify"
    }

@router.post("/api/v1/ai-processing/summarize", summary="Tóm tắt hợp đồng", tags=["AI Processing"])
async def summarize_api(
    file: UploadFile = File(..., description="File hợp đồng (docx, pdf, txt)"),
    gemini_api_key: str = Header(None, description="Gemini API Key (tùy chọn)")
):
    temp_path = os.path.join(RESULTS_DIR, file.filename)
    with open(temp_path, "wb") as f:
        f.write(await file.read())
    content = read_docx(temp_path) if file.filename.endswith(".docx") else "(Demo: chỉ hỗ trợ docx demo)"
    os.remove(temp_path)
    api_key = gemini_api_key or get_gemini_api_key()
    try:
        answer = ask_gemini(api_key, content, "Hãy tóm tắt nội dung hợp đồng này.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi AI/Summarize: {str(e)}")
    return {
        "apiVersion": "v1",
        "statusCode": 200,
        "shortMessage": "Success",
        "description": "Tóm tắt hợp đồng thành công.",
        "data": {"summary": answer},
        "path": "/api/v1/ai-processing/summarize"
    }

@router.post("/api/v1/ai-processing/risk-detect", summary="Phát hiện rủi ro hợp đồng", tags=["AI Processing"])
async def risk_detect_api(
    file: UploadFile = File(..., description="File hợp đồng (docx, pdf, txt)"),
    gemini_api_key: str = Header(None, description="Gemini API Key (tùy chọn)")
):
    temp_path = os.path.join(RESULTS_DIR, file.filename)
    with open(temp_path, "wb") as f:
        f.write(await file.read())
    content = read_docx(temp_path) if file.filename.endswith(".docx") else "(Demo: chỉ hỗ trợ docx demo)"
    os.remove(temp_path)
    api_key = gemini_api_key or get_gemini_api_key()
    try:
        answer = ask_gemini(api_key, content, "Hãy phát hiện các rủi ro tiềm ẩn trong hợp đồng này.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi AI/Risk Detect: {str(e)}")
    return {
        "apiVersion": "v1",
        "statusCode": 200,
        "shortMessage": "Success",
        "description": "Phát hiện rủi ro thành công.",
        "data": {"risks": answer},
        "path": "/api/v1/ai-processing/risk-detect"
    }
