document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummaryContainer = document.getElementById('cart-Report');
    const totalPriceElement = document.getElementById('total-price');
    const cartSummary = document.getElementById('cart-summary');
    let storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;

    // Funzione per rimuovere una carta dal carrello
    window.removeFromCart = function (cardId) {
        cardId = parseInt(cardId);
        const removedItemIndex = storedCart.findIndex(item => item.id === cardId);

        if (removedItemIndex !== -1) {
            const removedItem = storedCart.splice(removedItemIndex, 1)[0];
            localStorage.setItem('cart', JSON.stringify(storedCart));
            displayCartItems();
            alert(`${removedItem.name} è stato rimosso dal carrello.`);
        }
    };

    // Funzione per mostrare gli elementi del carrello
    function displayCartItems() {
        let pieno = document.getElementById("pieno");
        pieno.innerHTML = '';
        cartItemsContainer.innerHTML = '';
        cartSummaryContainer.innerHTML = '';
        totalPrice = 0;

        if (storedCart.length === 0) {
            pieno.innerHTML = '<p>Il tuo carrello è vuoto.</p>';
            totalPriceElement.innerHTML = '';
        } else {
            storedCart.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('cart-item');
                itemDiv.setAttribute('data-id', item.id);
                itemDiv.innerHTML = `
                    <a href="card.html?id=${item.id}">
                        <img src="${item.image}" alt="${item.name}">
                    </a>
                    <button class="rimuovi" data-card-id="${item.id}">Rimuovi dal carrello</button>
                    <h3>${item.name}</h3>
                    <p>Prezzo eBay: ${item.price}€</p>
                `;
                cartItemsContainer.appendChild(itemDiv);

                // evento click all'immagine per salvare i dati
                const imgElement = itemDiv.querySelector('a');
                imgElement.addEventListener('click', (event) => {
                    event.preventDefault();
                    window.location.href = `../clicked/card.html?id=${item.id}`;
                });

                const summaryDiv = document.createElement('div');
                summaryDiv.classList.add('summary-item');
                summaryDiv.innerHTML = `
                    <h4>${item.name}</h4>
                    <p>€${item.price}</p>
                `;
                cartSummaryContainer.appendChild(summaryDiv);

                totalPrice += parseFloat(item.price);
            });

            document.querySelectorAll('.rimuovi').forEach(button => {
                button.addEventListener('click', (event) => {
                    const cardId = event.target.getAttribute('data-card-id');
                    removeFromCart(cardId);
                });
            });

            totalPriceElement.classList.add('PrezzoFinale');
            totalPriceElement.innerHTML = `Prezzo totale: €${totalPrice.toFixed(2)}`;
        }
    }

    // Gestione animazioni iniziali
    cartSummary.classList.add('initial-animation');

    setTimeout(() => {
        cartSummary.classList.remove('initial-animation');
        cartSummary.classList.add('visible');
        cartSummary.id = 'cart-summary2'
    }, 1000);

    // Gestione dello scroll
    let hasScrolled = false;
    window.addEventListener('scroll', () => {
        if (!hasScrolled && window.scrollY > 100) {
            cartSummary.classList.add('fixed-scroll');
            hasScrolled = true;
        } else if (hasScrolled && window.scrollY <= 100) {
            cartSummary.classList.remove('fixed-scroll');
            hasScrolled = false;
        }
    });

    // Mostra gli elementi del carrello
    displayCartItems();


    document.getElementById('download-json').addEventListener('click', () => {
        if (storedCart.length === 0) {
            alert('Il carrello è vuoto. Non c\'è nulla da scaricare.');
            return;
        }

        // Estrarre solo nome e prezzo
        const cartSummary = storedCart.map(item => ({
            name: item.name,
            price: item.price
        }));

        // Creare il file JSON e scaricarlo
        const jsonBlob = new Blob([JSON.stringify(cartSummary, null, 2)], { type: 'application/json' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(jsonBlob);
        downloadLink.download = 'cart-summary.json';
        downloadLink.click();
    });

    document.getElementById('compra-tutto').addEventListener('click', () => {
        localStorage.clear();
        location.reload();
        if (storedCart.length === 0) {
            alert('Il carrello è vuoto. Non c\'è nulla da comprare.');
        } else {
            alert("grazie per l'aquisto!");
        }
    });
});
