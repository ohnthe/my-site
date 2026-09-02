import Link from "next/link";
import AuthButton from "./auth-button";

export default function Nav() {
  return (
    <nav className="bg-white border-b px-4 sm:px-8 py-4">
      <div className="flex flex-wrap items-center justify-between gap-y-3">
        <Link href="/" className="text-xl font-bold text-emerald-700">
          임장로그
        </Link>
        <AuthButton />
        <div className="w-full flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 order-3 sm:w-auto sm:order-2">
          <Link href="/records">임장기록</Link>
          <Link href="/requests">임장요청</Link>
          <Link href="/schedule">임장일정</Link>
          <Link href="/crew">임장크루</Link>
        </div>
      </div>
    </nav>
  );
}