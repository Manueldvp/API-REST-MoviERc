
import { API_KEY } from "./private.mjs";

let language = navigator.language;
let page = 1;
let maxPage;

//Data

const API = axios.create({
    // URL base
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    // Query parameters
    params: {
        'api_key': API_KEY,
        'language': language,
    },
});

export function likedMoviesList() {
  const item = JSON.parse(localStorage.getItem('liked_movies'));
  let movies;


  if (item) {
    movies = item;
  }else {
    movies = {};
  }
  return movies;
}

export function likeMovie(movie) {
   const likedMovies = likedMoviesList();

   if (likedMovies[movie.id]) {
    likedMovies[movie.id] = undefined;
   }else {
    likedMovies[movie.id] = movie;
   }

  localStorage.setItem('liked_movies', JSON.stringify(likedMovies));

  getTrendingMoviesPreview();
  getLikedMovies();
}

// Utils

// const lazyLoader = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//         console.log(entry);
//        if (entry.isIntersecting) {
//         entry.target.setAttribute('loading', 'lazy')
//        }
//     })
// })

 
export function createMovies(movies, container, clean = true) {
    
    if (clean) {
      container.innerHTML = '';
    }
  
    movies.forEach(movie => {
      const movieContainer = document.createElement('div');
      movieContainer.classList.add('movie-container');
  
  
      const movieImg = document.createElement('img');
      movieImg.classList.add('movie-img');
      movieImg.setAttribute('alt', movie.title);
      movieImg.setAttribute(
        'src',
        'https://image.tmdb.org/t/p/w300' + movie.poster_path,
      );
      movieImg.setAttribute('loading', 'lazy');
      movieImg.addEventListener('click', () =>{
        location.hash = '#movie=' + movie.id;
      })
      movieImg.addEventListener('error', () => {
        movieImg.setAttribute(
          'src',
          'https://static.platzi.com/static/images/error/img404.png',
        );
      
      });
      const movieBtn = document.createElement('button');
      movieBtn.classList.add("movie-liked")
      likedMoviesList()[movie.id] && movieBtn.classList.add("movie-liked--btn")
      movieBtn.addEventListener('click', () => {
        movieBtn.classList.toggle("movie-liked--btn")
        likeMovie(movie);
    })

    //   lazyLoader.observe(movieImg)
  
      movieContainer.appendChild(movieImg);
      movieContainer.appendChild(movieBtn)
      container.appendChild(movieContainer);
    });
    
}

export function createCategories(categories, container) {

   container.innerHTML = '';
  
    categories.forEach(category => {  
      const categoryContainer = document.createElement('div');
      categoryContainer.classList.add('category-container');
  
      const categoryTitle = document.createElement('h3');
      categoryTitle.classList.add('category-title');
      categoryTitle.setAttribute('id', 'id' + category.id);
      categoryTitle.addEventListener('click', () => {
        location.hash = `#category=${category.id}-${category.name}`;
      });
      const categoryTitleText = document.createTextNode(category.name);
  
      categoryTitle.appendChild(categoryTitleText);
      categoryContainer.appendChild(categoryTitle);
      container.appendChild(categoryContainer);
    });
}



export async function getTrendingMoviesPreview() {
    // Endpoints
    const {data} = await API('trending/movie/day')

    //Arriba como se hace con Axios y abajo con fetch
    // const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
    // const data = await res.json();

    const movies = data.results;
    createMovies(movies, trendingMoviesPreviewList)

}

export async function getCategoriesPreview() {
    const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
    const data = await res.json();
    const category = data.genres;
    
    createCategories(category, categoriesPreviewList);
}


export async function getMoviesByCategory(id) {
    // Endpoints
    const {data} = await API('discover/movie', {
        params: {
          with_genres: id,
        }
    });

    //Arriba como se hace con Axios y abajo con fetch
    // const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
    // const data = await res.json();

    const categoryMovies = data.results;
    maxPage = data.total_pages
   
    createMovies(categoryMovies, genericSection);

}



export function getCategoryPaginatedMovies(id) {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight} = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight -15);

    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++ 
       const {data} = await API('discover/movie', {
        params: {
          with_genres: id,
          page,
          }
       });
      
      const categoryMovies = data.results;
      createMovies(categoryMovies, genericSection, false);
    }
  }
 
}

export async function getMoviesBySearch(query) {
    // Endpoints
    const {data} = await API('search/movie', {
        params: {
            query,
        }
    });
  
    
    const categoryMovies = data.results;
    maxPage = data.total_pages;
    createMovies(categoryMovies, genericSection);

}

export function getSearchPaginatedMovies(query) {
  
  return async function () {
    const { scrollTop, scrollHeight, clientHeight} = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight -15);

    const pageIsNotMax = page < maxPage;

    

    if (scrollIsBottom && pageIsNotMax) {
      page++
      const {data} = await API('search/movie', {
          params: {
            query,
            page,
          },
      });
    
      const categoryMovies = data.results;
      createMovies(categoryMovies, genericSection, false);
    }
  }
 
}

export async function getTrendingMovies() {
    // Endpoints
    const {data} = await API('trending/movie/day')

    //Arriba como se hace con Axios y abajo con fetch
    // const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
    // const data = await res.json();

    const movies = data.results;
    maxPage = data.total_pages;
    createMovies(movies, genericSection)

    // const btnLoadMore = document.createElement('button');
    // btnLoadMore.innerText = 'Cargar mas';
    
    
    // genericSection.appendChild(btnLoadMore)
    // btnLoadMore.addEventListener('click', () => {
    //     getPaginatedMovies;
    //     btnLoadMore.remove;

    //   })
}


export async function getPaginatedMovies() {
  
  const { scrollTop, scrollHeight, clientHeight} = document.documentElement;

  const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight -15);

  const pageIsNotMax = page < maxPage;

  if (scrollIsBottom && pageIsNotMax) {
    page++
    const {data} = await API('trending/movie/day', {
      params: {
        page,
      },
    });
  
    //Arriba como se hace con Axios y abajo con fetch
    // const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
    // const data = await res.json();
  
    const movies = data.results;
  
    createMovies(movies, genericSection, false)
  }
 
}

export async function getMovieDescription(id) {
  // Endpoints
  const { data: movie } = await API('movie/' + id)

  //Arriba como se hace con Axios y abajo con fetch
  // const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
  // const data = await res.json();

  const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;

  headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(${movieImgUrl})`

  movieDetailTitle.textContent = movie.title
  movieDetailDescription.textContent = movie.overview
  movieDetailScore.textContent = movie.vote_average;

  createCategories(movie.genres, movieDetailCategoriesList);
  console.log(movie.genres);

  getReleatedMovies(id);

}


export async function getReleatedMovies(id) {
    // Endpoints
    const {data} = await API(`movie/${id}/similar`)

    //Arriba como se hace con Axios y abajo con fetch
    // const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
    // const data = await res.json();

    const relatedMovies = data.results;

  
    createMovies(relatedMovies, relatedMoviesContainer)

}

export function getLikedMovies() {
  const likedMovies = likedMoviesList();
  const moviesArray = Object.values(likedMovies);

  createMovies(moviesArray, likedMoviesLists, true)
}