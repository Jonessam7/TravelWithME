document.addEventListener('DOMContentLoaded', async () => {
    const navbar = document.querySelector('.navbar');
    const searchForm = document.querySelector('.search-form');
    const themeBtn = document.querySelector('#theme-btn');

    // Validate token on page load
    await validateToken();

    // Toggle navbar visibility
    document.querySelector('#menu-btn').onclick = () => {
        navbar.classList.toggle('active');
        searchForm.classList.remove('active');
    };

    // Redirect login button to the login page
    document.querySelector('#login-btn').onclick = () => {
        window.location.href = "components/login.html"; // Replace "login.html" with the actual page URL
    };

    // Redirect to protected pages based on token validation
    document.querySelector('#protected-btn').onclick = async () => {
        const isValidToken = await validateToken();
        if (isValidToken) {
            window.location.href = "components/protected.html"; // Replace with the protected page URL
        }
    };

    // Toggle search form visibility
    document.querySelector('#search-btn').onclick = () => {
        searchForm.classList.toggle('active');
        navbar.classList.remove('active');
    };

    // Remove all active classes on scroll
    window.onscroll = () => {
        navbar.classList.remove('active');
        searchForm.classList.remove('active');
    };

    // Theme switcher logic
    themeBtn.onclick = () => {
        themeBtn.classList.toggle('fa-sun');
        document.body.classList.toggle('active', themeBtn.classList.contains('fa-sun'));
    };
});

// Helper function to include JWT in requests
const includeJWT = () => {
    const token = localStorage.getItem("jwtToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Function to validate the token
const validateToken = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        customAlert("Please log in to continue.");
        setTimeout(() => {
            window.location.href = "components/login.html";
        }, 10000); // Redirect after 3 seconds for better UX
        return false;
    }

    try {
        const response = await fetch("http://localhost:8080/auth/validate", {
            method: "GET",
            headers: { ...includeJWT() },
        });

        if (!response.ok) {
            throw new Error("Invalid token or session expired.");
        }
        console.log("Token is valid");
        return true; // Token is valid
    } catch (error) {
        console.error("Token validation failed:", error);
        customAlert("Session expired. Please log in again.");
        localStorage.removeItem("jwtToken");
        setTimeout(() => {
            window.location.href = "components/login.html";
        }, 3000); // Redirect after 3 seconds for better UX
        return false; // Token is invalid
    }
};

// Function to show a custom pop-up (alert)
const customAlert = (message) => {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "1000";
    overlay.style.backdropFilter = "blur(8px)";

    // Create pop-up
    const popup = document.createElement("div");
    popup.style.backgroundColor = "#ffffff";
    popup.style.padding = "25px 30px";
    popup.style.borderRadius = "12px";
    popup.style.boxShadow = "0px 8px 24px rgba(0, 0, 0, 0.2)";
    popup.style.textAlign = "center";
    popup.style.maxWidth = "400px";
    popup.style.width = "90%";
    popup.style.animation = "fadeIn 0.3s ease-out";

    // Add message
    const messageElem = document.createElement("p");
    messageElem.textContent = message;
    messageElem.style.fontSize = "16px";
    messageElem.style.color = "#333333";
    messageElem.style.marginBottom = "20px";
    messageElem.style.lineHeight = "1.5";
    messageElem.style.fontFamily = "'Arial', sans-serif";
    popup.appendChild(messageElem);

    // Add close button
    const closeButton = document.createElement("button");
closeButton.textContent = "Close";
closeButton.style.width="40%"
// closeButton.style.padding = "12px 25px"; // Increased padding for a more prominent button
closeButton.style.marginTop = "15px"; // Added margin to separate it from the message
closeButton.style.border = "none";
closeButton.style.backgroundColor = "#4CAF50";
closeButton.style.color = "#ffffff";
closeButton.style.fontSize = "16px"; // Larger font size for better readability
closeButton.style.borderRadius = "8px"; // Slightly rounded corners for a modern look
closeButton.style.cursor = "pointer";
closeButton.style.transition = "background-color 0.3s ease, transform 0.2s ease"; // Smooth hover effects
closeButton.style.fontFamily = "'Arial', sans-serif";
closeButton.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)"; // Subtle shadow for depth
closeButton.style.alignSelf = "center"; // Ensure the button is centered in the pop-up

// Hover effect for the button
closeButton.onmouseover = () => {
    closeButton.style.backgroundColor = "#45a049";
    closeButton.style.transform = "scale(1.05)"; // Slightly enlarge the button on hover
};
closeButton.onmouseout = () => {
    closeButton.style.backgroundColor = "#4CAF50";
    closeButton.style.transform = "scale(1)";
};

// Close button click event
closeButton.onclick = () => {
    document.body.removeChild(overlay);
};


    closeButton.onmouseover = () => {
        closeButton.style.backgroundColor = "#45a049";
    };
    closeButton.onmouseout = () => {
        closeButton.style.backgroundColor = "#4CAF50";
    };

    closeButton.onclick = () => {
        document.body.removeChild(overlay);
    };

    popup.appendChild(closeButton);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Add keyframe animation for pop-up
    const style = document.createElement("style");
    style.innerHTML = `
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
};


// Trigger pop-up after 10 seconds on page load
window.addEventListener("load", () => {
    setTimeout(() => {
        customAlert("Welcome to the site! Please log in to continue if needed.");
    }, 5000); // 10 seconds delay
});
