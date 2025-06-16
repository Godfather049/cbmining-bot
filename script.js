// Her kullanıcı için benzersiz ID
function getUserId() {
  let userId = localStorage.getItem('cb_user_id');
  if (!userId) {
    userId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    localStorage.setItem('cb_user_id', userId);
  }
  return userId;
}

// Kullanıcı verilerini yükle veya oluştur
function loadUserData() {
  const userId = getUserId();
  const userData = JSON.parse(localStorage.getItem('cb_user_' + userId)) || {
    id: userId,
    balance: 0,
    mining: false,
    miningEnd: null,
    tonBalance: 0,
    clickedTasks: [],
    referrals: [],
    lastSpin: null,
    walletAddress: null,
    clan: null
  };
  return userData;
}

// Kullanıcı verilerini kaydet
function saveUserData(user) {
  localStorage.setItem('cb_user_' + user.id, JSON.stringify(user));
}

// Global user object
let user = loadUserData();

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
  // Her kullanıcı için farklı veri
  user = loadUserData();
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
  
  // Spin wheel initialization
  initSpinWheel();
});

// Madencilik başlat
function startMining() {
  if(user.mining) return;
  
  user.mining = true;
  user.miningEnd = Date.now() + 8 * 60 * 60 * 1000; // 8 saat
  saveUserData(user);
  
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
  saveUserData(user);
  startMining();
  alert("1.5 TON ödendi. Premium madencilik başladı!");
}

// Madencilik tamamlandı
function completeMining() {
  user.balance += 90;
  user.mining = false;
  saveUserData(user);
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
  // Her kullanıcı için benzersiz cüzdan simülasyonu
  user.walletAddress = "UQ" + Math.random().toString(36).substr(2, 44).toUpperCase();
  user.tonBalance = parseFloat((Math.random() * 10).toFixed(2)); // 0-10 arası rastgele bakiye
  saveUserData(user);
  updateUI();
  alert("TON Cüzdan başarıyla bağlandı!\nBakiyeniz: " + user.tonBalance + " TON");
}

// TON Satın Al
function buyTON() {
  window.open("https://ton.org/buy", "_blank");
  alert("Resmi TON satın alma sayfasına yönlendiriliyorsunuz...");
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
  saveUserData(user);
  updateUI();
  alert(`${boost.percent}% kazanç artışı satın alındı! ${boost.price} TON harcandı.`);
}

// Spin wheel initialization
function initSpinWheel() {
  const spinBtn = document.getElementById('spinBtn');
  if(!spinBtn) return;
  
  spinBtn.addEventListener('click', function() {
    const today = new Date().toDateString();
    if(user.lastSpin === today && user.tonBalance < 0.25) {
      alert("Günlük ücretsiz spininizi kullandınız!\nEk spinler için 0.25 TON ödemelisiniz.");
      return;
    }
    
    // Spin ücreti
    if(user.lastSpin === today) {
      user.tonBalance -= 0.25;
    } else {
      user.lastSpin = today;
    }
    
    const wheel = document.querySelector('.wheel');
    const result = Math.floor(Math.random() * 6);
    const prizes = [5, 10, 20, 0, 3, 1];
    const prize = prizes[result];
    
    // Spin animasyonu
    wheel.style.transform = `rotate(${1800 + result * 60}deg)`;
    
    setTimeout(function() {
      if(prize === 0) {
        alert("Maalesef, bu sefer kazanamadınız.");
      } else if(prize === 1) {
        alert("Tebrikler! 1 günlük Premium Mining kazandınız!");
        user.mining = true;
        user.miningEnd = Date.now() + 24 * 60 * 60 * 1000;
      } else if(prize === 3) {
        alert("Tebrikler! 3 ek spin kazandınız!");
        user.spinCount = (user.spinCount || 0) + 3;
      } else {
        alert(`Tebrikler! ${prize} CB kazandınız!`);
        user.balance += prize;
      }
      
      saveUserData(user);
      updateUI();
    }, 4000);
  });
}

// Klan oluştur
function createClan() {
  if(user.tonBalance < 1) {
    alert("Klan oluşturmak için 1 TON gereklidir!");
    return;
  }
  
  const clanName = prompt("Klan adını girin:");
  if(!clanName) return;
  
  user.tonBalance -= 1;
  user.clan = {
    name: clanName,
    id: 'clan_' + Date.now().toString(36),
    members: [user.id]
  };
  
  saveUserData(user);
  alert(`"${clanName}" klanı başarıyla oluşturuldu!`);
}

// Klana katıl
function joinClan() {
  const clanId = prompt("Katılmak istediğiniz klan ID'sini girin:");
  if(!clanId) return;
  
  // Burada gerçekte klan veritabanı kontrol edilecek
  alert(`${clanId} klanına katılma isteği gönderildi!`);
}

// Görev tamamlama
function completeTask(taskId) {
  if(user.clickedTasks.includes(taskId)) {
    alert("Bu görevi zaten tamamladınız!");
    return;
  }
  
  user.clickedTasks.push(taskId);
  user.balance += 10;
  saveUserData(user);
  updateUI();
  
  const tasks = {
    blum: "https://t.me/blum/app?startapp=ref_M96qo1sLIr",
    boinker: "https://t.me/boinker_bot/boinkapp?startapp=boink1463264622",
    cbank: "https://t.me/cbankmining",
    blumcrypto: "https://t.me/blumcrypto_memepad",
    yescoin: "https://t.me/theYescoin_bot/Yescoin?startapp=GtNgBb"
  };
  
  window.open(tasks[taskId], "_blank");
  alert("10 CB kazandınız! Görev tamamlandı.");
}

// Referans link kopyala
function copyRefLink() {
  const refLink = `https://t.me/cbmining_bot?start=ref_${user.id}`;
  navigator.clipboard.writeText(refLink);
  alert("Referans linki kopyalandı!");
}

// Arayüzü güncelle
function updateUI() {
  const balanceEl = document.getElementById('balance');
  const tonBalanceEl = document.getElementById('tonBalance');
  const cbBalanceEl = document.getElementById('cbBalance');
  const refCountEl = document.getElementById('refCount');
  
  if(balanceEl) balanceEl.textContent = user.balance;
  if(tonBalanceEl) tonBalanceEl.textContent = user.tonBalance.toFixed(2);
  if(cbBalanceEl) cbBalanceEl.textContent = user.balance;
  if(refCountEl) refCountEl.textContent = user.referrals.length;
  
  // Aktif sayfayı vurgula
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.bottom-menu button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeBtn = document.querySelector(`.bottom-menu button[onclick*="${currentPage}"]`);
  if(activeBtn) activeBtn.classList.add('active');
}
