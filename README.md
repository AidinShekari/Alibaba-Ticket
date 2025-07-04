# 🎫 Alibaba-Ticket | بلیط علی بابا
این برنامه Node.js به شما امکان می‌دهد تا در دسترس بودن بلیط‌ها را در وب‌سایت علی‌بابا (alibaba.ir) جستجو کنید. با استفاده از فایل config.json برای تنظیمات، درخواست‌هایی برای یافتن بلیط‌ها ارسال می‌کند. قبل از اجرای برنامه، حتماً بسته‌های موردنیاز را با استفاده از npm install نصب کنید.

# **🚀 شروع سریع**

مخزن را کلون کنید:  
`git clone https://github.com/AidinShekari/alibaba-ticket`

به پوشه پروژه بروید:  
`cd alibaba-ticket`

بسته‌های موردنیاز را نصب کنید:  
`npm install`

برنامه را با به‌روزرسانی فایل config.json با URLهای موردنظر و URL وب‌هوک تنظیم کنید.

برنامه را اجرا کنید:  
`node index.js`

# **⚙️ تنظیمات**
فایل config.json را با اطلاعات زیر به‌روزرسانی کنید:

- **urls**: آرایه‌ای از URLهای مربوط به جستجوی بلیط در وب‌سایت علی‌بابا.
- **webhookUrl**: URL وب‌هوک دیسکورد برای ارسال اعلان‌های در دسترس بودن بلیط.

# **📝 توضیحات**
این برنامه با استفاده از URLهای ارائه‌شده، درخواست‌هایی به وب‌سایت علی‌بابا ارسال می‌کند تا در دسترس بودن بلیط‌ها را بررسی کند. از بسته‌های axios، moment-jalaali و discord.js به‌ترتیب برای مدیریت درخواست‌های HTTP، تبدیل تاریخ و ادغام با وب‌هوک دیسکورد استفاده می‌کند.

![تصویر](https://github.com/DarkZo0m/alibaba-ticket/assets/59771519/aa9dc4ed-cfc1-4fb9-9c54-3ce04407f6fc)
