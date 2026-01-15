const express = require("express"); 
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const db = require("./config/db");

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());

db();

const blogRoutes = require("./routes/blog.js");
const userRoutes = require("./routes/user.js");

app.use("/api", blogRoutes);
app.use("/api", userRoutes);

// TEST ROUTE - Blog eklemek için (GEÇİCİ)
app.get("/api/seed-blogs", async (req, res) => {
    const Blog = require("./models/Blog.js");
    
    try {
        // Önce tüm blogları sil
        await Blog.deleteMany({});
        
        // Test blogları oluştur
        const blogs = await Blog.insertMany([
            {
                title: "Yapay Zeka ve Gelecek",
                slug: "yapay-zeka-ve-gelecek",
                content: "<h2>Yapay Zeka Nedir?</h2><p>Yapay zeka teknolojisi son yıllarda inanılmaz bir hızla gelişiyor. ChatGPT, DALL-E ve diğer AI modelleri hayatımızı değiştiriyor...</p><h3>Gelecekte Neler Bizi Bekliyor?</h3><p>Uzmanlar 2030'a kadar yapay zekanın birçok sektörü tamamen değiştireceğini öngörüyor. Otonom araçlar, tıbbi teşhis sistemleri ve kişiselleştirilmiş eğitim platformları sadece başlangıç...</p>",
                excerpt: "Yapay zeka teknolojisinin gelecekte nasıl bir rol oynayacağını keşfedin.",
                category: "Teknoloji",
                tags: ["yapay zeka", "teknoloji", "gelecek"],
                coverImage: {
                    public_id: "sample1",
                    url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800"
                },
                author: "65a1234567890abcdef12345",
                status: "published",
                featured: true,
                publishedAt: new Date()
            },
            {
                title: "Sağlıklı Yaşam İpuçları",
                slug: "saglikli-yasam-ipuclari",
                content: "<h2>Dengeli Beslenme</h2><p>Dengeli beslenme ve düzenli egzersiz sağlıklı bir yaşamın temel taşlarıdır. Her gün en az 30 dakika yürüyüş yapın...</p><h3>Egzersiz Önerileri</h3><p>Haftada en az 3 gün orta tempolu egzersiz yapmanız önerilir. Yüzme, koşu ve bisiklet gibi aktiviteler idealdir.</p>",
                excerpt: "Dengeli beslenme ve düzenli egzersizle sağlıklı bir yaşam sürdürün.",
                category: "Sağlık",
                tags: ["sağlık", "beslenme", "spor"],
                coverImage: {
                    public_id: "sample2",
                    url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800"
                },
                author: "65a1234567890abcdef12345",
                status: "published",
                featured: false,
                publishedAt: new Date()
            },
            {
                title: "Küresel Isınma ve Etkileri",
                slug: "kuresel-isinma-ve-etkileri",
                content: "<h2>İklim Krizi</h2><p>İklim değişikliği dünyamızın en büyük tehdididir. Bilim insanları uyarıyor: Hemen harekete geçmeliyiz...</p>",
                excerpt: "İklim değişikliği ve dünya üzerindeki etkileri hakkında bilmeniz gerekenler.",
                category: "Dünya",
                tags: ["iklim", "çevre", "doğa"],
                coverImage: {
                    public_id: "sample3",
                    url: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800"
                },
                author: "65a1234567890abcdef12345",
                status: "published",
                featured: true,
                publishedAt: new Date()
            },
            {
                title: "Uzayda Yeni Keşifler",
                slug: "uzayda-yeni-kesifler",
                content: "<h2>Mars Misyonu</h2><p>NASA ve SpaceX uzay keşfinde yeni bir çağ başlattı. Mars'a insanlı görev planları hızla ilerliyor...</p>",
                excerpt: "NASA ve diğer uzay ajanslarının son keşiflerini öğrenin.",
                category: "Bilim",
                tags: ["uzay", "bilim", "keşif"],
                coverImage: {
                    public_id: "sample4",
                    url: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800"
                },
                author: "65a1234567890abcdef12345",
                status: "published",
                featured: false,
                publishedAt: new Date()
            }
        ]);
        
        res.status(200).json({
            success: true,
            message: `${blogs.length} blog başarıyla eklendi!`,
            blogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.get("/", (req, res) => {
    res.status(200).json({ 
        message: "Blog API çalışıyor!",
        endpoints: {
            "Tüm bloglar": "GET /api/blogs",
            "Tek blog": "GET /api/blogs/:slug",
            "İlgili bloglar": "GET /api/blogs/:slug/related",
            "Blog oluştur": "POST /api/blogs",
            "Test verileri ekle": "GET /api/seed-blogs"
        }
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
});