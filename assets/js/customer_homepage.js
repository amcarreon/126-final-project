// Displays shop info when clicking the cards
const shop_cards = document.querySelectorAll('.shopContainers');

shop_cards.forEarch(card => {
    card.addEventListener('click', () => {
        window.location.href = 'shop_customer_view.html';
    });
});