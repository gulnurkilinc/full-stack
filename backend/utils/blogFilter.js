class BlogFilter {
    constructor(query, queryStr) { 
        this.query = query;
        this.queryStr = queryStr;
    }

    // Arama (başlık, içerik, etiketlerde)
    search() {
        const keyword = this.queryStr.keyword ? {
            $or: [
                { title: { $regex: this.queryStr.keyword, $options: "i" } },
                { content: { $regex: this.queryStr.keyword, $options: "i" } },
                { excerpt: { $regex: this.queryStr.keyword, $options: "i" } },
                { tags: { $in: [new RegExp(this.queryStr.keyword, "i")] } }
            ]
        } : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    // Filtreleme (kategori, durum, etiket, yazar)
    filter() {
        const queryCopy = { ...this.queryStr };
        
        // Sayfalama ve sıralama parametrelerini çıkar
        const removeFields = ["keyword", "page", "limit", "sort"];
        removeFields.forEach(key => delete queryCopy[key]);

        // Kategori filtresi
        if (queryCopy.category) {
            this.query = this.query.find({ category: queryCopy.category });
        }

        // Durum filtresi (draft, published, archived)
        if (queryCopy.status) {
            this.query = this.query.find({ status: queryCopy.status });
        }

        // Etiket filtresi
        if (queryCopy.tag) {
            this.query = this.query.find({ tags: queryCopy.tag });
        }

        // Yazar filtresi
        if (queryCopy.author) {
            this.query = this.query.find({ author: queryCopy.author });
        }

        // Öne çıkan filtresi
        if (queryCopy.featured) {
            this.query = this.query.find({ featured: queryCopy.featured === 'true' });
        }

        return this;
    }

    // Sıralama
    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            // Varsayılan: en yeni önce
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    // Sayfalama
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = BlogFilter;

