document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.getElementById("colorblind-toggle");

    // Get colorblind mode from localStorage
    const isColorblindMode = localStorage.getItem("colorblindMode") === "true";

    if (isColorblindMode) {
        document.body.classList.add("colorblind-mode");
        toggleSwitch.checked = true;
    }

    toggleSwitch.addEventListener("change", (e) => {
        const isActive = event.target.checked;

        // Add change-mode class
        if (isActive) document.body.classList.add("colorblind-mode");
        else document.body.classList.remove("colorblind-mode");

        localStorage.setItem("colorblindMode", isActive.toString());
    });
});