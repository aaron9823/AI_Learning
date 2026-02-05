// Profile page initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Profile loaded');
    
    const cardWrapper = document.getElementById('cardWrapper');
    const frontCard = document.getElementById('card');
    const backCard = document.getElementById('cardBack');
    
    let isFlipped = false;
    
    // 처음에 앞면 표시
    frontCard.classList.add('active');
    
    cardWrapper.addEventListener('click', function() {
        isFlipped = !isFlipped;
        
        if (isFlipped) {
            frontCard.classList.remove('active');
            backCard.classList.add('active');
        } else {
            frontCard.classList.add('active');
            backCard.classList.remove('active');
        }
    });
    
    // QR 코드 생성
    if (document.getElementById('qrcode')) {
        new QRCode(document.getElementById('qrcode'), {
            text: 'https://github.com/aaron9823',
            width: 150,
            height: 150,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }
});