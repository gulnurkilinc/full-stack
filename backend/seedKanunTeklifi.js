/*
 * SEED KANUN TEKLIFI SCRIPT
 * 
 * Bu script, veritabanına örnek kanun teklifi, parti, milletvekili ve oy verilerini ekler.
 * 
 * NASIL ÇALIŞTIRILIR:
 * Terminal'de: node seedKanunTeklifi.js
 * 
 * NE YAPAR:
 * 1. Eski verileri temizler (kanun teklifleri, partiler, milletvekilleri, oylar)
 * 2. 7 parti oluşturur (AKP, CHP, MHP, İYİ, HDP, DEM, BAĞ)
 * 3. 600 milletvekili oluşturur
 * 4. 1 örnek kanun teklifi oluşturur (Dijital Hizmet Vergisi)
 * 5. Her milletvekili için oy oluşturur
 * 6. Oy sayılarını günceller
 */

require('dotenv').config();
const mongoose = require('mongoose');
const KanunTeklifi = require('./models/KanunTeklifi');
const Parti = require('./models/Parti');
const Milletvekili = require('./models/Milletvekili');
const MvOy = require('./models/MvOy');

// Database bağlantısı
mongoose.connect(process.env.MONGO_URI);

.then(() => console.log('✅ MongoDB bağlandı'))
.catch(err => console.error('❌ MongoDB bağlantı hatası:', err));

