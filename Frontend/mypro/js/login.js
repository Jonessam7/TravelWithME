// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const signUpButton = document.querySelector("#sign-up-btn");
  const signInButton = document.querySelector("#sign-in-btn");
  const container = document.querySelector(".container");

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const togglePassword = document.getElementById("togglePassword");
  const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
  const signupButton = document.getElementById("signup-btn");
  const loginButton = document.getElementById("login-btn");

  // Switch modes
  if (signUpButton) {
    signUpButton.addEventListener("click", () => {
      container.classList.add("sign-up-mode");
    });
  }

  if (signInButton) {
    signInButton.addEventListener("click", () => {
      container.classList.remove("sign-up-mode");
    });
  }

  // Validate email format
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return toggleValidation(emailInput, emailRegex.test(emailInput?.value || ""));
  };

  // Validate password format
  const validatePassword = () => {
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
    return toggleValidation(passwordInput, passwordRegex.test(passwordInput?.value || ""));
  };

  // Confirm passwords match
  const validateConfirmPassword = () => {
    const passwordsMatch = passwordInput.value === confirmPasswordInput.value;
    return toggleValidation(confirmPasswordInput, passwordsMatch);
  };

  const toggleValidation = (input, isValid) => {
    const parent = input?.parentElement;
    if (!parent) return false;
    if (isValid) {
      parent.classList.add("valid");
      parent.classList.remove("invalid");
    } else {
      parent.classList.add("invalid");
      parent.classList.remove("valid");
    }
    return isValid;
  };

  // Add validation listeners
  if (emailInput) emailInput.addEventListener("input", validateEmail);
  if (passwordInput) passwordInput.addEventListener("input", validatePassword);
  if (confirmPasswordInput) confirmPasswordInput.addEventListener("input", validateConfirmPassword);

  // Handle password visibility toggle
  const togglePasswordVisibility = (input, toggleIcon) => {
    if (input?.type === "password") {
      input.type = "text";
      toggleIcon.classList.remove("fa-eye");
      toggleIcon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      toggleIcon.classList.remove("fa-eye-slash");
      toggleIcon.classList.add("fa-eye");
    }
  };

  if (togglePassword)
    togglePassword.addEventListener("click", () =>
      togglePasswordVisibility(passwordInput, togglePassword)
    );

  if (toggleConfirmPassword)
    toggleConfirmPassword.addEventListener("click", () =>
      togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword)
    );

  // Handle signup submission
  const handleSignUpSubmission = async (event) => {
    event.preventDefault();

    if (validateEmail() && validatePassword() && validateConfirmPassword()) {
      const endpoint = "http://localhost:8080/auth/signup";

      const payload = {
        username: document.querySelector(".sign-up-form input[placeholder='Username']")?.value,
        email: emailInput?.value,
        password: passwordInput?.value,
      };

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const token = await response.text();
          // console.log("toekn:"+token);
          
          localStorage.setItem("jwtToken", token); // Store token
          alert("Signup successful! Redirecting to OTP verification...");
          window.location.href = "components/login.html"; // Redirect
        } else {
          const error = await response.text();
          alert(`Signup error: ${error}`);
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Unable to connect to the server. Please try again later.");
      }
    } else {
      alert("Please fill all fields correctly before proceeding.");
    }
  };

  // Handle login submission
  const handleLoginSubmission = async (event) => {
    event.preventDefault();

    const username = document.querySelector(".sign-in-form input[placeholder='Username']")?.value;
    const password = document.querySelector(".sign-in-form input[placeholder='Password']")?.value;

    if (!username || !password) {
      alert("Please fill in both username and password fields.");
      return;
    }

    const endpoint = "http://localhost:8080/auth/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const token = await response.text();
        // console.log("token:"+token);
        
        localStorage.setItem("jwtToken", token); // Store token
        alert("Login successful! Redirecting to dashboard...");
        window.location.href = "jadoo/public/index.html";
// Redirect
      } else {
        const error = await response.text();
        alert(`Login error: ${error}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Unable to connect to the server. Please try again later.");
    }
  };

  if (signupButton) signupButton.addEventListener("click", handleSignUpSubmission);
  if (loginButton) loginButton.addEventListener("click", handleLoginSubmission);
});
