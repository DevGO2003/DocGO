from dotenv import load_dotenv
import os

# Nạp file .env.local thay vì mặc định .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env.local'))

def get_gemini_api_key():
    return os.getenv("GEMINI_API_KEY")