// منتظر لود شدن DOM بمان
document.addEventListener('DOMContentLoaded', function() {
    console.log('کادوی عاشقانه در حال بارگذاری...');
    
    // اگر سه بعدی داری، اینجا پیاده‌سازی کن
    initLoveScene();
    
    // تابع اصلی برای صحنه عاشقانه
    function initLoveScene() {
        // بررسی کن Three.js در دسترس هست
        if (typeof THREE === 'undefined') {
            console.error('Three.js لود نشده!');
            showError('کادوی ویژه در حال حاضر در دسترس نیست.');
            return;
        }
        
        try {
            // اینجا کد Three.js خودت رو پیاده‌سازی کن
            console.log('Three.js آماده است:', THREE.REVISION);
            
            // مثال ساده از ایجاد صحنه
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('love-scene'), alpha: true });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            
            // اضافه کردن نور
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(5, 5, 5);
            scene.add(light);
            
            // اضافه کردن یک هندسه ساده (مثلاً قلب)
            const geometry = new THREE.SphereGeometry(1, 32, 32);
            const material = new THREE.MeshPhongMaterial({ 
                color: 0xff6b6b,
                shininess: 100
            });
            const sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);
            
            camera.position.z = 5;
            
            // انیمیشن
            function animate() {
                requestAnimationFrame(animate);
                sphere.rotation.x += 0.01;
                sphere.rotation.y += 0.01;
                renderer.render(scene, camera);
            }
            
            animate();
            
            // وقتی کاربر کلیک کرد، پیام عاشقانه نشون بده
            renderer.domElement.addEventListener('click', function() {
                showLoveMessage();
            });
            
        } catch (error) {
            console.error('خطا در ایجاد صحنه:', error);
            showError('مشکلی در نمایش کادو پیش آمد.');
        }
    }
    
    // نمایش پیام عاشقانه
    function showLoveMessage() {
        const messageDiv = document.getElementById('message');
        const messageText = document.getElementById('personal-message');
        
        // پیام‌های عاشقانه (می‌تونی تغییر بدی)
        const messages = [
            "تو زیباترین اتفاق زندگیم هستی 💕",
            "هر روز با تو قشنگ‌تر می‌شود 🌹",
            "عشق من به تو بی‌پایان است ✨",
            "تو معنی واقعی عشق هستی 💖"
        ];
        
        messageText.textContent = messages[Math.floor(Math.random() * messages.length)];
        messageDiv.style.display = 'block';
    }
    
    // بستن پیام
    document.getElementById('close-btn')?.addEventListener('click', function() {
        document.getElementById('message').style.display = 'none';
    });
    
    // نمایش خطا
    function showError(msg) {
        const container = document.getElementById('love-gift-container');
        container.innerHTML = `
            <div style="text-align:center; padding:50px; color:#ff6b6b;">
                <h2>💔 متاسفانه مشکلی پیش آمد</h2>
                <p>${msg}</p>
                <button onclick="location.reload()">دوباره تلاش کن</button>
            </div>
        `;
    }
    
    // ریسایز کردن صحنه وقتی پنجره تغییر اندازه داد
    window.addEventListener('resize', function() {
        // کد ریسایز Three.js رو اینجا اضافه کن
        console.log('ریسایز شد');
    });
});
