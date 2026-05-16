// Stores round Open/Closed state and automatically calls a function when the value is changed.
// Naming convention for a class is to be in PascalCase instead of camelCase
export default class RoundState {
    // Private variables
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements
    #isOpen;
    #onStateChange;

    constructor(state, onStateChange) {
        this.#isOpen = state;
        this.#onStateChange = onStateChange;
    }

    get isOpen() {
        return this.#isOpen;
    }

    set isOpen(status) {
        // Allow parameter to also be "open" or "closed"
        if (status === "open") status = 1;
        else if (status === "closed") status = 0;

        const statusBoolean = Boolean(status);

        // Don't do anything if isOpen is already at a desired state
        if (this.#isOpen === statusBoolean) return;

        // Set isOpen value and call onStateChange function
        this.#isOpen = statusBoolean;
        this.#onStateChange(statusBoolean);
    }
};