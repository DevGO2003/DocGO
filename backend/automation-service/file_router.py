"""
File Storage Router for Automation Service
Converted from Document Management Service Controller
"""

from fastapi import APIRouter, UploadFile, File, Query, HTTPException, Response
from fastapi.responses import StreamingResponse
from typing import List, Optional
import io
import uuid
from datetime import datetime

from schemas.file_schemas import FileUploadResponse, FileDownloadResponse, FileListResponse, FileDetailsResponse
from schemas.response import RestResponse
from schemas.view_schemas import ViewType, ViewMapper, PaginatedViewResponse
from services.file_service import FileStorageService

# Create router
router = APIRouter(prefix="/api/v1/automation-service/v1/files", tags=["📁 APIs Quản lý File"])

# Initialize file service
file_service = FileStorageService()


@router.post("", summary="Upload file", response_model=RestResponse[FileUploadResponse])
async def upload_file(
    file: UploadFile = File(..., description="File cần upload lên hệ thống"),
    folder: Optional[str] = Query(None, description="Thư mục con tùy chọn trong bucket"),
    user_id: Optional[str] = Query(None, description="ID của user upload file (mặc định: public)"),
    view: Optional[str] = Query(None, description="Loại view để trả về dữ liệu (ví dụ: summary, detail, full)")
):
    """
    ## 📖 Mô tả
    API upload file lên hệ thống với khả năng lưu trữ trên S3 hoặc local storage.
    Hỗ trợ scan malware, versioning và quản lý metadata file.
    
    ## 🔹 Đầu vào
    
    📁 **file** (bắt buộc, multipart/form-data)
    - **Loại**: UploadFile
    - **Mô tả**: File cần upload lên hệ thống
    - **Giới hạn**: Tối đa 10MB, hỗ trợ tất cả định dạng file
    
    📂 **folder** (tùy chọn, query)
    - **Loại**: string
    - **Mô tả**: Thư mục con tùy chọn trong bucket để tổ chức file
    - **Ví dụ**: "documents", "contracts", "reports"
    
    👤 **user_id** (tùy chọn, query)
    - **Loại**: string
    - **Mô tả**: ID của user upload file để phân quyền truy cập
    - **Mặc định**: "public" (truy cập công khai)
    
    ## 🔹 Đầu ra
    
    📄 **data** (FileUploadResponse)
    Loại: FileUploadResponse
    Mô tả: Thông tin file đã upload bao gồm file_id, filename, file_size, file_type, status, upload_time, s3_key, bucket, file_url
    """
    try:
        response = file_service.upload_file(file, folder, user_id)
        return RestResponse(
            apiVersion="v1",
            statusCode=201,
            shortMessage="Created",
            description="File đã được upload thành công.",
            data=response,
            timestamp=response.upload_time.isoformat(),
            requestId=str(uuid.uuid4()),
            path="/api/v1/automation-service/v1/files"
        )
    except HTTPException as e:
        return RestResponse(
            apiVersion="v1",
            statusCode=e.status_code,
            shortMessage="Error",
            description=e.detail,
            data=None,
            timestamp=datetime.now().isoformat(),
            requestId=str(uuid.uuid4()),
            path="/api/v1/automation-service/v1/files"
        )


@router.get("/{file_id}/download", summary="Download file")
async def download_file(
    file_id: str,
    user_id: Optional[str] = Query(None, description="ID của user download file (mặc định: public)"),
    version: Optional[int] = Query(None, description="Phiên bản file cụ thể (nếu không có, tải bản mới nhất)")
):
    """
    ## 📖 Mô tả
    API download file từ hệ thống lưu trữ (S3 hoặc local storage).
    Hỗ trợ download theo file_id và có thể chỉ định phiên bản cụ thể.
    
    ## 🔹 Đầu vào
    
    🆔 **file_id** (bắt buộc, path)
    - **Loại**: string
    - **Mô tả**: ID duy nhất của file cần download
    - **Ví dụ**: "123e4567-e89b-12d3-a456-426614174000"
    
    👤 **user_id** (tùy chọn, query)
    - **Loại**: string
    - **Mô tả**: ID của user download file để kiểm tra quyền truy cập
    - **Mặc định**: "public" (truy cập công khai)
    
    🔢 **version** (tùy chọn, query)
    Loại: integer
    Mô tả: Phiên bản file cụ thể (nếu không có, tải bản mới nhất)
    
    🔹 Đầu ra
    
    📄 Response
    Loại: File content (application/octet-stream)
    Mô tả: Nội dung file với header Content-Disposition để download
    """
    try:
        response = file_service.download_file(file_id, user_id, version)
        
        # Create streaming response
        file_stream = io.BytesIO(response.file_content)
        
        return StreamingResponse(
            io.BytesIO(response.file_content),
            media_type=response.content_type,
            headers={
                "Content-Disposition": f"attachment; filename=\"{response.filename}\"",
                "Content-Length": str(response.file_size)
            }
        )
    except HTTPException as e:
        raise e


