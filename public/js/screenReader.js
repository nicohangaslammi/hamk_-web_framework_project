let announcer;
let announceTimeout;

export const announceMessage = (message) => {
    if (!announcer) announcer = document.getElementById('sr-announcer');

    announcer.textContent = message;

    clearTimeout(announceTimeout);

    announceTimeout = setTimeout(() => {
        announcer.textContent = '';
    });
}