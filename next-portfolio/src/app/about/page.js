'use client'

import Button from '../components/ui/button'

export default function About() {
  const handleClick = (variant) => {
    alert(`${variant} button clicked!`)
  }

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
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

      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '15px' }}>관심사</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#555' }}>
          새로운 기술 학습, 웹 성능 최적화, UI/UX 개선에 관심이 있습니다.
        </p>
      </section>

      {/* Button Variants Showcase */}
      <section style={{ marginTop: '50px', paddingTop: '30px', borderTop: '2px solid #e0e0e0' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Button Variants</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '30px' }}>
          <Button onClick={() => handleClick('Default')}>Default</Button>
          <Button variant="secondary" onClick={() => handleClick('Secondary')}>Secondary</Button>
          <Button variant="destructive" onClick={() => handleClick('Destructive')}>Destructive</Button>
          <Button variant="outline" onClick={() => handleClick('Outline')}>Outline</Button>
          <Button variant="ghost" onClick={() => handleClick('Ghost')}>Ghost</Button>
          <Button variant="link" onClick={() => handleClick('Link')}>Link</Button>
        </div>

        <h3 style={{ fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>Sizes</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px', alignItems: 'center' }}>
          <Button size="sm" onClick={() => handleClick('Small')}>Small</Button>
          <Button size="default" onClick={() => handleClick('Medium')}>Medium</Button>
          <Button size="lg" onClick={() => handleClick('Large')}>Large</Button>
          <Button size="icon" onClick={() => handleClick('Icon')}>🔍</Button>
        </div>

        <h3 style={{ fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>Disabled State</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>Outline Disabled</Button>
          <Button variant="secondary" disabled>Secondary Disabled</Button>
        </div>

        <h3 style={{ fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>Combinations</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <Button size="lg" onClick={() => handleClick('Primary Large')}>Primary Large</Button>
          <Button variant="secondary" size="sm" onClick={() => handleClick('Secondary Small')}>Secondary Small</Button>
          <Button variant="destructive" size="lg" onClick={() => handleClick('Delete')}>Delete</Button>
          <Button variant="ghost" size="sm" onClick={() => handleClick('Dismiss')}>Dismiss</Button>
        </div>
      </section>
    </div>
  )
}
