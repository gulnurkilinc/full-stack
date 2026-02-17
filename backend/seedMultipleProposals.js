require('dotenv').config();
const mongoose = require('mongoose');
const KanunTeklifi = require('./models/KanunTeklifi');
const Parti = require('./models/Parti');
const Milletvekili = require('./models/Milletvekili');
const MvOy = require('./models/MvOy');
const KullaniciOy = require('./models/KullaniciOy');

// MongoDB bağlantısı
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB bağlandı');
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error);
    process.exit(1);
  }
};

// Partiler
const partiler = [
  { kod: 'AKP', ad: 'Adalet ve Kalkınma Partisi', renk: '#FFA500', toplamMV: 268 },
  { kod: 'CHP', ad: 'Cumhuriyet Halk Partisi', renk: '#ED1C24', toplamMV: 169 },
  { kod: 'MHP', ad: 'Milliyetçi Hareket Partisi', renk: '#DA251D', toplamMV: 50 },
  { kod: 'İYİ', ad: 'İYİ Parti', renk: '#00ADEF', toplamMV: 36 },
  { kod: 'HDP', ad: 'Halkların Demokratik Partisi', renk: '#9D3596', toplamMV: 55 },
  { kod: 'DEVA', ad: 'Demokrasi ve Atılım Partisi', renk: '#0F47AF', toplamMV: 6 },
  { kod: 'GP', ad: 'Gelecek Partisi', renk: '#00457C', toplamMV: 6 }
];

// İl listesi (81 il)
const iller = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya',
  'Artvin', 'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur',
  'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne',
  'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane',
  'Hakkari', 'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu',
  'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya',
  'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu',
  'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat',
  'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray',
  'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan',
  'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
];

// İsim listesi
const isimler = [
  'Ahmet', 'Mehmet', 'Mustafa', 'Ali', 'Hasan', 'Hüseyin', 'İbrahim', 'Mahmut',
  'Ayşe', 'Fatma', 'Zeynep', 'Elif', 'Emine', 'Hatice', 'Meryem', 'Özlem'
];

const soyisimler = [
  'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Öztürk', 'Aydın',
  'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara', 'Koç'
];

