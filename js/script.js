/**
 * اسکریپت اصلی پروژه رز عاشقانه - نسخه ساده و بدون خطا
 */

// متغیرهای global
let scene, camera, renderer;
let health = 100;
let lastVisit = Date.now();
let visitStreak = 1;
let isMusicPlaying = false;
let isNightMode = true;

// مقداردهی اولیه
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🌹 رز عاشقانه در حال بارگذاری...');
    
    try {
        // راه‌اندازی صحنه Three.js
        initScene();
        
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
                showDailySentence();
            }, 500);
        }, 2000);
        
        // شروع سیستم سلامت گل
        startHealthSystem();
        
    } catch (error) {
        console.error('خطا در بارگذاری:', error);
        showError('مشکلی در بارگذاری کادو پیش آمد: ' + error.message);
    }
});

// ایجاد صحنه Three.js
function initScene() {
    // ایجاد صحنه
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
    
    // نورپردازی
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // ایجاد یک گل رز ساده اما زیبا
    createRose();
    
    // OrbitControls (حالا که لینکش اضافه شده)
    if (typeof THREE.OrbitControls !== 'undefined') {
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
    }
    
    window.addEventListener('resize', onWindowResize);
}

// ایجاد گل رز زیبا و واقعی
function createRose() {
    console.log('🌸 ساخت گل رز زیبا...');
    
    // حذف گل قبلی اگر وجود دارد
    scene.children.slice().forEach(child => {
        if (child.type === 'Mesh') {
            scene.remove(child);
        }
    });
    
    // ساقه اصلی (بلندتر و ظریف‌تر)
    const stemGeometry = new THREE.CylinderGeometry(0.04, 0.06, 5, 12);
    const stemMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x228B22,
        roughness: 0.7,
        metalness: 0.1
    });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = -2.5;
    stem.castShadow = true;
    scene.add(stem);
    
    // برگ‌های براق
    const leafGeometry = new THREE.PlaneGeometry(1.5, 0.7);
    const leafMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x32CD32,
        side: THREE.DoubleSide,
        roughness: 0.3,
        metalness: 0.2
    });
    
    const leaves = [];
    for (let i = 0; i < 6; i++) {
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        const angle = (i / 6) * Math.PI * 2;
        const radius = 0.4;
        
        leaf.position.set(
            Math.cos(angle) * radius,
            -1.5 + (i % 3) * 0.8,
            Math.sin(angle) * radius
        );
        
        leaf.rotation.x = Math.PI / 3;
        leaf.rotation.z = angle;
        leaf.scale.set(0.6, 0.6, 1);
        leaf.castShadow = true;
        
        scene.add(leaf);
        leaves.push(leaf);
    }
    
    // مرکز گل (کلاله) با جزئیات بیشتر
    const centerGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const centerMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFD700,
        emissive: 0x996600,
        emissiveIntensity: 0.3,
        roughness: 0.2,
        metalness: 0.5
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.position.y = 0.8;
    center.castShadow = true;
    scene.add(center);
    
    // گلبرگ‌های داخلی (قلب‌یشکل و ظریف)
    const petalCount = 12;
    for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        const radius = 0.7;
        
        // ایجاد شکل قلب برای گلبرگ
        const heartShape = new THREE.Shape();
        heartShape.moveTo(0, 0);
        heartShape.bezierCurveTo(0.5, 0.5, 0.8, 0.8, 0, 1.5);
        heartShape.bezierCurveTo(-0.8, 0.8, -0.5, 0.5, 0, 0);
        
        const extrudeSettings = {
            depth: 0.08,
            bevelEnabled: true,
            bevelSegments: 3,
            steps: 2,
            bevelSize: 0.05,
            bevelThickness: 0.05
        };
        
        const petalGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
        
        // رنگ‌های صورتی و قرمز برای گلبرگ‌ها
        const colors = [0xFF69B4, 0xFF1493, 0xFF0066, 0xFF3366];
        const petalMaterial = new THREE.MeshStandardMaterial({ 
            color: colors[i % colors.length],
            roughness: 0.2,
            metalness: 0.1,
            side: THREE.DoubleSide
        });
        
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        
        // موقعیت گلبرگ‌ها به صورت مارپیچ
        const spiralOffset = i * 0.3;
        petal.position.set(
            Math.cos(angle + spiralOffset) * radius * 0.8,
            0.5 + Math.sin(angle) * 0.2,
            Math.sin(angle + spiralOffset) * radius * 0.8
        );
        
        // چرخش طبیعی گلبرگ‌ها
        petal.rotation.y = angle + spiralOffset;
        petal.rotation.x = Math.PI / 4 + Math.sin(angle) * 0.2;
        
        // اندازه‌های مختلف برای طبیعی‌تر شدن
        const scale = 0.3 + Math.sin(i) * 0.05;
        petal.scale.set(scale, scale, scale);
        
        petal.castShadow = true;
        scene.add(petal);
    }
    
    // گلبرگ‌های بیرونی (بزرگ و باز)
    const outerPetalCount = 8;
    for (let i = 0; i < outerPetalCount; i++) {
        const angle = (i / outerPetalCount) * Math.PI * 2;
        const radius = 1.2;
        
        // گلبرگ‌های بیرونی کشیده‌تر
        const outerPetalGeometry = new THREE.ConeGeometry(0.8, 1.5, 24);
        
        // رنگ‌های روشن‌تر برای گلبرگ‌های بیرونی
        const outerPetalMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFB6C1, // صورتی بسیار روشن
            roughness: 0.3,
            metalness: 0.05,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9
        });
        
        const outerPetal = new THREE.Mesh(outerPetalGeometry, outerPetalMaterial);
        
        outerPetal.position.set(
            Math.cos(angle) * radius,
            0.2,
            Math.sin(angle) * radius
        );
        
        // گلبرگ‌های بیرونی کمی افتاده
        outerPetal.rotation.y = angle;
        outerPetal.rotation.x = Math.PI / 2.2;
        
        // اندازه‌های مختلف
        const scale = 0.6 + Math.cos(i * 0.5) * 0.1;
        outerPetal.scale.set(scale, 0.8, scale * 0.7);
        
        outerPetal.castShadow = true;
        scene.add(outerPetal);
    }
    
    // نورهای رنگی اطراف گل (افکت جادویی)
    const lightCount = 15;
    for (let i = 0; i < lightCount; i++) {
        const lightGeometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.03, 8, 8);
        const lightMaterial = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color().setHSL(Math.random(), 0.8, 0.7),
            transparent: true,
            opacity: 0.8
        });
        
        const lightParticle = new THREE.Mesh(lightGeometry, lightMaterial);
        
        const radius = 2.5 + Math.random() * 1;
        const angle = Math.random() * Math.PI * 2;
        const height = -1 + Math.random() * 3;
        
        lightParticle.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
        );
        
        // ذخیره برای انیمیشن
        lightParticle.userData = {
            speed: 0.5 + Math.random() * 0.5,
            angle: angle,
            radius: radius,
            height: height,
            timeOffset: Math.random() * Math.PI * 2
        };
        
        scene.add(lightParticle);
    }
    
    // شبنم‌های براق روی گلبرگ‌ها
    const dewCount = 20;
    for (let i = 0; i < dewCount; i++) {
        const dewGeometry = new THREE.SphereGeometry(0.03 + Math.random() * 0.02, 8, 8);
        const dewMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x87CEEB,
            roughness: 0.1,
            metalness: 0.9,
            transparent: true,
            opacity: 0.7
        });
        
        const dew = new THREE.Mesh(dewGeometry, dewMaterial);
        
        // قرار دادن شبنم‌ها روی گلبرگ‌ها
        const radius = 0.5 + Math.random() * 0.8;
        const angle = Math.random() * Math.PI * 2;
        const height = 0.2 + Math.random() * 0.6;
        
        dew.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
        );
        
        scene.add(dew);
    }
    
    console.log('🌸 گل رز زیبا ساخته شد!');
    
    // برگرداندن object برای انیمیشن
    return { stem, leaves, center };
}

