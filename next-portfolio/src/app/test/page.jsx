// components/Hero.js 
export  default  function  Hero ( ) { 
    return ( 
      <div className="bg-blue-500 text-white py-24"> 
        <div className="container mx-auto text-center"> 
          <h1 className="text-5xl font-bold">Tailwind CSS를 사용한 Next.js에 오신 것을 환영합니다.</h1> 
          <p className="mt-4 text-lg">아름답고 반응형 웹사이트를 그 어느 때보다 빠르게 구축하세요.</p> 
          <button className="mt-6 px-6 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-100"> 
            시작하기 
          </button> 
        </div> 
      </div> 
    ); 
  }