document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".input-field input");
  const verifyButton = document.getElementById("verify-button");

  // Add event listeners to each input
  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      const currentInput = input;
      const nextInput = inputs[index + 1];
      const prevInput = inputs[index - 1];

      // Move to the next input if filled
      if (currentInput.value.length === 1) {
        if (nextInput) {
          nextInput.removeAttribute("disabled");
          nextInput.focus();
        }
      }

      // Enable the Verify button if all inputs are filled
      if (Array.from(inputs).every((input) => input.value.trim() !== "")) {
        verifyButton.disabled = false;
      } else {
        verifyButton.disabled = true;
      }
    });

    input.addEventListener("keydown", (e) => {
      const prevInput = inputs[index - 1];

      // Handle backspace to clear and move focus backward
      if (e.key === "Backspace" && input.value === "") {
        if (prevInput) {
          prevInput.value = "";
          prevInput.focus();
        }
      }
    });
  });

  // Form submission handling
  const form = document.getElementById("otp-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Redirect only when all inputs are filled
    if (Array.from(inputs).every((input) => input.value.trim() !== "")) {
      alert("OTP Verified! Redirecting...");
      window.location.href = "/index.html";
    } else {
      alert("Please complete the OTP before verifying.");
    }
  });

  // Focus on the first input on page load
  inputs[0].focus();
});
