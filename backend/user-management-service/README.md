<<<<<<< HEAD
# User Management Service

Dịch vụ Spring Boot quản lý người dùng, xác thực, cấp token và phân quyền.

Docs: http://localhost:8001/docs#/

## How to run User Management Service
=======
# Authentication & Identity Service

Dịch vụ Spring Boot quản lý xác thực, cấp token và phân quyền.

Docs: http://localhost:8001/docs#/

## How to run Authentication Identity Service
>>>>>>> e4f9e590765b2a1b7ce2f3982eff8dae6ecb472e

### Prerequisites
- Java 21+ (or matching your toolchain)
- Maven 3.9+
- MongoDB Atlas hoặc MongoDB local
- Redis Cloud hoặc Redis local
<<<<<<< HEAD
- MongoDB Atlas (primary database)
=======
- MariaDB running locally (legacy support)
>>>>>>> e4f9e590765b2a1b7ce2f3982eff8dae6ecb472e

### Setup
1) Navigate to this folder
2) Create `.env` from example (PowerShell):
```
Copy-Item .env.example .env -Force
```
3) Update database credentials in `.env` and/or `src/main/resources/application.properties`:
   - MongoDB: `spring.data.mongodb.uri`
   - Redis: `spring.data.redis.host`, `spring.data.redis.port`
<<<<<<< HEAD
   - MongoDB: `spring.data.mongodb.uri` (primary)
=======
   - MariaDB: `spring.datasource.url` (legacy)
>>>>>>> e4f9e590765b2a1b7ce2f3982eff8dae6ecb472e

### Run (Dev)
```
mvn spring-boot:run
```
The service runs at (compose host): `http://localhost:8001` (container port 8000)

<<<<<<< HEAD
- Base API: `http://localhost:8001/api/v1/user-management-service/...`
=======
- Base API: `http://localhost:8001/api/v1/authentication-identity-service/...`
>>>>>>> e4f9e590765b2a1b7ce2f3982eff8dae6ecb472e
- Swagger UI: `http://localhost:8001/docs#/`

### Build Jar
```
mvn clean package -DskipTests
java -jar target/auth-service-*.jar
```

### Environment Variables
- `SERVER_PORT` (default 8001)
- `SPRING_DATA_MONGODB_URI` (MongoDB connection string)
- `SPRING_DATA_REDIS_HOST` (Redis host)
- `SPRING_DATA_REDIS_PORT` (Redis port)
<<<<<<< HEAD
- `MONGODB_ATLAS_URI` (MongoDB Atlas - primary)
- `MONGODB_DATABASE` (MongoDB database name)
=======
- `SPRING_DATASOURCE_URL` (MariaDB - legacy)
- `SPRING_DATASOURCE_USERNAME` (MariaDB - legacy)
- `SPRING_DATASOURCE_PASSWORD` (MariaDB - legacy)
>>>>>>> e4f9e590765b2a1b7ce2f3982eff8dae6ecb472e

## 🚀 Tính năng mới

### User Management
- **User CRUD**: Tạo, đọc, cập nhật, xóa người dùng
- **User Profile**: Quản lý thông tin cá nhân
- **User Search**: Tìm kiếm người dùng
- **User Status**: Trạng thái người dùng (active, inactive, suspended)
- **User Groups**: Nhóm người dùng
- **Two-Factor Authentication**: Xác thực hai yếu tố

### Role & Permission Management
- **Role CRUD**: Quản lý vai trò
- **Permission CRUD**: Quản lý quyền
- **Role Assignment**: Gán vai trò cho người dùng
- **Permission Assignment**: Gán quyền cho vai trò
- **Hierarchical Roles**: Vai trò phân cấp

### Session Management
- **Session Creation**: Tạo phiên đăng nhập
- **Session Validation**: Xác thực phiên đăng nhập
- **Session Termination**: Kết thúc phiên đăng nhập
- **Session Monitoring**: Theo dõi phiên đăng nhập
- **Multi-device Support**: Hỗ trợ đa thiết bị

