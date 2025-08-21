
from fastapi import APIRouter, File, UploadFile, Header, HTTPException, Body
from docx import Document
import PyPDF2
import os
from config import get_gemini_api_key
import google.generativeai as genai
import json

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


# API 1: EXTRACT (doc, pdf)
@router.post("/api/v1/ai-processing/extract", summary="Trích xuất thông tin hợp đồng (doc/pdf)", tags=["AI Processing Service"])
async def extract_api(
    file: UploadFile = File(..., description="File hợp đồng (docx, pdf)"),
    gemini_api_key: str = Header(None, description="Gemini API Key (tùy chọn)")
):
    # Extract API logic
    temp_path = os.path.join(RESULTS_DIR, file.filename)
    with open(temp_path, "wb") as f:
        f.write(await file.read())
    if file.filename.endswith(".docx"):
        content = read_docx(temp_path)
    elif file.filename.endswith(".pdf"):
        content = read_pdf(temp_path)
    else:
        os.remove(temp_path)
        return {
            "apiVersion": "v1",
            "statusCode": 400,
            "shortMessage": "Invalid Input",
            "description": "Chỉ hỗ trợ file docx hoặc pdf.",
            "data": None,
            "path": "/api/v1/ai-processing-service/extract"
        }
    os.remove(temp_path)
    if not content.strip():
        return {
            "apiVersion": "v1",
            "statusCode": 204,
            "shortMessage": "No Content",
            "description": "Không có nội dung văn bản để gửi cho AI.",
            "data": None,
            "path": "/api/v1/ai-processing-service/extract"
        }
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
        "data": answer,
    "path": "/api/v1/ai-processing-service/extract"
    }




# API 2: CLASSIFY (json, txt)
@router.post("/api/v1/ai-processing/classify", summary="Phân loại hợp đồng (json/txt)", tags=["AI Processing Service"])
async def classify_api(
    file: UploadFile = File(None, description="File hợp đồng (json, txt)"),
    text: str = Body(None, description="Nội dung văn bản dạng chuỗi (txt)", embed=True),
    gemini_api_key: str = Header(None, description="Gemini API Key (tùy chọn)")
):
    # Classify API logic
    content = None
    if file:
        temp_path = os.path.join(RESULTS_DIR, file.filename)
        with open(temp_path, "wb") as f:
            f.write(await file.read())
        if file.filename.endswith(".json"):
            with open(temp_path, "r", encoding="utf-8") as jf:
                try:
                    data = json.load(jf)
                    content = json.dumps(data, ensure_ascii=False)
                except Exception:
                    content = jf.read()
        elif file.filename.endswith(".txt"):
            with open(temp_path, "r", encoding="utf-8") as tf:
                content = tf.read()
        else:
            os.remove(temp_path)
            return {
                "apiVersion": "v1",
                "statusCode": 400,
                "shortMessage": "Invalid Input",
                "description": "Chỉ hỗ trợ file json hoặc txt.",
                "data": None,
                "path": "/api/v1/ai-processing-service/classify"
            }
        os.remove(temp_path)
    elif text:
        content = text
    else:
        return {
            "apiVersion": "v1",
            "statusCode": 400,
            "shortMessage": "No Input",
            "description": "Cần cung cấp file json/txt hoặc nội dung chuỗi.",
            "data": None,
            "path": "/api/v1/ai-processing-service/classify"
        }
    if not content or not content.strip():
        return {
            "apiVersion": "v1",
            "statusCode": 204,
            "shortMessage": "No Content",
            "description": "Không có nội dung để gửi cho AI.",
            "data": None,
            "path": "/api/v1/ai-processing/classify"
        }
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
    "path": "/api/v1/ai-processing-service/classify"
    }


# API 3: SUMMARIZE (txt, string input)
@router.post("/api/v1/ai-processing/summarize", summary="Tóm tắt hợp đồng (txt/string)", tags=["AI Processing Service"])
async def summarize_api(
    file: UploadFile = File(None, description="File txt cần tóm tắt"),
    text: str = Body(None, description="Nội dung văn bản dạng chuỗi (txt)", embed=True),
    gemini_api_key: str = Header(None, description="Gemini API Key (tùy chọn)")
):
    # Summarize API logic
    content = None
    if file:
        temp_path = os.path.join(RESULTS_DIR, file.filename)
        with open(temp_path, "wb") as f:
            f.write(await file.read())
        if file.filename.endswith(".txt"):
            with open(temp_path, "r", encoding="utf-8") as tf:
                content = tf.read()
        else:
            os.remove(temp_path)
            return {
                "apiVersion": "v1",
                "statusCode": 400,
                "shortMessage": "Invalid Input",
                "description": "Chỉ hỗ trợ file txt hoặc chuỗi văn bản.",
                "data": None,
                "path": "/api/v1/ai-processing-service/summarize"
            }
        os.remove(temp_path)
    elif text:
        content = text
    else:
        return {
            "apiVersion": "v1",
            "statusCode": 400,
            "shortMessage": "No Input",
            "description": "Cần cung cấp file txt hoặc nội dung chuỗi.",
            "data": None,
            "path": "/api/v1/ai-processing-service/summarize"
        }
    if not content or not content.strip():
        return {
            "apiVersion": "v1",
            "statusCode": 204,
            "shortMessage": "No Content",
            "description": "Không có nội dung để gửi cho AI.",
            "data": None,
            "path": "/api/v1/ai-processing/summarize"
        }
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
    "path": "/api/v1/ai-processing-service/summarize"
    }


