// Kullanıcı verileri
let user = {
  balance: 0,
  mining: false,
  miningEnd: null,
  tonBalance: 0,
  clickedTasks: [],
  referrals: []
};

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
  // Elementleri seç
  const miningBtn = document.getElementById('miningBtn');
  const premiumBtn = document.getElementById('premiumBtn');
  const timerEl = document.getElementById('timer');
  const balanceEl = document.getElementById('balance');
  
  // Madencilik başlatma
  miningBtn.addEventListener('click', function() {
    if(user.mining) return;
    
    user.mining = true;
    user.miningEnd = Date.now() + 8 * 60 * 60 * 1000; // 8 saat
    miningBtn.classList.add('active');
    startTimer();
    
    setTimeout(function() {
      user.balance += 90;
      user.mining = false;
      balanceEl.textContent = user.balance;
      miningBtn.classList.remove('active');
      timerEl.textContent = "Madenciliği Başlat";
      alert("Madencilik tamamlandı! 90 CB kazandınız.");
    }, 8 * 60 * 60 * 1000);
  });
  
  // Premium madencilik
  premiumBtn.addEventListener('click', function() {
    if(user.tonBalance < 1.5) {
      alert("Yeterli TON bakiyeniz yok!");
      return;
    }
    
    user.tonBalance -= 1.5;
    miningBtn.click(); // Normal madenciliği başlat
  });
  
  // Geri sayım fonksiyonu
  function startTimer() {
    const timerInterval = setInterval(function() {
      const now = Date.now();
      const distance = user.miningEnd - now;
      
      if(distance <= 0) {
        clearInterval(timerInterval);
        return;
      }
      
      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      timerEl.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }
  
  // Arayüzü güncelle
  function updateUI() {
    balanceEl.textContent = user.balance;
  }
});
