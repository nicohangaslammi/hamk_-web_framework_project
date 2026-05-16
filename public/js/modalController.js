// Modal elements
let modalWin;
let modalLoss;

// Winning number span elements inside modals
let modalWinNumber;
let modalLossNumber;

export const showModalWin = (winningNumber) => {
    modalWinNumber.textContent = winningNumber;
    modalWin.showModal();
}

export const showModalLoss = (winningNumber) => {
    modalLossNumber.textContent = winningNumber;
    modalLoss.showModal();
}

export const initializeModals = () => {
    // Win modal elements
    modalWin = document.querySelector("[data-modal-win]");
    const modalWinClose = document.querySelector("[data-close-modal-win]");
    modalWinNumber = modalWin.querySelector("[data-modal-winning-number]")

    // Loss modal elements
    modalLoss = document.querySelector("[data-modal-loss]");
    const modalLossClose = document.querySelector("[data-close-modal-loss]");
    modalLossNumber = modalLoss.querySelector("[data-modal-winning-number]")

    // Event listeners for closing the modals with either ESC (built-in) or clicking the close button
    modalWinClose?.addEventListener("click", () => {
        modalWin.close();
    });

    modalLossClose?.addEventListener("click", () => {
        modalLoss.close();
    });
}