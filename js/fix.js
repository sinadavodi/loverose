/**
 * فایل رفع مشکلات سریع
 */

// 1. ریست کامل localStorage
localStorage.clear();
console.log('🧹 همه داده‌ها پاک شدند');

// 2. تنظیم تاریخ شروع
localStorage.setItem('rose_start_date', new Date().toISOString());
localStorage.setItem('current_day', '1');

// 3. راه‌اندازی موسیقی مطمئن
function setupMusic() {
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');
    
    if (!musicBtn || !bgMusic) return;
    
    // موسیقی جدید مطمئن
    bgMusic.src = 'https://assets.mixkit.co/music/preview/mixkit-loving-you-117.mp3';
    bgMusic.volume = 0.3;
    
    // فعال‌سازی با یک کلیک
    let clicked = false;
    
    document.addEventListener('click', () => {
        if (!clicked) {
            clicked = true;
            console.log('✅ صفحه فعال شد');
        }
    });
    
    musicBtn.addEventListener('click', function() {
        if (!clicked) {
            alert('لطفاً اول یک بار روی صفحه کلیک کنید');
            return;
        }
        
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                this.innerHTML = '<i class="fas fa-pause"></i>';
                this.classList.add('playing');
                console.log('🎵 موسیقی پخش شد');
            }).catch(e => {
                console.log('خطا:', e);
                alert('برای پخش موسیقی، لطفاً با صفحه تعامل کنید');
            });
        } else {
            bgMusic.pause();
            this.innerHTML = '<i class="fas fa-music"></i>';
            this.classList.remove('playing');
        }
    });
}

// 4. تصحیح شمارش روز
function fixDayCounter() {
    const dateElement = document.getElementById('sentenceDate');
    if (!dateElement) return;
    
    const startDate = localStorage.getItem('rose_start_date');
    if (!startDate) {
        localStorage.setItem('rose_start_date', new Date().toISOString());
        dateElement.textContent = 'روز 1 از 180';
        return;
    }
    
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    dateElement.textContent = `روز ${diffDays} از 180`;
    localStorage.setItem('current_day', diffDays.toString());
}

// 5. ریلود گل
function reloadRose() {
    if (typeof createRose === 'function') {
        // پاک کردن صحنه
        const canvas = document.getElementById('roseCanvas');
        if (canvas && scene) {
            while(scene.children.length > 0){ 
                scene.remove(scene.children[0]); 
            }
            
            // ایجاد گل جدید
            createRose();
            
            // نورپردازی بهتر
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 10, 7);
            scene.add(directionalLight);
            
            console.log('🌹 گل رز دوباره ساخته شد');
        }
    }
}

// 6. وقتی صفحه لود شد اجرا کن
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 شروع رفع مشکلات...');
    
    setTimeout(() => {
        setupMusic();
        fixDayCounter();
        reloadRose();
        
        // نمایش پیام موفقیت
        const toast = document.createElement('div');
        toast.innerHTML = '✅ مشکلات رفع شدند! صفحه را رفرش کنید';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 99999;
            font-family: sans-serif;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
        
        console.log('✨ همه مشکلات رفع شدند');
    }, 1000);
});
