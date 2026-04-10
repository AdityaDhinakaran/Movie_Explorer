import { useEffect, useState } from "react"
import "./App.css"

const API_KEY = "785e0938"
const BASE_URL = "https://www.omdbapi.com/"

function App()
{
  let [movies,setMovies] = useState([])
  let [loading,setLoading] = useState(true)

  let [query,setQuery] = useState("")
  let [filter,setFilter] = useState("all")
  let [sort,setSort] = useState("")

  useEffect(() => {
    // Fetch a default set of movies (e.g., "Avengers") since OMDb requires a query
    fetch(`${BASE_URL}?s=Avengers&apikey=${API_KEY}`)
      .then(res => res.json())
      .then(async data => {
        if (data && data.Search) {
          // Fetch details for each movie to get ratings
          const detailPromises = data.Search.slice(0, 10).map(m =>
            fetch(`${BASE_URL}?i=${m.imdbID}&apikey=${API_KEY}`).then(res => res.json())
          )
          const details = await Promise.all(detailPromises)
          
          const mappedMovies = details.map(m => ({
            id: m.imdbID,
            title: m.Title,
            vote_average: m.imdbRating !== "N/A" ? parseFloat(m.imdbRating) : 0,
            poster_path: m.Poster !== "N/A" ? m.Poster : null
          }))
          setMovies(mappedMovies)
        } else {
          setMovies([
            { id: 1, title: "Demo Movie 1", vote_average: 8.2, poster_path: null },
            { id: 2, title: "Demo Movie 2", vote_average: 7.5, poster_path: null }
          ])
        }
        setLoading(false)
      })
      .catch(() => {
        setMovies([
          { id: 1, title: "Demo Movie 1", vote_average: 8.2, poster_path: null },
          { id: 2, title: "Demo Movie 2", vote_average: 7.5, poster_path: null }
        ])
        setLoading(false)
      })
  }, [])

  function searchMovie() {
    if (!query) return
    setLoading(true)

    fetch(`${BASE_URL}?s=${query}&apikey=${API_KEY}`)
      .then(res => res.json())
      .then(async data => {
        if (data && data.Search) {
          // Fetch details for each movie to get ratings
          const detailPromises = data.Search.slice(0, 10).map(m =>
            fetch(`${BASE_URL}?i=${m.imdbID}&apikey=${API_KEY}`).then(res => res.json())
          )
          const details = await Promise.all(detailPromises)

          const mappedMovies = details.map(m => ({
            id: m.imdbID,
            title: m.Title,
            vote_average: m.imdbRating !== "N/A" ? parseFloat(m.imdbRating) : 0,
            poster_path: m.Poster !== "N/A" ? m.Poster : null
          }))
          setMovies(mappedMovies)
        } else {
          setMovies([])
        }
        setLoading(false)
      })
      .catch(() => {
        setMovies([])
        setLoading(false)
      })
  }

  let filtered = movies.filter((m)=>{
    if(filter==="high") return m.vote_average>7
    return true
  })

  let sorted = [...filtered]

  if(sort==="asc")
  {
    sorted.sort((a,b)=>a.vote_average-b.vote_average)
  }
  else if(sort==="desc")
  {
    sorted.sort((a,b)=>b.vote_average-a.vote_average)
  }

  return (
    <div>

      <h1>Movie Explorer</h1>

      <div className="controls">

        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
        />

        <button onClick={searchMovie}>Search</button>

        <select onChange={(e)=>setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="high">Rating {'>'} 7</option>
        </select>

        <select onChange={(e)=>setSort(e.target.value)}>
          <option value="">Sort</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>

      </div>

      {loading && <h2 style={{textAlign:"center"}}>Loading...</h2>}

      <div className="movie-container">
        {sorted.map((m)=>{

          return (
            <div className="card" key={m.id}>

              <img
                src={
                  m.poster_path
                    ? m.poster_path
                    : "https://via.placeholder.com/200?text=No+Poster"
                }
                alt={m.title}
              />

              <h3>{m.title}</h3>
              <p>⭐ {m.vote_average}</p>

            </div>
          )
        })}
      </div>

    </div>
  )
}

export default App