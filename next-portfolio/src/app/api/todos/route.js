import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - userId로 필터링된 TODO 조회
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const id = searchParams.get("id");

    // 특정 TODO 조회
    if (id) {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return NextResponse.json({ data }, { status: 200 });
    }

    // userId가 없으면 에러
    if (!userId) {
      return NextResponse.json(
        { error: "사용자 ID가 필요합니다" },
        { status: 400 }
      );
    }

    // 로그인한 사용자의 TODO만 조회
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("GET /api/todos 오류:", error);
    return NextResponse.json(
      { error: error.message || "TODO 조회 실패" },
      { status: 500 }
    );
  }
}

// POST - 새로운 TODO 생성
export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, text, completed } = body;

    // 유효성 검사
    if (!user_id) {
      return NextResponse.json(
        { error: "사용자 ID는 필수입니다" },
        { status: 400 }
      );
    }

    if (!text || text.trim() === "") {
      return NextResponse.json(
        { error: "내용(text)은 필수입니다" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("todos")
      .insert([
        {
          user_id: user_id,
          text: text.trim(),
          completed: completed || false,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ data: data[0] }, { status: 201 });
  } catch (error) {
    console.error("POST /api/todos 오류:", error);
    return NextResponse.json(
      { error: error.message || "TODO 생성 실패" },
      { status: 500 }
    );
  }
}

// PUT/PATCH - TODO 수정
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, text, completed } = body;

    if (!id) {
      return NextResponse.json(
        { error: "TODO ID는 필수입니다" },
        { status: 400 }
      );
    }

    const updateData = {};
    if (text !== undefined) updateData.text = text.trim();
    if (completed !== undefined) updateData.completed = completed;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("todos")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw error;

    if (data.length === 0) {
      return NextResponse.json(
        { error: "해당 TODO를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: data[0] }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/todos 오류:", error);
    return NextResponse.json(
      { error: error.message || "TODO 수정 실패" },
      { status: 500 }
    );
  }
}

// DELETE - TODO 삭제
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "TODO ID는 필수입니다" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;

    if (data.length === 0) {
      return NextResponse.json(
        { error: "해당 TODO를 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "TODO가 삭제되었습니다", data: data[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/todos 오류:", error);
    return NextResponse.json(
      { error: error.message || "TODO 삭제 실패" },
      { status: 500 }
    );
  }
}