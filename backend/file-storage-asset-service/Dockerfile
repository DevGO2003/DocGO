# Sử dụng Python 3.11 slim image
FROM python:3.11-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Cài đặt system dependencies cần thiết
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libmagic1 \
    libmagic-dev \
    clamav \
    clamav-daemon \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements và cài đặt Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Tạo thư mục uploads và temp nếu chưa có
RUN mkdir -p uploads temp

# Expose port 8012 (theo quy tắc port mapping)
EXPOSE 8012

# Thiết lập biến môi trường
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Command khởi chạy service
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8012"]