// انیمیشن
function animate() {
    requestAnimationFrame(animate);
    
    // چرخش ملایم کل صحنه
    scene.rotation.y += 0.001;
    
    // حرکت شناور گلبرگ‌ها
    const time = Date.now() * 0.001;
    scene.children.forEach((child, index) => {
        if (child.type === 'Mesh' && child.geometry.type.includes('Cone')) {
            // حرکت موجی برای گلبرگ‌های بیرونی
            child.position.y = 0.3 + Math.sin(time + index) * 0.1;
            child.rotation.x = Math.PI / 2 + Math.sin(time * 0.5 + index) * 0.05;
        }
        
        // حرکت نقطه‌های نورانی
        if (child.geometry && child.geometry.type === 'SphereGeometry' && child.material.opacity < 1) {
            child.position.y += Math.sin(time + index) * 0.01;
            child.rotation.x += 0.01;
            child.rotation.y += 0.01;
        }
    });
    
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
    // تغییر رنگ گل‌ها به قهوه‌ای
    scene.children.forEach(child => {
        if (child.isMesh && child.material && child.material.color) {
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
        if (health > 50) {
            scene.children.forEach(child => {
                if (child.isMesh && child.material && child.material.color) {
                    // برگرداندن رنگ گلبرگ‌ها
                    if (child.geometry.type.includes('Cone') || child.geometry.type === 'ExtrudeGeometry') {
                        gsap.to(child.material.color, {
                            r: 1,
                            g: 0.2,
                            b: 0.4,
                            duration: 2
                        });
                    }
                    
                    // برگرداندن سایز
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
    
    // ایجاد افکت قلب
    createHeartEffect(window.innerWidth / 2, window.innerHeight / 2);
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
    let sentenceData;
    
    if (typeof sentenceManager !== 'undefined') {
        sentenceData = sentenceManager.getDailySentence();
    } else {
        // fallback - شروع از روز 1
        const startDate = localStorage.getItem('rose_start_date');
        if (!startDate) {
            localStorage.setItem('rose_start_date', new Date().toISOString());
        }
        
        const start = new Date(startDate || new Date());
        const today = new Date();
        const diffTime = Math.abs(today - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const sentences = [
            "ببین، من یه مشکلی دارم: نمیتونم بیشتر از ۵ دقیقه بهت فکر نکنم! دکتر بگو چیکار کنم؟ 💊",
            "عشقم، امروز صبح که بیدار شدم اولین چیزی که خواستم ببینم چشای تو بود... ولی گوشیمو دیدم! 😂",
            "من یه جوری عاشقتم که حتی موقع دعوامونم دوستت دارم! (البته کمتر! شوخی کردم 😘)",
            // بقیه جملات...
        ];
        
        sentenceData = {
            text: sentences[diffDays % sentences.length] || sentences[0],
            day: diffDays + 1, // همیشه از 1 شروع کن
            totalDays: 180
        };
    }
    
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
        // نمایش درست روز: همیشه از 1 شروع کن
        const displayDay = Math.max(1, sentenceData.day);
        sentenceDate.textContent = `روز ${displayDay} از ${sentenceData.totalDays}`;
    }
    
    // ذخیره روز فعلی
    localStorage.setItem('current_rose_day', sentenceData.day);
}

// راه‌اندازی UI
function setupUI() {
    // تغییر حالت روز/شب
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
    
 // کنترل موسیقی - نسخه اصلاح شده
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');

if (musicBtn && bgMusic) {
    // تنظیم حجم موسیقی
    bgMusic.volume = 0.5;
    
    // برای پخش خودکار بعد از تعامل کاربر
    let userInteracted = false;
    
    document.addEventListener('click', () => {
        if (!userInteracted) {
            userInteracted = true;
            console.log('کاربر با صفحه تعامل کرد، موسیقی آماده پخش است');
        }
    });
    
    musicBtn.addEventListener('click', () => {
        if (!userInteracted) {
            showToast('لطفاً اول یک بار روی صفحه کلیک کنید', 'info');
            return;
        }
        
        if (isMusicPlaying) {
            bgMusic.pause();
            musicBtn.innerHTML = '<i class="fas fa-music"></i>';
            musicBtn.classList.remove('playing');
            musicBtn.title = 'پخش موسیقی';
        } else {
            // پخش موسیقی با هندلینگ خطا
            const playPromise = bgMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    musicBtn.classList.add('playing');
                    musicBtn.title = 'توقف موسیقی';
                    console.log('موسیقی پخش شد');
                }).catch(error => {
                    console.log('خطا در پخش موسیقی:', error);
                    showToast('برای پخش موسیقی، روی صفحه کلیک کنید', 'info');
                    musicBtn.innerHTML = '<i class="fas fa-music"></i>';
                    isMusicPlaying = false;
                });
            }
        }
        isMusicPlaying = !isMusicPlaying;
    });
    
    // وقتی موسیقی تمام شد، دوباره شروع کن
    bgMusic.addEventListener('ended', () => {
        bgMusic.currentTime = 0;
        bgMusic.play();
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
            if (typeof notificationManager !== 'undefined') {
                const result = notificationManager.setReminderTime(reminderTimeInput.value);
                showToast(result, 'success');
            } else {
                showToast('یادآوری برای ساعت ' + reminderTimeInput.value + ' تنظیم شد', 'success');
            }
            notificationPanel.style.display = 'none';
        });
    }
    
    if (testNotificationBtn) {
        testNotificationBtn.addEventListener('click', () => {
            if (typeof notificationManager !== 'undefined') {
                notificationManager.testNotification();
            } else {
                showToast('نوتیفیکیشن تست در مرورگرهای مدرن کار می‌کند', 'info');
            }
        });
    }
    
    // کلیک روی گل = سرزدن
    const canvas = document.getElementById('roseCanvas');
    if (canvas) {
        canvas.addEventListener('click', (e) => {
            if (e.target === canvas) {
                visitRose();
                
                // افکت کلیک در محل کلیک
                createHeartEffect(e.clientX, e.clientY);
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
