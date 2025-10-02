# Multi-stage build for Spring Boot application
FROM eclipse-temurin:17-jdk AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

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
FROM eclipse-temurin:17-jre AS runner

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy built JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Set proper permissions
RUN chmod +r app.jar

# Debug: List files
RUN ls -la /app/

# Expose port 8000 (internal port)
EXPOSE 8000

# Command khởi chạy service
CMD ["java", "-jar", "/app/app.jar"]