@router.get("", summary="Danh sách files với projection", response_model=RestResponse[PaginatedViewResponse])
async def get_all_files(
    view: str = Query("table", description="View type: table, card, detail, full (mặc định: table)"),
    page_number: int = Query(0, description="Số trang (mặc định: 0)"),
    page_size: int = Query(10, description="Kích thước trang (mặc định: 10)"),
    sort_by: Optional[List[str]] = Query(None, description="Danh sách các trường để sắp xếp"),
    sort_direction: Optional[List[str]] = Query(None, description="Hướng sắp xếp (ASC/DESC)"),
    include_deleted: bool = Query(False, description="Có bao gồm files đã xóa không (mặc định: false)")
):
    """
    ## 📖 Mô tả
    API lấy danh sách tất cả files trong hệ thống với phân trang và sắp xếp.
    Hỗ trợ tìm kiếm, lọc và sắp xếp theo nhiều tiêu chí khác nhau.
    
    ## 🔹 Đầu vào
    
    📄 **page_number** (tùy chọn, query)
    - **Loại**: integer
    - **Mô tả**: Số trang cần lấy (bắt đầu từ 0)
    - **Mặc định**: 0
    - **Ví dụ**: 0, 1, 2...
    
    📊 **page_size** (tùy chọn, query)
    - **Loại**: integer
    - **Mô tả**: Số lượng files trên mỗi trang
    - **Mặc định**: 10
    - **Ví dụ**: 10, 20, 50...
    
    🔄 **sort_by** (tùy chọn, query)
    - **Loại**: List[string]
    - **Mô tả**: Danh sách các trường để sắp xếp
    - **Các giá trị**: "filename", "upload_time", "file_size", "file_type"
    - **Ví dụ**: ["upload_time", "filename"]
    
    📈 **sort_direction** (tùy chọn, query)
    - **Loại**: List[string]
    - **Mô tả**: Hướng sắp xếp cho từng trường
    - **Các giá trị**: "ASC", "DESC"
    - **Ví dụ**: ["DESC", "ASC"]
    
    🗑️ **include_deleted** (tùy chọn, query)
    - **Loại**: boolean
    - **Mô tả**: Có bao gồm files đã bị xóa không
    - **Mặc định**: false
    - **Ví dụ**: true, false
    
    ## 🔹 Đầu ra
    
    📄 **data** (FileListResponse)
    - **Mô tả**: Danh sách files với thông tin phân trang
    - **Bao gồm**: files[], total_elements, total_pages, current_page, page_size
    """
    try:
        # Validate view type
        try:
            view_type = ViewType(view.lower())
        except ValueError:
            view_type = ViewType.TABLE
        
        # Get files from service
        response = file_service.get_all_files(page_number, page_size, sort_by, sort_direction, include_deleted)
        
        # Map files to view
        view_items = []
        for file_data in response.files:
            # Convert file data to dict if needed
            if hasattr(file_data, 'dict'):
                file_dict = file_data.dict()
            else:
                file_dict = file_data
            
            # Map to view
            view_item = ViewMapper.map_file_to_view(file_dict, view_type)
            view_items.append(view_item)
        
        # Create paginated view response
        paginated_response = PaginatedViewResponse(
            view=view_type.value,
            items=view_items,
            pagination={
                "page": response.current_page,
                "size": response.page_size,
                "totalElements": response.total_elements,
                "totalPages": response.total_pages
            }
        )
        
        return RestResponse(
            apiVersion="v1",
            statusCode=200,
            shortMessage="Success",
            description=f"Đã lấy danh sách files thành công với view {view_type.value}",
            data=paginated_response,
            timestamp=datetime.now().isoformat(),
            requestId=str(uuid.uuid4()),
            path="/api/v1/automation-service/v1/files"
        )
    except HTTPException as e:
        return RestResponse(
            apiVersion="v1",
            statusCode=e.status_code,
            shortMessage="Error",
            description=e.detail,
            data=None,
            timestamp=datetime.now().isoformat(),
            requestId=str(uuid.uuid4()),
            path="/api/v1/automation-service/v1/files"
        )


