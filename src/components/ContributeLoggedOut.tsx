import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Header from "./Header";
import { Award, Sparkles, Upload } from "lucide-react";
import { contributionTypes } from "@/lib/constants";
import { leaderboard } from "@/lib/dummy";

const ContributeLoggedOut = () => {
  const navigate = useNavigate();
  const [selectedContribution, setSelectedContribution] = useState<string | null>(null);

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <Header
          title="Kontribusi Komunitas"
          description="Setiap kontribusi Anda membantu melestarikan warisan budaya Indonesia. Bergabunglah dengan ribuan pelestari bahasa dari seluruh Nusantara!"
        />

        {/* Contribution Types */}
        <section className="mb-16">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-foreground">
              Jenis Kontribusi yang Bisa Dilakukan
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {contributionTypes.map((type, index) => (
              <Card key={index} className="border-border shadow-soft transition-all hover:shadow-warm flex overflow-hidden">
                <div className="bg-primary/10 py-8 px-6 flex-1 flex justify-center">
                  <type.icon className="h-12 w-12 text-primary" />
                </div>
                <div className="flex-[6]">
                  <CardHeader>
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
                  </CardContent>
                </div>
                
              </Card>
            ))}
          </div>
        </section>

        {/* Upload Forms Modal */}
        <Dialog open={!!selectedContribution} onOpenChange={(open) => !open && setSelectedContribution(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Form Kontribusi: {selectedContribution}
              </DialogTitle>
              <DialogDescription>
                Isi formulir di bawah ini untuk mengirimkan kontribusi Anda
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
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

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setSelectedContribution(null)}>
                      Batal
                    </Button>
                    <Button type="submit" className="flex-1">
                      Kirim Kontribusi
                    </Button>
                  </div>
                </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Leaderboard */}
        <section className="mb-16">
          <Card className="border-border shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                <CardTitle>Kontributor Teratas</CardTitle>
              </div>
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
                          {contributor.region}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {contributor.xp}
                      </div>
                      <div className="text-xs text-muted-foreground">XP</div>
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
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90"
                onClick={() => navigate("/auth")}
              >
                Daftar sebagai Kontributor
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default ContributeLoggedOut;
