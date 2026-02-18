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
/**
 * Tip Calculator 테스트 파일
 */

// calculateTip 함수 테스트를 위한 순수 함수 버전
function calculateTipAmount(price, tipPercent) {
    return (price * tipPercent) / 100;
}

function calculateTotalPrice(price, tipPercent) {
    const tipAmount = calculateTipAmount(price, tipPercent);
    return price + tipAmount;
}

// 테스트 케이스
console.log('=== Tip Calculator 테스트 ===\n');

// 테스트 1: 팁 금액 계산
console.log('테스트 1: 팁 금액 계산');
console.log(`$20 식사, 10% 팁 = $${calculateTipAmount(20, 10).toFixed(2)}`); // 예상: $2.00
console.log(`$50 식사, 15% 팁 = $${calculateTipAmount(50, 15).toFixed(2)}`); // 예상: $7.50
console.log(`$35 식사, 20% 팁 = $${calculateTipAmount(35, 20).toFixed(2)}`); // 예상: $7.00

console.log('\n테스트 2: 총 금액 계산');
console.log(`$20 식사, 10% 팁 = 총 $${calculateTotalPrice(20, 10).toFixed(2)}`); // 예상: $22.00
console.log(`$50 식사, 15% 팁 = 총 $${calculateTotalPrice(50, 15).toFixed(2)}`); // 예상: $57.50
console.log(`$35 식사, 20% 팁 = 총 $${calculateTotalPrice(35, 20).toFixed(2)}`); // 예상: $42.00

console.log('\n테스트 3: 엣지 케이스');
console.log(`$0 식사, 10% 팁 = 총 $${calculateTotalPrice(0, 10).toFixed(2)}`); // 예상: $0.00
console.log(`$100 식사, 0% 팁 = 총 $${calculateTotalPrice(100, 0).toFixed(2)}`); // 예상: $100.00

console.log('\n=== 모든 테스트 완료 ===');