import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, BookOpen, Star, TrendingUp, Award, Trophy, Target, Zap } from "lucide-react";
import { useState } from "react";

const Learn = () => {
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const flashcards = [
    {
      word: "Sugeng enjang",
      meaning: "Selamat pagi",
      image: "☀️",
      pronunciation: "/sugəŋ əɲdʒaŋ/",
      example: "Sugeng enjang, Pak. Piye kabare?",
      exampleTranslation: "Selamat pagi, Pak. Bagaimana kabarnya?"
    },
    {
      word: "Matur nuwun",
      meaning: "Terima kasih",
      image: "🙏",
      pronunciation: "/matur nuwun/",
      example: "Matur nuwun sampun diampuni.",
      exampleTranslation: "Terima kasih sudah dimaafkan."
    },
    {
      word: "Sampun dhahar",
      meaning: "Sudah makan",
      image: "🍽️",
      pronunciation: "/sampun ḍahar/",
      example: "Sampun dhahar enjang dereng?",
      exampleTranslation: "Sudah makan pagi belum?"
    },
    {
      word: "Pinten rega",
      meaning: "Berapa harga",
      image: "💰",
      pronunciation: "/pintən rəga/",
      example: "Pinten regane barang niki?",
      exampleTranslation: "Berapa harga barang ini?"
    },
  ];

  const dailyChallenges = [
    {
      title: "Tantangan Kosakata Harian",
      description: "Tebak 10 kata dalam bahasa Jawa",
      points: 50,
      completed: false,
      icon: Target,
    },
    {
      title: "Latihan Pelafalan",
      description: "Rekam 5 kata dengan pelafalan yang benar",
      points: 75,
      completed: true,
      icon: Volume2,
    },
    {
      title: "Kuis Cerita Rakyat",
      description: "Jawab pertanyaan tentang legenda lokal",
      points: 100,
      completed: false,
      icon: BookOpen,
    },
  ];

  const achievements = [
    { name: "Pemula Rajin", icon: "🌱", unlocked: true },
    { name: "Kolektor Kata", icon: "📚", unlocked: true },
    { name: "Pelafalan Sempurna", icon: "🎯", unlocked: true },
    { name: "Master Bahasa", icon: "👑", unlocked: false },
    { name: "Kontributor Aktif", icon: "⭐", unlocked: false },
  ];

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    setCurrentFlashcard((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevFlashcard = () => {
    setIsFlipped(false);
    setCurrentFlashcard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const languages = [
    {
      name: "Bahasa Jawa",
      region: "Jawa Tengah, Jawa Timur, DI Yogyakarta",
      speakers: "84 juta",
      difficulty: "Pemula",
      lessons: 48,
      popular: true,
    },
    {
      name: "Bahasa Sunda",
      region: "Jawa Barat, Banten",
      speakers: "42 juta",
      difficulty: "Pemula",
      lessons: 36,
      popular: true,
    },
    {
      name: "Bahasa Bali",
      region: "Bali",
      speakers: "3,3 juta",
      difficulty: "Menengah",
      lessons: 28,
      popular: false,
    },
    {
      name: "Bahasa Minangkabau",
      region: "Sumatera Barat",
      speakers: "5,5 juta",
      difficulty: "Pemula",
      lessons: 24,
      popular: true,
    },
    {
      name: "Bahasa Batak Toba",
      region: "Sumatera Utara",
      speakers: "2 juta",
      difficulty: "Menengah",
      lessons: 20,
      popular: false,
    },
    {
      name: "Bahasa Bugis",
      region: "Sulawesi Selatan",
      speakers: "5 juta",
      difficulty: "Menengah",
      lessons: 22,
      popular: false,
    },
  ];

  const vocabularyExample = [
    { word: "Sugeng enjang", meaning: "Selamat pagi", audio: true },
    { word: "Matur nuwun", meaning: "Terima kasih", audio: true },
    { word: "Sampun", meaning: "Sudah", audio: true },
    { word: "Dereng", meaning: "Belum", audio: true },
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Belajar Bahasa Daerah
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Mulai perjalanan Anda mempelajari bahasa daerah Indonesia dengan metode interaktif 
            dan audio dari penutur asli
          </p>
        </div>

        {/* Popular Languages */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Bahasa Populer</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {languages.map((language, index) => (
              <Card key={index} className="border-border shadow-soft transition-all hover:shadow-warm">
                <CardHeader>
                  <div className="mb-2 flex items-start justify-between">
                    <CardTitle className="text-xl">{language.name}</CardTitle>
                    {language.popular && (
                      <Badge className="bg-accent text-accent-foreground">
                        <Star className="mr-1 h-3 w-3" />
                        Populer
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{language.region}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Penutur:</span>
                      <span className="font-medium text-foreground">{language.speakers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tingkat:</span>
                      <span className="font-medium text-foreground">{language.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pelajaran:</span>
                      <span className="font-medium text-foreground">{language.lessons} modul</span>
                    </div>
                  </div>
                  <Button className="w-full">Mulai Belajar</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Flashcards Section */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Kartu Kosakata Harian</h2>
          </div>

          <Card className="border-border shadow-warm">
            <CardContent className="p-8">
              <div className="mb-6 text-center text-sm text-muted-foreground">
                Kartu {currentFlashcard + 1} dari {flashcards.length}
              </div>

              <div
                className="relative mx-auto mb-6 h-80 w-full max-w-md cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl border-2 border-border bg-gradient-warm p-8 text-center shadow-lg transition-all duration-500 ${
                    isFlipped ? "rotate-y-180 opacity-0" : "rotate-y-0 opacity-100"
                  }`}
                  style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
                >
                  <div className="mb-4 text-6xl">{flashcards[currentFlashcard].image}</div>
                  <h3 className="mb-2 text-3xl font-bold text-foreground">
                    {flashcards[currentFlashcard].word}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    {flashcards[currentFlashcard].pronunciation}
                  </p>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Volume2 className="h-5 w-5 text-primary" />
                  </Button>
                </div>

                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl border-2 border-border bg-primary/10 p-8 text-center shadow-lg transition-all duration-500 ${
                    isFlipped ? "rotate-y-0 opacity-100" : "rotate-y-180 opacity-0"
                  }`}
                  style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
                >
                  <h3 className="mb-4 text-2xl font-bold text-primary">
                    {flashcards[currentFlashcard].meaning}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium text-foreground">
                      {flashcards[currentFlashcard].example}
                    </p>
                    <p className="italic text-muted-foreground">
                      {flashcards[currentFlashcard].exampleTranslation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handlePrevFlashcard}>
                  Sebelumnya
                </Button>
                <Button onClick={handleNextFlashcard}>
                  Selanjutnya
                </Button>
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                💡 Klik kartu untuk melihat artinya
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Daily Challenges */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Tantangan Harian</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {dailyChallenges.map((challenge, index) => (
              <Card
                key={index}
                className={`border-border shadow-soft transition-all hover:shadow-warm ${
                  challenge.completed ? "bg-primary/5" : ""
                }`}
              >
                <CardHeader>
                  <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-3">
                    <challenge.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Poin:</span>
                    <Badge variant="secondary" className="font-bold">
                      +{challenge.points}
                    </Badge>
                  </div>
                  {challenge.completed ? (
                    <Button className="w-full" variant="outline" disabled>
                      ✓ Selesai
                    </Button>
                  ) : (
                    <Button className="w-full">Mulai Tantangan</Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Pencapaian & Badge</h2>
          </div>

          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle>Koleksi Badge Anda</CardTitle>
              <CardDescription>
                Kumpulkan badge dengan menyelesaikan tantangan dan belajar konsisten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center gap-2 ${
                      !achievement.unlocked ? "opacity-40 grayscale" : ""
                    }`}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-muted text-3xl">
                      {achievement.icon}
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {achievement.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Progress Stats */}
        <section className="mb-16">
          <Card className="border-border bg-gradient-warm shadow-soft">
            <CardContent className="p-8">
              <h3 className="mb-6 text-xl font-bold text-foreground">Progres Belajar Anda</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="mb-2 text-3xl font-bold text-primary">47</div>
                  <p className="text-sm text-muted-foreground">Hari beruntun</p>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-3xl font-bold text-primary">1,250</div>
                  <p className="text-sm text-muted-foreground">Total poin</p>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-3xl font-bold text-primary">328</div>
                  <p className="text-sm text-muted-foreground">Kata dikuasai</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="border-border bg-gradient-hero shadow-warm">
            <CardContent className="p-8 text-center md:p-12">
              <h2 className="mb-4 text-2xl font-bold text-primary-foreground md:text-3xl">
                Siap Memulai Perjalanan Belajar Anda?
              </h2>
              <p className="mx-auto mb-6 max-w-2xl text-primary-foreground/90">
                Bergabunglah dengan ribuan pelajar yang telah memulai perjalanan 
                melestarikan bahasa daerah Indonesia
              </p>
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                Daftar Sekarang - Gratis!
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Learn;
