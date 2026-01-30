/**
 * LOVE ROSE - کادوی دیجیتال عاشقانه
 * نسخه اصلاح شده با رفع خطاهای اجرایی
 */

// منتظر لود شدن کامل صفحه
window.addEventListener('load', function() {
    console.log('❤️ LOVE ROSE در حال بارگذاری...');
    
    // مخفی کردن صفحه لودینگ
    const loading = document.getElementById('loading');
    const container = document.getElementById('container');
    
    // بررسی وجود Three.js
    if (typeof THREE === 'undefined') {
        showError('Three.js بارگذاری نشد. لطفا اتصال اینترنت را بررسی کنید.');
        return;
    }
    
    // تاخیر برای نمایش انیمیشن لودینگ
    setTimeout(() => {
        initScene();
        loading.style.opacity = '0';
        
        setTimeout(() => {
            loading.style.display = 'none';
            container.style.display = 'block';
            gsap.to(container, { opacity: 1, duration: 1 });
        }, 500);
    }, 1500);
});

function initScene() {
    try {
        // 1. تنظیمات اولیه Three.js
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        
        const canvas = document.getElementById('roseCanvas');
        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // 2. دوربین
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;
        
        // 3. نورپردازی
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        
        // 4. ایجاد هندسه قلب (مشابه کد شما)
        const heartShape = new THREE.Shape();
        heartShape.moveTo(0, 0.5);
        heartShape.bezierCurveTo(0.5, 0.5, 0.5, -0.3, 0, -0.5);
        heartShape.bezierCurveTo(-0.5, -0.3, -0.5, 0.5, 0, 0.5);
        
        const extrudeSettings = {
            depth: 0.2,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 2,
            bevelSize: 0.1,
            bevelThickness: 0.1
        };
        
        const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
        
        // 5. مواد و مش
        const heartMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff3366,
            shininess: 100,
            transparent: true,
            opacity: 0.9
        });
        
        const hearts = [];
        const heartCount = 3;
        
        // ایجاد چند قلب
        for (let i = 0; i < heartCount; i++) {
            const heart = new THREE.Mesh(heartGeometry, heartMaterial);
            
            heart.position.x = (Math.random() - 0.5) * 6;
            heart.position.y = (Math.random() - 0.5) * 4;
            heart.position.z = (Math.random() - 0.5) * 2;
            
            heart.scale.setScalar(0.8 + Math.random() * 0.4);
            heart.rotation.x = Math.random() * Math.PI;
            heart.rotation.y = Math.random() * Math.PI;
            
            scene.add(heart);
            hearts.push({
                mesh: heart,
                speed: 0.01 + Math.random() * 0.02,
                direction: Math.random() > 0.5 ? 1 : -1
            });
        }
        
        // 6. متغیرهای انیمیشن
        let autoRotate = false;
        let animationId = null;
        
        // 7. تابع انیمیشن
        function animate() {
            animationId = requestAnimationFrame(animate);
            
            hearts.forEach((heart, index) => {
                heart.mesh.rotation.y += heart.speed * heart.direction;
                heart.mesh.rotation.x += heart.speed * 0.5;
                
                // حرکت شناور ملایم
                heart.mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
            });
            
            if (autoRotate) {
                scene.rotation.y += 0.005;
            }
            
            renderer.render(scene, camera);
        }
        
        // شروع انیمیشن
        animate();
        
        // 8. کنترل‌های تعاملی
        setupControls(scene, heartGeometry, heartMaterial, hearts, animate);
        
        // 9. ریسایز کردن
        window.addEventListener('resize', function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        console.log('✅ صحنه Three.js با موفقیت راه‌اندازی شد');
        
    } catch (error) {
        console.error('❌ خطا در ایجاد صحنه:', error);
        showError('مشکلی در نمایش کادوی عاشقانه پیش آمد: ' + error.message);
    }
}

function setupControls(scene, heartGeometry, heartMaterial, hearts, animate) {
    // افزودن قلب جدید
    document.getElementById('addHeart').addEventListener('click', function() {
        const heart = new THREE.Mesh(heartGeometry, heartMaterial.clone());
        
        heart.position.x = (Math.random() - 0.5) * 8;
        heart.position.y = (Math.random() - 0.5) * 6;
        heart.position.z = (Math.random() - 0.5) * 4;
        
        heart.scale.setScalar(0.7 + Math.random() * 0.5);
        
        scene.add(heart);
        hearts.push({
            mesh: heart,
            speed: 0.01 + Math.random() * 0.02,
            direction: Math.random() > 0.5 ? 1 : -1
        });
        
        // انیمیشن ظاهر شدن
        heart.scale.set(0.1, 0.1, 0.1);
        gsap.to(heart.scale, {
            x: 0.7 + Math.random() * 0.5,
            y: 0.7 + Math.random() * 0.5,
            z: 0.7 + Math.random() * 0.5,
            duration: 1,
            ease: "back.out(1.7)"
        });
    });
    
    // تغییر رنگ قلب‌ها
    document.getElementById('changeColor').addEventListener('click', function() {
        const colors = [0xff3366, 0x33ccff, 0x9933ff, 0x33ff66, 0xffcc00];
        const newColor = colors[Math.floor(Math.random() * colors.length)];
        
        hearts.forEach(heart => {
            heart.mesh.material.color.setHex(newColor);
        });
    });
    
    // چرخش خودکار
    let rotateInterval = null;
    document.getElementById('autoRotate').addEventListener('click', function() {
        const btn = this;
        const scene = hearts[0]?.mesh.parent;
        
        if (!scene) return;
        
        if (rotateInterval) {
            clearInterval(rotateInterval);
            rotateInterval = null;
            btn.textContent = '🔄 چرخش خودکار';
            btn.style.backgroundColor = '#4CAF50';
        } else {
            rotateInterval = setInterval(() => {
                scene.rotation.y += 0.01;
            }, 16);
            btn.textContent = '⏸ توقف چرخش';
            btn.style.backgroundColor = '#f44336';
        }
    });
}

function showError(message) {
    const container = document.getElementById('container') || document.body;
    
    container.innerHTML = `
        <div class="error-message">
            <h2>💔 مشکلی پیش آمد</h2>
            <p>${message}</p>
            <button onclick="window.location.reload()">تلاش مجدد</button>
        </div>
    `;
    
    // اضافه کردن استایل خطا اگر وجود ندارد
    if (!document.querySelector('style[data-error-style]')) {
        const style = document.createElement('style');
        style.setAttribute('data-error-style', 'true');
        style.textContent = `
            .error-message {
                text-align: center;
                padding: 50px 20px;
                color: #ff6b6b;
                font-family: sans-serif;
            }
            .error-message button {
                background: #ff6b6b;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 16px;
                margin-top: 20px;
            }
        `;
        document.head.appendChild(style);
    }
}
