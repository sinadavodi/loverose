/**
 * اسکریپت اصلی پروژه رز عاشقانه
 */

// متغیرهای global
let scene, camera, renderer, roseModel;
let health = 100;
let lastVisit = Date.now();
let visitStreak = 1;
let isMusicPlaying = false;
let isNightMode = true;

// گل رز از فایل GLB
const ROSE_MODEL_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Rose.glb';

// مقداردهی اولیه
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🌹 رز عاشقانه در حال بارگذاری...');
    
    try {
        // بارگذاری بانک جملات
        await loadSentences();
        
        // بارگذاری گل رز 3D
        await initScene();
        
        // شروع انیمیشن
        animate();
        
        // راه‌اندازی UI
        setupUI();
        
        // پنهان کردن صفحه لودینگ
        setTimeout(() => {
            document.getElementById('loadingScreen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loadingScreen').style.display = 'none';
                document.getElementById('mainContainer').style.display = 'block';
                gsap.to('#mainContainer', { opacity: 1, duration: 1 });
                
                // نمایش جمله روز
                showDaily();
                
                // شروع موسیقی (اختیاری)
                setTimeout(() => {
                    const musicBtn = document.getElementById('musicBtn');
                    if (musicBtn) musicBtn.click();
                }, 2000);
            }, 500);
        }, 2000);
        
        // شروع سیستم سلامت گل
        startHealthSystem();
        
    } catch (error) {
        console.error('خطا در بارگذاری:', error);
        showError('مشکلی در بارگذاری کادو پیش آمد');
    }
});

// بارگذاری گل رز 3D
async function initScene() {
    // ایجاد صحنه Three.js
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // دوربین
    const canvas = document.getElementById('roseCanvas');
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);
    
    // رندرر
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // نورپردازی
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // بارگذاری مدل گل رز
    await loadRoseModel();
    
    // کنترل‌های OrbitControls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    window.addEventListener('resize', onWindowResize);
}

// بارگذاری مدل گل رز
async function loadRoseModel() {
    return new Promise((resolve, reject) => {
const loader = new GLTFLoader();

loader.load(
  "./models/rose.glb",
  (gltf) => {
    rose = gltf.scene;
    scene.add(rose);
    console.log("🌹 گل رز با موفقیت لود شد");
  },
  undefined,
  (error) => {
    console.error("❌ خطا در بارگذاری مدل:", error);
    createFallbackRose();
  }
);

function createFallbackRose() {
  const geo = new THREE.SphereGeometry(0.8, 32, 32);
  const mat = new THREE.MeshStandardMaterial({ color: 0xff3366 });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
  console.log("🌸 گل رز ساده ساخته شد (fallback)");
}


            (progress) => {
                // نمایش پیشرفت بارگذاری
                const percent = (progress.loaded / progress.total * 100).toFixed(1);
                document.querySelector('.loading-text').textContent = 
                    `بارگذاری گل رز... ${percent}%`;
            },
            (error) => {
                console.error('خطا در بارگذاری مدل:', error);
                // اگر مدل لود نشد، یک گل رز ساده بساز
                createSimpleRose();
                resolve();
            }
        );
    });
}

// ایجاد گل رز ساده (اگر مدل لود نشد)
function createSimpleRose() {
    console.log('ساخت گل رز ساده...');
    
    // ساقه
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = -1.5;
    scene.add(stem);
    
    // گلبرگ‌ها
    const petalGeometry = new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const petalMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff3366,
            side: THREE.DoubleSide
        });
        
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        petal.position.set(
            Math.cos(angle) * 0.3,
            0.5,
            Math.sin(angle) * 0.3
        );
        petal.scale.set(1, 0.3, 0.8);
        petal.rotation.y = angle;
        
        scene.add(petal);
    }
    
    // مرکز گل
    const centerGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const centerMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.position.y = 0.5;
    scene.add(center);
    
    roseModel = scene;
}

// انیمیشن
function animate() {
    requestAnimationFrame(animate);
    
    if (roseModel) {
        // چرخش ملایم گل
        roseModel.rotation.y += 0.002;
        
        // حرکت شناور
        const time = Date.now() * 0.001;
        roseModel.position.y = -1 + Math.sin(time) * 0.1;
    }
    
    renderer.render(scene, camera);
}

// ریسایز پنجره
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// سیستم سلامت گل
function startHealthSystem() {
    // چک سلامت هر ساعت
    setInterval(() => {
        const now = Date.now();
        const hoursSinceLastVisit = (now - lastVisit) / (1000 * 60 * 60);
        
        // اگر بیش از 12 ساعت گذشته، سلامت کم کن
        if (hoursSinceLastVisit > 12) {
            const healthLoss = Math.min(10, hoursSinceLastVisit / 2);
            health = Math.max(0, health - healthLoss);
            updateHealthDisplay();
            
            // اگر سلامت صفر شد، پژمرده شدن
            if (health === 0) {
                startWithering();
            }
        }
        
        // به روزرسانی نمایش آخرین سرزدن
        updateLastVisitDisplay();
    }, 3600000); // هر ساعت
}

