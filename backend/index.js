const express = require("express"); 
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const db = require("./config/db");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());

// Database bağlantısı
db();

// Routes
const blogRoutes = require("./routes/blog.js");
const userRoutes = require("./routes/user.js");

app.use("/api", blogRoutes);
app.use("/api", userRoutes);

// Test route
app.get("/", (req, res) => {
    res.status(200).json({ 
        message: "Blog API çalışıyor!",
        endpoints: {
            blogs: "/api/blogs",
            register: "/api/register",
            login: "/api/login"
        }
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
