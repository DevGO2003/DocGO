import React from 'react'

export type EditableColumn = {
  key: string
  label: string
  type?: 'text' | 'number' | 'date'
}

interface Props<T extends Record<string, any>> {
  data: T[]
  setData: (rows: T[]) => void
  columns: EditableColumn[]
  addRowTemplate: T
  title?: string
}

export default function EditableArrayTable<T extends Record<string, any>>({ data, setData, columns, addRowTemplate, title }: Props<T>) {
  const handleCellChange = (rowIndex: number, key: string, value: any) => {
    const newRows = data.map((row, idx) => (idx === rowIndex ? { ...row, [key]: value } : row))
    setData(newRows)
  }

  const handleAdd = () => {
    setData([...(data || []), { ...addRowTemplate }])
  }

  const handleDelete = (rowIndex: number) => {
    const newRows = data.filter((_, idx) => idx !== rowIndex)
    setData(newRows)
  }

  return (
    <div className="space-y-3">
      {title && <div className="font-medium text-gray-900">{title}</div>}
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {c.label}
                </th>
              ))}
              <th className="px-3 py-2 text-right">
                <button onClick={handleAdd} type="button" className="px-3 py-1 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700">
                  Thêm dòng
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {(data || []).length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-3 py-4 text-sm text-gray-500">
                  Chưa có dữ liệu. Nhấn "Thêm dòng" để khởi tạo.
                </td>
              </tr>
            ) : (
              (data || []).map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((c) => (
                    <td key={c.key} className="px-3 py-2">
                      <input
                        type={c.type === 'number' ? 'number' : c.type === 'date' ? 'date' : 'text'}
                        value={row[c.key] ?? ''}
                        onChange={(e) => handleCellChange(rowIndex, c.key, e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => handleDelete(rowIndex)}
                      type="button"
                      className="px-2 py-1 text-sm rounded border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


