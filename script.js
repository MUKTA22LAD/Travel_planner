let map = L.map('map').setView([20.5937, 78.9629], 5); // Default: India
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let markers = [];
let routeLayer;

function generateItinerary() {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const startDate = document.getElementById("startDate").value;
    const days = parseInt(document.getElementById("days").value);

    if (!from || !to || !startDate || isNaN(days) || days < 1) {
        alert("⚠️ Please enter valid details!");
        return;
    }

    let itineraryDiv = document.getElementById("itinerary");
    itineraryDiv.innerHTML = `<h3>Trip Plan: ${from} to ${to}</h3>`;

    let tripDate = new Date(startDate);

    for (let i = 0; i < days; i++) {
        let currentDay = new Date(tripDate);
        currentDay.setDate(tripDate.getDate() + i);

        let dateString = currentDay.toDateString();
        let dayPlan = `
            <div class="itinerary-day">
                <h4>📅 ${dateString}</h4>
                <ul>
                    <li>🛏️ 08:00 AM - Wake up & Breakfast</li>
                    <li>🏞️ 10:00 AM - Explore local attractions</li>
                    <li>🍽️ 01:00 PM - Lunch Break</li>
                    <li>🎭 03:00 PM - Visit famous landmarks</li>
                    <li>☕ 05:00 PM - Coffee break & relax</li>
                    <li>🌆 07:00 PM - Evening exploration & dinner</li>
                    <li>🏨 10:00 PM - Back to hotel & rest</li>
                </ul>
            </div>
        `;

        itineraryDiv.innerHTML += dayPlan;
    }

    getCoordinates(from, to);
}

// Convert Locations to Coordinates using Nominatim API
function getCoordinates(from, to) {
    const urlFrom = `https://nominatim.openstreetmap.org/search?format=json&q=${from}`;
    const urlTo = `https://nominatim.openstreetmap.org/search?format=json&q=${to}`;

    Promise.all([
        fetch(urlFrom).then(res => res.json()),
        fetch(urlTo).then(res => res.json())
    ]).then(data => {
        if (data[0].length === 0 || data[1].length === 0) {
            alert("❌ Invalid locations! Try again.");
            return;
        }

        let fromCoords = [data[0][0].lat, data[0][0].lon];
        let toCoords = [data[1][0].lat, data[1][0].lon];

        plotRoute(fromCoords, toCoords, from, to);
    }).catch(error => {
        alert("❌ Error fetching location data!");
        console.error(error);
    });
}

// Plot Route on Map using OpenRouteService API
function plotRoute(fromCoords, toCoords, from, to) {
    const apiKey = "5b3ce3597851110001cf6248c00c1e143d2c453e983eadc867bee4a5"; // Get from openrouteservice.org
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${fromCoords[1]},${fromCoords[0]}&end=${toCoords[1]},${toCoords[0]}`;

    fetch(url, {
        method: 'GET',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        console.log("Route Data:", data);
    })
    .catch(error => {
        console.error("❌ Error fetching route data:", error);
        alert(`⚠️ Route API Error: ${error.message}`);
    });
    
}