const seedData = async () => {
  try {
    console.log('🌱 Seed işlemi başlıyor...\n');

    // 1️⃣ Eski verileri temizle
    console.log('🗑️ Eski veriler temizleniyor...');
    await Promise.all([
      KanunTeklifi.deleteMany({}),
      Parti.deleteMany({}),
      Milletvekili.deleteMany({}),
      MvOy.deleteMany({})
    ]);
    console.log('✅ Eski veriler temizlendi\n');

    // 2️⃣ Partileri oluştur
    console.log('🎨 Partiler oluşturuluyor...');
    const partiler = await Parti.insertMany([
      { kod: 'AKP', ad: 'AK Parti', renk: '#F7941E', toplamMV: 195 },
      { kod: 'CHP', ad: 'CHP', renk: '#ED1C24', toplamMV: 140 },
      { kod: 'MHP', ad: 'MHP', renk: '#D90B0F', toplamMV: 50 },
      { kod: 'İYİ', ad: 'İYİ Parti', renk: '#00AEEF', toplamMV: 55 },
      { kod: 'HDP', ad: 'HDP', renk: '#7B3F99', toplamMV: 65 },
      { kod: 'DEM', ad: 'DEM Parti', renk: '#6B4C9A', toplamMV: 25 },
      { kod: 'BAĞ', ad: 'Bağımsız', renk: '#95A5A6', toplamMV: 20 }
    ]);
    console.log(`✅ ${partiler.length} parti oluşturuldu\n`);

    // 3️⃣ Milletvekillerini oluştur
    console.log('👥 Milletvekilleri oluşturuluyor...');
    const milletvekilleri = [];
    const isimler = ['Ahmet', 'Mehmet', 'Ali', 'Ayşe', 'Fatma', 'Zeynep', 'Hasan', 'Hüseyin', 'Mustafa', 'Elif'];
    const soyisimler = ['Yılmaz', 'Demir', 'Çelik', 'Kaya', 'Arslan', 'Özkan', 'Şahin', 'Aydın', 'Koç', 'Öztürk'];
    const iller = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Diyarbakır', 'Kayseri'];

    let koltukIndex = 0;

    for (const parti of partiler) {
      for (let i = 0; i < parti.toplamMV; i++) {
        const isim = isimler[Math.floor(Math.random() * isimler.length)];
        const soyisim = soyisimler[Math.floor(Math.random() * soyisimler.length)];
        const il = iller[Math.floor(Math.random() * iller.length)];

        milletvekilleri.push({
          adSoyad: `${isim} ${soyisim}`,
          parti: parti._id,
          il: il,
          koltukIndex: koltukIndex++
        });
      }
    }

    const createdMVler = await Milletvekili.insertMany(milletvekilleri);
    console.log(`✅ ${createdMVler.length} milletvekili oluşturuldu\n`);

    // 4️⃣ Kanun Teklifini oluştur
    console.log('📜 Kanun teklifi oluşturuluyor...');
    const teklif = await KanunTeklifi.create({
      teklifNo: '2026/142',
      baslik: 'Dijital Hizmet Vergisi Kanunu Teklifi',
      kategori: 'Vergi Mevzuatı',
      aciklama: 'Dijital platformların Türkiye\'de sağladıkları hizmetlerden elde ettikleri gelirlerin vergilendirilmesine ilişkin düzenleme. Bu kanun teklifi ile büyük teknoloji şirketlerinin yerel vergi yükümlülüklerinin netleştirilmesi ve dijital ekonominin vergilendirilmesine yönelik çerçevenin oluşturulması hedeflenmektedir.',
      durum: 'KABUL_EDILDI',
      gorusulmeTarihi: new Date('2026-02-02')
    });
    console.log(`✅ Kanun teklifi oluşturuldu: ${teklif.teklifNo}\n`);

    // 5️⃣ Milletvekili oylarını oluştur
    console.log('🗳️ Milletvekili oyları oluşturuluyor...');
    const mvOylari = [];

    for (const mv of createdMVler) {
      const partiKod = partiler.find(p => p._id.equals(mv.parti)).kod;
      let oyTipi;

      // Parti bazlı oy eğilimleri
      if (partiKod === 'AKP') {
        oyTipi = Math.random() < 0.92 ? 'kabul' : Math.random() < 0.5 ? 'ret' : 'cekimser';
      } else if (partiKod === 'CHP') {
        oyTipi = Math.random() < 0.35 ? 'kabul' : Math.random() < 0.8 ? 'ret' : 'cekimser';
      } else if (partiKod === 'MHP') {
        oyTipi = Math.random() < 0.80 ? 'kabul' : Math.random() < 0.6 ? 'ret' : 'cekimser';
      } else if (partiKod === 'İYİ') {
        oyTipi = Math.random() < 0.36 ? 'kabul' : Math.random() < 0.75 ? 'ret' : 'cekimser';
      } else if (partiKod === 'HDP') {
        oyTipi = Math.random() < 0.15 ? 'kabul' : Math.random() < 0.7 ? 'ret' : 'cekimser';
      } else if (partiKod === 'DEM') {
        oyTipi = Math.random() < 0.40 ? 'kabul' : Math.random() < 0.5 ? 'ret' : 'cekimser';
      } else {
        oyTipi = Math.random() < 0.50 ? 'kabul' : Math.random() < 0.5 ? 'ret' : 'cekimser';
      }

      mvOylari.push({
        teklif: teklif._id,
        milletvekili: mv._id,
        oyTipi: oyTipi
      });
    }

    await MvOy.insertMany(mvOylari);
    console.log(`✅ ${mvOylari.length} milletvekili oyu oluşturuldu\n`);

    // 6️⃣ Teklif oy sayılarını güncelle
    console.log('🔄 Teklif oy sayıları güncelleniyor...');
    await teklif.updateVoteCount();
    console.log('✅ Teklif oy sayıları güncellendi\n');

    // 7️⃣ Özet
    console.log('📊 SEED ÖZETİ:');
    console.log('================');
    console.log(`✅ Partiler: ${partiler.length}`);
    console.log(`✅ Milletvekilleri: ${createdMVler.length}`);
    console.log(`✅ Kanun Teklifleri: 1`);
    console.log(`✅ MV Oyları: ${mvOylari.length}`);
    console.log('\n🎉 Seed işlemi başarıyla tamamlandı!');
    console.log('\n💡 Şimdi serveri başlatabilirsiniz: npm run dev');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed hatası:', error);
    process.exit(1);
  }
};

seedData();