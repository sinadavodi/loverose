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
                showDailySentence();
                
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
        showError('مشکلی در بارگذاری کادو پیش
