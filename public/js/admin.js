const apiKeyInput = document.getElementById("api-key");
const createDrawButton = document.getElementById("create-draw-button");
const completeDrawButton = document.getElementById("complete-draw-button");
const adminInfo = document.getElementById("admin-info");

// Open draw as admin
createDrawButton.addEventListener("click", async () => {
        const response = await axios.post('/api/rounds', {}, {
            headers: {
                "x-api-key": apiKeyInput.value
            }
        });

        adminInfo.textContent = "Draw created!";
});

// Complete draw as admin
completeDrawButton.addEventListener("click", async () => {
        const response = await axios.patch('/api/rounds', {}, {
            headers: {
                "x-api-key": apiKeyInput.value
            }
        });

        adminInfo.textContent = "Draw completed!";
});
