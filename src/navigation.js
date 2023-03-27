
import {getCategoriesPreview, getMovieDescription, getTrendingMovies, getTrendingMoviesPreview, getMoviesByCategory, getMoviesBySearch, getPaginatedMovies, getSearchPaginatedMovies, getCategoryPaginatedMovies, getLikedMovies} from'./main.js'


let infiniteScroll;


searchFormBtn.addEventListener('click', () => {
    location.hash = '#search=' + searchFormInput.value;
})
arrowBtn.addEventListener('click', () =>  history.back());

trendingBtn.addEventListener('click', () => location.hash = '#trends')

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false);

function navigator() {
    console.log({ location });

    if(infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, false);
        infiniteScroll = undefined;
    }

    location.hash.startsWith('#trends')    ? trendsPage()       :
    location.hash.startsWith('#search=')   ? searchPage()       :
    location.hash.startsWith('#movie=')    ? moviePage() :
    location.hash.startsWith('#category=') ? categoryPage()   :
    homePage()

    document.scrollTop = 0

    if(infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, false);
    }
}

function homePage() {
    console.log('home')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive')
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    footer.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive')
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive')
    likedMoviesSection.classList.remove('inactive')

    getTrendingMoviesPreview()
    getCategoriesPreview()
    getLikedMovies()
}
function trendsPage() {
    console.log('trends');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    likedMoviesSection.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive')

    headerCategoryTitle.innerHTML = 'Trending'
    getTrendingMovies();

    infiniteScroll = getPaginatedMovies;
}
function searchPage() {
    console.log('search');
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.remove('inactive');
    likedMoviesSection.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, query] = location.hash.split('=');
    getMoviesBySearch(query);

    infiniteScroll = getSearchPaginatedMovies(query);

}
function moviePage() {
    console.log('movie');
    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
    likedMoviesSection.classList.add('inactive')
    footer.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive')

    const [_, movieId] = location.hash.split('=')
    
    getMovieDescription(movieId);
}
function categoryPage() {
    console.log('category');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive')
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive')
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    likedMoviesSection.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive')

   const [_, categoryData] = location.hash.split('=')
   const [categoryId, categoryName] = categoryData.split('-')
   headerCategoryTitle.innerHTML = categoryName;

    getMoviesByCategory(categoryId);

    infiniteScroll = getCategoryPaginatedMovies(categoryId);
}

