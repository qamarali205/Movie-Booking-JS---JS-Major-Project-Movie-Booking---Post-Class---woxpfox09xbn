import {fetchMovieAvailability,fetchMovieList} from "./api.js"


fetch(fetchMovieAvailability, fetchMovieList)
  .then(response => response.json())
  .then(data => {
    // remove the loader
    const loader = document.querySelector('#loader');
    loader.parentNode.removeChild(loader);
    
    // display the data in the movie-holder div
    const movieHolder = document.querySelector('#movie-holder');
    data.forEach(movie => {
      const movieDiv = document.createElement('div');
      movieDiv.innerHTML = `<h2>${movie.name}</h2><img src="${movie.imgUrl}" alt="${movie.name}" />`;
      movieHolder.appendChild(movieDiv);
    });
  })
  .catch(error => {
    console.error(error);
  });


const movieLinks = document.querySelectorAll('.movie-link');
const booker = document.querySelector('#booker');
const gridHolder = document.querySelector('#booker-grid-holder');
const bookTicketBtn = document.querySelector('#book-ticket-btn');
const confirmPurchase = document.querySelector('#confirm-purchase');
const customerDetailForm = document.querySelector('#customer-detail-form');
const success = document.querySelector('#success');

// Get movie availability data and render seat grids
movieLinks.forEach(link => {
  link.addEventListener('click', async e => {
    e.preventDefault();

    const movieName = e.target.dataset.d;
    const availability = await fetchMovieAvailability(movieName);

    renderSeatGrids(availability);
    booker.classList.remove('v-none');
  });
});

// Handle seat selection
gridHolder.addEventListener('click', e => {
  if (e.target.classList.contains('available-seat')) {
    e.target.classList.toggle('selected-seat');

    const selectedSeats = document.querySelectorAll('.selected-seat');

    if (selectedSeats.length) {
      bookTicketBtn.classList.remove('v-none');
    } else {
      bookTicketBtn.classList.add('v-none');
    }
  }
});

//
