// Theme toggle
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const savedTheme = localStorage.getItem('theme') || 'light';

if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeIcon.innerHTML = '<div class="moon-icon"></div>';
}

if (themeBtn) {
  themeBtn.onclick = () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeIcon.innerHTML = isDark ? '<div class="moon-icon"></div>' : '<div class="sun-icon"></div>';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };
}

// Mobile menu
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileToggle && mobileMenu) {
  mobileToggle.onclick = () => {
    mobileMenu.classList.toggle('open');
    mobileToggle.classList.toggle('active');
  };

  document.querySelectorAll('.mobile-links a').forEach(link => {
    link.onclick = () => {
      mobileMenu.classList.remove('open');
      mobileToggle.classList.remove('active');
    };
  });
}

// Waitlist form
const waitlistForm = document.getElementById('waitlistForm');
if (waitlistForm) {
  waitlistForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const btn = e.target.querySelector('.btn');
    const success = document.getElementById('success');
    const orig = btn.textContent;

    btn.textContent = 'Joining...';
    btn.disabled = true;

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        success.style.display = 'block';
        e.target.reset();
        setTimeout(() => success.style.display = 'none', 5000);
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      btn.textContent = orig;
      btn.disabled = false;
    }
  });
}

// Live Demo - Camera functionality
let stream = null;
const startCamera = document.getElementById('startCamera');
const stopCamera = document.getElementById('stopCamera');
const webcamContainer = document.getElementById('webcamContainer');
const output = document.getElementById('output');

if (startCamera && stopCamera && webcamContainer && output) {
  startCamera.onclick = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });

      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.muted = true;
      video.playsInline = true;
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';

      webcamContainer.innerHTML = '';
      webcamContainer.appendChild(video);

      startCamera.style.display = 'none';
      stopCamera.style.display = 'inline-block';

      output.textContent = JSON.stringify({
        status: "Recognizing",
        confidence: 0.94,
        prediction: "HELLO",
        timestamp: Date.now()
      }, null, 2);

    } catch (err) {
      alert('Camera access denied. Please allow camera permissions.');
    }
  };

  stopCamera.onclick = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      webcamContainer.innerHTML = '<div class="webcam-placeholder">Camera stopped</div>';
      startCamera.style.display = 'inline-block';
      stopCamera.style.display = 'none';
      output.textContent = JSON.stringify({
        status: "Ready",
        message: "Click \'Start Camera\' to begin"
      }, null, 2);
    }
  };
}

// Pricing calculator
const slider = document.getElementById('callSlider');
const callCount = document.getElementById('callCount');
const priceDisplay = document.getElementById('priceDisplay');

if (slider && callCount && priceDisplay) {
  slider.oninput = function () {
    const calls = parseInt(this.value);
    callCount.textContent = calls.toLocaleString();

    let price = 0;
    if (calls > 5000) {
      price = (calls - 5000) * 0.002;
    }
    if (calls > 100000) {
      price = price * 0.85;
    }

    priceDisplay.textContent = '$' + price.toFixed(2);
  };
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
