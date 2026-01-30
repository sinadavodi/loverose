/**
 * مدیریت نوتیفیکیشن‌های روزانه - نسخه ساده
 */

class NotificationManager {
    constructor() {
        this.reminderTime = '20:00';
        this.loadSettings();
        this.init();
    }

    // بارگذاری تنظیمات
    loadSettings() {
        const saved = localStorage.getItem('roseReminderSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.reminderTime = settings.reminderTime || '20:00';
        }
    }

    // ذخیره تنظیمات
    saveSettings() {
        const settings = {
            reminderTime: this.reminderTime,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('roseReminderSettings', JSON.stringify(settings));
    }

    // مقداردهی اولیه
    async init() {
        // تنظیم تایمر روزانه
        this.setDailyReminder();
        
        // چک کردن نوتیفیکیشن هر دقیقه
        setInterval(() => this.checkReminderTime(), 60000);
        
        console.log('مدیریت نوتیفیکیشن راه‌اندازی شد');
    }

    // تنظیم نوتیفیکیشن روزانه
    setDailyReminder() {
        // پاک کردن reminder قبلی
        if (this.reminderTimeout) {
            clearTimeout(this.reminderTimeout);
        }

        const now = new Date();
        const [hours, minutes] = this.reminderTime.split(':').map(Number);
        
        const reminderTime = new Date();
        reminderTime.setHours(hours, minutes, 0, 0);
        
        // اگر زمان از حالا گذشته، برای فردا تنظیم کن
        if (reminderTime < now) {
            reminderTime.setDate(reminderTime.getDate() + 1);
        }

        const timeUntilReminder = reminderTime - now;
        
        this.reminderTimeout = setTimeout(() => {
            this.sendDailyReminder();
            this.setDailyReminder(); // برای فردا هم تنظیم کن
        }, timeUntilReminder);

        console.log(`یادآوری بعدی: ${reminderTime.toLocaleTimeString('fa-IR')}`);
        return `یادآوری برای ${reminderTime.toLocaleTimeString('fa-IR')} تنظیم شد`;
    }

    // چک کردن زمان یادآوری
    checkReminderTime() {
        const now = new Date();
        const [hours, minutes] = this.reminderTime.split(':').map(Number);
        
        if (now.getHours() === hours && now.getMinutes() === minutes) {
            this.sendDailyReminder();
        }
    }

    // ارسال نوتیفیکیشن روزانه
    sendDailyReminder() {
        // فقط اگر مرورگر از Notification پشتیبانی می‌کند
        if (!('Notification' in window)) {
            console.log('مرورگر از Notification پشتیبانی نمی‌کند');
            return;
        }

        // درخواست مجوز اگر لازم است
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showNotification();
                }
            });
        } else if (Notification.permission === 'granted') {
            this.showNotification();
        }
    }

    // نمایش نوتیفیکیشن
    showNotification() {
        const title = '🌸 وقت سر زدن به رز عشقه!';
        const body = 'یادت نره امروز به رزت سر بزنی، وگرنه شروع به پژمرده شدن می‌کنه!';
        const icon = 'https://cdn-icons-png.flaticon.com/512/1998/1998678.png';

        const notification = new Notification(title, {
            body: body,
            icon: icon,
            tag: 'daily-rose-reminder'
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };

        // پخش صدای نوتیفیکیشن (اختیاری)
        this.playNotificationSound();
        
        console.log('یادآوری روزانه ارسال شد');
    }

    // پخش صدای نوتیفیکیشن
    playNotificationSound() {
        // استفاده از Web Audio API برای تولید صدای ساده
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        } catch (e) {
            console.log('نمی‌توان صدا پخش کرد');
        }
    }

    // تست نوتیفیکیشن
    testNotification() {
        this.sendDailyReminder();
        return 'نوتیفیکیشن تست ارسال شد!';
    }

    // تغییر زمان یادآوری
    setReminderTime(time) {
        this.reminderTime = time;
        this.saveSettings();
        const result = this.setDailyReminder();
        return result;
    }

    // گرفتن وضعیت
    getStatus() {
        return {
            reminderTime: this.reminderTime,
            permission: Notification.permission,
            nextReminder: this.getNextReminderTime()
        };
    }

    // گرفتن زمان یادآوری بعدی
    getNextReminderTime() {
        const now = new Date();
        const [hours, minutes] = this.reminderTime.split(':').map(Number);
        
        const nextTime = new Date();
        nextTime.setHours(hours, minutes, 0, 0);
        
        if (nextTime < now) {
            nextTime.setDate(nextTime.getDate() + 1);
        }
        
        return nextTime;
    }
}

// ایجاد نمونه global
const notificationManager = new NotificationManager();
