"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // 초기 세션 가져오기
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 실시간 인증 상태 변경 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // 메모리 누수 방지를 위한 unsubscribe
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast.success("로그아웃되었습니다.");
      router.push("/login");
    } catch (error) {
      console.error("로그아웃 오류:", error);
      toast.error(error.message || "로그아웃 중 오류가 발생했습니다.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
      <Link href="/" className="font-bold text-lg">
        Next Portfolio
      </Link>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link
              href="/todos"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              📝 TODO
            </Link>
            <Link
              href="/forms"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              프로필 폼
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-sm font-medium px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                "로그아웃"
              )}
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-700 transition-colors"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}