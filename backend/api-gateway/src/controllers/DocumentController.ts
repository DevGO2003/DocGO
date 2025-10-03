import { NextApiRequest, NextApiResponse } from 'next'
import { createErrorResponse, generateRequestId, ValidationError } from '../../lib/utils/errorHandler'
import { contractService } from '../../lib/services/contractService'
import { fileService } from '../../lib/services/fileService'

export class DocumentController {
  private req: NextApiRequest
  private res: NextApiResponse

  constructor(req: NextApiRequest, res: NextApiResponse) {
    this.req = req
    this.res = res
  }

  async handleRequest() {
    const method = this.req.method
    const path = this.req.url || ''

    try {
      // Route based on path
      if (path.includes('/contracts')) {
        return await this.handleContracts()
      } else if (path.includes('/documents')) {
        return await this.handleDocuments()
      } else if (path.includes('/files')) {
        return await this.handleFiles()
      } else if (path.includes('/assets')) {
        return await this.handleAssets()
      } else {
        return this.methodNotAllowed(['GET', 'POST', 'PUT', 'DELETE'])
      }
    } catch (error: any) {
      console.error('[DocumentController] Error:', error)
      return this.res.status(200).json(createErrorResponse(error, this.req as any))
    }
  }

  private async handleContracts() {
    const method = this.req.method
    const path = this.req.url || ''

    try {
      if (path.includes('/bulk')) {
        return await this.handleBulkContracts()
      } else if (path.includes('/[id]') || path.match(/\/contracts\/[^\/]+$/)) {
        return await this.handleContractById()
      } else {
        // Handle /contracts (list and create)
        switch (method) {
          case 'GET':
            return await this.getContracts()
          case 'POST':
            return await this.createContract()
          default:
            return this.methodNotAllowed(['GET', 'POST'])
        }
      }
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async handleDocuments() {
    const method = this.req.method

    try {
      switch (method) {
        case 'GET':
          return await this.getDocuments()
        case 'POST':
          return await this.createDocument()
        default:
          return this.methodNotAllowed(['GET', 'POST'])
      }
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async handleFiles() {
    const method = this.req.method
    const path = this.req.url || ''

    try {
      if (path.includes('/upload')) {
        return await this.uploadFile()
      } else if (path.includes('/[id]') || path.match(/\/files\/[^\/]+$/)) {
        return await this.handleFileById()
      } else {
        // Handle /files (list)
        switch (method) {
          case 'GET':
            return await this.getFiles()
          default:
            return this.methodNotAllowed(['GET'])
        }
      }
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async handleAssets() {
    const method = this.req.method
    const path = this.req.url || ''

    try {
      if (path.includes('/[id]') || path.match(/\/assets\/[^\/]+$/)) {
        return await this.handleAssetById()
      } else {
        // Handle /assets (list and create)
        switch (method) {
          case 'GET':
            return await this.getAssets()
          case 'POST':
            return await this.createAsset()
          default:
            return this.methodNotAllowed(['GET', 'POST'])
        }
      }
    } catch (error: any) {
      return this.error(error)
    }
  }

  // Contract methods
  private async getContracts() {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        sortBy,
        sortDirection
      } = this.req.query

      const params = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        search: search as string,
        status: status as string,
        sortBy: sortBy as string,
        sortDirection: sortDirection as 'asc' | 'desc'
      }

      const result = await contractService.getContracts(params, this.getToken())
      return this.success(result.data, 200, 'Contracts retrieved successfully')
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async createContract() {
    try {
      const contractData = this.req.body

      if (!contractData || !contractData.title || !contractData.content) {
        const requestId = generateRequestId()
        throw new ValidationError(
          'Title and content are required',
          requestId,
          this.req.url || '/api/contracts'
        )
      }

      const result = await contractService.createContract(contractData, this.getToken())
      return this.success(result.data, 201, 'Contract created successfully')
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async handleContractById() {
    const method = this.req.method
    const contractId = this.extractIdFromPath()

    try {
      switch (method) {
        case 'GET':
          const contract = await contractService.getContract(contractId, this.getToken())
          return this.success(contract.data, 200, 'Contract retrieved successfully')
        case 'PUT':
          const updateData = this.req.body
          const updatedContract = await contractService.updateContract(contractId, updateData, this.getToken())
          return this.success(updatedContract.data, 200, 'Contract updated successfully')
        case 'DELETE':
          await contractService.deleteContract(contractId, this.getToken())
          return this.success(null, 200, 'Contract deleted successfully')
        default:
          return this.methodNotAllowed(['GET', 'PUT', 'DELETE'])
      }
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async handleBulkContracts() {
    const method = this.req.method

    try {
      if (method === 'DELETE') {
        const { ids } = this.req.body

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
          const requestId = generateRequestId()
          throw new ValidationError(
            'Contract IDs array is required and cannot be empty',
            requestId,
            this.req.url || '/api/contracts/bulk'
          )
        }

        const result = await contractService.bulkDeleteContracts(ids, this.getToken())
        return this.success(result.data, 200, 'Contracts deleted successfully')
      } else {
        return this.methodNotAllowed(['DELETE'])
      }
    } catch (error: any) {
      return this.error(error)
    }
  }

  // Document methods
  private async getDocuments() {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sortBy,
        sortDirection
      } = this.req.query

      const params = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        search: search as string,
        sortBy: sortBy as string,
        sortDirection: sortDirection as 'asc' | 'desc'
      }

      const result = await fileService.getFiles(params, this.getToken())
      return this.success(result.data, 200, 'Documents retrieved successfully')
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async createDocument() {
    try {
      const documentData = this.req.body

      if (!documentData || !documentData.title || !documentData.content) {
        const requestId = generateRequestId()
        throw new ValidationError(
          'Title and content are required',
          requestId,
          this.req.url || '/api/documents'
        )
      }

      // For now, redirect to file upload
      return this.success(null, 501, 'Document creation not implemented. Use file upload instead.')
    } catch (error: any) {
      return this.error(error)
    }
  }

  // File methods
  private async getFiles() {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        mimeType,
        sortBy,
        sortDirection
      } = this.req.query

      const params = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        search: search as string,
        mimeType: mimeType as string,
        sortBy: sortBy as string,
        sortDirection: sortDirection as 'asc' | 'desc'
      }

      const result = await fileService.getFiles(params, this.getToken())
      return this.success(result.data, 200, 'Files retrieved successfully')
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async uploadFile() {
    try {
      const file = this.req.body.file || (this.req as any).file

      if (!file) {
        const requestId = generateRequestId()
        throw new ValidationError(
          'File is required',
          requestId,
          this.req.url || '/api/files/upload'
        )
      }

      const metadata = this.req.body.metadata ? JSON.parse(this.req.body.metadata) : undefined
      const tags = this.req.body.tags ? JSON.parse(this.req.body.tags) : undefined

      const uploadRequest = {
        file,
        metadata,
        tags
      }

      const result = await fileService.uploadFile(uploadRequest, this.getToken())
      return this.success(result.data, 201, 'File uploaded successfully')
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async handleFileById() {
    const method = this.req.method
    const fileId = this.extractIdFromPath()

    try {
      switch (method) {
        case 'GET':
          const file = await fileService.getFile(fileId, this.getToken())
          return this.success(file.data, 200, 'File retrieved successfully')
        case 'DELETE':
          await fileService.deleteFile(fileId, this.getToken())
          return this.success(null, 200, 'File deleted successfully')
        default:
          return this.methodNotAllowed(['GET', 'DELETE'])
      }
    } catch (error: any) {
      return this.error(error)
    }
  }

  // Asset methods
  private async getAssets() {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sortBy,
        sortDirection
      } = this.req.query

      const params = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        search: search as string,
        sortBy: sortBy as string,
        sortDirection: sortDirection as 'asc' | 'desc'
      }

      const result = await fileService.getAssets(params, this.getToken())
      return this.success(result.data, 200, 'Assets retrieved successfully')
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async createAsset() {
    try {
      const assetData = this.req.body

      if (!assetData || !assetData.name || !assetData.type || !assetData.fileId) {
        const requestId = generateRequestId()
        throw new ValidationError(
          'Name, type, and fileId are required',
          requestId,
          this.req.url || '/api/assets'
        )
      }

      const result = await fileService.createAsset(assetData, this.getToken())
      return this.success(result.data, 201, 'Asset created successfully')
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async handleAssetById() {
    const method = this.req.method
    const assetId = this.extractIdFromPath()

    try {
      switch (method) {
        case 'GET':
          const asset = await fileService.getAsset(assetId, this.getToken())
          return this.success(asset.data, 200, 'Asset retrieved successfully')
        case 'PUT':
          const updateData = this.req.body
          const updatedAsset = await fileService.updateAsset(assetId, updateData, this.getToken())
          return this.success(updatedAsset.data, 200, 'Asset updated successfully')
        case 'DELETE':
          await fileService.deleteAsset(assetId, this.getToken())
          return this.success(null, 200, 'Asset deleted successfully')
        default:
          return this.methodNotAllowed(['GET', 'PUT', 'DELETE'])
      }
    } catch (error: any) {
      return this.error(error)
    }
  }

  // Helper methods
  private extractIdFromPath(): string {
    const path = this.req.url || ''
    const matches = path.match(/\/([^\/]+)$/)
    return matches ? matches[1] : ''
  }

  private validateMethod(allowedMethods: string[]): boolean {
    const method = this.req.method
    if (!allowedMethods.includes(method || '')) {
      this.res.status(405).json({
        apiVersion: 'v1',
        statusCode: 405,
        shortMessage: 'Method Not Allowed',
        description: `Method ${method} not allowed. Allowed methods: ${allowedMethods.join(', ')}`,
        data: null,
        timestamp: new Date().toISOString(),
        requestId: generateRequestId(),
        path: this.req.url || ''
      })
      return false
    }
    return true
  }

  private methodNotAllowed(allowedMethods: string[]) {
    return this.validateMethod(allowedMethods)
  }

  private success(data: any, statusCode: number = 200, message: string = 'Success') {
    return this.res.status(statusCode).json({
      apiVersion: 'v1',
      statusCode,
      shortMessage: message,
      description: message,
      data,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      path: this.req.url || ''
    })
  }

  private error(error: any) {
    console.error(`[DocumentController] Error:`, error)
    return this.res.status(200).json(createErrorResponse(error, this.req as any))
  }

  private getToken(): string | undefined {
    return this.req.headers['x-user-token'] as string
  }
}

// Helper function for backward compatibility
export async function handleDocumentRequest(req: NextApiRequest, res: NextApiResponse) {
  const controller = new DocumentController(req, res)
  return await controller.handleRequest()
}
