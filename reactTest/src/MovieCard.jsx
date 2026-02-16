import './MovieCard.css'

function MovieCard({ movieList, onMovieSelect }) {
  return (
    <>
      {movieList.map((movie, index) => (
        <div 
          key={index} 
          className="movie-card"
          onClick={() => onMovieSelect(movie)}
        >
          <div className="poster-container">
            <img src={movie.poster} alt={movie.title} className="poster" />
          </div>
          <div className="movie-info">
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-description">{movie.description}</p>
            <div className="rating">
              <span className="stars">{'⭐'.repeat(movie.rating)}</span>
              <span className="rating-value">별점 {movie.rating}점</span>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default MovieCard