"""
Pagination schemas for file storage service
"""
from typing import List, Optional, Generic, TypeVar
from pydantic import BaseModel

T = TypeVar('T')

class RequestInfo(BaseModel):
    """Request information for pagination"""
    page: int
    size: int
    search_term: Optional[str] = None
    sort_by: Optional[List[str]] = None
    sort_direction: Optional[List[str]] = None

class ResultInfo(BaseModel):
    """Result information for pagination"""
    page: int
    size: int
    total_elements: int
    total_pages: int
    first: bool
    last: bool
    number_of_elements: int
    empty: bool
    sort: List[dict] = []

class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response structure"""
    request: RequestInfo
    result: ResultInfo
    content: List[T]