// پژمرده شدن گل
function startWithering() {
    if (!roseModel) return;
    
    // تغییر رنگ گل به قهوه‌ای
    roseModel.traverse((child) => {
        if (child.isMesh && child.material) {
            gsap.to(child.material.color, {
                r: 0.4,
                g: 0.2,
                b: 0,
                duration: 3
            });
            
            // کاهش سایز
            gsap.to(child.scale, {
                x: 0.8,
                y: 0.8,
                z: 0.8,
                duration: 3
            });
        }
    });
    
    // نمایش پیام
    showToast('گل شروع به پژمرده شدن کرده! هرچه سریع‌تر سر بزنید.', 'warning');
}

// سرزدن کاربر
function visitRose() {
    const now = Date.now();
    const hoursSinceLastVisit = (now - lastVisit) / (1000 * 60 * 60);
    
    // اگر کمتر از 24 ساعت گذشته، streak را افزایش بده
    if (hoursSinceLastVisit < 24) {
        visitStreak++;
    } else {
        visitStreak = 1; // ریست streak
    }
    
    lastVisit = now;
    
    // بهبود سلامت
    if (health < 100) {
        health = Math.min(100, health + 20);
        updateHealthDisplay();
        
        // اگر در حال پژمرده شدن بود، برگرداندن به حالت عادی
        if (health > 50 && roseModel) {
            roseModel.traverse((child) => {
                if (child.isMesh && child.material) {
                    gsap.to(child.material.color, {
                        r: 1,
                        g: 0.2,
                        b: 0.4,
                        duration: 2
                    });
                    
                    gsap.to(child.scale, {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: 2
                    });
                }
            });
        }
    }
    
    // ذخیره در localStorage
    saveVisitData();
    
    // نمایش پیام
    const messages = [
        'عالی! گل دوباره شاداب شد!',
        'مرسی که سر زدی! 💕',
        'گل از دیدن تو خوشحاله!',
        'این سر زدن عالیه! ادامه بده'
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    showToast(randomMsg, 'success');
}

// به روزرسانی نمایش سلامت
function updateHealthDisplay() {
    const healthFill = document.getElementById('healthFill');
    const healthText = document.getElementById('healthText');
    
    if (healthFill && healthText) {
        healthFill.style.width = `${health}%`;
        healthText.textContent = `سلامت گل: ${Math.round(health)}%`;
        
        // تغییر رنگ بر اساس سلامت
        if (health > 70) {
            healthFill.style.background = 'linear-gradient(90deg, #00b894, #55efc4)';
        } else if (health > 30) {
            healthFill.style.background = 'linear-gradient(90deg, #fdcb6e, #ffeaa7)';
        } else {
            healthFill.style.background = 'linear-gradient(90deg, #ff7675, #fd79a8)';
        }
    }
}

// به روزرسانی نمایش آخرین سرزدن
function updateLastVisitDisplay() {
    const lastVisitElement = document.getElementById('lastVisit');
    const streakCount = document.getElementById('streakCount');
    
    if (lastVisitElement) {
        const now = Date.now();
        const diffMs = now - lastVisit;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        let text = 'همین الان';
        if (diffHours > 0) {
            text = `${diffHours} ساعت و ${diffMinutes} دقیقه قبل`;
        } else if (diffMinutes > 0) {
            text = `${diffMinutes} دقیقه قبل`;
        }
        
        lastVisitElement.textContent = `آخرین سرزدن: ${text}`;
    }
    
    if (streakCount) {
        streakCount.textContent = `${visitStreak} روز متوالی`;
    }
}

// نمایش جمله روز
function showDailySentence() {
    const sentenceData = import { sentenceManager } from "./sentences.js";

    
    const sentenceText = document.getElementById('sentenceText');
    const sentenceDate = document.getElementById('sentenceDate');
    
    if (sentenceText) {
        sentenceText.textContent = `"${sentenceData.text}"`;
        
        // انیمیشن ظاهر شدن
        gsap.fromTo(sentenceText,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
        );
    }
    
    if (sentenceDate) {
        sentenceDate.textContent = `روز ${sentenceData.day} از ${sentenceData.totalDays}`;
    }
}

// راه‌اندازی UI
function setupUI() {
    // تغییر حالت روز/شب
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
    
    // کنترل موسیقی
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');
    
    if (musicBtn && bgMusic) {
        musicBtn.addEventListener('click', () => {
            if (isMusicPlaying) {
                bgMusic.pause();
                musicBtn.innerHTML = '<i class="fas fa-music"></i>';
                musicBtn.classList.remove('playing');
            } else {
                bgMusic.play().catch(e => {
                    console.log('خطا در پخش موسیقی:', e);
                    showToast('برای پخش موسیقی، با صفحه تعامل کنید', 'info');
                });
                musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
                musicBtn.classList.add('playing');
            }
            isMusicPlaying = !isMusicPlaying;
        });
    }
    
    // جمله بعدی
    const nextSentenceBtn = document.getElementById('nextSentence');
    if (nextSentenceBtn) {
        nextSentenceBtn.addEventListener('click', showDailySentence);
    }
    
    // نوتیفیکیشن
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPanel = document.getElementById('notificationPanel');
    
    if (notificationBtn && notificationPanel) {
        notificationBtn.addEventListener('click', () => {
            notificationPanel.style.display = 
                notificationPanel.style.display === 'block' ? 'none' : 'block';
        });
        
        // بستن پنل با کلیک خارج
        document.addEventListener('click', (e) => {
            if (!notificationPanel.contains(e.target) && 
                !notificationBtn.contains(e.target)) {
                notificationPanel.style.display = 'none';
            }
        });
    }
    
    // ذخیره تنظیمات نوتیفیکیشن
    const saveNotificationBtn = document.getElementById('saveNotification');
    const reminderTimeInput = document.getElementById('reminderTime');
    const testNotificationBtn = document.getElementById('testNotification');
    
    if (saveNotificationBtn && reminderTimeInput) {
        saveNotificationBtn.addEventListener('click', () => {
            const result = notificationManager.setReminderTime(reminderTimeInput.value);
            showToast(result, 'success');
            notificationPanel.style.display = 'none';
        });
    }
    
    if (testNotificationBtn) {
        testNotificationBtn.addEventListener('click', () => {
            notificationManager.testNotification();
        });
    }
    
    // کلیک روی گل = سرزدن
    const canvas = document.getElementById('roseCanvas');
    if (canvas) {
        canvas.addEventListener('click', (e) => {
            if (e.target === canvas) {
                visitRose();
                
                // افکت کلیک
                const x = e.clientX;
                const y = e.clientY;
                
                createHeartEffect(x, y);
            }
        });
    }
    
    // بارگذاری داده‌های ذخیره شده
    loadVisitData();
}

// تغییر حالت روز/شب
function toggleTheme() {
    isNightMode = !isNightMode;
    document.body.classList.toggle('night-mode', isNightMode);
    
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        themeBtn.innerHTML = isNightMode ? 
            '<i class="fas fa-moon"></i>' : 
            '<i class="fas fa-sun"></i>';
    }
    
    // تغییر پس‌زمینه صحنه Three.js
    if (scene) {
        scene.background = new THREE.Color(isNightMode ? 0x000000 : 0x87CEEB);
    }
}

