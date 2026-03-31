'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, Trash2, Edit2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export default function TodosPage() {
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deletingTodoId, setDeletingTodoId] = useState(null);
  const [formData, setFormData] = useState({ text: '', completed: false });
  const [currentUserId, setCurrentUserId] = useState(null);

  // ── 초기화 및 사용자 확인 ────────────────────────────────────────────
  useEffect(() => {
    const initializePage = async () => {
      try {
        setIsLoading(true);

        // 현재 로그인한 사용자 정보 가져오기
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          toast.error('로그인이 필요합니다.');
          router.push('/login');
          return;
        }

        setCurrentUserId(user.id);
        // 로그인한 사용자의 TODO만 조회
        await fetchTodos(user.id);
      } catch (error) {
        console.error('초기화 오류:', error);
        toast.error('초기화 중 오류가 발생했습니다.');
      }
    };

    initializePage();
  }, []);

  // ── TODO 리스트 조회 (userId로 필터링) ──────────────────────────────
  const fetchTodos = async (userId) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/todos?userId=${userId}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'TODO 조회 실패');
      }

      setTodos(json.data || []);
    } catch (error) {
      console.error('TODO 조회 오류:', error);
      toast.error(error.message || 'TODO를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── TODO 생성 ────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!formData.text.trim()) {
      toast.error('TODO 내용을 입력해주세요.');
      return;
    }

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUserId,
          text: formData.text.trim(),
          completed: false,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'TODO 생성 실패');
      }

      setTodos([json.data, ...todos]);
      setFormData({ text: '', completed: false });
      setIsDialogOpen(false);

      toast.success('TODO가 생성되었습니다.');
    } catch (error) {
      console.error('TODO 생성 오류:', error);
      toast.error(error.message || 'TODO를 생성하지 못했습니다.');
    }
  };

  // ── TODO 수정 ────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!formData.text.trim()) {
      toast.error('TODO 내용을 입력해주세요.');
      return;
    }

    try {
      const res = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTodo.id,
          text: formData.text.trim(),
          completed: formData.completed,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'TODO 수정 실패');
      }

      setTodos(
        todos.map((todo) => (todo.id === editingTodo.id ? json.data : todo))
      );
      setFormData({ text: '', completed: false });
      setEditingTodo(null);
      setIsDialogOpen(false);

      toast.success('TODO가 수정되었습니다.');
    } catch (error) {
      console.error('TODO 수정 오류:', error);
      toast.error(error.message || 'TODO를 수정하지 못했습니다.');
    }
  };

  // ── TODO 삭제 ────────────────────────────────────────────────────────
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/todos?id=${deletingTodoId}`, {
        method: 'DELETE',
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'TODO 삭제 실패');
      }

      setTodos(todos.filter((todo) => todo.id !== deletingTodoId));
      setIsDeleteDialogOpen(false);
      setDeletingTodoId(null);

      toast.success('TODO가 삭제되었습니다.');
    } catch (error) {
      console.error('TODO 삭제 오류:', error);
      toast.error(error.message || 'TODO를 삭제하지 못했습니다.');
    }
  };

  // ── 완료 상태 토글 ──────────────────────────────────────────────────
  const toggleCompleted = async (todo) => {
    try {
      const res = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: todo.id,
          text: todo.text,
          completed: !todo.completed,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || '상태 업데이트 실패');
      }

      setTodos(todos.map((t) => (t.id === todo.id ? json.data : t)));

      toast.success(
        todo.completed ? 'TODO를 미완료 처리했습니다.' : 'TODO를 완료 처리했습니다.'
      );
    } catch (error) {
      console.error('상태 업데이트 오류:', error);
      toast.error(error.message || '상태를 업데이트하지 못했습니다.');
    }
  };

  // ── 편집 모드 열기 ──────────────────────────────────────────────────
  const openEditDialog = (todo) => {
    setEditingTodo(todo);
    setFormData({ text: todo.text, completed: todo.completed });
    setIsDialogOpen(true);
  };

  // ── 생성 모드 열기 ──────────────────────────────────────────────────
  const openCreateDialog = () => {
    setEditingTodo(null);
    setFormData({ text: '', completed: false });
    setIsDialogOpen(true);
  };

  // ── 포맷팅 함수 ────────────────────────────────────────────────────
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* ── 헤더 ──────────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            📝 TODO 관리
          </h1>
          <p className="text-slate-600">
            할 일을 추가하고 관리하세요. 완료된 항목을 체크하면 자동으로 표시됩니다.
          </p>
        </div>

        {/* ── 생성 버튼 ──────────────────────────────────────────────── */}
        <div className="mb-6">
          <Button
            onClick={openCreateDialog}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            새 TODO 추가
          </Button>
        </div>

        {/* ── TODO 리스트 테이블 ────────────────────────────────────── */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-slate-600">TODO를 불러오는 중...</span>
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">
                아직 TODO가 없습니다. 새로운 TODO를 추가해보세요!
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50 border-b">
                <TableRow>
                  <TableHead className="w-12">완료</TableHead>
                  <TableHead>내용</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>생성일</TableHead>
                  <TableHead>수정일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todos.map((todo) => (
                  <TableRow
                    key={todo.id}
                    className={`${
                      todo.completed ? 'bg-slate-50' : ''
                    } hover:bg-slate-100 transition-colors`}
                  >
                    {/* ── 완료 체크박스 ──────────────────────────────── */}
                    <TableCell>
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleCompleted(todo)}
                        className="cursor-pointer"
                      />
                    </TableCell>

                    {/* ── 내용 ───────────────────────────────────────── */}
                    <TableCell
                      className={`font-medium ${
                        todo.completed
                          ? 'line-through text-slate-400'
                          : 'text-slate-900'
                      }`}
                    >
                      {todo.text}
                    </TableCell>

                    {/* ── 상태 배지 ───────────────────────────────────── */}
                    <TableCell>
                      <Badge
                        className={`${
                          todo.completed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                        variant="outline"
                      >
                        {todo.completed ? '완료' : '진행중'}
                      </Badge>
                    </TableCell>

                    {/* ── 생성일 ───────────────────────────────────────── */}
                    <TableCell className="text-sm text-slate-500">
                      {formatDate(todo.created_at)}
                    </TableCell>

                    {/* ── 수정일 ───────────────────────────────────────── */}
                    <TableCell className="text-sm text-slate-500">
                      {formatDate(todo.updated_at)}
                    </TableCell>

                    {/* ── 액션 버튼 ───────────────────────────────────── */}
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(todo)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeletingTodoId(todo.id);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* ── 통계 ──────────────────────────────────────────────────── */}
        {todos.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
              <p className="text-slate-600 text-sm">전체 TODO</p>
              <p className="text-3xl font-bold text-slate-900">{todos.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
              <p className="text-slate-600 text-sm">완료됨</p>
              <p className="text-3xl font-bold text-green-600">
                {todos.filter((t) => t.completed).length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
              <p className="text-slate-600 text-sm">진행중</p>
              <p className="text-3xl font-bold text-yellow-600">
                {todos.filter((t) => !t.completed).length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── TODO 생성/수정 Dialog ────────────────────────────────────── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTodo ? 'TODO 수정' : '새 TODO 추가'}
            </DialogTitle>
            <DialogDescription>
              {editingTodo
                ? 'TODO 내용을 수정하세요.'
                : '새로운 TODO를 추가하세요.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">
                TODO 내용
              </label>
              <Textarea
                placeholder="할 일을 입력하세요..."
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                className="min-h-24 resize-none"
              />
            </div>

            {editingTodo && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="completed"
                  checked={formData.completed}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, completed: checked })
                  }
                />
                <label
                  htmlFor="completed"
                  className="text-sm font-medium text-slate-900 cursor-pointer"
                >
                  완료됨
                </label>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              onClick={editingTodo ? handleUpdate : handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {editingTodo ? '수정' : '추가'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── 삭제 확인 Dialog ────────────────────────────────────────── */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>TODO를 삭제하시겠어요?</AlertDialogTitle>
            <AlertDialogDescription>
              삭제된 TODO는 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}