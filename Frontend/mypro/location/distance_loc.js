// Initialize Leaflet Map
var map = L.map("map").setView([20.5937, 78.9629], 5); // Default to India
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const API_KEY = "5b3ce3597851110001cf6248bde22c0b80f6400cb32cde2860e06337"; // OpenRouteService API Key

// Function to fetch coordinates
function fetchCoordinates(inputId, coordId) {
  const place = document.getElementById(inputId).value.trim();
  if (!place) {
    alert(`Please enter a place for ${inputId}`);
    return;
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    place
  )}&format=json&addressdetails=1`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.length > 0) {
        const lat = data[0].lat;
        const lon = data[0].lon;
        document.getElementById(coordId).value = `${lon},${lat}`;

        // Add marker on the map
        L.marker([lat, lon])
          .addTo(map)
          .bindPopup(`${place}<br>Lat: ${lat}, Lon: ${lon}`)
          .openPopup();

        // Center map
        map.setView([lat, lon], 10);
      } else {
        alert(`No results found for ${place}`);
      }
    })
    .catch((error) => console.error("Error fetching geolocation:", error));
}

// Function to calculate route
function calculateRoute() {
  const startInput = document.getElementById("start").value.trim();
  const endInput = document.getElementById("end").value.trim();

  if (!startInput || !endInput) {
    alert("Please fetch both start and end coordinates!");
    return;
  }

  const startCoords = startInput.split(",").map(Number);
  const endCoords = endInput.split(",").map(Number);

  if (startCoords.length !== 2 || endCoords.length !== 2) {
    alert("Invalid coordinate format! Use Longitude, Latitude.");
    return;
  }

  const url = "https://api.openrouteservice.org/v2/directions/driving-car";
  const body = JSON.stringify({
    coordinates: [startCoords, endCoords],
  });

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: API_KEY,
    },
    body: body,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      const distance = data.routes[0].summary.distance / 1000; // Convert meters to kilometers
      const totalDurationMinutes = data.routes[0].summary.duration / 60; // Convert seconds to minutes

      // Calculate hours and minutes
      const hours = Math.floor(totalDurationMinutes / 60);
      const minutes = Math.round(totalDurationMinutes % 60);

      document.getElementById(
        "distance"
      ).textContent = `Distance: ${distance.toFixed(2)} km`;
      document.getElementById(
        "duration"
      ).textContent = `Duration: ${hours} hour(s) and ${minutes} minute(s)`;
    })
    .catch((error) => {
      console.error("Error fetching directions:", error);
      alert("An error occurred while fetching the route.");
    });
}
