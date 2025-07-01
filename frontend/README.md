🎬 IMDb Clone - Movie Review & Watchlist App
Bu proje, kullanıcıların filmleri keşfedip arayabildiği, yorum yapıp puan verebildiği ve izleme listesi oluşturabildiği bir IMDb benzeri film uygulamasıdır. Vue.js + Node.js (Express) + PostgreSQL mimarisiyle geliştirilmiştir.

🧠 Design Overview
Uygulama, modern web geliştirme prensiplerine uygun şekilde component-based frontend (Vue.js) ve RESTful backend (Express) yapılarıyla oluşturulmuştur. Projede MVC (Model-View-Controller) yaklaşımı ve servis katmanı prensipleri uygulanmıştır.

✅ Features
Kullanıcı kayıt & giriş (JWT)

Film arama ve detay sayfası

IMDb puanı + kullanıcı puanı gösterimi

Yorum yazma ve puan verme

İzleme listesine film ekleme / çıkarma

Responsive arayüz

Çoklu dil desteği (TR & EN)

Dinamik popülerlik sıralaması
    popularity_score = (imdb_rating * 0.5) + (avg_user_rating * 0.3) + (log(comment_count + 1) * 0.2)


🟢 Backend (Node.js)

cd backend
node src/index.js


🟡 Frontend (Vue.js)

cd ../frontend
npm run dev