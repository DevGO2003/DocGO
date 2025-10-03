import { NextApiRequest, NextApiResponse } from 'next'
import { createErrorResponse, generateRequestId, ValidationError } from '../../lib/utils/errorHandler'
import { config as appConfig } from '../../lib/config'

export class AutomationController {
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
      if (path.includes('/ai/extract') || path.includes('/document/extract')) {
        return await this.handleExtract()
      } else if (path.includes('/ai/summarize') || path.includes('/contracts/summarize')) {
        return await this.handleSummarize()
      } else if (path.includes('/ai/ocr') || path.includes('/ocr')) {
        return await this.handleOCR()
      } else if (path.includes('/ai/notifications')) {
        return await this.handleNotifications()
      } else if (path.includes('/process')) {
        return await this.handleProcess()
      } else if (path.includes('/validate')) {
        return await this.handleValidate()
      } else if (path.includes('/files')) {
        return await this.handleFiles()
      } else if (path.includes('/batch')) {
        return await this.handleBatch()
      } else {
        return this.methodNotAllowed(['GET', 'POST', 'PUT', 'DELETE'])
      }
    } catch (error: any) {
      console.error('[AutomationController] Error:', error)
      return this.res.status(200).json(createErrorResponse(error, this.req as any))
    }
  }

  // Document Processing Methods
  private async handleExtract() {
    if (!this.validateMethod(['POST'])) return

    try {
      const file = this.req.body.file || (this.req as any).file

      if (!file) {
        const requestId = generateRequestId()
        throw new ValidationError(
          'File is required',
          requestId,
          this.req.url || '/api/ai/extract'
        )
      }

      // Get optional Gemini API key
      const geminiApiKey = this.req.headers['gemini-api-key'] as string

      // Call automation service directly
      const automationServiceUrl = appConfig.automationServiceUrl
      const response = await fetch(`${automationServiceUrl}/api/v1/automation-service/v1/document/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-token': this.getToken() || '',
          'gemini-api-key': geminiApiKey || ''
        },
        body: JSON.stringify({ file, geminiApiKey })
      })

      if (!response.ok) {
        throw new Error(`Automation service error: ${response.statusText}`)
      }

      const result = await response.json()
      return this.success(result.data, 200, 'Text extracted successfully')
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async handleSummarize() {
    if (!this.validateMethod(['POST'])) return

    try {
      const { text, file } = this.req.body

      if (!text && !file) {
        const requestId = generateRequestId()
        throw new ValidationError(
          'Text or file is required',
          requestId,
          this.req.url || '/api/ai/summarize'
        )
      }

      // Get optional Gemini API key
      const geminiApiKey = this.req.headers['gemini-api-key'] as string

      // Call automation service directly
      const automationServiceUrl = appConfig.automationServiceUrl
      const response = await fetch(`${automationServiceUrl}/api/v1/automation-service/v1/contracts/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-token': this.getToken() || '',
          'gemini-api-key': geminiApiKey || ''
        },
        body: JSON.stringify({ text, file, geminiApiKey })
      })

      if (!response.ok) {
        throw new Error(`Automation service error: ${response.statusText}`)
      }

      const result = await response.json()
      return this.success(result.data, 200, 'Text summarized successfully')
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async handleOCR() {
    if (!this.validateMethod(['POST'])) return

    try {
      const file = this.req.body.file || (this.req as any).file

      if (!file) {
        const requestId = generateRequestId()
        throw new ValidationError(
          'File is required',
          requestId,
          this.req.url || '/api/ai/ocr'
        )
      }

      // Get optional Gemini API key
      const geminiApiKey = this.req.headers['gemini-api-key'] as string

      // Call automation service directly
      const automationServiceUrl = appConfig.automationServiceUrl
      const response = await fetch(`${automationServiceUrl}/api/v1/automation-service/v1/document/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-token': this.getToken() || '',
          'gemini-api-key': geminiApiKey || ''
        },
        body: JSON.stringify({ file, geminiApiKey })
      })

      if (!response.ok) {
        throw new Error(`Automation service error: ${response.statusText}`)
      }

      const result = await response.json()
      return this.success(result.data, 200, 'OCR completed successfully')
    } catch (error: any) {
      return this.error(error)
    }
  }

  // Contract Processing Methods
  private async handleProcess() {
    if (!this.validateMethod(['POST'])) return

    try {
      const { file, options } = this.req.body

      if (!file) {
        const requestId = generateRequestId()
        throw new ValidationError(
          'File is required',
          requestId,
          this.req.url || '/api/process'
        )
      }

      // Get optional Gemini API key
      const geminiApiKey = this.req.headers['gemini-api-key'] as string

      // Call automation service directly
      const automationServiceUrl = appConfig.automationServiceUrl
      const response = await fetch(`${automationServiceUrl}/api/v1/automation-service/v1/contracts/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-token': this.getToken() || '',
          'gemini-api-key': geminiApiKey || ''
        },
        body: JSON.stringify({ file, options, geminiApiKey })
      })

      if (!response.ok) {
        throw new Error(`Automation service error: ${response.statusText}`)
      }

      const result = await response.json()
      return this.success(result.data, 200, 'Contract processed successfully')
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async handleValidate() {
    if (!this.validateMethod(['POST'])) return

    try {
      const { file, rules } = this.req.body

      if (!file) {
        const requestId = generateRequestId()
        throw new ValidationError(
          'File is required',
          requestId,
          this.req.url || '/api/validate'
        )
      }

      // Get optional Gemini API key
      const geminiApiKey = this.req.headers['gemini-api-key'] as string

      // Call automation service directly
      const automationServiceUrl = appConfig.automationServiceUrl
      const response = await fetch(`${automationServiceUrl}/api/v1/automation-service/v1/contracts/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-token': this.getToken() || '',
          'gemini-api-key': geminiApiKey || ''
        },
        body: JSON.stringify({ file, rules, geminiApiKey })
      })

      if (!response.ok) {
        throw new Error(`Automation service error: ${response.statusText}`)
      }

      const result = await response.json()
      return this.success(result.data, 200, 'Contract validated successfully')
    } catch (error: any) {
      return this.error(error)
    }
  }

  // File Management Methods
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

      // Call automation service directly
      const automationServiceUrl = appConfig.automationServiceUrl
      const response = await fetch(`${automationServiceUrl}/api/v1/automation-service/v1/files?${new URLSearchParams(params as any)}`, {
        method: 'GET',
        headers: {
          'x-user-token': this.getToken() || ''
        }
      })

      if (!response.ok) {
        throw new Error(`Automation service error: ${response.statusText}`)
      }

      const result = await response.json()
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

      // Call automation service directly
      const automationServiceUrl = appConfig.automationServiceUrl
      const formData = new FormData()
      formData.append('file', file)
      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata))
      }

      const response = await fetch(`${automationServiceUrl}/api/v1/automation-service/v1/files`, {
        method: 'POST',
        headers: {
          'x-user-token': this.getToken() || ''
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Automation service error: ${response.statusText}`)
      }

      const result = await response.json()
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
          const automationServiceUrl = appConfig.automationServiceUrl
          const response = await fetch(`${automationServiceUrl}/api/v1/automation-service/v1/files/${fileId}`, {
            method: 'GET',
            headers: {
              'x-user-token': this.getToken() || ''
            }
          })

          if (!response.ok) {
            throw new Error(`Automation service error: ${response.statusText}`)
          }

          const result = await response.json()
          return this.success(result.data, 200, 'File retrieved successfully')
        case 'DELETE':
          const deleteResponse = await fetch(`${automationServiceUrl}/api/v1/automation-service/v1/files/${fileId}`, {
            method: 'DELETE',
            headers: {
              'x-user-token': this.getToken() || ''
            }
          })

          if (!deleteResponse.ok) {
            throw new Error(`Automation service error: ${deleteResponse.statusText}`)
          }

          return this.success(null, 200, 'File deleted successfully')
        default:
          return this.methodNotAllowed(['GET', 'DELETE'])
      }
    } catch (error: any) {
      return this.error(error)
    }
  }

  // Batch Processing Methods
  private async handleBatch() {
    const method = this.req.method
    const path = this.req.url || ''

    try {
      if (path.includes('/process')) {
        return await this.processBatch()
      } else if (path.includes('/status')) {
        return await this.getBatchStatus()
      } else if (path.includes('/results')) {
        return await this.getBatchResults()
      } else {
        return this.methodNotAllowed(['GET', 'POST'])
      }
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async processBatch() {
    if (!this.validateMethod(['POST'])) return

    try {
      const { files, options } = this.req.body

      if (!files || !Array.isArray(files) || files.length === 0) {
        const requestId = generateRequestId()
        throw new ValidationError(
          'Files array is required and cannot be empty',
          requestId,
          this.req.url || '/api/batch/process'
        )
      }

      // Get optional Gemini API key
      const geminiApiKey = this.req.headers['gemini-api-key'] as string

      // Call automation service directly
      const automationServiceUrl = appConfig.automationServiceUrl
      const response = await fetch(`${automationServiceUrl}/api/v1/automation-service/v1/batch/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-token': this.getToken() || '',
          'gemini-api-key': geminiApiKey || ''
        },
        body: JSON.stringify({ files, options, geminiApiKey })
      })

      if (!response.ok) {
        throw new Error(`Automation service error: ${response.statusText}`)
      }

      const result = await response.json()
      return this.success(result.data, 201, 'Batch processing started successfully')
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async getBatchStatus() {
    if (!this.validateMethod(['GET'])) return

    try {
      const batchId = this.extractIdFromPath()

      if (!batchId) {
        const requestId = generateRequestId()
        throw new ValidationError(
          'Batch ID is required',
          requestId,
          this.req.url || '/api/batch/status'
        )
      }

      // Call automation service directly
      const automationServiceUrl = appConfig.automationServiceUrl
      const response = await fetch(`${automationServiceUrl}/api/v1/automation-service/v1/batch/status/${batchId}`, {
        method: 'GET',
        headers: {
          'x-user-token': this.getToken() || ''
        }
      })

      if (!response.ok) {
        throw new Error(`Automation service error: ${response.statusText}`)
      }

      const result = await response.json()
      return this.success(result.data, 200, 'Batch status retrieved successfully')
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async getBatchResults() {
    if (!this.validateMethod(['GET'])) return

    try {
      const batchId = this.extractIdFromPath()

      if (!batchId) {
        const requestId = generateRequestId()
        throw new ValidationError(
          'Batch ID is required',
          requestId,
          this.req.url || '/api/batch/results'
        )
      }

      // Call automation service directly
      const automationServiceUrl = appConfig.automationServiceUrl
      const response = await fetch(`${automationServiceUrl}/api/v1/automation-service/v1/batch/results/${batchId}`, {
        method: 'GET',
        headers: {
          'x-user-token': this.getToken() || ''
        }
      })

      if (!response.ok) {
        throw new Error(`Automation service error: ${response.statusText}`)
      }

      const result = await response.json()
      return this.success(result.data, 200, 'Batch results retrieved successfully')
    } catch (error: any) {
      return this.error(error)
    }
  }

  // Notification Methods (Not implemented yet)
  private async handleNotifications() {
    const path = this.req.url || ''

    try {
      if (path.includes('/send')) {
        return await this.sendNotification()
      } else if (path.includes('/history')) {
        return await this.getNotificationHistory()
      } else {
        return this.methodNotAllowed(['GET', 'POST'])
      }
    } catch (error: any) {
      return this.error(error)
    }
  }

  private async sendNotification() {
    // Notification service is not implemented yet in automation-service
    const requestId = generateRequestId()
    throw new ValidationError(
      'Notification service is not implemented yet in automation-service',
      requestId,
      this.req.url || '/api/ai/notifications/send'
    )
  }

  private async getNotificationHistory() {
    // Notification service is not implemented yet in automation-service
    const requestId = generateRequestId()
    throw new ValidationError(
      'Notification service is not implemented yet in automation-service',
      requestId,
      this.req.url || '/api/ai/notifications/history'
    )
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
    console.error(`[AutomationController] Error:`, error)
    return this.res.status(200).json(createErrorResponse(error, this.req as any))
  }

  private getToken(): string | undefined {
    return this.req.headers['x-user-token'] as string
  }
}

// Helper function for backward compatibility
export async function handleAutomationRequest(req: NextApiRequest, res: NextApiResponse) {
  const controller = new AutomationController(req, res)
  return await controller.handleRequest()
}
