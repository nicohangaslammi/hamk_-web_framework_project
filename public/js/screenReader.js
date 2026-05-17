let announcer;
let announceTimeout;

// Screen reader announcer that updates a visually hidden <output>-element with given text
// Screen reader applications read out the updated text
export const announceMessage = (message) => {
    if (!announcer) announcer = document.getElementById('sr-announcer');

    announcer.textContent = message;

    clearTimeout(announceTimeout);

    announceTimeout = setTimeout(() => {
        announcer.textContent = '';
    });
}