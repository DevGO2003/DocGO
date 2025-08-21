
from fastapi import APIRouter, File, UploadFile, Header, HTTPException, Body
from docx import Document
import PyPDF2
import os
from config import get_gemini_api_key
import google.generativeai as genai
import json
import uuid
from datetime import datetime, timezone

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
@router.post("/api/v1/ai-processing-service/extract", summary="Trích xuất thông tin hợp đồng (doc/pdf)", tags=["AI Processing Service"])
async def extract_api(
    file: UploadFile = File(..., description="File hợp đồng (docx, pdf)"),
    gemini_api_key: str = Header(None, description="Gemini API Key (tùy chọn)")
):
    """
    Đầu vào:
        - file: File docx hoặc pdf (bắt buộc)
        - gemini_api_key: Header (tùy chọn)
    Đầu ra:
        - data: Chuỗi text các điều khoản chính của hợp đồng (do AI sinh ra)
    """
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
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "requestId": str(uuid.uuid4()),
        "path": "/api/v1/ai-processing-service/extract"
    }






# API 3: SUMMARIZE (txt, string input)
@router.post("/api/v1/ai-processing-service/summarize", summary="Tóm tắt hợp đồng (txt/string)", tags=["AI Processing Service"])
async def summarize_api(
    file: UploadFile = File(None, description="File txt cần tóm tắt"),
    text: str = Body(None, description="Nội dung văn bản dạng chuỗi (txt)", embed=True),
    gemini_api_key: str = Header(None, description="Gemini API Key (tùy chọn)")
):
    """
    Đầu vào:
        - file: File txt (tùy chọn)
        - text: Chuỗi văn bản (tùy chọn)
        - gemini_api_key: Header (tùy chọn)
        (Chỉ cần 1 trong 2: file hoặc text)
    Đầu ra:
        - data: object chứa các trường tóm tắt hợp đồng (title, parties, object, effective_date, ...)
        (nếu AI trả về JSON hợp lệ)
        - hoặc data: chuỗi text nếu không parse được JSON
    """
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
            "path": "/api/v1/ai-processing-service/summarize"
        }
    api_key = gemini_api_key or get_gemini_api_key()
    try:
        prompt = (
            "Hãy phân tích và tóm tắt hợp đồng dưới đây thành một JSON với cấu trúc như sau: "
            '{\n'
            '  "contract_summary": {\n'
            '    "title": string,\n'
            '    "tag": string hoặc mảng string,\n'
            '    "parties": [\n'
            '      {"name": string, "role": string, "representative": string, "tax_code": string, "contact": string}, ...\n'
            '    ],\n'
            '    "object": string,\n'
            '    "effective_date": string,\n'
            '    "term": string,\n'
            '    "payment_details": {"total_value": string, "schedule": string, "currency": string},\n'
            '    "key_clauses": [\n'
            '      {"name": string, "description": string, "source": string}, ...\n'
            '    ],\n'
            '    "favorable_clauses": [\n'
            '      {"clause_name": string, "description": string, "benefit_to": string}, ...\n'
            '    ],\n'
            '    "unfavorable_clauses": [\n'
            '      {"clause_name": string, "description": string, "risk_to": string}, ...\n'
            '    ],\n'
            '    "reminders": [\n'
            '      {"type": "gia hạn|xem xét|hết hạn", "date": "yyyy-MM-dd hoặc null", "content": string}, ...\n'
            '    ],\n'
            '    "termination_conditions": string\n'
            '  }\n'
            '}'
            "\nChỉ trả về đúng JSON hợp lệ, không giải thích thêm. Lưu ý: reminders chỉ có ngày nhắc nhở là ngày cụ thể (yyyy-MM-dd), nếu không có ngày cụ thể thì để date=null. Dưới đây là nội dung hợp đồng:"
        )
        answer = ask_gemini(api_key, content, prompt)
        # Loại bỏ các ký tự đặc biệt, markdown, ...
        cleaned = answer.strip()
        if cleaned.startswith('```json'):
            cleaned = cleaned[7:]
        if cleaned.startswith('```'):
            cleaned = cleaned[3:]
        if cleaned.endswith('```'):
            cleaned = cleaned[:-3]
        cleaned = cleaned.replace('\n', '').replace('\r', '').replace('\\', '')
        try:
            summary_json = json.loads(cleaned)
            # Nếu có contract_summary thì chỉ lấy các trường con ra ngoài data
            if isinstance(summary_json, dict) and 'contract_summary' in summary_json:
                data_out = summary_json['contract_summary']
                # Xử lý reminders: nếu không có ngày hợp lệ thì để null
                if 'reminders' in data_out and isinstance(data_out['reminders'], list):
                    # Đầu tiên set date = None nếu không hợp lệ
                    for r in data_out['reminders']:
                        date_val = r.get('date')
                        if not date_val or not isinstance(date_val, str) or not date_val.strip():
                            r['date'] = None
                    # Sau đó loại bỏ reminders có date == None
                    data_out['reminders'] = [r for r in data_out['reminders'] if r.get('date') is not None]
            else:
                data_out = summary_json
        except Exception:
            data_out = answer
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi AI/Summarize: {str(e)}")
    return {
        "apiVersion": "v1",
        "statusCode": 200,
        "shortMessage": "Success",
        "description": "Tóm tắt hợp đồng thành công.",
        "data": data_out,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "requestId": str(uuid.uuid4()),
        "path": "/api/v1/ai-processing-service/summarize"
    }


