'use client'

import React, { useState } from 'react'

interface OCRUploadProps {
  onResult: (result: any) => void
  onError: (error: string) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export default function OCRUpload({ onResult, onError, loading, setLoading }: OCRUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === 'application/pdf' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.type === 'text/plain') {
        setUploadedFile(file)
        onError('')
      } else {
        onError('Chỉ hỗ trợ file PDF, DOCX, TXT')
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === 'application/pdf' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.type === 'text/plain') {
        setUploadedFile(file)
        onError('')
      } else {
        onError('Chỉ hỗ trợ file PDF, DOCX, TXT')
      }
    }
  }

  const handleOCR = async () => {
    if (!uploadedFile) {
      onError('Vui lòng chọn file để xử lý')
      return
    }

    try {
      setLoading(true)
      onError('')

      let result
      try {
        // Extract text from file first
        const formData = new FormData()
        formData.append('file', uploadedFile)

        const res = await fetch('/api/v1/ai-processing-service/extract', {
          method: 'POST',
          body: formData
        })

        if (!res.ok) {
          throw new Error('AI service not available')
        }

        const extractData = await res.json()
        const extractedText = extractData.data

        // Then summarize the extracted text
        const summarizeRes = await fetch('/api/v1/ai-processing-service/summarize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: extractedText })
        })

        if (!summarizeRes.ok) {
          throw new Error('AI service not available')
        }

        result = await summarizeRes.json()
      } catch (aiError) {
        // Fallback to mock API
        console.log('AI service not available, using mock API')
        const formData = new FormData()
        formData.append('file', uploadedFile)
        
        const res = await fetch('/api/mock/ocr', {
          method: 'POST',
          body: formData
        })

        if (!res.ok) {
          throw new Error('Lỗi xử lý OCR')
        }

        result = await res.json()
      }

      onResult(result.data)
    } catch (err: any) {
      onError(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setUploadedFile(null)
    onError('')
  }

  return (
    <div className="space-y-6">

      {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="text-6xl text-green-500">☁️</div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Kéo thả file vào đây hoặc click để chọn
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Hỗ trợ PDF, DOCX, TXT (tối đa 10MB)
              </p>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
            >
              Chọn file
            </label>
            {uploadedFile && (
              <div className="mt-2 text-sm text-green-600">
                ✓ Đã chọn: {uploadedFile.name}
              </div>
            )}
          </div>
        </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={handleOCR}
          disabled={loading || !uploadedFile}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Đang xử lý...</span>
            </>
          ) : (
            <>
              <span>✓</span>
              <span>Trích xuất thông tin</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Xóa dữ liệu
        </button>
      </div>
    </div>
  )
}
