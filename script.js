
const form = document.getElementById("flightForm");
const results = document.getElementById("results");

// ADD MORE CITY OPTIONS TO THE DEPARTURE AND DESTINATION DROPDOWNS
const cities = [
    "Pune", "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai",
    "Kolkata", "Goa", "Ahmedabad", "Jaipur", "Lucknow", "Kochi",
    "Indore", "Nagpur", "Surat", "Chandigarh", "Patna",
    "Bhubaneswar", "Guwahati", "Varanasi", "Srinagar"
];

function populateCities(selectElement) {
    if (!selectElement || selectElement.tagName !== "SELECT") return;

    cities.forEach(function(city) {
        const exists = Array.from(selectElement.options).some(function(option) {
            return option.value === city;
        });

        if (!exists) {
            const option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            selectElement.appendChild(option);
        }
    });
}

populateCities(document.getElementById("from"));
populateCities(document.getElementById("to"));


// SAMPLE FLIGHT DATA
const flights = [
    {
        id: "SK101",
        airline: "Sky Express",
        from: "Pune",
        to: "Bengaluru",
        departure: "08:00 AM",
        arrival: "09:30 AM",
        price: 3500,
        seats: 12,
        occupied: ["1A", "1B", "2C", "3D"]
    },
    {
        id: "AB202",
        airline: "Air Blue",
        from: "Pune",
        to: "Bengaluru",
        departure: "01:00 PM",
        arrival: "02:30 PM",
        price: 4200,
        seats: 8,
        occupied: ["1A", "1B", "1C", "2A", "2B", "3C", "4A", "4D"]
    },
    {
        id: "SK103",
        airline: "Sky Express",
        from: "Pune",
        to: "Delhi",
        departure: "10:00 AM",
        arrival: "12:10 PM",
        price: 4800,
        seats: 5,
        occupied: ["1A", "1B", "1C", "1D", "2A", "2B", "2C", "3A", "3B", "3C", "4D"]
    },
    {
        id: "AB204",
        airline: "Air Blue",
        from: "Mumbai",
        to: "Delhi",
        departure: "09:00 AM",
        arrival: "11:10 AM",
        price: 5100,
        seats: 10,
        occupied: ["1A", "1B", "2C", "2D", "3A", "3B"]
    },
    {
        id: "CA305",
        airline: "Cloud Air",
        from: "Mumbai",
        to: "Bengaluru",
        departure: "04:00 PM",
        arrival: "05:40 PM",
        price: 3900,
        seats: 6,
        occupied: ["1A", "1B", "1C", "2A", "2B", "2C", "3A", "3B", "3C", "4D"]
    }
];

const selectedSeats = {};

let currentSearch = null;
let currentFlightId = null;

// FORMAT MONEY
function money(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN");
}

// CREATE HTML ELEMENTS
function makeElement(tag, text, className) {
    const element = document.createElement(tag);

    if (text !== undefined) {
        element.textContent = text;
    }

    if (className) {
        element.className = className;
    }

    return element;
}

// CREATE SEAT LIST
function getSeatLayout() {
    const seats = [];

    for (let row = 1; row <= 4; row++) {
        ["A", "B", "C", "D"].forEach(function(letter) {
            seats.push(row + letter);
        });
    }

    return seats;
}

