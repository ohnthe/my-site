"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Record = {
  id: number;
  complex: string;
  note: string;
  visitor: string;
  visit_date: string;
};

export default function Records() {
  const [records, setRecords] = useState<Record[]>([]);
  const [complex, setComplex] = useState("");
  const [note, setNote] = useState("");
  const [visitor, setVisitor] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!complex || !visitor || !visitDate) return;

    setLoading(true);
    const { error } = await supabase.from("records").insert([
      { complex, note, visitor, visit_date: visitDate },
    ]);
    setLoading(false);

    if (error) {
      alert("저장 중 오류가 발생했어요: " + error.message);
      return;
    }

    // 입력창 초기화 + 목록 새로고침
    setComplex("");
    setNote("");
    setVisitor("");
    setVisitDate("");
    fetchRecords();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-12 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">임장기록</h1>

      {/* 새 기록 입력 폼 */}
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
          type="text"
          placeholder="작성자 이름"
          value={visitor}
          onChange={(e) => setVisitor(e.target.value)}
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