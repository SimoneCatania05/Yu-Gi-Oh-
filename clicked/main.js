document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
    let currentCard = null;

    // Funzione per recuperare i dati della carta dal database
    async function fetchCardData() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            return data.data; // Ritorna l'array di carte
        } catch (error) {
            console.error("Errore nel recupero dei dati:", error);
            return [];
        }
    }

    // Funzione per stampare i dettagli della carta
    async function printCardDetails(cardId) {
        // Recupera i dati delle carte
        const cards = await fetchCardData();

        const card = cards.find(item => item.id === cardId);
        if (!card) {
            console.error("Carta non trovata con l'ID:", cardId);
            document.getElementById('card-details').innerHTML = `<p>Carta non trovata.</p>`;
            return;
        }

        // Memorizza la carta corrente per l'aggiunta al carrello
        currentCard = card;

        // Stampa i dettagli nel DOM
        const detailsContainer = document.getElementById('card-details');
        detailsContainer.innerHTML = `
            <h2 id="titolo">${card.name}</h2>
            <img src="${card.card_images[0].image_url}" alt="${card.name}" class="cardImg">
            <p><strong>Tipo:</strong> ${card.type}</p>
            <p><strong>Descrizione:</strong> ${card.desc}</p>
            <p><strong>Prezzo (eBay):</strong> ${card.card_prices[0].ebay_price}€</p>
            <button class="inserisci">Aggiungi al carrello</button>
        `;
        // Aggiungi il listener per il pulsante
        document.querySelector('.inserisci').addEventListener('click', () => {
            addToCart(card.id);
        });
    }

    // Recupera l'ID dalla query string
    function getCardIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('id'), 10); // Converte l'ID in numero intero
    }

    const cardId = getCardIdFromUrl();
    if (!cardId) {
        console.error("ID della carta non fornito nell'URL.");
        document.getElementById('card-details').innerHTML = `<p>ID carta mancante nell'URL.</p>`;
        return;
    }

    printCardDetails(cardId);

    // Funzione per aggiungere una carta al carrello
    function addToCart(cardId) {
        const cardData = {
            id: currentCard.id,
            name: currentCard.name,
            image: currentCard.card_images[0].image_url,
            price: currentCard.card_prices[0]?.ebay_price || 'N/A'
        };

        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        storedCart.push(cardData);
        localStorage.setItem('cart', JSON.stringify(storedCart));
        alert(`${currentCard.name} è stato aggiunto al carrello!`);
    }
});