// SEARCH FOR FLIGHTS
if (form && results) {
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const from = document.getElementById("from").value;
        const to = document.getElementById("to").value;
        const date = document.getElementById("date").value;
        const passengers = Number(
            document.getElementById("passengers").value
        );

        if (from === to) {
            alert("Departure and destination must be different.");
            return;
        }

        currentSearch = {
            from: from,
            to: to,
            date: date,
            passengers: passengers
        };

        currentFlightId = null;

        Object.keys(selectedSeats).forEach(function(id) {
            delete selectedSeats[id];
        });

        const routeFlights = flights.filter(function(flight) {
            return flight.from === from && flight.to === to;
        });

        let availableFlights = routeFlights.filter(function(flight) {
            return flight.seats >= passengers;
        });

        // Generate clearly fictional demo flights when a route has no sample data.
        if (routeFlights.length === 0) {
            const routeCode = (from + to)
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
                .slice(0, 18);

            availableFlights = [
                {
                    id: "FY" + routeCode + "1",
                    airline: "Flyora Airways",
                    from: from,
                    to: to,
                    departure: "08:00 AM",
                    arrival: "10:00 AM",
                    price: 3500,
                    seats: 12,
                    occupied: ["1A", "1B", "2C", "3D"]
                },
                {
                    id: "FY" + routeCode + "2",
                    airline: "Sky Express",
                    from: from,
                    to: to,
                    departure: "12:30 PM",
                    arrival: "02:30 PM",
                    price: 4200,
                    seats: 8,
                    occupied: ["1A", "1B", "1C", "1D", "2A", "2B", "2C", "2D"]
                },
                {
                    id: "FY" + routeCode + "3",
                    airline: "Cloud Air",
                    from: from,
                    to: to,
                    departure: "06:00 PM",
                    arrival: "08:00 PM",
                    price: 5000,
                    seats: 6,
                    occupied: ["1A", "1B", "1C", "1D", "2A", "2B", "2C", "2D", "3A", "3B"]
                }
            ].filter(function(flight) {
                return flight.seats >= passengers;
            });
        }

        results.replaceChildren();

        results.appendChild(
            makeElement("h2", "Available Flights")
        );

        results.appendChild(
            makeElement(
                "p",
                from + " → " + to + " | " + date +
                " | " + passengers + " passenger(s)"
            )
        );

        if (availableFlights.length === 0) {
            results.appendChild(
                makeElement("p", "No sample flights found for this route.")
            );
            return;
        }

        availableFlights.forEach(function(flight) {
            const card = makeElement("div", undefined, "flight-card");

            card.appendChild(
                makeElement("h3", flight.airline + " (" + flight.id + ")")
            );

            card.appendChild(
                makeElement("p", flight.departure + " → " + flight.arrival)
            );

            card.appendChild(
                makeElement("p", flight.from + " → " + flight.to)
            );

            card.appendChild(
                makeElement("p", "Available seats: " + flight.seats)
            );

            card.appendChild(
                makeElement("p", money(flight.price) + " per passenger")
            );

            card.appendChild(
                makeElement(
                    "h3",
                    "Total: " + money(flight.price * passengers)
                )
            );

            const button = makeElement(
                "button",
                "Select Seats",
                "seat-open-button"
            );

            button.type = "button";

            button.addEventListener("click", function() {
                currentFlightId = flight.id;
                showSeatMap(flight);
            });

            card.appendChild(button);
            results.appendChild(card);
        });
    });
}

// DISPLAY AIRPLANE SEAT MAP
function showSeatMap(flight) {
    if (!currentSearch || !results) return;

    const passengers = currentSearch.passengers;

    if (!selectedSeats[flight.id]) {
        selectedSeats[flight.id] = [];
    }

    results.replaceChildren();

    results.appendChild(
        makeElement("h2", "Choose Your Seats")
    );

    results.appendChild(
        makeElement(
            "p",
            flight.airline + " | " + flight.from + " → " + flight.to
        )
    );

    results.appendChild(
        makeElement(
            "p",
            "Select " + passengers + " seat(s) for " +
            money(flight.price) + " per passenger."
        )
    );

    const legend = makeElement("div", undefined, "seat-legend");

    [
        ["Available", "available"],
        ["Occupied", "occupied"],
        ["Selected", "selected"]
    ].forEach(function(item) {
        const entry = makeElement("span", undefined, "legend-item");
        const sample = makeElement("span", "", "seat " + item[1]);

        entry.append(sample, document.createTextNode(" " + item[0]));
        legend.appendChild(entry);
    });

    results.appendChild(legend);

    const plane = makeElement("div", undefined, "plane");

    plane.appendChild(
        makeElement("h3", "✈ FRONT OF AIRCRAFT")
    );

    const grid = makeElement("div", undefined, "seat-grid");

    getSeatLayout().forEach(function(seatName) {
        const button = makeElement("button", seatName, "seat");

        button.type = "button";

        if (flight.occupied.includes(seatName)) {
            button.classList.add("occupied");
            button.disabled = true;
            button.title = "This seat is occupied";
        } else if (selectedSeats[flight.id].includes(seatName)) {
            button.classList.add("selected");
            button.title = "Click to deselect";
        } else {
            button.classList.add("available");
            button.title = "Select seat " + seatName;
        }

        button.addEventListener("click", function() {
            const chosen = selectedSeats[flight.id];
            const index = chosen.indexOf(seatName);

            if (index !== -1) {
                chosen.splice(index, 1);
            } else {
                if (chosen.length >= passengers) {
                    alert(
                        "You can select only " + passengers + " seat(s)."
                    );
                    return;
                }

                chosen.push(seatName);
            }

            showSeatMap(flight);
        });

        grid.appendChild(button);

        if (seatName.endsWith("B")) {
            grid.appendChild(
                makeElement("span", "", "aisle")
            );
        }
    });

    plane.appendChild(grid);
    results.appendChild(plane);

    const chosen = selectedSeats[flight.id];

    results.appendChild(
        makeElement(
            "p",
            "Selected seats: " +
            (chosen.length ? chosen.join(", ") : "None")
        )
    );

    results.appendChild(
        makeElement(
            "p",
            "Seats remaining: " + (flight.seats - chosen.length)
        )
    );

    results.appendChild(
        makeElement(
            "h3",
            "Total fare: " + money(flight.price * chosen.length)
        )
    );

    const confirmButton = makeElement(
        "button",
        "Continue to Booking",
        "confirm-seat-button"
    );

    confirmButton.type = "button";
    confirmButton.disabled = chosen.length !== passengers;

    confirmButton.addEventListener("click", function() {
        if (chosen.length !== passengers) {
            alert("Please select " + passengers + " seat(s).");
            return;
        }

        const passengerSection =
            document.getElementById("passengerSection");

        if (!passengerSection) {
            alert("Passenger form not found. Check index.html.");
            return;
        }

        currentSearch.selectedFlight = flight;
        currentSearch.selectedSeats = [...chosen];

        passengerSection.style.display = "block";
        passengerSection.scrollIntoView({ behavior: "smooth" });
    });

    results.appendChild(confirmButton);

    const backButton = makeElement(
        "button",
        "Back to Flights",
        "back-button"
    );

    backButton.type = "button";

    backButton.addEventListener("click", function() {
        if (form) {
            form.requestSubmit();
        }
    });

    results.appendChild(backButton);
}

