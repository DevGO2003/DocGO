export default function TestNoAuth() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-600">
        ✅ Trang không yêu cầu đăng nhập
      </h1>
      <p className="mt-4 text-gray-600">
        Nếu bạn thấy trang này, có nghĩa là không có middleware nào chặn truy cập.
      </p>
      <div className="mt-4 p-4 bg-blue-100 rounded">
        <p className="text-blue-800">
          🔗 Các link test:
        </p>
        <ul className="mt-2 text-sm text-blue-700">
          <li>• <a href="/" className="underline">Trang chủ</a></li>
          <li>• <a href="/contracts" className="underline">Danh sách hợp đồng</a></li>
          <li>• <a href="/test-hot-reload" className="underline">Test Hot Reload</a></li>
        </ul>
      </div>
    </div>
  )
}
