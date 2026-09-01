export default function Records() {
  const records = [
    { complex: "래미안 대치팰리스", date: "2026.08.28", visitor: "다니엘", note: "역세권, 초등학교 도보 5분. 관리비 다소 높음" },
    { complex: "신촌 그랑자이", date: "2026.08.30", visitor: "수진", note: "채광 좋음, 주차 여유 있음. 주변 상권 활발" },
    { complex: "합정 한강뷰 오피스텔", date: "2026.09.01", visitor: "민호", note: "한강뷰 프리미엄. 다만 층간소음 우려" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-12 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">임장기록</h1>
      <div className="space-y-4">
        {records.map((r, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-5 flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg mb-1">{r.complex}</h3>
              <p className="text-gray-600 text-sm">{r.note}</p>
            </div>
            <div className="text-right text-sm text-gray-400 whitespace-nowrap ml-4">
              <p>{r.date}</p>
              <p className="text-emerald-700 font-medium">{r.visitor}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}