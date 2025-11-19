import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Globe, Mic, Heart, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-culture.jpg";

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Arsip Bahasa Interaktif",
      description: "Rekaman kata, frasa, cerita rakyat, dialek, dan ekspresi lokal dalam format digital yang mudah diakses",
    },
    {
      icon: Globe,
      title: "Peta Hidup Bahasa Nusantara",
      description: "Visualisasi interaktif persebaran dan status bahasa daerah di seluruh Indonesia",
    },
    {
      icon: TrendingUp,
      title: "AI Linguistik",
      description: "Transkripsi suara otomatis, klasifikasi kata, dan kurasi dataset dengan teknologi AI terkini",
    },
    {
      icon: Heart,
      title: "Micro-Learning & Gamifikasi",
      description: "Kartu kosakata visual, tantangan harian, kuis interaktif, dan audio dari penutur asli",
    },
    {
      icon: Mic,
      title: "Kontribusi Komunitas",
      description: "Fitur unggah rekaman suara oleh penutur asli untuk memperkaya database bahasa",
    },
    {
      icon: Users,
      title: "Kamus Multimedia",
      description: "Kamus lengkap dengan audio pelafalan, makna, konteks penggunaan, dan contoh kalimat",
    },
  ];

  const stats = [
    { value: "700+", label: "Bahasa Daerah" },
    { value: "10K+", label: "Kontributor Aktif" },
    { value: "100K+", label: "Kosakata" },
    { value: "50K+", label: "Rekaman Suara" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold text-primary-foreground md:text-6xl">
              Melestarikan Bahasa, Menghidupkan Budaya Digital Nusantara
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/90 md:text-xl">
              Platform berbasis AI dan komunitas untuk melestarikan, mempelajari, dan mendokumentasikan 
              bahasa daerah Indonesia agar tetap hidup di era digital.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/learn">
                <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90 sm:w-auto">
                  Mulai Belajar
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full border-primary-foreground/20 bg-background/10 text-primary-foreground backdrop-blur-sm hover:bg-background/20 sm:w-auto"
                >
                  Gabung Komunitas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Word of the Day Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
                  Kata Hari Ini
                </h2>
                <div className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
                  Sugeng
                </div>
                <p className="mb-2 text-lg text-muted-foreground">
                  (Bahasa Jawa)
                </p>
                <div className="mx-auto mb-4 max-w-md border-t border-border pt-4">
                  <p className="mb-2 text-foreground">
                    <span className="font-semibold">Arti:</span> Selamat
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Contoh:</span> "Sugeng enjing" - Selamat pagi
                  </p>
                </div>
                <Link to="/learn">
                  <Button variant="outline" size="sm">
                    Pelajari Lebih Banyak
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Mengapa RANA?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Platform lengkap untuk pelestarian bahasa daerah dengan teknologi AI modern 
              dan dukungan komunitas yang solid
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-border shadow-soft transition-all hover:shadow-warm">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-hero py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
            Mari Bersama Lestarikan Bahasa Nusantara
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90">
            Setiap kontribusi Anda membantu menjaga kekayaan budaya Indonesia 
            untuk generasi mendatang. Bergabunglah dengan gerakan pelestarian bahasa hari ini!
          </p>
          <Link to="/contribute">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90">
              Mulai Berkontribusi
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
