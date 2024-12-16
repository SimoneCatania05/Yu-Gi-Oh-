document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
    const cartePerPagina = 14; // Numero Carte per Pagina
    const bottoniPerRiga = 30; // Numero di bottoni per riga
    let currentPage = 1;
    let rigaBottoniAttuale = 0; // Indice della riga di bottoni (es. 0: 1-35, 1: 36-71)
    let cards = [];

    // Funzione per aggiungere una carta al carrello
    window.addToCart = function (cardId) {
        const card = cards.find(c => c.id === parseInt(cardId, 10)); // Trova la carta tramite ID
        if (!card) {
            alert('Carta non trovata!'); // In caso di errore
            return;
        }
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const cardData = {
            id: card.id,
            name: card.name,
            image: card.card_images[0].image_url,
            price: card.card_prices[0]?.ebay_price || 'N/A'
        };
        storedCart.push(cardData);
        localStorage.setItem('cart', JSON.stringify(storedCart));
        alert(`${card.name} è stato aggiunto al carrello!`);
    };

    // Funzione per recuperare i dati dall'API
    async function fetchCards() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Errore nel recupero dei dati.');
            const dati = await response.json();
            cards = dati.data; // Aggiungi i dati all'array delle carte
            displayCards();
            setupPagination();
        } catch (error) {
            document.getElementById('error-message').textContent = `Errore: ${error.message}`;
        }
    }
    
    // Funzione per mostrare le carte
    function displayCards() {
        const container = document.getElementById('card-container');
        container.innerHTML = '';
        const startIndex = (currentPage - 1) * cartePerPagina;
        const endIndex = startIndex + cartePerPagina;
        const currentCards = cards.slice(startIndex, endIndex);
    
        currentCards.forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');
            cardDiv.innerHTML = `
                <a href="../clicked/card.html?id=${card.id}">
                    <img src="${card.card_images[0].image_url}" alt="${card.name}">
                </a>
                <button class="inserisci" data-card-id="${card.id.toString()}">Inserisci nel carrello</button>
                <h3>${card.name}</h3>
                <p>Prezzo eBay: ${card.card_prices[0]?.ebay_price || 'N/A'}€</p>
            `;
            container.appendChild(cardDiv);
    
            // evento click all'immagine per salvare i dati
            const imgElement = cardDiv.querySelector('a');
            imgElement.addEventListener('click', (event) => {
                event.preventDefault();
                window.location.href = `../clicked/card.html?id=${card.id}`;
            });
        });
    
        // Aggiungi event listener ai pulsanti creati dinamicamente
        document.querySelectorAll('.inserisci').forEach(button => {
            button.addEventListener('click', (event) => {
                const cardId = event.target.getAttribute('data-card-id');
                addToCart(cardId);
            });
        });
    }
    

    // Funzione per impostare i bottoni di paginazione
    function setupPagination() {
        const current_page = document.getElementById('pagina_attuale');
        current_page.innerHTML = `Current page: ${currentPage}`;

        const pagination = document.getElementById('pagination');
        pagination.innerHTML = ''; // Svuota la paginazione
        const totalPages = Math.ceil(cards.length / cartePerPagina);
        const totalRows = Math.ceil(totalPages / bottoniPerRiga);

        // Aggiungi freccia sinistra se necessario
        if (rigaBottoniAttuale > 0) {
            const leftArrow = document.createElement('button');
            leftArrow.textContent = '←';
            leftArrow.classList.add('arrow');
            leftArrow.onclick = () => {
                rigaBottoniAttuale--;
                setupPagination();
            };
            pagination.appendChild(leftArrow);
        }

        // Aggiungi bottoni della riga corrente
        const startPage = rigaBottoniAttuale * bottoniPerRiga + 1;
        const endPage = Math.min(startPage + bottoniPerRiga - 1, totalPages);

        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.onclick = () => {
                currentPage = i;
                displayCards();
                current_page.innerHTML = `Current page: ${currentPage}`;
            };
            pagination.appendChild(button);
        }

        // Aggiungi freccia destra se necessario
        if (rigaBottoniAttuale < totalRows - 1) {
            const rightArrow = document.createElement('button');
            rightArrow.textContent = '→';
            rightArrow.classList.add('arrow');
            rightArrow.onclick = () => {
                rigaBottoniAttuale++;
                setupPagination();
            };
            pagination.appendChild(rightArrow);
        }
    }

    // Avvio: recupera i dati
    fetchCards();
});
