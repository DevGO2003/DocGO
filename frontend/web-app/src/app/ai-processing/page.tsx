'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { aiProcessingAPI } from '@/lib/api'
import { CogIcon, DocumentTextIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function AIProcessingPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'extract' | 'summarize'>('extract')
  const [loading, setLoading] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const [summary, setSummary] = useState('')
  const [keyPoints, setKeyPoints] = useState<string[]>([])
  const [confidence, setConfidence] = useState(0)
  const [processingTime, setProcessingTime] = useState(0)
  
  // Extract tab states
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [apiKey, setApiKey] = useState('')
  
  // Summarize tab states
  const [inputText, setInputText] = useState('')
  const [summarizeFile, setSummarizeFile] = useState<File | null>(null)
  const [summarizeApiKey, setSummarizeApiKey] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const summarizeFileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'extract' | 'summarize') => {
    const file = event.target.files?.[0]
    if (file) {
      if (type === 'extract') {
        setSelectedFile(file)
      } else {
        setSummarizeFile(file)
      }
    }
  }

  const handleExtractText = async () => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn file để trích xuất')
      return
    }

    try {
      setLoading(true)
      const startTime = Date.now()
      
      const response = await aiProcessingAPI.extractText(selectedFile, apiKey || undefined)
      const data = response.data.data
      
      setExtractedText(data.extractedText)
      setConfidence(data.confidence || 0)
      setProcessingTime(Date.now() - startTime)
      
      toast.success('Trích xuất văn bản thành công!')
    } catch (error: any) {
      const message = error.response?.data?.description || 'Lỗi khi trích xuất văn bản'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleSummarize = async () => {
    if (!inputText && !summarizeFile) {
      toast.error('Vui lòng nhập văn bản hoặc chọn file để tóm tắt')
      return
    }

    try {
      setLoading(true)
      const startTime = Date.now()
      
      let response
      if (summarizeFile) {
        response = await aiProcessingAPI.summarizeFile(summarizeFile, summarizeApiKey || undefined)
      } else {
        response = await aiProcessingAPI.summarizeText(inputText, summarizeApiKey || undefined)
      }
      
      const data = response.data.data
      
      setSummary(data.summary)
      setKeyPoints(data.keyPoints || [])
      setConfidence(data.confidence || 0)
      setProcessingTime(Date.now() - startTime)
      
      toast.success('Tóm tắt văn bản thành công!')
    } catch (error: any) {
      const message = error.response?.data?.description || 'Lỗi khi tóm tắt văn bản'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setExtractedText('')
    setSummary('')
    setKeyPoints([])
    setConfidence(0)
    setProcessingTime(0)
  }

  const downloadText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <CogIcon className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Xử lý AI</h1>
              <p className="text-gray-600">Trích xuất và tóm tắt văn bản với AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('extract')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'extract'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <DocumentTextIcon className="h-5 w-5 inline mr-2" />
                Trích xuất văn bản
              </button>
              <button
                onClick={() => setActiveTab('summarize')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'summarize'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <DocumentMagnifyingGlassIcon className="h-5 w-5 inline mr-2" />
                Tóm tắt văn bản
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'extract' ? (
              /* Extract Tab */
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Trích xuất văn bản từ file</h3>
                  <p className="text-gray-600">Upload file (PDF, DOCX, TXT) để trích xuất nội dung văn bản</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Input Section */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn file
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.docx,.txt"
                          onChange={(e) => handleFileSelect(e, 'extract')}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="btn-secondary"
                        >
                          Chọn file
                        </button>
                        {selectedFile && (
                          <p className="mt-2 text-sm text-gray-600">
                            Đã chọn: {selectedFile.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key (tùy chọn)
                      </label>
                      <input
                        type="password"
                        placeholder="Nhập Gemini API Key nếu có"
                        className="input-field"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                    </div>

                    <button
                      onClick={handleExtractText}
                      disabled={!selectedFile || loading}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <LoadingSpinner size="sm" text="Đang xử lý..." showText={false} />
                      ) : (
                        'Trích xuất văn bản'
                      )}
                    </button>
                  </div>

                  {/* Results Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-medium text-gray-900">Kết quả trích xuất</h4>
                      {extractedText && (
                        <button
                          onClick={() => downloadText(extractedText, 'extracted_text.txt')}
                          className="btn-secondary text-sm"
                        >
                          Tải xuống
                        </button>
                      )}
                    </div>
                    
                    {extractedText ? (
                      <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap">{extractedText}</pre>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center text-gray-500">
                        Kết quả sẽ hiển thị ở đây
                      </div>
                    )}

                    {confidence > 0 && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Độ tin cậy:</span>
                          <span className="ml-2 font-medium text-gray-900">{confidence.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Thời gian xử lý:</span>
                          <span className="ml-2 font-medium text-gray-900">{processingTime}ms</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Summarize Tab */
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tóm tắt văn bản</h3>
                  <p className="text-gray-600">Nhập văn bản hoặc upload file để tạo tóm tắt với AI</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Input Section */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Văn bản cần tóm tắt
                      </label>
                      <textarea
                        placeholder="Nhập văn bản cần tóm tắt..."
                        className="input-field h-32 resize-none"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                      />
                    </div>

                    <div className="text-center text-gray-500">hoặc</div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload file
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                        <input
                          ref={summarizeFileInputRef}
                          type="file"
                          accept=".txt,.pdf,.docx"
                          onChange={(e) => handleFileSelect(e, 'summarize')}
                          className="hidden"
                        />
                        <button
                          onClick={() => summarizeFileInputRef.current?.click()}
                          className="btn-secondary"
                        >
                          Chọn file
                        </button>
                        {summarizeFile && (
                          <p className="mt-2 text-sm text-gray-600">
                            Đã chọn: {summarizeFile.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key (tùy chọn)
                      </label>
                      <input
                        type="password"
                        placeholder="Nhập Gemini API Key nếu có"
                        className="input-field"
                        value={summarizeApiKey}
                        onChange={(e) => setSummarizeApiKey(e.target.value)}
                      />
                    </div>

                    <button
                      onClick={handleSummarize}
                      disabled={(!inputText && !summarizeFile) || loading}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Đang xử lý...' : 'Tóm tắt văn bản'}
                    </button>
                  </div>

                  {/* Results Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-medium text-gray-900">Kết quả tóm tắt</h4>
                      {summary && (
                        <button
                          onClick={() => downloadText(summary, 'summary.txt')}
                          className="btn-secondary text-sm"
                        >
                          Tải xuống
                        </button>
                      )}
                    </div>
                    
                    {summary ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tóm tắt</label>
                          <div className="bg-gray-50 rounded-lg p-4 h-32 overflow-y-auto">
                            <p className="text-sm text-gray-800">{summary}</p>
                          </div>
                        </div>

                        {keyPoints.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Điểm chính</label>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <ul className="space-y-1">
                                {keyPoints.map((point, index) => (
                                  <li key={index} className="text-sm text-gray-800 flex items-start">
                                    <span className="text-primary-600 mr-2">•</span>
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Độ tin cậy:</span>
                            <span className="ml-2 font-medium text-gray-900">{confidence.toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Thời gian xử lý:</span>
                            <span className="ml-2 font-medium text-gray-900">{processingTime}ms</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center text-gray-500">
                        Kết quả sẽ hiển thị ở đây
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Clear Results Button */}
        {(extractedText || summary) && (
          <div className="text-center">
            <button
              onClick={clearResults}
              className="btn-secondary"
            >
              Xóa kết quả
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
