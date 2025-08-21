# How to run Auth Service

## Prerequisites
- Java 21+ (or matching your toolchain)
- Maven 3.9+
- MariaDB running locally

## Setup
1) Navigate to this folder
2) Create `.env` from example (PowerShell):
```
Copy-Item .env.example .env -Force
```
3) Optionally update DB creds in `.env` and/or `src/main/resources/application.properties`

## Run (Dev)
```
mvn spring-boot:run
```
The service runs at: `http://localhost:8082`

- Base API: `http://localhost:8082/api/v1/auth-service/...`
- Swagger UI: `http://localhost:8082/docs#/`

## Build Jar
```
mvn clean package -DskipTests
java -jar target/auth-service-*.jar
```

## Environment Variables
- `SERVER_PORT` (default 8082)
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

## Notes
- Swagger UI must be at `/docs#/` per project convention.
- Authentication is temporarily disabled in `SecurityConfig` for development.
