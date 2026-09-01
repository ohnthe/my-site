export default function Crew() {
  const members = [
    { name: "다니엘", role: "모임장", intro: "서울 아파트 위주로 임장, 데이터 분석 좋아함" },
    { name: "수진", role: "총무", intro: "신축 단지 관심 많음, 일정 조율 담당" },
    { name: "민호", role: "멤버", intro: "한강뷰/오피스텔 전문" },
    { name: "지훈", role: "멤버", intro: "마포/합정 지역 로컬" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-12 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">임장크루</h1>
      <p className="text-gray-600 mb-8">함께 발로 뛰며 임장 다니는 사람들</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {members.map((m, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg">{m.name}</h3>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                {m.role}
              </span>
            </div>
            <p className="text-gray-600 text-sm">{m.intro}</p>
          </div>
        ))}
      </div>
    </div>
  );
}