### Security Features
- **JWT Tokens**: Quản lý JWT tokens
- **Password Hashing**: Mã hóa mật khẩu
- **Account Lockout**: Khóa tài khoản
- **Password Reset**: Đặt lại mật khẩu

## API Endpoints

### 🔹 Authentication
<<<<<<< HEAD
- `POST /api/v1/user-management-service/auth/login` - Đăng nhập
- `POST /api/v1/user-management-service/auth/logout` - Đăng xuất
- `POST /api/v1/user-management-service/auth/refresh` - Refresh token

### 🔹 User Management
- `GET /api/v1/user-management-service/users` - Danh sách người dùng
- `POST /api/v1/user-management-service/users` - Tạo người dùng
- `GET /api/v1/user-management-service/users/{id}` - Chi tiết người dùng
- `PUT /api/v1/user-management-service/users/{id}` - Cập nhật người dùng
- `DELETE /api/v1/user-management-service/users/{id}` - Xóa người dùng

### 🔹 Role Management
- `GET /api/v1/user-management-service/roles` - Danh sách vai trò
- `POST /api/v1/user-management-service/roles` - Tạo vai trò
- `GET /api/v1/user-management-service/roles/{id}` - Chi tiết vai trò
- `PUT /api/v1/user-management-service/roles/{id}` - Cập nhật vai trò
- `DELETE /api/v1/user-management-service/roles/{id}` - Xóa vai trò

### 🔹 Session Management
- `GET /api/v1/user-management-service/sessions` - Danh sách phiên đăng nhập
- `GET /api/v1/user-management-service/sessions/{id}` - Chi tiết phiên đăng nhập
- `PUT /api/v1/user-management-service/sessions/{id}/terminate` - Kết thúc phiên đăng nhập
=======
- `POST /api/v1/authentication-identity-service/auth/login` - Đăng nhập
- `POST /api/v1/authentication-identity-service/auth/logout` - Đăng xuất
- `POST /api/v1/authentication-identity-service/auth/refresh` - Refresh token

### 🔹 User Management
- `GET /api/v1/authentication-identity-service/users` - Danh sách người dùng
- `POST /api/v1/authentication-identity-service/users` - Tạo người dùng
- `GET /api/v1/authentication-identity-service/users/{id}` - Chi tiết người dùng
- `PUT /api/v1/authentication-identity-service/users/{id}` - Cập nhật người dùng
- `DELETE /api/v1/authentication-identity-service/users/{id}` - Xóa người dùng

### 🔹 Role Management
- `GET /api/v1/authentication-identity-service/roles` - Danh sách vai trò
- `POST /api/v1/authentication-identity-service/roles` - Tạo vai trò
- `GET /api/v1/authentication-identity-service/roles/{id}` - Chi tiết vai trò
- `PUT /api/v1/authentication-identity-service/roles/{id}` - Cập nhật vai trò
- `DELETE /api/v1/authentication-identity-service/roles/{id}` - Xóa vai trò

### 🔹 Session Management
- `GET /api/v1/authentication-identity-service/sessions` - Danh sách phiên đăng nhập
- `GET /api/v1/authentication-identity-service/sessions/{id}` - Chi tiết phiên đăng nhập
- `PUT /api/v1/authentication-identity-service/sessions/{id}/terminate` - Kết thúc phiên đăng nhập
>>>>>>> e4f9e590765b2a1b7ce2f3982eff8dae6ecb472e

## Notes
- Swagger UI must be at `/docs#/` per project convention.
- MongoDB được sử dụng làm database chính cho user management
- Redis được sử dụng cho session management và caching
<<<<<<< HEAD
- MongoDB Atlas là database chính duy nhất
=======
- MariaDB vẫn được hỗ trợ cho backward compatibility
>>>>>>> e4f9e590765b2a1b7ce2f3982eff8dae6ecb472e