// DISPLAY BOOKINGS, CANCEL TICKETS, AND SHOW BOOKING HISTORY
function renderBookings() {
    const bookingsSection = document.getElementById("myBookings");
    const historySection = document.getElementById("bookingHistory");

    let bookings = [];

    try {
        bookings = JSON.parse(
            localStorage.getItem("skybookBookings") || "[]"
        );

        if (!Array.isArray(bookings)) {
            bookings = [];
        }
    } catch (error) {
        bookings = [];
    }

    const activeBookings = bookings.filter(function(booking) {
        return booking.status === "Confirmed";
    });

    const cancelledBookings = bookings.filter(function(booking) {
        return booking.status === "Cancelled";
    });

    // SHOW CONFIRMED BOOKINGS
    if (bookingsSection) {
        bookingsSection.innerHTML = `
            <h2>My Bookings</h2>
            ${
                activeBookings.length === 0
                    ? "<p>No active bookings.</p>"
                    : activeBookings.map(function(booking) {
                        return `
                            <div class="booking-card">
                                <h3>Booking ID: ${booking.booking_id}</h3>
                                <p>Passenger: ${booking.name}</p>
                                <p>Flight: ${booking.flight_name || booking.flight_id || ""}</p>
                                <p>Route: ${booking.from} to ${booking.to}</p>
                                <p>Date: ${booking.date || ""}</p>
                                <p>Seats: ${(booking.seats || []).join(", ")}</p>
                                <p>Total: ${money(booking.totalFare || 0)}</p>
                                <p>Status: <strong>Confirmed</strong></p>
                                <button type="button"
                                    class="cancel-booking-button"
                                    data-booking-id="${booking.booking_id}">
                                    Cancel Booking
                                </button>
                            </div>
                        `;
                    }).join("")
            }
        `;

        bookingsSection
            .querySelectorAll(".cancel-booking-button")
            .forEach(function(button) {
                button.addEventListener("click", function() {
                    const bookingId = this.dataset.bookingId;

                    if (!confirm("Are you sure you want to cancel this booking?")) {
                        return;
                    }

                    let savedBookings = [];

                    try {
                        savedBookings = JSON.parse(
                            localStorage.getItem("skybookBookings") || "[]"
                        );

                        if (!Array.isArray(savedBookings)) {
                            savedBookings = [];
                        }
                    } catch (error) {
                        alert("Could not read saved bookings.");
                        return;
                    }

                    const booking = savedBookings.find(function(item) {
                        return item.booking_id === bookingId;
                    });

                    if (!booking || booking.status !== "Confirmed") {
                        alert("This booking cannot be cancelled.");
                        return;
                    }

                    booking.status = "Cancelled";

                    localStorage.setItem(
                        "skybookBookings",
                        JSON.stringify(savedBookings)
                    );

                    renderBookings();
                    alert("Ticket cancelled and moved to Booking History.");
                });
            });
    }

    // SHOW CANCELLED TICKETS IN HISTORY
    if (historySection) {
        historySection.innerHTML = `
            <h2>Booking History</h2>
            ${
                cancelledBookings.length === 0
                    ? "<p>No cancelled bookings yet.</p>"
                    : cancelledBookings.map(function(booking) {
                        return `
                            <div class="booking-card">
                                <h3>Booking ID: ${booking.booking_id}</h3>
                                <p>Passenger: ${booking.name}</p>
                                <p>Flight: ${booking.flight_name || booking.flight_id || ""}</p>
                                <p>Route: ${booking.from} to ${booking.to}</p>
                                <p>Date: ${booking.date || ""}</p>
                                <p>Seats: ${(booking.seats || []).join(", ")}</p>
                                <p>Total: ${money(booking.totalFare || 0)}</p>
                                <p>Status: <strong>Cancelled</strong></p>
                                <button type="button"
                                    class="delete-booking-button"
                                    data-booking-id="${booking.booking_id}">
                                    Delete from History
                                </button>
                            </div>
                        `;
                    }).join("")
            }
        `;

        historySection
            .querySelectorAll(".delete-booking-button")
            .forEach(function(button) {
                button.addEventListener("click", function() {
                    const bookingId = this.dataset.bookingId;

                    if (!confirm("Permanently delete this ticket from history?")) {
                        return;
                    }

                    let savedBookings = [];

                    try {
                        savedBookings = JSON.parse(
                            localStorage.getItem("skybookBookings") || "[]"
                        );

                        if (!Array.isArray(savedBookings)) {
                            savedBookings = [];
                        }
                    } catch (error) {
                        alert("Could not read saved bookings.");
                        return;
                    }

                    const remainingBookings = savedBookings.filter(
                        function(booking) {
                            return !(
                                booking.booking_id === bookingId &&
                                booking.status === "Cancelled"
                            );
                        }
                    );

                    localStorage.setItem(
                        "skybookBookings",
                        JSON.stringify(remainingBookings)
                    );

                    renderBookings();
                    alert("Ticket deleted from history.");
                });
            });
    }
}

