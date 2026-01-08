const express = require("express"); 
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const db = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json ({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded ({limit: "30mb", extended: true}));
app.use(cookieParser());

app.get("/products", (req,res)  =>
    res.status(200).json({message: "iyi ki hayatımdasın sensiz kimler ağlasın senii yerim yer"})
)

db();

// Routes
const blogRoutes = require("./routes/blog.js");
app.use("/api", blogRoutes);

// Test route
app.get("/", (req, res) => {
    res.status(200).json({ 
        message: "Blog API çalışıyor!",
        endpoints: {
            blogs: "/api/blogs",
            featured: "/api/blogs/featured",
            popular: "/api/blogs/popular",
            detail: "/api/blogs/:slug"
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        message: "Route bulunamadı" 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        message: "Sunucu hatası",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});



const PORT = 4000;
app.listen(PORT, () => {
    console.log("Server is running on port 4000");
});
