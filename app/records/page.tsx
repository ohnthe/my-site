"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type Record = {
  id: number;
  complex: string;
  note: string;
  visitor: string;
  visit_date: string;
};

export default function Records() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [records, setRecords] = useState<Record[]>([]);
  const [complex, setComplex] = useState("");
  const [note, setNote] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [loading, setLoading] = useState(false);

  // 로그인 상태 확인
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  // 페이지 열릴 때 기록 불러오기
  const fetchRecords = async () => {
    const { data, error } = await supabase
      .from("records")
      .select("*")
      .order("visit_date", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setRecords(data as Record[]);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // 폼 제출 시 새 기록 추가
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !complex || !visitDate) return;

    const visitorName =
      user.user_metadata?.full_name || user.email || "익명";

    setLoading(true);
    const { error } = await supabase.from("records").insert([
      { complex, note, visitor: visitorName, visit_date: visitDate },
    ]);
    setLoading(false);

    if (error) {
      alert("저장 중 오류가 발생했어요: " + error.message);
      return;
    }

    setComplex("");
    setNote("");
    setVisitDate("");
    fetchRecords();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-12 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">임장기록</h1>

      {/* 새 기록 입력 폼: 로그인한 사용자만 표시 */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-5 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="단지명 (예: 래미안 대치팰리스)"
            value={complex}
            onChange={(e) => setComplex(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="메모 (교통, 채광, 관리비 등)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm md:col-span-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium md:col-span-2 disabled:opacity-50"
          >
            {loading ? "저장 중..." : "기록 추가하기"}
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow p-5 mb-8 text-sm text-gray-500 text-center">
          기록을 남기려면 구글 로그인이 필요해요.
        </div>
      )}

      {/* 기록 목록 */}
      <div className="space-y-4">
        {records.length === 0 && (
          <p className="text-gray-400 text-sm">아직 등록된 기록이 없어요.</p>
        )}
        {records.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-lg shadow p-5 flex justify-between items-start"
          >
            <div>
              <h3 className="font-semibold text-lg mb-1">{r.complex}</h3>
              <p className="text-gray-600 text-sm">{r.note}</p>
            </div>
            <div className="text-right text-sm text-gray-400 whitespace-nowrap ml-4">
              <p>{r.visit_date}</p>
              <p className="text-emerald-700 font-medium">{r.visitor}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}