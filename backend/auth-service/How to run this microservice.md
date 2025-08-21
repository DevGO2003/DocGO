### How to run this microservice

Prerequisites:
- Java 17+
- Maven 3.9+
- MariaDB with database `docgo_auth_service`

Configure database in `src/main/resources/application.properties` if needed:
```
spring.datasource.url=jdbc:mariadb://localhost:3306/docgo_auth_service
spring.datasource.username=root
spring.datasource.password=sapassword
```

Run (PowerShell):
```powershell
cd backend/auth-service
./mvnw spring-boot:run -Dspring-boot.run.profiles=default
```

Packaging:
```powershell
./mvnw clean package
java -jar target/auth-service-*.jar
```

Docs: `http://localhost:8082/swagger-ui.html`

