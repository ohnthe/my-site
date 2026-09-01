import Link from "next/link";

export default function Nav() {
  return (
    <nav className="bg-white border-b px-8 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-emerald-700">
        임장로그
      </Link>
      <div className="space-x-6 text-sm text-gray-600">
        <Link href="/records">임장기록</Link>
        <Link href="/requests">임장요청</Link>
        <Link href="/schedule">임장일정</Link>
        <Link href="/crew">임장크루</Link>
      </div>
    </nav>
  );
}