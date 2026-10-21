'use client';

import { useState } from 'react';

const StatusBadge = ({ status }: { status: 'pending' | 'progress' | 'completed' | 'payment' }) => {
  const styles = {
    pending: 'bg-gray-100 text-gray-700 border-gray-200',
    progress: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    payment: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };

  const labels = {
    pending: 'อยู่ในคิว',
    progress: 'กำลังดำเนินการ',
    completed: 'เสร็จสิ้น',
    payment: 'รอชำระเงิน',
  };

  return (
    <span className={`px-3 py-1.5 text-xs md:text-sm font-medium rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const mockOrders = [
  { id: 'ORD-2587965432159-458', date: '21/08/2026 15:42 น.', status: 'progress', type: 'current' },
  { id: 'ORD-1234567890123-111', date: '20/08/2026 10:15 น.', status: 'payment', type: 'current' },
  { id: 'ORD-9876543210987-999', date: '15/08/2026 09:30 น.', status: 'completed', type: 'past' },
];

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  
  // State สำหรับจัดการ Pop-up
  const [isSearching, setIsSearching] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const orderPattern = /^ORD-\d+-\d+$/;
    
    if (!orderPattern.test(orderNumber)) {
      setError('รูปแบบหมายเลขออเดอร์ไม่ถูกต้อง (เช่น ORD-2587965432159-458)');
    } else {
      setError('');
      // เปิด Pop-up โหลดดิ้งจำลองการค้นหา
      setIsSearching(true);
      
      // จำลองเวลาโหลด API 1.5 วินาที แล้วปิด
      setTimeout(() => {
        setIsSearching(false);
        // สามารถเพิ่ม Logic เปลี่ยนข้อมูล หรือแจ้งเตือนว่าค้นหาสำเร็จตรงนี้ได้
      }, 1500);
    }
  };

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    // แสดง Toast แจ้งเตือนคัดลอกสำเร็จ
    setToastMessage(`คัดลอก ${id} แล้ว`);
    
    // ปิด Toast อัตโนมัติหลัง 2.5 วินาที
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  const filteredOrders = mockOrders.filter(order => order.type === activeTab);

  return (
    <main className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-sans relative">
      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        
        {/* Header Section */}
        <header className="text-center pt-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">ติดตามสถานะออเดอร์</h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">ตรวจสอบสถานะการสั่งซื้อและประวัติการทำรายการของคุณ</p>
        </header>

        {/* Search Section */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={handleSearch} className="flex flex-col gap-3">
            <label htmlFor="order-input" className="text-sm font-semibold text-slate-700">
              ค้นหาหมายเลขออเดอร์ <span className="text-red-600">*</span>
            </label>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                id="order-input"
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="ตัวอย่าง: ORD-2587965432159-458"
                className={`flex-1 px-4 py-3 text-sm md:text-base border rounded-xl focus:ring-4 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 ${
                  error 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50/30' 
                    : 'border-slate-200 focus:border-red-500 focus:ring-red-100 bg-slate-50 hover:bg-white'
                }`}
              />
              <button 
                type="submit"
                className="bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 active:scale-95 transition-all font-medium text-sm md:text-base shadow-sm"
              >
                ค้นหา
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-1" role="alert">{error}</p>}
          </form>
        </section>

        {/* Order List & Tabs Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Tabs */}
          <nav className="flex border-b border-slate-200 bg-slate-50/50">
            <button
              onClick={() => setActiveTab('current')}
              className={`flex-1 py-4 text-sm md:text-base font-semibold transition-all relative ${
                activeTab === 'current' 
                  ? 'text-red-600 bg-white' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              ออเดอร์ปัจจุบัน
              {activeTab === 'current' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-4 text-sm md:text-base font-semibold transition-all relative ${
                activeTab === 'past' 
                  ? 'text-red-600 bg-white' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
              }`}
            >
              ออเดอร์ที่ผ่านมา
              {activeTab === 'past' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
              )}
            </button>
          </nav>

          {/* Order List */}
          <div className="p-4 md:p-6 bg-slate-50/30">
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white border border-slate-200 rounded-xl hover:border-red-200 hover:shadow-md transition-all gap-4 group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-slate-900 tracking-wide">
                          {order.id}
                        </span>
                        <button 
                          onClick={() => handleCopy(order.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none"
                          title="คัดลอกเลขออเดอร์"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {order.date}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <StatusBadge status={order.status as any} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-slate-700 font-semibold">ไม่พบรายการออเดอร์</p>
                <p className="text-slate-500 text-sm mt-1">คุณยังไม่มีรายการสั่งซื้อในหมวดหมู่นี้</p>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* --- Overlay Modal สำหรับตอนกดค้นหา --- */}
      {isSearching && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 animate-[ping_0.5s_cubic-bezier(0,0,0.2,1)_1] sm:animate-none scale-100 transition-transform">
            {/* Spinner Animation แบบ Tailwind */}
            <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-bold text-slate-900">กำลังค้นหาข้อมูล...</h3>
            <p className="text-slate-500 text-sm mt-2 text-center break-all">ออเดอร์: {orderNumber}</p>
          </div>
        </div>
      )}

      {/* --- Toast Notification สำหรับตอนกดคัดลอก --- */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out">
          <div className="bg-slate-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {toastMessage}
          </div>
        </div>
      )}
    </main>
  );
}