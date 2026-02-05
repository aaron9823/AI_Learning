console.log('Script loaded');

const foodButtons = document.querySelectorAll('.food-btn');
const tipButtons = document.querySelectorAll('.tip-btn');
const tipSection = document.getElementById('tipSection');
const divider = document.getElementById('divider');
const resultsSection = document.getElementById('resultsSection');
const mealPriceDisplay = document.getElementById('mealPrice');
const tipAmountDisplay = document.getElementById('tipAmount');
const totalPriceDisplay = document.getElementById('totalPrice');

let selectedPrice = 0;
let selectedTipPercent = 0;

foodButtons.forEach(button => {
    button.addEventListener('click', () => {
        foodButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        selectedPrice = parseFloat(button.dataset.price);
        
        tipSection.style.display = 'block';
        divider.style.display = 'block';
        resultsSection.style.display = 'block';
        
        selectedTipPercent = 0;
        tipButtons.forEach(btn => btn.classList.remove('active'));
        
        mealPriceDisplay.textContent = `$${selectedPrice.toFixed(2)}`;
        calculateTip();
    });
});

tipButtons.forEach(button => {
    button.addEventListener('click', () => {
        tipButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedTipPercent = parseInt(button.dataset.tip);
        calculateTip();
    });
});

function calculateTip() {
    const tipAmount = (selectedPrice * selectedTipPercent) / 100;
    const totalPrice = selectedPrice + tipAmount;
    
    tipAmountDisplay.textContent = `$${tipAmount.toFixed(2)}`;
    totalPriceDisplay.textContent = `$${totalPrice.toFixed(2)}`;
}
