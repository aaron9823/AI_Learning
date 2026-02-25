export default function About() {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>About Me</h1>
      
      <section style={{ marginBottom: '30px' }}>
        <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#333' }}>
          안녕하세요 AARON입니다.
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555' }}>
          저는 풀스택 개발자로서 React, Next.js, JavaScript를 중심으로 웹 애플리케이션을 개발하고 있습니다. 
          사용자 경험을 중시하며 깔끔하고 효율적인 코드 작성을 목표로 하고 있습니다.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '15px' }}>기술 스택</h2>
        <ul style={{ fontSize: '16px', lineHeight: '1.8', color: '#555' }}>
          <li>Frontend: React, Next.js, JavaScript, CSS</li>
          <li>Backend: Node.js, Express</li>
          <li>Tools: Git, VSCode</li>
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: '28px', marginBottom: '15px' }}>관심사</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555' }}>
          새로운 기술 학습, 웹 성능 최적화, UI/UX 개선에 관심이 있습니다.
        </p>
      </section>
    </div>
  );
}
