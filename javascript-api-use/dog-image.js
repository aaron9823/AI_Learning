// 강아지 API 주소
const DOG_API_URL = 'https://dog.ceo/api/breeds/image/random';

// HTML 요소들을 변수에 저장
const dogImage = document.getElementById('dogImage');

const loadingText = document.getElementById('loadingText');
const fetchButton = document.getElementById('fetchButton');

// 강아지 사진을 가져오는 비동기 함수
async function fetchDogImage() {
    // 버튼 비활성화 (중복 클릭 방지)
    fetchButton.disabled = true;
    // 이전 사진 숨기기
    dogImage.classList.remove('loaded');
    // 로딩 텍스트 보이기
    loadingText.classList.add('show');

    try {
        // API에 요청 보내기
        const response = await fetch(DOG_API_URL);
        // 응답을 JSON 형식으로 변환
        const data = await response.json();
        
        // API 응답이 성공인 경우
        if (data.status === 'success') {
            // 받은 이미지 URL을 img 태그에 설정
            dogImage.src = data.message;
            // 사진 표시하기
            dogImage.classList.add('loaded');
        } else {
            // 실패 시 알림 표시
            alert('강아지 사진을 불러올 수 없습니다.');
        }
    } catch (error) {
        // 네트워크 오류 등의 예외 처리
        console.error('API 호출 오류:', error);
        alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        // 로딩이 완료되었으므로 로딩 텍스트 숨기기
        loadingText.classList.remove('show');
        // 버튼 다시 활성화
        fetchButton.disabled = false;
    }
}

// 버튼 클릭 시 강아지 사진 가져오기
fetchButton.addEventListener('click', fetchDogImage);

// 페이지 로드 시 자동으로 강아지 사진 로드
window.addEventListener('load', fetchDogImage);
