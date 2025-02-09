const courses = [
    {
        id: 'datascience',
        name: 'Data Science',
        price: 2000
    },
    {
        id: 'webdevolopment',
        name: 'Web Development',
        price: 1500
    },
    {
        id: 'mobileappdevolopment',
        name: 'Mobile App Development',
        price: 1800
    },
    {
        id: 'cloudcommputing',
        name: 'Cloud Computing',
        price: 2200
    },
    {
        id: 'cybersecurity',
        name: 'Cyber Security',
        price: 2500
    }
];
function cadd(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (course) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(course);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${course.name} added to cart.`);
    } else {
        alert('Course not found.');
    }
}
if (document.getElementById('purchaseSummary')) {
    displayPurchaseSummary();
}
if (document.getElementById('checkoutSummary')) {
    displayCartSummary();
}
function displayCartSummary() {
    const cartSummary = document.getElementById('cartSummary');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartSummary.innerHTML = '<p>No items in the cart.</p>';
        return;
    }

    let total = 0;
    let itemsHtml = '<ul>';
    cart.forEach((item, index) => {
        itemsHtml += `
            <li>
                <strong>${item.name}</strong> - $${item.price}
                <button onclick="removeFromCart(${index})">Remove</button>
            </li>
        `;
        total += item.price;
    });
    itemsHtml += '</ul>';

    cartSummary.innerHTML = itemsHtml + `<p>Total: $${total.toFixed(2)}</p>`;
}
document.addEventListener('DOMContentLoaded', displayCartSummary);
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);  
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartSummary();  
    }
}
function applyPromoCode() {
    const promoCode = document.getElementById('promoCode').value.trim();
    const checkoutSummary = document.getElementById('checkoutSummary');
    const isPremium = document.getElementById('premiumAccount').checked;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    cart.forEach(item => total += item.price);

    if (promoCode === 'NEWUSER10') {
        total=total-(total*0.1); 
    }else if (promoCode === 'TECH25') {
        if(total>4000){
        total=total-(total*0.25);
        }
    }else if (promoCode === 'BUNDLE3') {
        if(total>4500) {
            total=total-(total/6);
        }
    } else {
        checkoutSummary.innerHTML += '<p>Invalid promo code.</p>';
    }

    if (isPremium) {
        total += 250;
    }
    if (total < 3000) {
        total += 50; 
    }

    localStorage.setItem('finalTotal', total.toFixed(2));
    localStorage.setItem('isPremium', isPremium); 

    checkoutSummary.innerHTML += `<p>Total after discounts: $${total.toFixed(2)}</p>`;
}
function cticompletePurchase() {
    window.location.href = 'confirmation.html';
	clearCart();
}

function clearCart() {
    localStorage.removeItem('cart');
    displayCartSummary();
    
}
function displayPurchaseSummary() {
    const purchaseSummary = document.getElementById('purchaseSummary');
    const isPremium = localStorage.getItem('isPremium') === 'true'; 

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        purchaseSummary.innerHTML = '<p>No items in the purchase.</p>';
        return;
    }

    let total = 0;
    let itemsHtml = '<ul>';
    cart.forEach(item => {
        itemsHtml += `<li>${item.name} - $${item.price}</li>`;
        total += item.price;
    });
    itemsHtml += '</ul>';
    const finalTotal = localStorage.getItem('finalTotal');
    if (isPremium) {
        total += 250; 
        itemsHtml += '<p>Premium Upgrade: $250</p>';
    }
    purchaseSummary.innerHTML = itemsHtml + `<p>Total: $${total.toFixed(2)}</p>`;
    
    if (finalTotal === null) {
        purchaseSummary.innerHTML += '<p>No purchase details available.</p>';
    } else {
        purchaseSummary.innerHTML += `<p>Total amount to be paid: $${finalTotal}</p>`;
    }
}

document.getElementById('searchButton').addEventListener('click', function () {
    const query = document.getElementById('input').value.toLowerCase();
    const results = courses.filter(course => course.name.toLowerCase().includes(query));
    
    if (results.length > 0) {
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
            resultsContainer.remove();
        }
        
        const newResultsContainer = document.createElement('div');
        newResultsContainer.id = 'searchResults';
        newResultsContainer.style.backgroundColor = 'lightgreen';
        newResultsContainer.style.padding = '20px';
        newResultsContainer.style.marginTop = '20px';
        
        results.forEach(result => {
            const resultElement = document.createElement('p');
            resultElement.textContent = `${result.name} - $${result.price}`;
            newResultsContainer.appendChild(resultElement);
        });
        document.getElementById('main').appendChild(newResultsContainer);
        newResultsContainer.scrollIntoView({ behavior: 'smooth' });
    } else {
        alert('No results found.');
    }
});
