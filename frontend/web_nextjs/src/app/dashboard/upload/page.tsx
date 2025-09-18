'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout'
import { useState, useRef, useCallback } from 'react'

export default function UploadPage() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const [isUploading, setIsUploading] = useState(false)
	const [message, setMessage] = useState<string | null>(null)
	const [responseData, setResponseData] = useState<any>(null)
	const [folder, setFolder] = useState<string>('documents')
	const inputRef = useRef<HTMLInputElement | null>(null)

	const onSelectFile = (file: File | null) => {
		setMessage(null)
		setResponseData(null)
		setSelectedFile(file)
	}

	const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			onSelectFile(e.dataTransfer.files[0])
			e.dataTransfer.clearData()
		}
	}, [])

	const handleUpload = async () => {
		if (!selectedFile) {
			setMessage('Vui lòng chọn một file trước.')
			return
		}
		try {
			setIsUploading(true)
			setMessage('Đang tải lên...')

			const form = new FormData()
			form.append('file', selectedFile)

			// Backend service: file-storage-asset-service (port 8012)
			const url = `http://localhost:8012/api/v1/file-storage-asset-service/files?folder=${encodeURIComponent(folder)}`
			const res = await fetch(url, {
				method: 'POST',
				body: form,
			})

			const json = await res.json().catch(() => null)
			if (!res.ok) {
				setMessage(`Lỗi tải lên: ${json?.description || json?.detail || res.statusText}`)
				setIsUploading(false)
				return
			}

			setResponseData(json?.data ?? json)
			setMessage('Tải lên thành công!')
		} catch (err: any) {
			setMessage(`Có lỗi xảy ra: ${err?.message || String(err)}`)
		} finally {
			setIsUploading(false)
		}
	}

	return (
		<DashboardLayout>
			<div className="space-y-6">
				<h1 className="text-2xl font-bold text-gray-900">Tải lên</h1>
				<p className="text-gray-600">Chọn file (ví dụ từ Desktop) và tải lên hệ thống.</p>

				<div className="flex items-center gap-3">
					<label className="text-sm text-gray-700">Thư mục lưu:</label>
					<input
						type="text"
						value={folder}
						onChange={(e) => setFolder(e.target.value)}
						className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="documents"
					/>
				</div>

				<div
					className={`mt-2 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors ${
						isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
					}`}
					onDragOver={(e) => {
						e.preventDefault()
						setIsDragging(true)
					}}
					onDragLeave={(e) => {
						e.preventDefault()
						setIsDragging(false)
					}}
					onDrop={onDrop}
				>
					<input
						ref={inputRef}
						type="file"
						className="hidden"
						onChange={(e) => onSelectFile(e.target.files?.[0] ?? null)}
					/>
					<div className="text-center">
						<p className="text-gray-800 font-medium">Kéo thả file vào đây</p>
						<p className="text-gray-500 text-sm">hoặc</p>
						<button
							onClick={() => inputRef.current?.click()}
							className="mt-2 inline-flex items-center px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
							disabled={isUploading}
						>
							Chọn file
						</button>
						<p className="text-gray-400 text-xs mt-2">Bạn có thể chọn file từ Desktop trong hộp thoại.</p>
					</div>
				</div>

				{selectedFile && (
					<div className="mt-4 rounded border p-4 bg-white">
						<p className="text-sm text-gray-700"><span className="font-semibold">File đã chọn:</span> {selectedFile.name}</p>
						<p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
						<div className="mt-3 flex gap-3">
							<button
								onClick={handleUpload}
								className="inline-flex items-center px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
								disabled={isUploading}
							>
								{isUploading ? 'Đang tải lên...' : 'Tải lên'}
							</button>
							<button
								onClick={() => onSelectFile(null)}
								className="inline-flex items-center px-4 py-2 rounded border text-gray-700 hover:bg-gray-50 disabled:opacity-50"
								disabled={isUploading}
							>
								Hủy chọn
							</button>
						</div>
					</div>
				)}

				{message && (
					<p className={`mt-2 text-sm ${message.includes('lỗi') || message.toLowerCase().includes('error') ? 'text-red-600' : 'text-green-600'}`}>
						{message}
					</p>
				)}

				{responseData && (
					<div className="mt-4 rounded border p-4 bg-gray-50 text-sm text-gray-800">
						<p className="font-semibold">Kết quả:</p>
						<pre className="mt-2 whitespace-pre-wrap break-all">{JSON.stringify(responseData, null, 2)}</pre>
					</div>
				)}
			</div>
		</DashboardLayout>
	)
}


