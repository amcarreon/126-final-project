const input = document.querySelector(".searchStoreButton");
const form = document.getElementById("searchForm");

let timeout;

function sendSearch() {
    const value = input.value.toLowerCase().trim();
    window.parent.postMessage(value, window.location.origin);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendSearch();
});

input.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(sendSearch, 150);
});