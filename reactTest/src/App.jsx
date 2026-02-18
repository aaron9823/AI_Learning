import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import MovieCard from './MovieCard'
import { fetchMoviesData } from './api/moviesApi'
import './App.css'
import TipCalculator from './HookTest'

function App() {
  const [count, setCount] = useState(0)
  const [movieList, setMovieList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchMoviesData()
        setMovieList(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadMovies()
  }, [])

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie)
    console.log('선택된 영화:', movie)
  }

  return (
    <>
      <nav style={{ marginBottom: '20px', borderBottom: '2px solid #667eea', padding: '10px 0' }}>
        <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', justifyContent: 'center' }}>
          <li>
            <button
              onClick={() => setCurrentPage('home')}
              style={{
                cursor: 'pointer',
                backgroundColor: currentPage === 'home' ? '#667eea' : 'transparent',
                color: currentPage === 'home' ? 'white' : '#667eea',
                border: '2px solid #667eea',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentPage('tip-calculator')}
              style={{
                cursor: 'pointer',
                backgroundColor: currentPage === 'tip-calculator' ? '#667eea' : 'transparent',
                color: currentPage === 'tip-calculator' ? 'white' : '#667eea',
                border: '2px solid #667eea',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            >
              Tip Calculator
            </button>
          </li>
        </ul>
      </nav>

      {currentPage === 'home' && (
        <>
          <div>
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>Vite + React</h1>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
            <p>
              Edit <code>src/App.jsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <h2>Featured Movies</h2>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', padding: '20px' }}>
              {loading && <p>로딩 중...</p>}
              {error && <p style={{ color: 'red' }}>에러: {error}</p>}
              {!loading && !error && <MovieCard movieList={movieList} onMovieSelect={handleMovieSelect} />}
            </div>
          </div>

          {selectedMovie && (
            <div style={{ marginTop: '40px', textAlign: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', maxWidth: '600px', margin: '40px auto' }}>
              <h3 style={{ color: '#000' }}>선택된 영화</h3>
              <p style={{ color: '#000' }}><strong>제목:</strong> {selectedMovie.title}</p>
              <p style={{ color: '#000' }}><strong>설명:</strong> {selectedMovie.description}</p>
              <p style={{ color: '#000' }}><strong>별점:</strong> {'⭐'.repeat(selectedMovie.rating)}</p>
              <button onClick={() => setSelectedMovie(null)} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '4px' }}>
                닫기
              </button>
            </div>
          )}
        </>
      )}

      {currentPage === 'tip-calculator' && <TipCalculator />}
    </>
  )
}

export default App
