# Multi-stage build for Spring Boot application
<<<<<<< HEAD
FROM eclipse-temurin:21-jdk AS builder
=======
FROM openjdk:21-jdk-slim AS builder
>>>>>>> e4f9e590765b2a1b7ce2f3982eff8dae6ecb472e

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
<<<<<<< HEAD
FROM eclipse-temurin:21-jre AS runner
=======
FROM openjdk:21-jre-slim AS runner
>>>>>>> e4f9e590765b2a1b7ce2f3982eff8dae6ecb472e

# Thiết lập thư mục làm việc
WORKDIR /app

# Create non-root user for security
RUN groupadd -r spring && useradd -r -g spring spring

# Copy built JAR from builder stage
<<<<<<< HEAD
COPY --from=builder /app/target/user-service-1.0.0.jar app.jar
=======
COPY --from=builder /app/target/auth-service-0.0.1-SNAPSHOT.jar app.jar
>>>>>>> e4f9e590765b2a1b7ce2f3982eff8dae6ecb472e

# Change ownership to non-root user
RUN chown spring:spring app.jar

# Switch to non-root user
USER spring

# Expose port 8001 (theo quy tắc port mapping)
EXPOSE 8001

# Command khởi chạy service
CMD ["java", "-jar", "app.jar"]