// ایجاد افکت قلب هنگام کلیک
function createHeartEffect(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = '24px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    heart.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(heart);
    
    gsap.to(heart, {
        y: y - 100,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => heart.remove()
    });
    
    gsap.to(heart, {
        scale: 1.5,
        duration: 0.5,
        yoyo: true,
        repeat: 1
    });
}

// نمایش Toast
function showToast(message, type = 'info') {
    // اگر از قبل toast وجود دارد، پاکش کن
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                           type === 'warning' ? 'exclamation-triangle' : 
                           type === 'error' ? 'times-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // استایل toast
    toast.style.cssText = `
        position: fixed;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#00b894' : 
                     type === 'warning' ? '#fdcb6e' : 
                     type === 'error' ? '#ff7675' : '#6c5ce7'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: inherit;
        animation: slideIn 0.3s ease;
    `;
    
    // انیمیشن
    gsap.fromTo(toast,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3 }
    );
    
    // پنهان شدن خودکار
    setTimeout(() => {
        gsap.to(toast, {
            y: -50,
            opacity: 0,
            duration: 0.3,
            onComplete: () => toast.remove()
        });
    }, 3000);
}

// ذخیره داده‌های سرزدن
function saveVisitData() {
    const data = {
        lastVisit: lastVisit,
        visitStreak: visitStreak,
        health: health
    };
    localStorage.setItem('roseVisitData', JSON.stringify(data));
}

// بارگذاری داده‌های سرزدن
function loadVisitData() {
    const saved = localStorage.getItem('roseVisitData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            lastVisit = data.lastVisit || Date.now();
            visitStreak = data.visitStreak || 1;
            health = data.health || 100;
            
            // چک کردن زمان از آخرین سرزدن
            const hoursSinceLastVisit = (Date.now() - lastVisit) / (1000 * 60 * 60);
            if (hoursSinceLastVisit > 12) {
                health = Math.max(0, health - (hoursSinceLastVisit / 2));
            }
            
            updateHealthDisplay();
            updateLastVisitDisplay();
        } catch (e) {
            console.error('خطا در بارگذاری داده‌ها:', e);
        }
    }
}

// نمایش خطا
function showError(message) {
    document.body.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%);
            color: #ff6b6b;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 20px;
            font-family: sans-serif;
        ">
            <h1 style="font-size: 2.5rem; margin-bottom: 20px;">💔 مشکلی پیش آمد</h1>
            <p style="font-size: 1.2rem; margin-bottom: 30px; max-width: 500px;">${message}</p>
            <button onclick="window.location.reload()" style="
                background: #ff6b6b;
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 25px;
                font-size: 1rem;
                cursor: pointer;
                font-weight: bold;
            ">
                تلاش مجدد
            </button>
        </div>
    `;
}

// بارگذاری بانک جملات
async function loadSentences() {
    // اگر فایل sentences.js جداگانه داریم، منتظر لودش می‌شویم
    if (typeof sentenceManager === 'undefined') {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return true;
}
