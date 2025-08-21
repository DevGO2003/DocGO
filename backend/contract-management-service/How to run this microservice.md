### How to run this microservice

Prerequisites:
- Java 17+
- Maven 3.9+
- MariaDB with database `docgo_contract_service`

Database config in `src/main/resources/application.properties`:
```
spring.datasource.url=jdbc:mariadb://localhost:3306/docgo_contract_service
spring.datasource.username=root
spring.datasource.password=sapassword
```

Run (PowerShell):
```powershell
cd backend/contract-management-service
Copy-Item .env.example .env -Force
./mvnw spring-boot:run -Dspring-boot.run.profiles=default
```

Docs: `http://localhost:8081/docs#/`