// Kanun teklifleri (15 adet)
const kanunTeklifleri = [
  {
    teklifNo: '2026/142',
    baslik: 'Dijital Hizmet Vergisi Kanunu Teklifi',
    kategori: 'Vergi Mevzuatı',
    aciklama: 'Dijital platformlardan elde edilen gelirlerin vergilendirilmesine ilişkin düzenleme. Sosyal medya, e-ticaret ve dijital reklam gelirlerini kapsayan kapsamlı bir vergi sistemi önerisi.',
    durum: 'GORUSLULUYOR',
    kabul: 310, ret: 160, cekimser: 50, katilmayan: 30
  },
  {
    teklifNo: '2026/143',
    baslik: 'Çevre Koruma ve İklim Değişikliği Kanunu',
    kategori: 'Çevre',
    aciklama: 'İklim değişikliğiyle mücadele ve çevre koruma politikalarının güçlendirilmesi. Karbon emisyonu azaltımı, yenilenebilir enerji teşvikleri ve yeşil dönüşüm hedeflerini içeren kapsamlı kanun.',
    durum: 'KABUL_EDILDI',
    kabul: 380, ret: 120, cekimser: 70, katilmayan: 30
  },
  {
    teklifNo: '2026/144',
    baslik: 'Hayvan Hakları ve Refah Kanunu',
    kategori: 'Adalet',
    aciklama: 'Hayvan haklarının korunması, sokak hayvanlarının bakımı ve hayvan istismarının önlenmesine yönelik cezai müeyyideler içeren kapsamlı düzenleme.',
    durum: 'GORUSLULUYOR',
    kabul: 290, ret: 180, cekimser: 60, katilmayan: 20
  },
  {
    teklifNo: '2026/145',
    baslik: 'Yenilenebilir Enerji Teşvik Kanunu',
    kategori: 'Enerji',
    aciklama: 'Güneş, rüzgar ve hidroelektrik enerji yatırımlarına yönelik teşvik paketleri. Enerji bağımsızlığı hedefine katkı sağlayacak uzun vadeli strateji.',
    durum: 'KABUL_EDILDI',
    kabul: 420, ret: 90, cekimser: 60, katilmayan: 30
  },
  {
    teklifNo: '2026/146',
    baslik: 'Gıda Güvenliği ve Denetim Kanunu',
    kategori: 'Sağlık',
    aciklama: 'Gıda üretim ve dağıtım süreçlerinde kalite standartlarının yükseltilmesi, denetim mekanizmalarının güçlendirilmesi ve tüketici haklarının korunması.',
    durum: 'GORUSLULUYOR',
    kabul: 340, ret: 140, cekimser: 50, katilmayan: 20
  },
  {
    teklifNo: '2026/147',
    baslik: 'Yapay Zeka ve Veri Güvenliği Kanunu',
    kategori: 'Bilim ve Teknoloji',
    aciklama: 'Yapay zeka teknolojilerinin etik kullanımı, kişisel verilerin korunması ve algoritmik şeffaflık ilkelerini düzenleyen modern bir mevzuat.',
    durum: 'GORUSLULUYOR',
    kabul: 280, ret: 200, cekimser: 40, katilmayan: 30
  },
  {
    teklifNo: '2026/148',
    baslik: 'Eğitimde Dijital Dönüşüm Kanunu',
    kategori: 'Eğitim',
    aciklama: 'Okullarda dijital altyapının güçlendirilmesi, uzaktan eğitim standartları ve öğretmen dijital yetkinlik programları.',
    durum: 'REDDEDILDI',
    kabul: 180, ret: 290, cekimser: 60, katilmayan: 20
  },
  {
    teklifNo: '2026/149',
    baslik: 'Asgari Ücret Artış Formülü Kanunu',
    kategori: 'Ekonomi',
    aciklama: 'Asgari ücret artışlarının enflasyon ve büyüme verilerine endeksli şeffaf bir formülle belirlenmesini öngören düzenleme.',
    durum: 'GORUSLULUYOR',
    kabul: 270, ret: 220, cekimser: 40, katilmayan: 20
  },
  {
    teklifNo: '2026/150',
    baslik: 'Kentsel Dönüşüm ve Afet Riski Kanunu',
    kategori: 'Ulaştırma',
    aciklama: 'Deprem riski altındaki yapıların dönüşümü, afet yönetimi ve acil durum planlaması konularında kapsamlı düzenleme.',
    durum: 'KABUL_EDILDI',
    kabul: 410, ret: 100, cekimser: 60, katilmayan: 30
  },
  {
    teklifNo: '2026/151',
    baslik: 'Kadına Yönelik Şiddetle Mücadele Kanunu',
    kategori: 'Aile ve Sosyal Hizmetler',
    aciklama: 'Kadına yönelik şiddetin önlenmesi, mağdur destek mekanizmaları ve caydırıcı cezai müeyyidelerin güçlendirilmesi.',
    durum: 'KABUL_EDILDI',
    kabul: 450, ret: 70, cekimser: 50, katilmayan: 30
  },
  {
    teklifNo: '2026/152',
    baslik: 'Tarımda Sürdürülebilirlik ve Yerel Üretim Kanunu',
    kategori: 'Tarım',
    aciklama: 'Yerli tohumların korunması, organik tarım teşvikleri ve küçük ölçekli çiftçilere destek programları.',
    durum: 'GORUSLULUYOR',
    kabul: 300, ret: 170, cekimser: 60, katilmayan: 20
  },
  {
    teklifNo: '2026/153',
    baslik: 'Sağlıkta İnsan Kaynakları ve Norm Kadro Kanunu',
    kategori: 'Sağlık',
    aciklama: 'Sağlık çalışanlarının çalışma koşullarının iyileştirilmesi, norm kadro eksikliklerinin giderilmesi ve uzman hekim dağılımının dengelenmesi.',
    durum: 'GORUSLULUYOR',
    kabul: 320, ret: 150, cekimser: 60, katilmayan: 20
  },
  {
    teklifNo: '2026/154',
    baslik: 'Kültür ve Sanat Destekleme Kanunu',
    kategori: 'Kültür ve Turizm',
    aciklama: 'Sanatçılara sosyal güvence, kültür merkezlerinin yaygınlaştırılması ve sinema-tiyatro sektörüne destek mekanizmaları.',
    durum: 'REDDEDILDI',
    kabul: 190, ret: 280, cekimser: 60, katilmayan: 20
  },
  {
    teklifNo: '2026/155',
    baslik: 'Gençlik ve Spor Politikaları Kanunu',
    kategori: 'Spor',
    aciklama: 'Gençlere yönelik istihdam programları, spor tesisleri yaygınlaştırma ve amatör spor dallarına destek.',
    durum: 'GORUSLULUYOR',
    kabul: 330, ret: 140, cekimser: 60, katilmayan: 20
  },
  {
    teklifNo: '2026/156',
    baslik: 'Deniz ve Kıyı Koruma Kanunu',
    kategori: 'Çevre',
    aciklama: 'Deniz kirliliğinin önlenmesi, balıkçılık kaynaklarının sürdürülebilir yönetimi ve kıyı ekosistemlerinin korunması.',
    durum: 'GORUSLULUYOR',
    kabul: 350, ret: 130, cekimser: 50, katilmayan: 20
  }
];

