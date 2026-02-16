import { moviesData } from '../data/moviesData'

export const fetchMoviesData = async () => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(moviesData)
      }, 500)
    })
  } catch (error) {
    console.error('영화 데이터 조회 실패:', error)
    throw error
  }
}