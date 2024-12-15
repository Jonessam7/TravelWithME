const body = document.querySelector("body"),
    modeToggle = body.querySelector(".mode-toggle"),
    sidebar = body.querySelector("nav"),
    sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
    sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
        localStorage.setItem("mode", "dark");
    } else {
        localStorage.setItem("mode", "light");
    }
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if (sidebar.classList.contains("close")) {
        localStorage.setItem("status", "close");
    } else {
        localStorage.setItem("status", "open");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    const locationInputsContainer = document.getElementById("location-inputs-container");
    const getDistanceBtn = document.getElementById("get-distance-btn");
    const fromLocationInput = document.getElementById("from-location");
    const toLocationInput = document.getElementById("to-location");

    const hotelInputContainer = document.getElementById("hotel-input-container");
    const hotelPlaceInput = document.getElementById("hotel-place");
    const starRatingSelect = document.getElementById("star-rating");
    const searchHotelsBtn = document.getElementById("search-hotels-btn");

    const nearbyMenu = document.getElementById("menu-nearby");
    const nearbyInputContainer = document.getElementById("nearby-input-container");
    const searchNearbyBtn = document.getElementById("search-nearby-btn");
    const placeInput = document.getElementById("place-input");
    const placeCount = document.getElementById("place-count");

    const distanceMenu = document.getElementById("menu-distance");
    const hotelMenu = document.getElementById("menu-hotel");

    // Hide containers initially
    locationInputsContainer.style.display = "none";
    hotelInputContainer.style.display = "none";
    nearbyInputContainer.style.display = "none";

    function addMessage(text, sender) {
        const message = document.createElement("div");
        message.className = `message ${sender}`;
        message.innerHTML = text;
        chatBox.appendChild(message);
        chatBox.scrollTop = chatBox.scrollHeight;
        return message;
    }

    function simulateTyping(messageDiv, text, typingMessageDiv) {
        let index = 0;
        messageDiv.innerHTML = "";
        const typingInterval = setInterval(() => {
            if (index < text.length) {
                messageDiv.innerHTML += text[index];
                index++;
            } else {
                clearInterval(typingInterval);
                if (typingMessageDiv) {
                    typingMessageDiv.remove();
                }
            }
        }, 13);
    }

    function showTypingIndicator() {
        const typingMessage = addMessage('AI is typing...', 'ai');
        typingMessage.classList.add('typing-effect');
        return typingMessage;
    }

    async function getChatResponse(userMessage) {
        const apiKey = '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'; 
        const url = 'https://api.groq.com/openai/v1/chat/completions';

        const data = {
            model: "llama3-8b-8192",
            messages: [{
                role: "user",
                content: userMessage
            }]
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                return result.choices[0].message.content;
            } else {
                console.error('Error:', result);
                return 'Sorry, I encountered an error. Please try again later.';
            }
        } catch (error) {
            console.error('Error:', error);
            return 'Sorry, I encountered an error. Please try again later.';
        }
    }

    sendBtn.addEventListener('click', async () => {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            userInput.value = ''; 

            let aiResponse = '';

            // Check for specific commands
            if (message.toLowerCase() === "get start") {
                aiResponse = "Welcome to the chatbot! How can I assist you today?";
                addMessage(aiResponse, 'ai');

            } else if (message.toLowerCase().includes("hotel")) {
                const hotelPlace = hotelPlaceInput.value;
                const starRating = starRatingSelect.value;
                const userHotelMessage = `The hotel near ${hotelPlace} with ${starRating} star(s).`;
                addMessage(userHotelMessage, 'user');

                const aiHotelMessage = `Can you recommend a hotel near ${hotelPlace} with ${starRating} star(s)?`;
                const typingMessageDiv = showTypingIndicator();
                aiResponse = await getChatResponse(aiHotelMessage);
                const aiMessageDiv = addMessage("", 'ai');
                simulateTyping(aiMessageDiv, aiResponse, typingMessageDiv);

            } else if (message.toLowerCase().includes("distance")) {
                const fromLocation = fromLocationInput.value;
                const toLocation = toLocationInput.value;
                const userDistanceMessage = `Distance from ${fromLocation} to ${toLocation}.`;
                addMessage(userDistanceMessage, 'user');

                const aiDistanceMessage = `Can you tell me the distance from ${fromLocation} to ${toLocation}?`;
                const typingMessageDiv = showTypingIndicator();
                aiResponse = await getChatResponse(aiDistanceMessage);
                const aiMessageDiv = addMessage("", 'ai');
                simulateTyping(aiMessageDiv, aiResponse, typingMessageDiv);

            } else {
                const typingMessageDiv = showTypingIndicator();
                aiResponse = await getChatResponse(message);
                const aiMessageDiv = addMessage("", 'ai');
                simulateTyping(aiMessageDiv, aiResponse, typingMessageDiv);
            }
        }
    });

    // Toggle distance dropdown
    distanceMenu.addEventListener("click", (e) => {
        e.preventDefault();
        toggleDropdown(distanceMenu, locationInputsContainer);
        hotelInputContainer.style.display = "none";
        nearbyInputContainer.style.display = "none";
    });

    // Toggle hotel dropdown
    hotelMenu.addEventListener("click", (e) => {
        e.preventDefault();
        toggleDropdown(hotelMenu, hotelInputContainer);
        locationInputsContainer.style.display = "none";
        nearbyInputContainer.style.display = "none";
    });

    // Toggle Nearby Places dropdown
    nearbyMenu.addEventListener("click", (e) => {
        e.preventDefault();
        toggleDropdown(nearbyMenu, nearbyInputContainer);
        locationInputsContainer.style.display = "none";
        hotelInputContainer.style.display = "none";
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
        if (
            !distanceMenu.contains(e.target) &&
            !hotelMenu.contains(e.target) &&
            !nearbyMenu.contains(e.target) &&
            !locationInputsContainer.contains(e.target) &&
            !hotelInputContainer.contains(e.target) &&
            !nearbyInputContainer.contains(e.target)
        ) {
            locationInputsContainer.style.display = "none";
            hotelInputContainer.style.display = "none";
            nearbyInputContainer.style.display = "none";
        }
    });

    // Function to position and toggle dropdown visibility
    function toggleDropdown(menuItem, dropdownContainer) {
        const rect = menuItem.getBoundingClientRect();
        dropdownContainer.style.top = `${rect.bottom + window.scrollY}px`;
        dropdownContainer.style.left = `${rect.left}px`;
        dropdownContainer.style.display =
            dropdownContainer.style.display === "block" ? "none" : "block";
    }

    // Search Nearby Places functionality
    searchNearbyBtn.addEventListener("click", async () => {
        const place = placeInput.value;
        const count = placeCount.value;

        if (place) {
            const userNearbyMessage = `Searching for ${count} place(s) near ${place}.`;
            addMessage(userNearbyMessage, "user");

            const aiNearbyMessage = `Can you list ${count} nearby places around ${place}?`;
            const typingMessageDiv = showTypingIndicator();
            let aiResponse = await getChatResponse(aiNearbyMessage);
            const aiMessageDiv = addMessage("", "ai");
            simulateTyping(aiMessageDiv, aiResponse, typingMessageDiv);
        } else {
            alert("Please enter a place!");
        }
    });

    // Search DISTANCE functionality
    getDistanceBtn.addEventListener("click", async () => {
        const fromLocation = fromLocationInput.value.trim();
        const toLocation = toLocationInput.value.trim();
    
        if (fromLocation && toLocation) {
            const userMessage = `Distance from ${fromLocation} to ${toLocation}.`;
            addMessage(userMessage, "user");
    
            const aiMessage = `Can you tell me the distance from ${fromLocation} to ${toLocation}?`;
            const typingMessageDiv = showTypingIndicator();
    
            const aiResponse = await getChatResponse(aiMessage);
            const aiMessageDiv = addMessage("", "ai");
            simulateTyping(aiMessageDiv, aiResponse, typingMessageDiv);
        } else {
            alert("Please fill in both From and To locations!");
        }
    });



   // Search Hotels functionality
    searchHotelsBtn.addEventListener("click", async () => {
        const hotelPlace = hotelPlaceInput.value.trim();
        const starRating = starRatingSelect.value;
    
        if (hotelPlace) {
            const userMessage = `Searching for hotels in ${hotelPlace} with ${starRating} star(s).`;
            addMessage(userMessage, "user");
    
            const aiMessage = `Can you suggest hotels in ${hotelPlace} with a ${starRating}-star rating?`;
            const typingMessageDiv = showTypingIndicator();
    
            const aiResponse = await getChatResponse(aiMessage);
            const aiMessageDiv = addMessage("", "ai");
            simulateTyping(aiMessageDiv, aiResponse, typingMessageDiv);
        } else {
            alert("Please enter a place to search for hotels!");
        }
    });

    

    

});
function toggleDropdown(menuItem, dropdownContainer) {
    const rect = menuItem.getBoundingClientRect();
    dropdownContainer.style.top = `${rect.bottom + window.scrollY}px`;

    // Adjust left alignment
    const offset = 5; // Adjust this value as needed
    dropdownContainer.style.left = `${rect.left + offset}px`;

    dropdownContainer.style.display =
        dropdownContainer.style.display === "block" ? "none" : "block";
}
