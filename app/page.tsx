import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 섹션 */}
      <section className="bg-emerald-700 text-white px-8 py-24 text-center">
        <p className="text-emerald-200 text-sm font-medium mb-3">우리 모임 전용 임장 플랫폼</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">임장로그</h1>
        <p className="text-emerald-100 text-lg mb-8">
          누가, 언제, 어디를 다녀왔는지<br />모임원 모두가 한눈에
        </p>
        <Link
          href="/records"
          className="inline-block bg-white text-emerald-700 font-semibold px-6 py-3 rounded-lg hover:bg-emerald-50"
        >
          기록 보러가기
        </Link>
      </section>

      {/* 4개 메뉴 카드 */}
      <section className="max-w-5xl mx-auto px-8 py-16">
        <h2 className="text-xl font-bold text-center mb-10">임장로그로 할 수 있는 것</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/records"
            className="bg-white rounded-xl shadow p-6 hover:shadow-md transition"
          >
            <p className="text-3xl mb-3">📋</p>
            <h3 className="font-semibold text-lg mb-1">임장기록</h3>
            <p className="text-gray-500 text-sm">다녀온 단지들의 후기와 정보를 모아봐요</p>
          </Link>

          <Link
            href="/requests"
            className="bg-white rounded-xl shadow p-6 hover:shadow-md transition"
          >
            <p className="text-3xl mb-3">🙋</p>
            <h3 className="font-semibold text-lg mb-1">임장요청</h3>
            <p className="text-gray-500 text-sm">가보고 싶은 지역을 제안하고 투표해요</p>
          </Link>

          <Link
            href="/schedule"
            className="bg-white rounded-xl shadow p-6 hover:shadow-md transition"
          >
            <p className="text-3xl mb-3">📅</p>
            <h3 className="font-semibold text-lg mb-1">임장일정</h3>
            <p className="text-gray-500 text-sm">다가오는 임장 일정을 확인하고 참석해요</p>
          </Link>

          <Link
            href="/crew"
            className="bg-white rounded-xl shadow p-6 hover:shadow-md transition"
          >
            <p className="text-3xl mb-3">👥</p>
            <h3 className="font-semibold text-lg mb-1">임장크루</h3>
            <p className="text-gray-500 text-sm">함께 발로 뛰는 모임원들을 소개해요</p>
          </Link>
        </div>
      </section>

      {/* 다음 일정 미리보기 */}
      <section className="max-w-5xl mx-auto px-8 pb-16">
        <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">다음 임장 일정</p>
            <p className="font-semibold text-lg">9월 6일(토) 오전 10시 · 신촌 일대</p>
          </div>
          <Link
            href="/schedule"
            className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            전체 일정 보기
          </Link>
        </div>
      </section>
    </div>
  );
}