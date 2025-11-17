import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, FileText, BookOpen, Share2, Award, Sparkles, Upload } from "lucide-react";
import { useState } from "react";

const Contribute = () => {
  const [selectedContribution, setSelectedContribution] = useState<string | null>(null);

  const contributionTypes = [
    {
      icon: Mic,
      title: "Rekam Suara",
      description: "Bagikan pelafalan autentik dari bahasa daerah Anda untuk membangun AI voice dataset",
      benefits: ["Kontribusi untuk teknologi AI", "Sertifikat kontributor", "Poin komunitas"],
    },
    {
      icon: FileText,
      title: "Tambah Kosakata",
      description: "Dokumentasikan kata-kata dan frasa yang mungkin belum tercatat",
      benefits: ["Perluas database bahasa", "Kredit sebagai kontributor", "Badge kolaborator"],
    },
    {
      icon: BookOpen,
      title: "Cerita Rakyat",
      description: "Tulis atau rekam cerita rakyat dalam bahasa asli untuk generasi mendatang",
      benefits: ["Lestarikan budaya oral", "Publikasi di platform", "Royalti konten"],
    },
    {
      icon: Share2,
      title: "Terjemahan",
      description: "Bantu menerjemahkan konten pembelajaran ke bahasa daerah Anda",
      benefits: ["Akses materi eksklusif", "Pengakuan publik", "Network kolaborator"],
    },
  ];

  const leaderboard = [
    { rank: 1, name: "Ibu Siti Nurhaliza", region: "Jawa Tengah", contributions: 342, type: "Rekaman Suara" },
    { rank: 2, name: "Bapak Ahmad Dahlan", region: "Sumatera Barat", contributions: 298, type: "Kosakata" },
    { rank: 3, name: "Ni Luh Ketut Ayu", region: "Bali", contributions: 276, type: "Cerita Rakyat" },
    { rank: 4, name: "Raden Mas Wijaya", region: "Jawa Barat", contributions: 254, type: "Terjemahan" },
    { rank: 5, name: "Andi Mappasessu", region: "Sulawesi Selatan", contributions: 231, type: "Rekaman Suara" },
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Kontribusi Komunitas
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Setiap kontribusi Anda membantu melestarikan warisan budaya Indonesia. 
            Bergabunglah dengan ribuan pelestari bahasa dari seluruh Nusantara!
          </p>
        </div>

        {/* Contribution Types */}
        <section className="mb-16">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-foreground">
              Cara Berkontribusi
            </h2>
            <p className="text-muted-foreground">
              Pilih jenis kontribusi yang sesuai dengan kemampuan Anda
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {contributionTypes.map((type, index) => (
              <Card key={index} className="border-border shadow-soft transition-all hover:shadow-warm">
                <CardHeader>
                  <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-3">
                    <type.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="mb-2 text-sm font-medium text-muted-foreground">
                      Manfaat:
                    </div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {type.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-accent" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => setSelectedContribution(type.title)}
                  >
                    Mulai Berkontribusi
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Upload Forms */}
        {selectedContribution && (
          <section className="mb-16">
            <Card className="border-border shadow-warm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Form Kontribusi: {selectedContribution}
                </CardTitle>
                <CardDescription>
                  Isi formulir di bawah ini untuk mengirimkan kontribusi Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Common fields */}
                  <div className="space-y-2">
                    <Label htmlFor="language">Bahasa Daerah *</Label>
                    <Select>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Pilih bahasa daerah" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jawa">Bahasa Jawa</SelectItem>
                        <SelectItem value="sunda">Bahasa Sunda</SelectItem>
                        <SelectItem value="bali">Bahasa Bali</SelectItem>
                        <SelectItem value="batak">Bahasa Batak</SelectItem>
                        <SelectItem value="minang">Bahasa Minangkabau</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">Wilayah Asal *</Label>
                    <Input id="region" placeholder="Contoh: Jawa Tengah, Yogyakarta" />
                  </div>

                  {/* Conditional fields based on contribution type */}
                  {selectedContribution === "Rekam Suara" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="audio">File Audio *</Label>
                        <Input id="audio" type="file" accept="audio/*" />
                        <p className="text-xs text-muted-foreground">
                          Format: MP3, WAV, M4A (Maks. 10MB)
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="transcription">Transkripsi *</Label>
                        <Textarea
                          id="transcription"
                          placeholder="Tulis teks yang diucapkan dalam rekaman..."
                          rows={4}
                        />
                      </div>
                    </>
                  )}

                  {selectedContribution === "Tambah Kosakata" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="word">Kata/Frasa *</Label>
                        <Input id="word" placeholder="Masukkan kata atau frasa" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="meaning">Arti/Terjemahan *</Label>
                        <Input id="meaning" placeholder="Arti dalam Bahasa Indonesia" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="example">Contoh Kalimat</Label>
                        <Textarea
                          id="example"
                          placeholder="Berikan contoh penggunaan dalam kalimat..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="audio-word">Audio Pelafalan (opsional)</Label>
                        <Input id="audio-word" type="file" accept="audio/*" />
                      </div>
                    </>
                  )}

                  {selectedContribution === "Cerita Rakyat" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="story-title">Judul Cerita *</Label>
                        <Input id="story-title" placeholder="Judul cerita rakyat" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="story-type">Jenis Cerita</Label>
                        <Select>
                          <SelectTrigger id="story-type">
                            <SelectValue placeholder="Pilih jenis cerita" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="legend">Legenda</SelectItem>
                            <SelectItem value="myth">Mitos</SelectItem>
                            <SelectItem value="fable">Fabel</SelectItem>
                            <SelectItem value="folklore">Cerita Rakyat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="story-content">Isi Cerita (Bahasa Daerah) *</Label>
                        <Textarea
                          id="story-content"
                          placeholder="Tulis cerita dalam bahasa daerah..."
                          rows={8}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="story-translation">Terjemahan (Indonesia)</Label>
                        <Textarea
                          id="story-translation"
                          placeholder="Terjemahan cerita dalam Bahasa Indonesia..."
                          rows={8}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="audio-story">Rekaman Audio (opsional)</Label>
                        <Input id="audio-story" type="file" accept="audio/*" />
                      </div>
                    </>
                  )}

                  {selectedContribution === "Terjemahan" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="source-text">Teks Sumber (Indonesia) *</Label>
                        <Textarea
                          id="source-text"
                          placeholder="Teks yang akan diterjemahkan..."
                          rows={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="translated-text">Terjemahan (Bahasa Daerah) *</Label>
                        <Textarea
                          id="translated-text"
                          placeholder="Hasil terjemahan..."
                          rows={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Catatan Terjemahan</Label>
                        <Textarea
                          id="notes"
                          placeholder="Jelaskan nuansa atau konteks khusus..."
                          rows={3}
                        />
                      </div>
                    </>
                  )}

                  {/* Common fields */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Kontributor *</Label>
                    <Input id="name" placeholder="Nama Anda" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="email@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additional-notes">Catatan Tambahan</Label>
                    <Textarea
                      id="additional-notes"
                      placeholder="Informasi tambahan yang ingin Anda sampaikan..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1">
                      Kirim Kontribusi
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedContribution(null)}
                    >
                      Batal
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Leaderboard */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Kontributor Teratas</h2>
          </div>

          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle>Leaderboard Bulan Ini</CardTitle>
              <CardDescription>
                Apresiasi untuk para pahlawan pelestari bahasa daerah
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((contributor) => (
                  <div
                    key={contributor.rank}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                          contributor.rank === 1
                            ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                            : contributor.rank === 2
                            ? "bg-gray-300/20 text-gray-700 dark:text-gray-400"
                            : contributor.rank === 3
                            ? "bg-orange-500/20 text-orange-700 dark:text-orange-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {contributor.rank}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {contributor.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {contributor.region} • {contributor.type}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {contributor.contributions}
                      </div>
                      <div className="text-xs text-muted-foreground">kontribusi</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="border-border bg-gradient-hero shadow-warm">
            <CardContent className="p-8 text-center md:p-12">
              <h2 className="mb-4 text-2xl font-bold text-primary-foreground md:text-3xl">
                Jadilah Bagian dari Gerakan Pelestarian Bahasa
              </h2>
              <p className="mx-auto mb-6 max-w-2xl text-primary-foreground/90">
                Kontribusi Anda, sekecil apapun, sangat berarti untuk menjaga 
                kekayaan bahasa Indonesia tetap hidup untuk generasi mendatang
              </p>
              <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                Daftar sebagai Kontributor
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Contribute;
