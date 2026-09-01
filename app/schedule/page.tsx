export default function Schedule() {
  const schedules = [
    { date: "2026.09.06 (토)", time: "오전 10:00", area: "신촌 일대", status: "예정" },
    { date: "2026.09.13 (토)", time: "오전 10:00", area: "마포/합정", status: "예정" },
    { date: "2026.08.30 (일)", time: "오후 2:00", area: "판교", status: "완료" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-12 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">임장일정</h1>
      <div className="space-y-4">
        {schedules.map((s, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-5 flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg">{s.date} · {s.time}</p>
              <p className="text-gray-600 text-sm mt-1">{s.area}</p>
            </div>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${
                s.status === "예정"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}