// SHOW SAVED BOOKINGS WHEN THE PAGE LOADS
renderBookings();

// PASSENGER DETAILS AND BOOKING CONFIRMATION
const passengerForm = document.getElementById("passengerForm");

if (passengerForm) {
    passengerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name =
            document.getElementById("passengerName").value.trim();

        const age =
            document.getElementById("passengerAge").value;

        const email =
            document.getElementById("passengerEmail").value.trim();

        const phone =
            document.getElementById("passengerPhone").value.trim();

        if (!name || !age || !email || !phone) {
            alert("Please fill in all passenger details.");
            return;
        }

        if (
            !currentSearch ||
            !currentSearch.selectedFlight ||
            !currentSearch.selectedSeats
        ) {
            alert("Please select a flight and seats first.");
            return;
        }

        const flight = currentSearch.selectedFlight;
        const seats = currentSearch.selectedSeats;
        const totalFare = flight.price * seats.length;

        const booking = {
            booking_id: "SKY" + Date.now().toString().slice(-9),
            name: name,
            age: age,
            email: email,
            phone: phone,
            flight_id: flight.id,
            flight_name: flight.airline,
            from: flight.from,
            to: flight.to,
            date: currentSearch.date || "",
            seats: seats,
            totalFare: totalFare,
            status: "Confirmed"
        };

        let bookings = [];

        try {
            bookings = JSON.parse(
                localStorage.getItem("skybookBookings") || "[]"
            );

            if (!Array.isArray(bookings)) {
                bookings = [];
            }
        } catch (error) {
            bookings = [];
        }

        bookings.push(booking);

        localStorage.setItem(
            "skybookBookings",
            JSON.stringify(bookings)
        );

        // DISPLAY BOOKING CONFIRMATION
        const confirmation =
            document.getElementById("bookingConfirmation");

        const details =
            document.getElementById("confirmationDetails");

        if (!confirmation || !details) {
            alert(
                "Booking saved, but the confirmation section is missing. " +
                "Check index.html for bookingConfirmation and confirmationDetails."
            );

            renderBookings();
            return;
        }

        details.innerHTML = `
            <h3>Booking Confirmed!</h3>
            <p><strong>Booking ID:</strong> ${booking.booking_id}</p>
            <p><strong>Passenger:</strong> ${booking.name}</p>
            <p><strong>Flight:</strong> ${booking.flight_name}</p>
            <p><strong>Route:</strong> ${booking.from} to ${booking.to}</p>
            <p><strong>Date:</strong> ${booking.date}</p>
            <p><strong>Seats:</strong> ${booking.seats.join(", ")}</p>
            <p><strong>Total Fare:</strong> ${money(booking.totalFare)}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
        `;

        confirmation.style.display = "block";

        const passengerSection =
            document.getElementById("passengerSection");

        if (passengerSection) {
            passengerSection.style.display = "none";
        }

        confirmation.scrollIntoView({ behavior: "smooth" });

        renderBookings();

        alert("Your booking is confirmed!");
    });
}
