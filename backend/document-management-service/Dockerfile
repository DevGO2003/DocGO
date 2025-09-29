<<<<<<< HEAD
# Multi-stage build for Spring Boot application
FROM openjdk:17-jdk-slim AS builder
=======
# Sử dụng Python 3.11 slim image
FROM python:3.11-slim
>>>>>>> e4f9e590765b2a1b7ce2f3982eff8dae6ecb472e

# Thiết lập thư mục làm việc
WORKDIR /app

<<<<<<< HEAD
# Cài đặt Maven
RUN apt-get update && apt-get install -y \
    maven \
    && rm -rf /var/lib/apt/lists/*

# Copy pom.xml first for better layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build ứng dụng
RUN mvn clean package -DskipTests

# Production stage
FROM openjdk:17-jdk-slim AS runner

# Thiết lập thư mục làm việc
WORKDIR /app

# Create non-root user for security
RUN groupadd -r spring && useradd -r -g spring spring

# Copy built JAR from builder stage
COPY --from=builder /app/target/document-service-1.0.0.jar app.jar

# Change ownership to non-root user
RUN chown spring:spring app.jar

# Switch to non-root user
USER spring

# Expose internal runtime port (matches docker-compose command override)
EXPOSE 8000

# Command khởi chạy service
CMD ["java", "-jar", "app.jar"]
=======
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
>>>>>>> e4f9e590765b2a1b7ce2f3982eff8dae6ecb472e
