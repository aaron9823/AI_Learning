import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request) {
  try {
    // userId 쿼리 파라미터 받기
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // userId가 없으면 에러
    if (!userId) {
      return NextResponse.json(
        { error: "userId 파라미터가 필요합니다" },
        { status: 400 }
      );
    }

    // 로그인한 사용자의 프로필만 조회
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      // PGRST116은 데이터가 없을 때 발생하는 에러 (정상)
      if (error.code === "PGRST116") {
        return NextResponse.json({ data: null }, { status: 200 });
      }
      throw error;
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("GET /api/profiles 오류:", error);
    return NextResponse.json(
      { error: error.message || "프로필 조회 실패" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // user_id 필수 검증
    if (!body.user_id) {
      return NextResponse.json(
        { error: "user_id는 필수입니다" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("profiles")
      .upsert(body)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("POST /api/profiles 오류:", error);
    return NextResponse.json(
      { error: error.message || "프로필 저장 실패" },
      { status: 500 }
    );
  }
}