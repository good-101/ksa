const form = document.getElementById("owner-login-form");
const statusText = document.getElementById("status-text");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusText.textContent = "Signing in...";

  const payload = {
    email: document.getElementById("email-input").value.trim(),
    password: document.getElementById("password-input").value
  };

  try {
    const response = await fetch("/api/owner/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      statusText.textContent = "Login failed. Check the owner email and password.";
      return;
    }

    window.location.href = "/dashboard";
  } catch (error) {
    statusText.textContent = "Network error while signing in.";
  }
});
