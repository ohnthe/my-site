"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type RequestItem = {
  id: number;
  title: string;
  author: string;
  votes: number;
};

export default function Requests() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [votedIds, setVotedIds] = useState<number[]>([]);

  // 로그인 상태 확인
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("votes", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setRequests(data as RequestItem[]);
    }
  };

  useEffect(() => {
    fetchRequests();
    const saved = localStorage.getItem("votedRequestIds");
    if (saved) {
      setVotedIds(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title) return;

    const authorName = user.user_metadata?.full_name || user.email || "익명";

    setLoading(true);
    const { error } = await supabase.from("requests").insert([
      { title, author: authorName },
    ]);
    setLoading(false);

    if (error) {
      alert("등록 중 오류가 발생했어요: " + error.message);
      return;
    }

    setTitle("");
    fetchRequests();
  };

  const handleVote = async (id: number, currentVotes: number) => {
    if (!user) {
      alert("투표하려면 구글 로그인이 필요해요.");
      return;
    }

    const alreadyVoted = votedIds.includes(id);
    const newVotes = alreadyVoted ? currentVotes - 1 : currentVotes + 1;

    const { error } = await supabase
      .from("requests")
      .update({ votes: newVotes })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    const updatedVotedIds = alreadyVoted
      ? votedIds.filter((v) => v !== id)
      : [...votedIds, id];

    setVotedIds(updatedVotedIds);
    localStorage.setItem("votedRequestIds", JSON.stringify(updatedVotedIds));
    fetchRequests();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-12 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">임장요청</h1>

      {user ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-5 mb-8 flex flex-col md:flex-row gap-4"
        >
          <input
            type="text"
            placeholder="가보고 싶은 지역을 제안해보세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm flex-1"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? "등록 중..." : "요청 등록하기"}
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-lg shadow p-5 mb-8 text-sm text-gray-500 text-center">
          요청을 등록하려면 구글 로그인이 필요해요.
        </div>
      )}

      <div className="space-y-4">
        {requests.length === 0 && (
          <p className="text-gray-400 text-sm">아직 등록된 요청이 없어요.</p>
        )}
        {requests.map((r) => {
          const voted = votedIds.includes(r.id);
          return (
            <div
              key={r.id}
              className="bg-white rounded-lg shadow p-5 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg mb-1">{r.title}</h3>
                <p className="text-gray-400 text-sm">{r.author}</p>
              </div>
              <button
                onClick={() => handleVote(r.id, r.votes)}
                className={`font-bold text-lg rounded-lg px-3 py-1 transition ${
                  voted
                    ? "bg-emerald-700 text-white"
                    : "text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                👍 {r.votes}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}