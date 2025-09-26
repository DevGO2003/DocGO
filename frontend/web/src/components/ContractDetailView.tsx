import React, { useState } from 'react';
import { ArrowLeft, Edit, FileText, Calendar, DollarSign, Users, AlertTriangle, CheckCircle, Clock, Star, Building, Scale, Handshake } from 'lucide-react';
import { Contract } from '../types/contract';
import { useTagTranslation } from '../hooks/useTagTranslation';

interface ContractDetailViewProps {
  contract: Contract;
  onBack: () => void;
  onEdit: () => void;
  canEdit: boolean;
}

export const ContractDetailView: React.FC<ContractDetailViewProps> = ({
  contract,
  onBack,
  onEdit,
  canEdit
}) => {
  const { translateTag } = useTagTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'highlights'>('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'signed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Đã duyệt';
      case 'pending': return 'Chờ duyệt';
      case 'rejected': return 'Từ chối';
      case 'signed': return 'Đã ký';
      case 'expired': return 'Hết hạn';
      case 'draft': return 'Nháp';
      default: return status;
    }
  };

  const getCategoryIcon = (category: string) => {
    return category === 'commercial' ? <Building className="w-5 h-5" /> : <Users className="w-5 h-5" />;
  };

  const renderKeyHighlights = () => {
    const highlights = contract.extractedInfo?.detailedSummary?.keyHighlights || [];
    
    if (highlights.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Chưa có thông tin nổi bật</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {highlights.map((highlight, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-gray-800">{highlight}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderDetailedInfo = () => {
    const details = contract.extractedInfo?.detailedSummary;
    if (!details) return null;

    return (
      <div className="space-y-8">
        {/* General Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <span>🧾 Thông tin chung</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên hợp đồng</label>
              <p className="text-gray-900">{details.generalInfo.contractName || contract.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số hiệu hợp đồng</label>
              <p className="text-gray-900">{details.generalInfo.contractNumber || 'Chưa có'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày ký</label>
              <p className="text-gray-900">
                {details.generalInfo.signDate ? new Date(details.generalInfo.signDate).toLocaleDateString('vi-VN') : 'Chưa ký'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời hạn hợp đồng</label>
              <p className="text-gray-900">
                {details.generalInfo.effectiveDate && details.generalInfo.expiryDate
                  ? `${new Date(details.generalInfo.effectiveDate).toLocaleDateString('vi-VN')} - ${new Date(details.generalInfo.expiryDate).toLocaleDateString('vi-VN')}`
                  : 'Chưa xác định'}
              </p>
            </div>
          </div>
        </div>

        {/* Parties Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5 text-green-500" />
            <span>👥 Các bên tham gia</span>
          </h3>
          <div className="space-y-4">
            {details.generalInfo.parties.map((party, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Bên {party.role}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                    <p className="text-gray-900">{party.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đại diện</label>
                    <p className="text-gray-900">{party.representative}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <p className="text-gray-900">{party.address}</p>
                  </div>
                  {party.taxCode && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mã số thuế</label>
                      <p className="text-gray-900">{party.taxCode}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work Scope */}
        {details.workScope && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Handshake className="w-5 h-5 text-purple-500" />
              <span>💼 Nội dung và phạm vi công việc</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết</label>
                <p className="text-gray-900 whitespace-pre-wrap">{details.workScope.description}</p>
              </div>
              {details.workScope.technicalRequirements && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yêu cầu kỹ thuật</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{details.workScope.technicalRequirements}</p>
                </div>
              )}
              {details.workScope.milestones && details.workScope.milestones.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mốc thời gian thực hiện</label>
                  <div className="space-y-2">
                    {details.workScope.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{milestone.name}</p>
                          <p className="text-sm text-gray-600">Hạn: {new Date(milestone.deadline).toLocaleDateString('vi-VN')}</p>
                          <p className="text-sm text-gray-600">{milestone.deliverables}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Financial Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span>💵 Giá trị hợp đồng và thanh toán</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tổng giá trị</label>
              <p className="text-xl font-semibold text-green-600">{details.financialInfo.totalValue}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại tiền tệ</label>
              <p className="text-gray-900">{details.financialInfo.currency || 'VND'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức thanh toán</label>
              <p className="text-gray-900">{details.financialInfo.paymentMethod}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời hạn thanh toán</label>
              <p className="text-gray-900">{details.financialInfo.paymentTerms}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Lịch thanh toán</label>
              <p className="text-gray-900 whitespace-pre-wrap">{details.financialInfo.paymentSchedule}</p>
            </div>
          </div>
        </div>

        {/* Delivery and Acceptance */}
        {details.deliveryAndAcceptance && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <span>📦 Bàn giao, nghiệm thu</span>
            </h3>
            <div className="space-y-4">
              {details.deliveryAndAcceptance.deliveryDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời điểm bàn giao</label>
                  <p className="text-gray-900">{new Date(details.deliveryAndAcceptance.deliveryDate).toLocaleDateString('vi-VN')}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Điều kiện nghiệm thu</label>
                <p className="text-gray-900 whitespace-pre-wrap">{details.deliveryAndAcceptance.acceptanceCriteria}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quy trình nghiệm thu</label>
                <p className="text-gray-900 whitespace-pre-wrap">{details.deliveryAndAcceptance.acceptanceProcess}</p>
              </div>
            </div>
          </div>
        )}

        {/* Obligations */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Scale className="w-5 h-5 text-orange-500" />
            <span>⚖️ Trách nhiệm & cam kết pháp lý</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trách nhiệm Bên A</label>
              <ul className="space-y-1">
                {details.obligations.partyA.map((obligation, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-900">{obligation}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trách nhiệm Bên B</label>
              <ul className="space-y-1">
                {details.obligations.partyB.map((obligation, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-900">{obligation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {details.obligations.penalties && details.obligations.penalties.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Phạt vi phạm</label>
              <div className="space-y-2">
                {details.obligations.penalties.map((penalty, index) => (
                  <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="font-medium text-red-900">{penalty.violation}</p>
                    <p className="text-red-700">{penalty.penalty}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dispute Resolution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Scale className="w-5 h-5 text-red-500" />
            <span>⚖️ Giải quyết tranh chấp</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cơ quan tài phán</label>
              <p className="text-gray-900">{details.disputeResolution.jurisdiction}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
              <p className="text-gray-900">{details.disputeResolution.venue}</p>
            </div>
            {details.disputeResolution.arbitration && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Trọng tài</label>
                <p className="text-gray-900">{details.disputeResolution.arbitration}</p>
              </div>
            )}
          </div>
        </div>

        {/* Signatures */}
        {details.signatures && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              <span>🔐 Chữ ký & đóng dấu</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {details.signatures.partyASignature && (
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Đại diện Bên A</h4>
                  <p className="text-gray-700">{details.signatures.partyASignature.name}</p>
                  <p className="text-sm text-gray-500">{details.signatures.partyASignature.position}</p>
                  {details.signatures.partyASignature.date && (
                    <p className="text-sm text-gray-500">Ngày ký: {new Date(details.signatures.partyASignature.date).toLocaleDateString('vi-VN')}</p>
                  )}
                </div>
              )}
              {details.signatures.partyBSignature && (
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Đại diện Bên B</h4>
                  <p className="text-gray-700">{details.signatures.partyBSignature.name}</p>
                  <p className="text-sm text-gray-500">{details.signatures.partyBSignature.position}</p>
                  {details.signatures.partyBSignature.date && (
                    <p className="text-sm text-gray-500">Ngày ký: {new Date(details.signatures.partyBSignature.date).toLocaleDateString('vi-VN')}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>
        {canEdit && (
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Chỉnh sửa</span>
          </button>
        )}
      </div>

      {/* Contract Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{contract.title}</h1>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(contract.status)}`}>
                {getStatusText(contract.status)}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{contract.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                {getCategoryIcon(contract.contractCategory)}
                <div>
                  <p className="text-sm text-gray-500">Loại hợp đồng</p>
                  <p className="font-medium">{contract.contractCategory === 'commercial' ? 'Thương mại' : 'Nội bộ'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Giá trị</p>
                  <p className="font-medium">{contract.extractedInfo?.value || 'Chưa xác định'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Ngày tải lên</p>
                  <p className="font-medium">{new Date(contract.uploadDate).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Phiên bản</p>
                  <p className="font-medium">v{contract.currentVersion}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Chi tiết đầy đủ
            </button>
            <button
              onClick={() => setActiveTab('highlights')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'highlights'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Điểm nổi bật
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin cơ bản</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Loại hợp đồng:</span>
                      <p className="font-medium">{contract.extractedInfo?.contractType || 'Chưa xác định'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Thời hạn:</span>
                      <p className="font-medium">{contract.extractedInfo?.duration || 'Chưa xác định'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Các bên tham gia:</span>
                      <div className="mt-1">
                        {contract.extractedInfo?.parties.map((party, index) => (
                          <span key={index} className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm mr-2 mb-1">
                            {party}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tóm tắt nội dung</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {contract.extractedInfo?.summary || 'Chưa có tóm tắt'}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {contract.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {contract.tags.map(tag => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800"
                      >
                        {translateTag(tag.name)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && renderDetailedInfo()}
          {activeTab === 'highlights' && renderKeyHighlights()}
        </div>
      </div>
    </div>
  );
};