// Random isim oluştur
const randomIsim = () => {
  const isim = isimler[Math.floor(Math.random() * isimler.length)];
  const soyisim = soyisimler[Math.floor(Math.random() * soyisimler.length)];
  return `${isim} ${soyisim}`;
};

// Seed fonksiyonu
const seed = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Seed işlemi başlıyor...\n');

    // Eski verileri temizle
    console.log('🗑️ Eski veriler temizleniyor...');
    await KullaniciOy.deleteMany({});
    await MvOy.deleteMany({});
    await KanunTeklifi.deleteMany({});
    await Milletvekili.deleteMany({});
    await Parti.deleteMany({});
    console.log('✅ Eski veriler temizlendi\n');

    // Partiler oluştur
    console.log('🎨 Partiler oluşturuluyor...');
    const createdPartiler = await Parti.insertMany(partiler);
    console.log(`✅ ${createdPartiler.length} parti oluşturuldu\n`);

    // Milletvekilleri oluştur
    console.log('👥 Milletvekilleri oluşturuluyor...');
    const milletvekilleriData = [];
    let koltukIndex = 0;

    for (const parti of createdPartiler) {
      for (let i = 0; i < parti.toplamMV; i++) {
        milletvekilleriData.push({
          adSoyad: randomIsim(),
          parti: parti._id,
          il: iller[Math.floor(Math.random() * iller.length)],
          koltukIndex: koltukIndex++
        });
      }
    }

    const createdMilletvekilleri = await Milletvekili.insertMany(milletvekilleriData);
    console.log(`✅ ${createdMilletvekilleri.length} milletvekili oluşturuldu\n`);

    // Kanun teklifleri ve oylar oluştur
    console.log('📜 Kanun teklifleri oluşturuluyor...\n');
    
    for (const teklifData of kanunTeklifleri) {
      // Teklif oluştur
      const teklif = await KanunTeklifi.create({
        teklifNo: teklifData.teklifNo,
        baslik: teklifData.baslik,
        kategori: teklifData.kategori,
        aciklama: teklifData.aciklama,
        durum: teklifData.durum,
        gorusulmeTarihi: new Date(2026, 0, Math.floor(Math.random() * 28) + 1), // Ocak 2026
        oySayilari: {
          kabul: teklifData.kabul,
          ret: teklifData.ret,
          cekimser: teklifData.cekimser,
          katilmayan: teklifData.katilmayan
        }
      });

      // MV oyları oluştur
      const oylar = [];
      const shuffledMVs = [...createdMilletvekilleri].sort(() => Math.random() - 0.5);
      
      let kabulCount = 0;
      let retCount = 0;
      let cekimserCount = 0;
      let katilmayanCount = 0;

      for (const mv of shuffledMVs) {
        let oyTipi;
        
        if (kabulCount < teklifData.kabul) {
          oyTipi = 'kabul';
          kabulCount++;
        } else if (retCount < teklifData.ret) {
          oyTipi = 'ret';
          retCount++;
        } else if (cekimserCount < teklifData.cekimser) {
          oyTipi = 'cekimser';
          cekimserCount++;
        } else {
          oyTipi = 'katilmayan';
          katilmayanCount++;
        }

        oylar.push({
          teklif: teklif._id,
          milletvekili: mv._id,
          oyTipi,
          oyZamani: teklif.gorusulmeTarihi
        });
      }

      await MvOy.insertMany(oylar);
      
      console.log(`✅ ${teklif.teklifNo} - ${teklif.baslik}`);
      console.log(`   🗳️  ${oylar.length} MV oyu oluşturuldu`);
      console.log(`   🔗 ID: ${teklif._id}\n`);
    }

    console.log('\n📊 SEED ÖZETİ:');
    console.log('================');
    console.log(`✅ Partiler: ${createdPartiler.length}`);
    console.log(`✅ Milletvekilleri: ${createdMilletvekilleri.length}`);
    console.log(`✅ Kanun Teklifleri: ${kanunTeklifleri.length}`);
    console.log(`✅ MV Oyları: ${createdMilletvekilleri.length * kanunTeklifleri.length}`);
    console.log('\n🎉 Seed işlemi başarıyla tamamlandı!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed hatası:', error);
    process.exit(1);
  }
};

seed();