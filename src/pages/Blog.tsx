import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";

const Blog = () => {
  const articles = [
    {
      title: "Peluncuran Fitur AI Voice untuk Bahasa Jawa",
      excerpt: "RANA menghadirkan teknologi text-to-speech berbasis AI untuk bahasa Jawa dengan 3 tingkatan bahasa: Ngoko, Madya, dan Krama Inggil.",
      author: "Tim RANA",
      date: "15 Januari 2025",
      category: "Teknologi",
      readTime: "5 menit",
    },
    {
      title: "Kisah Sukses: Revitalisasi Bahasa Batak di Kalangan Muda",
      excerpt: "Bagaimana komunitas muda Batak Toba menggunakan RANA untuk menghidupkan kembali minat terhadap bahasa leluhur mereka.",
      author: "Maria Situmorang",
      date: "10 Januari 2025",
      category: "Komunitas",
      readTime: "8 menit",
    },
    {
      title: "Kolaborasi dengan UNESCO: Dokumentasi 50 Bahasa Terancam Punah",
      excerpt: "RANA bermitra dengan UNESCO untuk mendokumentasikan bahasa-bahasa daerah yang terancam punah di Indonesia bagian timur.",
      author: "Dr. Arief Budiman",
      date: "5 Januari 2025",
      category: "Berita",
      readTime: "6 menit",
    },
    {
      title: "Panduan: Cara Merekam Suara Berkualitas untuk Voice Dataset",
      excerpt: "Tips dan trik merekam pelafalan bahasa daerah dengan kualitas tinggi menggunakan smartphone Anda.",
      author: "Fadli Rahman",
      date: "28 Desember 2024",
      category: "Tutorial",
      readTime: "10 menit",
    },
    {
      title: "Ekonomi Kreatif: Monetisasi Konten Bahasa Daerah",
      excerpt: "Peluang ekonomi dari pelestarian bahasa daerah - dari AI dataset hingga konten kreatif dan pariwisata budaya.",
      author: "Siti Nurhaliza",
      date: "20 Desember 2024",
      category: "Bisnis",
      readTime: "7 menit",
    },
    {
      title: "Aksara Nusantara: Mengenal Sistem Tulisan Tradisional Indonesia",
      excerpt: "Eksplorasi keindahan dan keunikan aksara Jawa, Bali, Batak, Bugis, dan aksara tradisional lainnya.",
      author: "Prof. I Made Sudarma",
      date: "15 Desember 2024",
      category: "Budaya",
      readTime: "12 menit",
    },
  ];

  const categories = ["Semua", "Teknologi", "Komunitas", "Berita", "Tutorial", "Bisnis", "Budaya"];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Blog & Berita
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Ikuti perkembangan terbaru, kisah inspiratif, dan wawasan mendalam 
            tentang pelestarian bahasa daerah Indonesia
          </p>
        </div>

        {/* Categories Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((category, index) => (
            <Button
              key={index}
              variant={category === "Semua" ? "default" : "outline"}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Article */}
        <section className="mb-12">
          <Card className="overflow-hidden border-border shadow-warm">
            <div className="grid md:grid-cols-2">
              <div className="h-64 bg-gradient-hero md:h-auto" />
              <div className="p-8">
                <Badge className="mb-3 bg-accent text-accent-foreground">
                  Artikel Unggulan
                </Badge>
                <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
                  {articles[0].title}
                </h2>
                <p className="mb-4 text-muted-foreground">{articles[0].excerpt}</p>
                <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {articles[0].author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {articles[0].date}
                  </div>
                  <Badge variant="outline">{articles[0].category}</Badge>
                </div>
                <Button>
                  Baca Selengkapnya
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Articles Grid */}
        <section>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.slice(1).map((article, index) => (
              <Card key={index} className="flex flex-col border-border shadow-soft transition-all hover:shadow-warm">
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="outline">{article.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {article.readTime}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {article.date}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Baca Artikel
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" size="lg">
              Muat Lebih Banyak Artikel
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blog;
