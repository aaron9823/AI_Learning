function Counter() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      console.log("1. 컴포넌트가 화면에 나타남 (마운트)");
      
      return () => {
        console.log("3. 컴포넌트가 화면에서 사라짐 (언마운트)");
      };
    }, []);
    
    return (
      <button onClick={() => setCount(count + 1)}>
        숫자: {count}
        {/* 2. 버튼을 누르면 상태 변경 (업데이트) */}
      </button>
    );
  }