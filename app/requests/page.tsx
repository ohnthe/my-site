export default function Requests() {
  const requests = [
    { title: "이번엔 마포/합정 쪽 가보고 싶어요", author: "지훈", date: "2026.08.29", votes: 4 },
    { title: "판교 신축 단지 임장 어때요?", author: "수진", date: "2026.08.30", votes: 2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-12 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">임장요청</h1>
        <button className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
          요청 등록하기
        </button>
      </div>
      <div className="space-y-4">
        {requests.map((r, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-5 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg mb-1">{r.title}</h3>
              <p className="text-gray-400 text-sm">{r.author} · {r.date}</p>
            </div>
            <div className="text-emerald-700 font-bold text-lg">
              👍 {r.votes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}