@router.get("/{file_id}", summary="Chi tiết file", response_model=RestResponse[dict])
async def get_file_details(
    file_id: str,
    view: Optional[str] = Query(None, description="Loại view để trả về dữ liệu (ví dụ: summary, detail, full)")
):
    """
    Lấy thông tin chi tiết file
    
    🔹 Đầu vào
    
    🆔 file_id (bắt buộc, path)
    Loại: string
    Mô tả: ID của file cần lấy thông tin
    
    🔹 Đầu ra
    
    📄 data
    Loại: dict
    Mô tả: Thông tin chi tiết của file bao gồm metadata, checksum, access count
    """
    try:
        response = file_service.get_file_details(file_id)
        return RestResponse(
            apiVersion="v1",
            statusCode=200,
            shortMessage="Success",
            description="Đã lấy thông tin chi tiết file thành công",
            data=response,
            timestamp=datetime.now().isoformat(),
            requestId=str(uuid.uuid4()),
            path=f"/api/v1/automation-service/v1/files/{file_id}"
        )
    except HTTPException as e:
        return RestResponse(
            apiVersion="v1",
            statusCode=e.status_code,
            shortMessage="Error",
            description=e.detail,
            data=None,
            timestamp=datetime.now().isoformat(),
            requestId=str(uuid.uuid4()),
            path=f"/api/v1/automation-service/v1/files/{file_id}"
        )


@router.delete("/{file_id}", summary="Xóa file", response_model=RestResponse[dict])
async def delete_file(
    file_id: str,
    user_id: Optional[str] = Query(None, description="ID của user xóa file (mặc định: public)"),
    version: Optional[int] = Query(None, description="Phiên bản cụ thể cần xóa (nếu không có thì xóa tất cả)")
):
    """
    Xóa file hoặc phiên bản cụ thể
    
    🔹 Đầu vào
    
    🆔 file_id (bắt buộc, path)
    Loại: string
    Mô tả: ID của file cần xóa
    
    👤 user_id (tùy chọn, query)
    Loại: string
    Mô tả: ID của user xóa file (mặc định: public)
    
    🔢 version (tùy chọn, query)
    Loại: integer
    Mô tả: Phiên bản cụ thể cần xóa (nếu không có thì xóa tất cả)
    
    🔹 Đầu ra
    
    📄 data
    Loại: object
    Mô tả: Kết quả xóa file với thông tin xác nhận
    """
    try:
        result = file_service.delete_file(file_id, user_id, version)
        response = {"success": result}
        
        description = f"Đã xóa phiên bản {version} của file thành công" if version else "Đã xóa toàn bộ file thành công"
        
        return RestResponse(
            apiVersion="v1",
            statusCode=200,
            shortMessage="Success",
            description=description,
            data=response,
            timestamp=datetime.now().isoformat(),
            requestId=str(uuid.uuid4()),
            path=f"/api/v1/automation-service/files/{file_id}"
        )
    except HTTPException as e:
        return RestResponse(
            apiVersion="v1",
            statusCode=e.status_code,
            shortMessage="Error",
            description=e.detail,
            data=None,
            timestamp=datetime.now().isoformat(),
            requestId=str(uuid.uuid4()),
            path=f"/api/v1/automation-service/files/{file_id}"
        )


