// API Response Types
export interface ApiResponse<T = any> {
  apiVersion: string
  statusCode: number
  shortMessage: string
  description: string
  data: T | null
  timestamp: string
  requestId: string
  path: string
}

export interface PaginatedResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      sorted: boolean
      unsorted: boolean
      empty: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
  numberOfElements: number
  size: number
  number: number
  sort: {
    sorted: boolean
    unsorted: boolean
    empty: boolean
  }
  empty: boolean
}

export interface ErrorResponse {
  apiVersion: string
  statusCode: number
  shortMessage: string
  description: string
  data: null
  timestamp: string
  requestId: string
  path: string
  errors?: string[]
  details?: any
}

export interface HealthCheckResponse {
  status: 'UP' | 'DOWN'
  components: {
    [key: string]: {
      status: 'UP' | 'DOWN'
      details?: any
    }
  }
  timestamp: string
}


