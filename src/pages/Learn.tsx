import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, BookOpen, Star, TrendingUp } from "lucide-react";

const Learn = () => {
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

        {/* Interactive Example */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Contoh Pembelajaran</h2>
          </div>

          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle>Kosakata Dasar - Bahasa Jawa (Krama Inggil)</CardTitle>
              <CardDescription>
                Klik ikon speaker untuk mendengar pelafalan dari penutur asli
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {vocabularyExample.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <div>
                      <div className="mb-1 font-semibold text-foreground">
                        {item.word}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.meaning}
                      </div>
                    </div>
                    {item.audio && (
                      <Button size="icon" variant="ghost" className="shrink-0">
                        <Volume2 className="h-5 w-5 text-primary" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg bg-gradient-warm p-6">
                <h3 className="mb-2 font-semibold text-foreground">Tips Pembelajaran:</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Dengarkan audio berulang kali untuk familiar dengan intonasi</li>
                  <li>Praktikkan dengan penutur asli di forum komunitas</li>
                  <li>Pelajari dalam konteks kalimat, bukan hanya kata tunggal</li>
                  <li>Gunakan bahasa dalam percakapan sehari-hari</li>
                </ul>
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
