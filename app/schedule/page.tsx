"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type ScheduleItem = {
  id: number;
  visit_date: string;
  visit_time: string;
  area: string;
  status: string;
  created_by: string | null;
};

export default function Schedule() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editArea, setEditArea] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const fetchSchedules = async () => {
    const { data, error } = await supabase
      .from("schedule")
      .select("*")
      .order("visit_date", { ascending: true });

    if (error) {
      console.error(error);
    } else {
      setSchedules(data as ScheduleItem[]);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const requireLogin = () => {
    if (!user) {
      alert("이 작업을 하려면 구글 로그인이 필요해요.");
      return true;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !visitDate || !visitTime || !area) return;

    const creatorName = user.user_metadata?.full_name || user.email || "익명";

    setLoading(true);
    const { error } = await supabase.from("schedule").insert([
      {
        visit_date: visitDate,
        visit_time: visitTime,
        area,
        status: "예정",
        created_by: creatorName,
      },
    ]);
    setLoading(false);

    if (error) {
      alert("등록 중 오류가 발생했어요: " + error.message);
      return;
    }

    setVisitDate("");
    setVisitTime("");
    setArea("");
    fetchSchedules();
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    if (requireLogin()) return;
    const newStatus = currentStatus === "예정" ? "완료" : "예정";
    const { error } = await supabase
      .from("schedule")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }
    fetchSchedules();
  };

  const handleDelete = async (id: number) => {
    if (requireLogin()) return;
    const confirmed = window.confirm("이 일정을 삭제하시겠어요?");
    if (!confirmed) return;

    const { error } = await supabase.from("schedule").delete().eq("id", id);
    if (error) {
      alert("삭제 중 오류가 발생했어요: " + error.message);
      return;
    }
    fetchSchedules();
  };

  const startEdit = (s: ScheduleItem) => {
    if (requireLogin()) return;
    setEditingId(s.id);
    setEditDate(s.visit_date);
    setEditTime(s.visit_time);
    setEditArea(s.area);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: number) => {
    if (requireLogin()) return;
    const { error } = await supabase
      .from("schedule")
      .update({ visit_date: editDate, visit_time: editTime, area: editArea })
      .eq("id", id);

    if (error) {
      alert("수정 중 오류가 발생했어요: " + error.message);
      return;
    }
    setEditingId(null);
    fetchSchedules();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-12 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">임장일정</h1>

      {user ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-5 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="오전 10:00"
            value={visitTime}
            onChange={(e) => setVisitTime(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="지역 (예: 신촌 일대)"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? "등록 중..." : "일정 등록하기"}
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow p-5 mb-8 text-sm text-gray-500 text-center">
          일정을 등록하려면 구글 로그인이 필요해요.
        </div>
      )}

      <div className="space-y-4">
        {schedules.length === 0 && (
          <p className="text-gray-400 text-sm">아직 등록된 일정이 없어요.</p>
        )}
        {schedules.map((s) =>
          editingId === s.id ? (
            <div
              key={s.id}
              className="bg-white rounded-lg shadow p-5 grid grid-cols-1 md:grid-cols-4 gap-3 items-center"
            >
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={editArea}
                onChange={(e) => setEditArea(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit(s.id)}
                  className="bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                >
                  저장
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div
              key={s.id}
              className="bg-white rounded-lg shadow p-5 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-lg">{s.area}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {s.visit_date} · {s.visit_time}
                  {s.created_by && (
                    <span className="text-emerald-700"> · {s.created_by}</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStatus(s.id, s.status)}
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    s.status === "예정"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {s.status}
                </button>
                <button
                  onClick={() => startEdit(s)}
                  className="text-xs text-gray-400 hover:text-gray-600 px-2"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-xs text-red-400 hover:text-red-600 px-2"
                >
                  삭제
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}