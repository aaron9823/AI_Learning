"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Zod 검증 스키마
const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, "닉네임은 2~20자 사이여야 합니다.")
    .max(20, "닉네임은 2~20자 사이여야 합니다."),
  email: z
    .string()
    .email("유효한 이메일 주소를 입력해주세요."),
  password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
  phone: z
    .string()
    .regex(/^[0-9\-\+\s\(\)]+$/, "유효한 전화번호 형식이 아닙니다.")
    .optional()
    .or(z.literal("")),
  experience: z
    .string()
    .refine((val) => val === "" || !isNaN(parseInt(val)), "숫자로 입력해주세요.")
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .url("유효한 URL 형식이 아닙니다.")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(160, "자기소개는 160자를 초과할 수 없습니다.")
    .optional()
    .or(z.literal("")),
  role: z
    .enum(["developer", "designer", "manager"], {
      errorMap: () => ({ message: "직업을 선택해주세요." }),
    }),
  resume_url: z
    .string()
    .optional()
    .or(z.literal("")),
  marketing_emails: z.boolean().default(false),
  theme: z.enum(["light", "dark", "system"]).default("system"),
});

// SWR fetcher 함수
const fetcher = (url) => {
  console.log(`🌐 실제 네트워크 요청 발생: ${url} (${new Date().toLocaleTimeString()})`);
  return fetch(url).then((res) => res.json());
};

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [profileId, setProfileId] = useState(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ── 로그인한 사용자 확인 ────────────────────────────────────────────
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          toast.error("로그인이 필요합니다.");
          router.push("/login");
          return;
        }

        setCurrentUserId(user.id);
      } catch (error) {
        console.error("인증 확인 오류:", error);
        toast.error("인증 중 오류가 발생했습니다.");
        router.push("/login");
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // ── SWR 데이터 패칭 (currentUserId가 있을 때만) ──────────────────────
  const { data, error, isLoading } = useSWR(
    currentUserId ? `/api/profiles?userId=${currentUserId}` : null,
    fetcher,
    {
      onSuccess: (data) =>
        console.log("✅ SWR 데이터 수신 (캐시 or 네트워크):", data),
      revalidateOnFocus: true,
      revalidateOnMount: true,
      dedupingInterval: 2000,
    }
  );

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      phone: "",
      experience: "",
      github: "",
      bio: "",
      role: "",
      resume_url: "",
      marketing_emails: false,
      theme: "system",
    },
  });

  // ── SWR로 받아온 데이터를 폼에 채워넣기 ──────────────────────────────
  useEffect(() => {
    if (data?.data) {
      // 배열인 경우 현재 사용자의 프로필 찾기
      if (Array.isArray(data.data)) {
        const userProfile = data.data.find(p => p.user_id === currentUserId);
        if (userProfile) {
          const { resume_url, ...dataWithoutResume } = userProfile;
          form.reset(dataWithoutResume);
          setProfileId(userProfile.id);
          setResumeFile(null);
        } else {
          // 현재 사용자의 프로필이 없으면 폼을 비우기
          form.reset({
            username: "",
            email: "",
            password: "",
            phone: "",
            experience: "",
            github: "",
            bio: "",
            role: "",
            resume_url: "",
            marketing_emails: false,
            theme: "system",
          });
          setProfileId(null);
          setResumeFile(null);
        }
      } else {
        // 단일 객체인 경우
        if (data.data.user_id === currentUserId) {
          const { resume_url, ...dataWithoutResume } = data.data;
          form.reset(dataWithoutResume);
          setProfileId(data.data.id);
          setResumeFile(null);
        } else {
          // user_id가 일치하지 않으면 폼을 비우기
          form.reset({
            username: "",
            email: "",
            password: "",
            phone: "",
            experience: "",
            github: "",
            bio: "",
            role: "",
            resume_url: "",
            marketing_emails: false,
            theme: "system",
          });
          setProfileId(null);
          setResumeFile(null);
        }
      }
    }
  }, [data, form, currentUserId]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 유형 검증 (PDF, DOC, DOCX)
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("파일 형식 오류", {
        description: "PDF, DOC, DOCX 파일만 업로드 가능합니다.",
      });
      e.target.value = "";
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기 오류", {
        description: "파일 크기는 5MB 이하여야 합니다.",
      });
      e.target.value = "";
      return;
    }

    try {
      setIsUploadingResume(true);

      // 기존 파일 삭제
      const currentResumeUrl = form.getValues("resume_url");
      if (currentResumeUrl) {
        const fileName = currentResumeUrl.split("/").pop();
        try {
          await supabase.storage.from("resumes").remove([fileName]);
        } catch (err) {
          console.warn("기존 파일 삭제 중 오류:", err);
        }
      }

      // 새 파일 업로드
      const timestamp = Date.now();
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `${profileId || timestamp}_${safeFileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("업로드 에러 상세:", uploadError);

        if (uploadError.message?.includes("RLS") || uploadError.message?.includes("policy")) {
          throw new Error(
            "Storage RLS 정책이 설정되지 않았습니다. Supabase 대시보드에서 resumes 버킷의 정책을 확인하세요."
          );
        }

        throw uploadError;
      }

      // 공개 URL 획득
      const { data: publicUrlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) {
        throw new Error("공개 URL을 생성할 수 없습니다.");
      }

      form.setValue("resume_url", publicUrlData.publicUrl);
      setResumeFile({ name: file.name });
      toast.success("이력서 업로드 완료!", {
        description: file.name,
      });
    } catch (error) {
      console.error("업로드 실패 상세:", error);

      let errorMessage = error?.message || "이력서 업로드 중 오류가 발생했습니다.";

      if (errorMessage.includes("RLS")) {
        errorMessage =
          "Storage 권한이 없습니다. Supabase 대시보드의 Storage → Policies를 확인하세요.";
      } else if (errorMessage.includes("bucket")) {
        errorMessage = "resumes 버킷이 없습니다. Supabase에서 'resumes' 버킷을 생성하세요.";
      }

      toast.error("업로드 실패", {
        description: errorMessage,
      });
    } finally {
      setIsUploadingResume(false);
      e.target.value = "";
    }
  };

  const handleRemoveResume = async () => {
    try {
      const resumeUrl = form.getValues("resume_url");
      if (resumeUrl) {
        const fileName = resumeUrl.split("/").pop();
        try {
          await supabase.storage.from("resumes").remove([fileName]);
        } catch (err) {
          console.warn("파일 삭제 중 오류:", err);
        }
      }

      form.setValue("resume_url", "");
      setResumeFile(null);
      toast.success("이력서가 제거되었습니다.");
    } catch (error) {
      console.error("제거 실패:", error);
      toast.error("제거 실패", {
        description: "이력서 제거 중 오류가 발생했습니다.",
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = profileId
        ? { ...data, id: profileId, user_id: currentUserId }
        : { ...data, user_id: currentUserId };

      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "서버 오류가 발생했습니다.");
      }

      const json = await res.json();

      const successMessage = profileId ? "프로필 수정 완료!" : "프로필 생성 완료!";
      toast.success(successMessage, {
        description: `이메일: ${data.email} | 직업: ${getRoleLabel(data.role)}`,
      });

      if (!profileId && json.data && json.data.length > 0) {
        setProfileId(json.data[0].id);
      }

      if (!profileId) {
        form.reset();
      }
    } catch (error) {
      console.error("저장 실패 상세:", error);
      toast.error("저장 실패", {
        description: error?.message || "서버에 문제가 발생했습니다.",
      });
    }
  };

  const handleDelete = async () => {
    if (!profileId) return;

    if (!window.confirm("정말 프로필을 삭제하시겠습니까?")) {
      return;
    }

    try {
      // 이력서 파일 삭제
      const resumeUrl = form.getValues("resume_url");
      if (resumeUrl) {
        const fileName = resumeUrl.split("/").pop();
        await supabase.storage.from("resumes").remove([fileName]);
      }

      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", profileId);

      if (error) {
        throw error;
      }

      toast.success("프로필이 삭제되었습니다", {
        description: "모든 프로필 정보가 제거되었습니다.",
      });

      form.reset({
        username: "",
        email: "",
        password: "",
        phone: "",
        experience: "",
        github: "",
        bio: "",
        role: "",
        resume_url: "",
        marketing_emails: false,
        theme: "system",
      });
      setProfileId(null);
      setResumeFile(null);
    } catch (error) {
      console.error("삭제 실패:", error);
      toast.error("삭제 실패", {
        description: "프로필 삭제 중 오류가 발생했습니다.",
      });
    }
  };

  const getRoleLabel = (role) => {
    const roleMap = {
      developer: "개발자",
      designer: "디자이너",
      manager: "매니저",
    };
    return roleMap[role] || role;
  };

  const isSubmitting = form.formState.isSubmitting;

  // 인증 확인 중일 때
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-slate-600" />
          <p className="text-lg font-semibold text-slate-600">
            인증 정보를 확인하는 중...
          </p>
        </div>
      </div>
    );
  }

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-slate-600" />
          <p className="text-lg font-semibold text-slate-600">
            사용자 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-semibold">오류 발생</p>
            <p className="text-red-600 text-sm">{error.message || String(error)}</p>
          </div>
        )}

        <Card className="shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold">프로필 설정</CardTitle>
            <CardDescription>
              당신의 프로필 정보를 입력하고 관리하세요.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Username Field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        닉네임 *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="2~20자 사이의 닉네임을 입력하세요"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormDescription className="text-sm">
                        2자 이상 20자 이하의 닉네임을 설정하세요.
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        이메일 *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormDescription className="text-sm">
                        유효한 이메일 주소를 입력하세요.
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        비밀번호 *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="8자 이상의 비밀번호"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormDescription className="text-sm">
                        최소 8자 이상의 강력한 비밀번호를 설정하세요.
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Phone Field */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        전화번호
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+82-10-1234-5678"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormDescription className="text-sm">
                        연락 가능한 전화번호를 입력하세요. (선택사항)
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Experience Field */}
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        경력 년수
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="60"
                          placeholder="5"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormDescription className="text-sm">
                        현재까지의 경력을 년 단위로 입력하세요. (선택사항)
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* GitHub URL Field */}
                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        GitHub URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://github.com/username"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormDescription className="text-sm">
                        당신의 GitHub 프로필 링크를 입력하세요. (선택사항)
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Role Field */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        직업 *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="직업을 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="developer">개발자</SelectItem>
                          <SelectItem value="designer">디자이너</SelectItem>
                          <SelectItem value="manager">매니저</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-sm">
                        당신의 직업을 선택해주세요.
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Bio Field */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        자기소개
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="당신에 대해 간단히 소개해주세요 (선택사항)"
                          {...field}
                          className="resize-none min-h-[100px]"
                        />
                      </FormControl>
                      <div className="flex justify-between items-center text-sm">
                        <FormDescription>
                          최대 160자까지 입력 가능합니다.
                        </FormDescription>
                        <span className="text-xs text-slate-500">
                          {field.value?.length || 0}/160
                        </span>
                      </div>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Resume Upload Field */}
                <div className="space-y-3">
                  <label className="text-base font-semibold">
                    이력서 (선택사항)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      disabled={isUploadingResume}
                      className="hidden"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      {isUploadingResume ? (
                        <>
                          <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                          <span className="text-sm text-slate-600">
                            업로드 중...
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-slate-400" />
                          <span className="text-sm font-medium text-slate-700">
                            클릭하여 파일 선택
                          </span>
                          <span className="text-xs text-slate-500">
                            PDF, DOC, DOCX (최대 5MB)
                          </span>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Uploaded Resume Display */}
                  {resumeFile && (
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-xs font-bold text-red-600">
                          PDF
                        </div>
                        <span className="text-sm font-medium text-slate-700 truncate">
                          {resumeFile.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveResume}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-slate-500">
                    이력서를 업로드하면 프로필과 함께 저장됩니다.
                  </p>
                </div>

                {/* Theme Field */}
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold">
                        테마 선택
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="light" id="light" />
                            <FormLabel
                              htmlFor="light"
                              className="font-normal cursor-pointer"
                            >
                              라이트 모드
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dark" id="dark" />
                            <FormLabel
                              htmlFor="dark"
                              className="font-normal cursor-pointer"
                            >
                              다크 모드
                            </FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="system" id="system" />
                            <FormLabel
                              htmlFor="system"
                              className="font-normal cursor-pointer"
                            >
                              시스템 설정 따르기
                            </FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormDescription className="text-sm">
                        선호하는 테마를 선택하세요.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* Marketing Emails Field */}
                <FormField
                  control={form.control}
                  name="marketing_emails"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-200 p-4 bg-slate-50">
                      <div className="space-y-1">
                        <FormLabel className="text-base font-semibold cursor-pointer">
                          마케팅 이메일 수신
                        </FormLabel>
                        <FormDescription className="text-sm">
                          새로운 기능, 제품 업데이트 및 프로모션에 대한 이메일을 받으시겠습니까?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex gap-3 pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-10 text-base font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        저장 중...
                      </>
                    ) : (
                      "프로필 저장"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={isSubmitting}
                    className="flex-1 h-10 text-base font-semibold"
                  >
                    초기화
                  </Button>
                </div>

                {/* Delete Button - Only show if profileId exists */}
                {profileId && (
                  <div className="pt-4 border-t border-slate-200">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isSubmitting}
                      className="w-full h-10 text-base font-semibold"
                    >
                      프로필 삭제
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}