import { fetchMovieAvailability, fetchMovieList } from "./api.js"

fetchMovieList().then((data) => {
    show(data);
});

function show(data) {
    document.getElementById('loader').remove();
    const main = document.getElementsByTagName('main')[0];
    const movieHolder = document.createElement("div");
    movieHolder.className = "movie-holder";
    main.append(movieHolder)
    for (let item of data) {
        const link = document.createElement("a");
        link.className = "movie-link"
        link.href = `/${item.name}`;
        link.innerHTML = `<div class="movie" data-d="${item.name}">
            <div class="movie-img-wrapper" style="background-image: url('${item.imgUrl}');">
            </div>
            <h4>${item.name}</h4>
            </div>`;

        link.addEventListener("click", movieSeatAvailability)
        movieHolder.append(link);
    }
}

function movieSeatAvailability(e) {
    e.preventDefault();
    let name = e.currentTarget.querySelector(".movie").dataset.d
    const div = document.createElement('div');
    div.id = 'loader';
    div.textContent = 'Loading...'
    const parentDiv = document.getElementById('booker-grid-holder');
    parentDiv.append(div);
    fetchMovieAvailability(name).then((res) => {
        bookedSeats(res);
    }).catch((error) => console.log(error));
}


function bookedSeats(seats) {
    document.getElementById('loader').remove();

    let parentDiv = document.getElementById("booker-grid-holder");
    parentDiv.innerHTML = ""
    document.querySelectorAll('h3')[1].classList.toggle('v-none');
    let rowDiv1 = document.createElement("div");
    let rowDiv2 = document.createElement("div");
    rowDiv1.className = "booking-grid"
    rowDiv2.className = "booking-grid"
    for (let i = 0; i < 12; i++) {
        let div = document.createElement("div");
        div.id = `booking-grid-${i + 1}`
        div.innerText = i + 1;
        div.className = "available-seat"
        div.addEventListener("click", bookSeats);
        rowDiv1.append(div);
    }
    for (let i = 12; i < 24; i++) {
        let div = document.createElement("div");
        div.id = `booking-grid-${i + 1}`
        div.innerText = i + 1;
        div.className = "available-seat"
        div.addEventListener("click", bookSeats);
        rowDiv2.append(div);
    }
    parentDiv.append(rowDiv1);
    parentDiv.append(rowDiv2);

    for (let seat of seats) {
        let seatId = document.getElementById("booking-grid-" + `${seat}`);
        seatId.disabled = true;
        seatId.className = "unavailable-seat"
    }



}
let selectedSeats = []
function bookSeats(e) {
    e.preventDefault();
    const seat = e.currentTarget.innerText;
    const target = document.getElementById(`booking-grid-${seat}`)

    document.getElementById('book-ticket-btn').className = '';
    if (target.className != "unavailable-seat") {
        if (target.classList.contains("selected-seat")) {
            const index = selectedSeats.indexOf(target.innerText);
            selectedSeats.splice(index, 1);
            target.classList.remove("selected-seat");
        }
        else {
            target.classList.add("selected-seat");
            selectedSeats.push(target.innerText);
        }
        if (selectedSeats.length === 0) {
            document.getElementById('book-ticket-btn').className = 'v-none';
        }
        console.log(selectedSeats)
    }


}

let book = document.getElementById("book-ticket-btn")
let email, phone;
book.addEventListener("click", bookTickets);

function bookTickets() {

    const main = document.getElementById("booker")

    const div = document.createElement("div")
    div.id = "confirm-purchase"

    const h3 = document.createElement("h3")
    h3.innerText = `Confirm your booking for seat numbers:${selectedSeats.join(",")}`

    const form = document.createElement("form")
    form.id = "customer-detail-form"
    form.setAttribute('onsubmit', 'event.preventDefault();');

    const ndiv = document.createElement("div");
    ndiv.innerHTML = `<label for="email">Email : </label>
    <input type="email" id="email" required></div>
    <div><label for="phone">Phone Number : </label>
    <input type="tel" id="phone" required>`

    const button = document.createElement("button");
    button.setAttribute("type", "submit");
    button.innerText = "Submit"
    button.addEventListener("click", success);

    form.append(ndiv, button);
    div.append(h3, form)

    main.innerHTML = "";
    main.append(div);
}
function success() {
    //e.preventDefault();
    if (!document.forms['customer-detail-form'].reportValidity()) return;
    email = document.getElementById("email").value;
    phone = document.getElementById("phone").value;
    document.getElementById("booker").innerHTML =
        `<div id="success">
     <h3>Booking details</h3>
     <p>Seats : ${selectedSeats.join(", ")}</p>
     <p>Phone Number : ${phone}</p>
     <p>Email : ${email}</p> 
     </div>`
}