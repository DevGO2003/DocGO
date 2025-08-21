import os
from dotenv import load_dotenv

load_dotenv()  # Tải các biến môi trường từ file .env

def get_gemini_api_key():
    """
    Lấy Gemini API Key từ biến môi trường.
    Ném ra lỗi nếu không tìm thấy key.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("Biến môi trường GEMINI_API_KEY chưa được thiết lập.")
    return api_key