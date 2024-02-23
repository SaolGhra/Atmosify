// Function to set a cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

// Function to get a cookie by name
function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

// Function to accept cookies
function acceptCookies() {
    setCookie("cookiesAccepted", true, 365); // Set a cookie to remember user preference
    hideCookieBanner();
}

// Function to decline cookies
function declineCookies() {
    // setCookie("cookiesAccepted", false, 365); // Set a cookie to remember user preference
    hideCookieBanner();
}

// Function to hide the cookie banner
function hideCookieBanner() {
    document.getElementById("cookie-banner").classList.remove("active");
}

// Check if the user has already accepted cookies
document.addEventListener("DOMContentLoaded", function () {
    const cookiesAccepted = getCookie("cookiesAccepted");
    if (!cookiesAccepted) {
        // Show the cookie banner if the user has not accepted cookies
        document.getElementById("cookie-banner").classList.add("active");
    }
});

// Check for existing username and location cookies and set the input values
document.addEventListener("DOMContentLoaded", function () {
    const savedUsername = getCookie("username");
    const savedLocation = getCookie("location");

    document.getElementById("username").value = savedUsername || "";
    document.getElementById("location").value = savedLocation || "";

    // Update the displayed username in the header
    if (savedUsername) {
        document.querySelector(".username").innerText = "Welcome " + savedUsername;
    } else {
        document.querySelector(".username").innerText = "Welcome DefaultUsername";
    }
});

function openSettingsModal() {
    document.getElementById("settings-modal").style.display = "block";
}

function closeSettingsModal() {
    document.getElementById("settings-modal").style.display = "none";
}

function updateSettings() {
    const newName = document.getElementById("username").value;
    const newLocation = document.getElementById("location").value;

    // Update the displayed username in the header
    if (newName.trim() !== "") {
        document.querySelector(".username").innerText = "Welcome " + newName;
    } else {
        document.querySelector(".username").innerText = "Welcome DefaultUsername";
    }

    setCookie("username", newName, 30);
    setCookie("location", newLocation, 30); // Save the location in a cookie

    // Update the weather based on the new location
    updateLocationAndWeather();

    closeSettingsModal();
}

// Additional event listener to update location on page load
document.addEventListener("DOMContentLoaded", function () {
    // Get the saved location from the cookie
    const savedLocation = getCookie("location");

    // If there is a saved location, update the weather based on the location
    if (savedLocation) {
        // Call a function to update the weather based on the location
        updateLocationAndWeather();
    }
});

// var usernameValue = getCookie("username"); // Get the value of the "username" cookie
// console.log("Username:", usernameValue);