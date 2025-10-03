'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

type ContactFormData = {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true)
    try {
      // TODO: Implement actual contact form submission
      console.log('Contact form data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSubmitted(true)
      reset()
    } catch (error) {
      console.error('Contact form error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: 'Email',
      content: 'support@docgo.com',
      description: 'Liên hệ qua email'
    },
    {
      icon: PhoneIcon,
      title: 'Điện thoại',
      content: '+84 123 456 789',
      description: 'Hỗ trợ 24/7'
    },
    {
      icon: MapPinIcon,
      title: 'Địa chỉ',
      content: '123 Đường ABC, Quận 1, TP.HCM',
      description: 'Văn phòng chính'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <DocumentTextIcon className="h-12 w-12 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Có câu hỏi hoặc cần hỗ trợ? Chúng tôi luôn sẵn sàng giúp đỡ bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Gửi tin nhắn
                </CardTitle>
                <CardDescription>
                  Điền thông tin để chúng tôi có thể liên hệ lại với bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Cảm ơn bạn!
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                    </p>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                    >
                      Gửi tin nhắn khác
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Họ và tên *
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Nhập họ và tên"
                        {...register('name', {
                          required: 'Họ và tên là bắt buộc',
                          minLength: {
                            value: 2,
                            message: 'Họ và tên phải có ít nhất 2 ký tự'
                          }
                        })}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Nhập email"
                        {...register('email', {
                          required: 'Email là bắt buộc',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email không hợp lệ'
                          }
                        })}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Subject Field */}
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                        Chủ đề *
                      </label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="Nhập chủ đề"
                        {...register('subject', {
                          required: 'Chủ đề là bắt buộc',
                          minLength: {
                            value: 5,
                            message: 'Chủ đề phải có ít nhất 5 ký tự'
                          }
                        })}
                      />
                      {errors.subject && (
                        <p className="text-sm text-red-600">{errors.subject.message}</p>
                      )}
                    </div>

                    {/* Message Field */}
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-gray-700">
                        Tin nhắn *
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Nhập tin nhắn của bạn"
                        {...register('message', {
                          required: 'Tin nhắn là bắt buộc',
                          minLength: {
                            value: 10,
                            message: 'Tin nhắn phải có ít nhất 10 ký tự'
                          }
                        })}
                      />
                      {errors.message && (
                        <p className="text-sm text-red-600">{errors.message.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      loading={isLoading}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Đang gửi...' : 'Gửi tin nhắn'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Thông tin liên hệ
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <info.icon className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {info.title}
                      </h3>
                      <p className="text-primary-600 font-medium">
                        {info.content}
                      </p>
                      <p className="text-sm text-gray-600">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Câu hỏi thường gặp
              </h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Làm thế nào để tạo tài khoản?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Bạn có thể đăng ký tài khoản miễn phí bằng cách nhấn nút "Đăng ký" ở góc trên bên phải.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Tôi có thể hủy tài khoản bất cứ lúc nào không?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Có, bạn có thể hủy tài khoản bất cứ lúc nào từ trang cài đặt tài khoản.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Dữ liệu của tôi có được bảo mật không?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Chúng tôi sử dụng mã hóa end-to-end để bảo vệ dữ liệu của bạn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
