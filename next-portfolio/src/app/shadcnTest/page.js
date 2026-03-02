"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Checkbox,
} from "@/components/ui/checkbox"

export default function ShadcnTest() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    category: "",
    interests: [],
    experience: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, id]
        : prev.interests.filter(item => item !== id)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const submissionText = `
폼 제출 완료!

이름: ${formData.name || "입력 안 됨"}
이메일: ${formData.email || "입력 안 됨"}
메시지: ${formData.message || "입력 안 됨"}
카테고리: ${formData.category || "선택 안 함"}
관심사: ${formData.interests.length > 0 ? formData.interests.join(", ") : "선택 안 함"}
경험 수준: ${formData.experience || "선택 안 함"}
    `
    alert(submissionText)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Shadcn UI 컴포넌트 테스트</h1>
        
        {/* Dialog 섹션 */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Dialog</h2>
          <Dialog>
            <DialogTrigger className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Dialog 열기
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
                <DialogDescription>
                  이 작업은 되돌릴 수 없습니다. 계정이 영구적으로 삭제되고 
                  서버에서 모든 데이터가 제거됩니다.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        {/* 폼 필드 섹션 */}
        <form onSubmit={handleSubmit} className="mb-12 bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">폼 필드 예제</h2>
          
          {/* 텍스트 입력 필드 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">이름</label>
            <input
              type="text"
              name="name"
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 이메일 입력 필드 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">이메일</label>
            <input
              type="email"
              name="email"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 텍스트 영역 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">메시지</label>
            <textarea
              name="message"
              placeholder="메시지를 입력하세요"
              rows="4"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* 셀렉트 필드 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">카테고리 선택</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">선택하세요</option>
              <option value="기술">기술</option>
              <option value="디자인">디자인</option>
              <option value="마케팅">마케팅</option>
              <option value="기타">기타</option>
            </select>
          </div>

          {/* 체크박스 그룹 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-700">관심사 선택</label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="interest1"
                  checked={formData.interests.includes("interest1")}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="interest1" className="ml-2 text-sm text-gray-700 cursor-pointer">
                  웹 개발
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="interest2"
                  checked={formData.interests.includes("interest2")}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="interest2" className="ml-2 text-sm text-gray-700 cursor-pointer">
                  모바일 개발
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="interest3"
                  checked={formData.interests.includes("interest3")}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="interest3" className="ml-2 text-sm text-gray-700 cursor-pointer">
                  데이터 분석
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="interest4"
                  checked={formData.interests.includes("interest4")}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="interest4" className="ml-2 text-sm text-gray-700 cursor-pointer">
                  AI/머신러닝
                </label>
              </div>
            </div>
          </div>

          {/* 라디오 버튼 그룹 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-700">경험 수준</label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="level1"
                  name="experience"
                  value="초급"
                  checked={formData.experience === "초급"}
                  onChange={handleInputChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="level1" className="ml-2 text-sm text-gray-700 cursor-pointer">
                  초급
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="level2"
                  name="experience"
                  value="중급"
                  checked={formData.experience === "중급"}
                  onChange={handleInputChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="level2" className="ml-2 text-sm text-gray-700 cursor-pointer">
                  중급
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="level3"
                  name="experience"
                  value="고급"
                  checked={formData.experience === "고급"}
                  onChange={handleInputChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="level3" className="ml-2 text-sm text-gray-700 cursor-pointer">
                  고급
                </label>
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button 
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            제출
          </button>
        </form>

        {/* Drawer 섹션 */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Drawer</h2>
          
          {/* Drawer 1: 메뉴 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">네비게이션 메뉴</h3>
            <Drawer>
              <DrawerTrigger className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                메뉴 열기
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>네비게이션</DrawerTitle>
                  <DrawerDescription>원하는 페이지를 선택하세요</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-2">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">홈</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">소개</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">서비스</button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded">연락처</button>
                </div>
                <DrawerClose className="w-full px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors">
                  닫기
                </DrawerClose>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Drawer 2: 필터 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">검색 필터</h3>
            <Drawer>
              <DrawerTrigger className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
                필터 설정
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>필터 옵션</DrawerTitle>
                  <DrawerDescription>검색 결과를 필터링합니다</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block font-semibold mb-2">카테고리</label>
                    <select className="w-full p-2 border rounded">
                      <option>전체</option>
                      <option>기술</option>
                      <option>디자인</option>
                      <option>마케팅</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">가격대</label>
                    <select className="w-full p-2 border rounded">
                      <option>전체</option>
                      <option>~10만원</option>
                      <option>10~50만원</option>
                      <option>50만원 이상</option>
                    </select>
                  </div>
                </div>
                <DrawerClose className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors m-4">
                  적용하기
                </DrawerClose>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Drawer 3: 정보 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">상세 정보</h3>
            <Drawer>
              <DrawerTrigger className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors">
                정보 보기
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>상세 정보</DrawerTitle>
                  <DrawerDescription>추가 정보를 확인할 수 있습니다</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-4">
                  <div className="bg-blue-50 p-4 rounded">
                    <h4 className="font-semibold mb-2">특징 1</h4>
                    <p className="text-gray-700">이것은 첫 번째 특징입니다.</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded">
                    <h4 className="font-semibold mb-2">특징 2</h4>
                    <p className="text-gray-700">이것은 두 번째 특징입니다.</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded">
                    <h4 className="font-semibold mb-2">특징 3</h4>
                    <p className="text-gray-700">이것은 세 번째 특징입니다.</p>
                  </div>
                </div>
                <DrawerClose className="w-full px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors m-4">
                  닫기
                </DrawerClose>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
}