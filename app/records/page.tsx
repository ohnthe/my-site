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
  sido_name: string | null;
  sgg_name: string | null;
};

type Region = { sgg_code: string; sgg_name: string; sido_name: string };
type Apartment = { id: number; complex_name: string };

const SIDO_LIST = ["서울특별시", "경기도"];

export default function Records() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [records, setRecords] = useState<Record[]>([]);

  const [sido, setSido] = useState("");
  const [sggList, setSggList] = useState<Region[]>([]);
  const [sgg, setSgg] = useState("");
  const [aptList, setAptList] = useState<Apartment[]>([]);
  const [complex, setComplex] = useState("");

  const [note, setNote] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

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

  useEffect(() => {
    setSgg("");
    setSggList([]);
    setComplex("");
    setAptList([]);
    if (!sido) return;

    supabase
      .from("regions")
      .select("sgg_code, sgg_name, sido_name")
      .eq("sido_name", sido)
      .order("sgg_name", { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setSggList((data as Region[]) || []);
      });
  }, [sido]);

  useEffect(() => {
    setComplex("");
    setAptList([]);
    if (!sgg) return;

    supabase
      .from("apartments")
      .select("id, complex_name")
      .eq("sgg_code", sgg)
      .order("complex_name", { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setAptList((data as Apartment[]) || []);
      });
  }, [sgg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !complex || !visitDate) return;

    const visitorName = user.user_metadata?.full_name || user.email || "익명";
    const sggName = sggList.find((r) => r.sgg_code === sgg)?.sgg_name || null;

    setLoading(true);
    const { error } = await supabase.from("records").insert([
      {
        complex,
        note,
        visitor: visitorName,
        visit_date: visitDate,
        sido_name: sido || null,
        sgg_name: sggName,
      },
    ]);
    setLoading(false);

    if (error) {
      alert("저장 중 오류가 발생했어요: " + error.message);
      return;
    }

    setSido("");
    setNote("");
    setVisitDate("");
    fetchRecords();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-12 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">임장기록</h1>

      {user ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-5 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <select
            value={sido}
            onChange={(e) => setSido(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">시/도 선택</option>
            {SIDO_LIST.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={sgg}
            onChange={(e) => setSgg(e.target.value)}
            disabled={!sido}
            className="border rounded-lg px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="">시/군/구 선택</option>
            {sggList.map((r) => (
              <option key={r.sgg_code} value={r.sgg_code}>
                {r.sgg_name}
              </option>
            ))}
          </select>

          <select
            value={complex}
            onChange={(e) => setComplex(e.target.value)}
            disabled={!sgg}
            className="border rounded-lg px-3 py-2 text-sm md:col-span-2 disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="">아파트 단지 선택</option>
            {aptList.map((a) => (
              <option key={a.id} value={a.complex_name}>
                {a.complex_name}
              </option>
            ))}
          </select>

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
            className="border rounded-lg px-3 py-2 text-sm"
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
              {(r.sido_name || r.sgg_name) && (
                <p className="text-xs text-gray-400 mb-1">
                  {r.sido_name} {r.sgg_name}
                </p>
              )}
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