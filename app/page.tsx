export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <span className="text-xl font-bold text-blue-700">우리집 부동산</span>
        <div className="space-x-6 text-sm text-gray-600">
          <span>매물찾기</span>
          <span>지역정보</span>
          <span>문의하기</span>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="bg-blue-700 text-white px-8 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">원하는 집, 여기서 찾으세요</h1>
        <p className="text-blue-100 mb-8">서강대 근처 원룸부터 아파트까지 한눈에</p>
        <input
          type="text"
          placeholder="지역, 역 이름으로 검색"
          className="w-96 max-w-full px-4 py-3 rounded-lg text-gray-800"
        />
      </section>

      {/* 매물 카드 목록 */}
      <section className="px-8 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">인기 매물</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "신촌 역세권 원룸", price: "보증금 1000 / 월 55" },
            { title: "서강대 근처 투룸", price: "보증금 3000 / 월 70" },
            { title: "합정동 오피스텔", price: "매매 4억 2천" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-5">
              <div className="h-40 bg-gray-200 rounded mb-4"></div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-blue-700 font-bold">{item.price}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}