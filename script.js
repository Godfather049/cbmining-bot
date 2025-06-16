// Kullanıcı verileri
let user = {
  balance: 0,
  mining: false,
  miningEnd: null,
  tonBalance: 2.0,
  clickedRefs: [],
  lastSpin: null
};

// DOM Elementleri
const balanceEl = document.getElementById('balance');
const miningBtn = document.getElementById('miningBtn');
const timerEl = document.getElementById('timer');
const premiumBtn = document.getElementById('premiumBtn');

// Madencilik başlat
function startMining() {
  if(user.mining) return;
  
  user.mining = true;
  user.miningEnd = Date.now() + 8 * 60 * 60 * 1000; // 8 saat
  
  miningBtn.classList.add('active');
  updateTimer();
  
  setTimeout(() => {
    user.balance += 90;
    user.mining = false;
    updateUI();
    showNotification("Madencilik tamamlandı! +90 CB kazandınız.");
  }, 8 * 60 * 60 * 1000);
}

// Premium madencilik
function startPremiumMining() {
  if(user.tonBalance < 1.5) {
    showNotification("Yeterli TON bakiyeniz yok!");
    return;
  }
  
  user.tonBalance -= 1.5;
  sendPaymentToAdmin(1.5);
  startMining();
}

// Ödemeyi admin cüzdanına gönder
function sendPaymentToAdmin(amount) {
  // Burada TON blockchain işlemi yapılacak
  console.log(`${amount} TON admin cüzdanına gönderildi: UQB7Qq8821NNJJ5JGp4GbnV66sLWxEDFCtpUUYOaBbW2RpIL`);
}

// Geri sayım
function updateTimer() {
  const now = Date.now();
  const distance = user.miningEnd - now;
  
  if(distance <= 0) {
    timerEl.textContent = "Madenciliği Başlat";
    miningBtn.classList.remove('active');
    return;
  }
  
  const hours = Math.floor(distance / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
  timerEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  if(distance > 0) {
    setTimeout(updateTimer, 1000);
  }
}

// Spin fonksiyonu
function openSpin() {
  const today = new Date().toDateString();
  
  if(user.lastSpin === today) {
    showNotification("Günlük ücretsiz spininizi zaten kullandınız!\nEk spinler için TON veya CBANK yatırın.");
    return;
  }
  
  user.lastSpin = today;
  const prize = Math.floor(Math.random() * 10) + 1; // 1-10 CB arası
  user.balance += prize;
  updateUI();
  showNotification(`Tebrikler! Spin çarkından ${prize} CB kazandınız!`);
}

// Görevler
function openTasks() {
  const refLinks = [
    { url: "https://t.me/blum/app?startapp=ref_M96qo1sLIr", clicked: false },
    { url: "https://t.me/boinker_bot/boinkapp?startapp=boink1463264622", clicked: false },
    { url: "https://t.me/cbankmining", clicked: false },
    { url: "https://t.me/blumcrypto_memepad", clicked: false },
    { url: "https://t.me/theYescoin_bot/Yescoin?startapp=GtNgBb", clicked: false }
  ];
  
  let message = "Görevler (Her biri 10 CB kazandırır):\n\n";
  refLinks.forEach((link, index) => {
    const isClicked = user.clickedRefs.includes(link.url);
    message += `${index+1}. ${isClicked ? '✅ ' : '🔗 '}${link.url}\n`;
  });
  
  const choice = prompt(message + "\nTamamladığınız görevin numarasını girin:");
  if(choice && refLinks[choice-1] && !user.clickedRefs.includes(refLinks[choice-1].url)) {
    user.clickedRefs.push(refLinks[choice-1].url);
    user.balance += 10;
    updateUI();
    showNotification("10 CB kazandınız! Görev tamamlandı.");
  }
}

// Klan fonksiyonları
function openClan() {
  const action = prompt("Klan işlemleri:\n1. Klan oluştur\n2. Klana katıl\n3. Klanımı yönet\n\nSeçiminiz (1-3):");
  
  if(action === "1") {
    showNotification("Klan oluşturmak için 5 TON gereklidir.");
  } else if(action === "2") {
    const clanId = prompt("Katılmak istediğiniz klan ID'sini girin:");
    showNotification(`${clanId} klanına katılma isteği gönderildi.`);
  }
}

// Liderlik tablosu
function openLeaderboard() {
  showNotification("Liderlik tablosu yükleniyor...\n\n1. Kullanıcı1 - 1500 CB\n2. Kullanıcı2 - 1200 CB\n...\n100. Kullanıcı100 - 300 CB\n\nSizin sıralamanız: 100+");
}

// Bildirim göster
function showNotification(message) {
  alert(message);
}

// Arayüzü güncelle
function updateUI() {
  balanceEl.textContent = user.balance;
}

// Event listeners
miningBtn.addEventListener('click', startMining);
premiumBtn.addEventListener('click', startPremiumMining);

// Telegram WebApp entegrasyonu
if(window.Telegram && Telegram.WebApp) {
  Telegram.WebApp.expand();
  
  // Kullanıcı verilerini Telegram'dan al
  const tgUser = Telegram.WebApp.initDataUnsafe.user;
  if(tgUser) {
    user.id = tgUser.id;
    user.username = tgUser.username;
  }
    }
