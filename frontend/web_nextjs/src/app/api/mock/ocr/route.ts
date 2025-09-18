import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const now = new Date().toISOString()
  try {
    const contentType = req.headers.get('content-type') || ''
    let text = ''

    if (contentType.includes('application/json')) {
      const body = await req.json().catch(() => ({})) as any
      text = (body?.text || '').toString()
    } else if (contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      const file = form.get('file') as File | null
      if (file) {
        // Mock đọc file: chỉ lấy tên file để sinh dữ liệu
        text = `Extracted from: ${file.name}`
      }
    }

    // Sinh dữ liệu trích xuất giả lập với nhiều biến thể
    const contractTypes = ['Hợp đồng lao động', 'Hợp đồng cung cấp dịch vụ', 'Hợp đồng mua bán', 'Hợp đồng thuê nhà', 'Hợp đồng bảo hiểm', 'Hợp đồng hợp tác']
    const randomType = contractTypes[Math.floor(Math.random() * contractTypes.length)]
    const randomValue = Math.floor(Math.random() * 1000000000) + 10000000
    
    const title = text ? `${randomType} từ "${text.slice(0, 24)}"` : `${randomType} - ${Math.floor(Math.random() * 1000) + 1000}`
    const extracted = {
      title,
      contractType: randomType,
      tags: ['hợp_đồng', 'dịch_vụ', '2024', 'thương_mại'],
      object: text ? text.substring(0, 100) + '...' : 'Cung cấp dịch vụ theo thỏa thuận',
      effectiveDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      term: `${Math.floor(Math.random() * 24) + 6} tháng`,
      terminationConditions: 'Thông báo trước 30 ngày',
      content: text || 'Nội dung hợp đồng được trích xuất từ tài liệu. Đây là một hợp đồng quan trọng giữa các bên tham gia với các điều khoản và điều kiện được thỏa thuận...',
      paymentDetails: {
        totalValue: randomValue,
        schedule: ['Thanh toán 1 lần', 'Thanh toán hàng tháng', 'Thanh toán theo tiến độ', '30% khi ký, 70% khi bàn giao'][Math.floor(Math.random() * 4)],
        currency: 'VND',
        paymentMethod: ['Chuyển khoản', 'Tiền mặt', 'Séc'][Math.floor(Math.random() * 3)],
      },
      parties: [
        { 
          name: 'Công ty ABC Corp', 
          role: 'Bên A', 
          representative: 'Nguyễn Văn A', 
          taxCode: '0123456789', 
          contact: '0123456789', 
          address: '123 Đường ABC, Quận 1, TP.HCM', 
          businessLicense: 'ABC-2024' 
        },
        { 
          name: 'Công ty XYZ Ltd', 
          role: 'Bên B', 
          representative: 'Trần Thị B', 
          taxCode: '9876543210', 
          contact: '0987654321', 
          address: '456 Đường XYZ, Quận 2, TP.HCM', 
          businessLicense: 'XYZ-2024' 
        },
      ],
      keyClauses: [
        { 
          title: 'Điều khoản thanh toán', 
          content: 'Bên A thanh toán cho Bên B theo lịch trình đã thỏa thuận trong hợp đồng' 
        },
        { 
          title: 'Điều khoản chấm dứt', 
          content: 'Hợp đồng có thể chấm dứt trước thời hạn nếu có vi phạm nghiêm trọng' 
        },
        { 
          title: 'Điều khoản bảo mật', 
          content: 'Các bên cam kết giữ bí mật thông tin trong quá trình thực hiện hợp đồng' 
        },
        { 
          title: 'Điều khoản giải quyết tranh chấp', 
          content: 'Mọi tranh chấp sẽ được giải quyết thông qua thương lượng và trọng tài' 
        },
      ],
      favorableClauses: [
        { clauseName: 'Điều khoản thanh toán nhanh', description: 'Chiết khấu 2% khi thanh toán sớm', benefitTo: 'Bên A' },
        { clauseName: 'Điều khoản gia hạn', description: 'Tự động gia hạn nếu không có thông báo chấm dứt', benefitTo: 'Cả hai bên' },
      ],
      unfavorableClauses: [
        { clauseName: 'Phạt chậm tiến độ', description: '1%/ngày chậm tiến độ', riskTo: 'Bên A' },
        { clauseName: 'Phạt vi phạm bảo mật', description: '10% giá trị hợp đồng', riskTo: 'Bên vi phạm' },
      ],
      reminders: [
        { type: 'RENEWAL', date: new Date(Date.now() + 25 * 86400000).toISOString().slice(0, 10), content: 'Nhắc gia hạn trước 5 ngày' },
        { type: 'PAYMENT', date: new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10), content: 'Nhắc thanh toán đợt 1' },
      ],
      riskAssessment: { 
        riskLevel: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)], 
        riskFactors: ['Chậm tiến độ', 'Thay đổi yêu cầu', 'Vấn đề tài chính'], 
        mitigationMeasures: ['Theo dõi tiến độ hàng tuần', 'Thiết lập checkpoint', 'Đảm bảo thanh toán đúng hạn'] 
      },
      complianceStatus: { 
        status: 'COMPLIANT', 
        issues: [], 
        recommendations: ['Cập nhật điều khoản bảo mật', 'Bổ sung điều khoản force majeure'] 
      },
    }

    return NextResponse.json({
      apiVersion: 'v1',
      statusCode: 200,
      shortMessage: 'Success',
      description: 'Trích xuất OCR mock thành công',
      data: extracted,
      timestamp: now,
      requestId: crypto.randomUUID(),
      path: '/api/mock/ocr'
    })
  } catch (e: any) {
    return NextResponse.json({
      apiVersion: 'v1',
      statusCode: 500,
      shortMessage: 'Internal Server Error',
      description: 'Lỗi xử lý OCR mock',
      data: null,
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
      path: '/api/mock/ocr'
    }, { status: 500 })
  }
}


