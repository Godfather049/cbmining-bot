// Kullanıcı verilerini yükle veya oluştur
let user = JSON.parse(localStorage.getItem('cb_user')) || {
  id: Date.now().toString(),
  balance: 0,
  mining: false,
  miningEnd: null,
  tonBalance: 3.0, // Test için başlangıç bakiyesi
  clickedTasks: [],
  referrals: [],
  lastSpin: null,
  walletAddress: null
};

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
  updateUI();
  
  // Madencilik durumunu kontrol et
  if(user.mining && user.miningEnd > Date.now()) {
    startMiningTimer();
  } else if(user.mining) {
    completeMining();
  }
  
  // Buton eventleri
  const miningBtn = document.getElementById('miningBtn');
  const premiumBtn = document.getElementById('premiumBtn');
  
  if(miningBtn) miningBtn.addEventListener('click', startMining);
  if(premiumBtn) premiumBtn.addEventListener('click', startPremiumMining);
});

// Madencilik başlat
function startMining() {
  if(user.mining) return;
  
  user.mining = true;
  user.miningEnd = Date.now() + 8 * 60 * 60 * 1000; // 8 saat
  saveUserData();
  
  document.getElementById('miningBtn').classList.add('active');
  startMiningTimer();
  
  setTimeout(completeMining, 8 * 60 * 60 * 1000);
}

// Premium madencilik
function startPremiumMining() {
  if(user.tonBalance < 1.5) {
    alert("Yeterli TON bakiyeniz yok! Minimum 1.5 TON gereklidir.");
    return;
  }
  
  user.tonBalance -= 1.5;
  saveUserData();
  startMining();
  alert("1.5 TON ödendi. Premium madencilik başladı!");
}

// Madencilik tamamlandı
function completeMining() {
  user.balance += 90;
  user.mining = false;
  saveUserData();
  updateUI();
  
  const miningBtn = document.getElementById('miningBtn');
  if(miningBtn) {
    miningBtn.classList.remove('active');
    miningBtn.querySelector('#timer').textContent = "Madenciliği Başlat";
  }
  
  alert("Madencilik tamamlandı! 90 CB kazandınız.");
}

// Geri sayım
function startMiningTimer() {
  const timerEl = document.getElementById('timer');
  if(!timerEl) return;
  
  const timerInterval = setInterval(function() {
    const now = Date.now();
    const distance = user.miningEnd - now;
    
    if(distance <= 0) {
      clearInterval(timerInterval);
      completeMining();
      return;
    }
    
    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    timerEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

// Cüzdan bağla
function connectWallet() {
  // Simüle edilmiş cüzdan bağlantısı
  user.walletAddress = "EQ" + Math.random().toString(36).substr(2, 33).toUpperCase();
  user.tonBalance = 5.0; // Test bakiyesi
  saveUserData();
  updateUI();
  alert("TON Cüzdan başarıyla bağlandı!\nAdres: " + user.walletAddress);
}

// TON Satın Al
function buyTON() {
  window.open("https://ton.org/buy", "_blank");
  alert("TON satın alma sayfasına yönlendiriliyorsunuz...");
}

// CBANK Satın Al
function buyCBANK() {
  window.open("https://t.me/blumcrypto_memepad", "_blank");
  alert("CBANK satın alma sayfasına yönlendiriliyorsunuz...");
}

// Mağaza işlemleri
function buyBoost(boostId) {
  const boosts = {
    1: { percent: 0.5, price: 0.1 },
    2: { percent: 1, price: 1.5 },
    3: { percent: 5, price: 2.0 },
    4: { percent: 35, price: 5.0 }
  };
  
  const boost = boosts[boostId];
  if(!boost) return;
  
  if(user.tonBalance < boost.price) {
    alert(`Yeterli TON bakiyeniz yok! Gerekli: ${boost.price} TON`);
    return;
  }
  
  user.tonBalance -= boost.price;
  saveUserData();
  updateUI();
  alert(`${boost.percent}% kazanç artışı satın alındı! ${boost.price} TON harcandı.`);
}

// Kullanıcı verisini kaydet
function saveUserData() {
  localStorage.setItem('cb_user', JSON.stringify(user));
}

// Arayüzü güncelle
function updateUI() {
  const balanceEl = document.getElementById('balance');
  const tonBalanceEl = document.getElementById('tonBalance');
  
  if(balanceEl) balanceEl.textContent = user.balance;
  if(tonBalanceEl) tonBalanceEl.textContent = user.tonBalance.toFixed(2);
  
  // Aktif sayfayı vurgula
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.bottom-menu button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeBtn = document.querySelector(`.bottom-menu button[onclick*="${currentPage}"]`);
  if(activeBtn) activeBtn.classList.add('active');
}
