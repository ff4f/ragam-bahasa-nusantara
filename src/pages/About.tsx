import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { ABOUT_FEATURES } from "@/lib/constants";

const About = () => {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <Header
          title="Tentang"
          description="Ragam Bahasa Nusantara - Platform digital yang berdedikasi untuk melestarikan kekayaan bahasa daerah Indonesia melalui teknologi AI, pembelajaran interaktif, dan kekuatan komunitas"
        />

        {/* Story Section */}
        <section className="mb-16">
          <div className="mx-auto max-w-4xl">
            <Card className="border-border shadow-soft">
              <CardContent className="p-8 md:p-12">
                <h2 className="mb-6 text-2xl font-bold text-foreground">
                  Latar Belakang
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-justify">
                    Lebih dari 40% bahasa Nusantara terancam punah. Kondisi ini diperburuk oleh dokumentasi yang tidak terpusat dan belum terdigitalisasi, rendahnya minat generasi muda karena media pembelajaran yang kurang relevan, serta program revitalisasi yang terbatas pada daftar kosakata tanpa platform interaktif. Belum ada pusat data nasional yang menyatukan berbagai sumber, meskipun Balai Bahasa provinsi telah menghasilkan banyak data seperti kosakata, rekaman, dan glosarium. Tanpa digitalisasi berbasis komunitas, bahasa Nusantara berisiko punah dalam 1–2 generasi.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values Grid */}
        <section className="mb-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Visi, Misi & Nilai
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Prinsip-prinsip yang memandu setiap langkah kami dalam pelestarian bahasa daerah
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {ABOUT_FEATURES.map((value, index) => (
              <Card key={index} className="border-border shadow-soft transition-all hover:shadow-warm">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section>
          <div className="mx-auto max-w-4xl">
            <Card className="border-border bg-gradient-warm shadow-soft">
              <CardContent className="p-8 md:p-12">
                <h2 className="mb-6 text-2xl font-bold text-foreground">
                  Dampak & Potensi Ekonomi
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    RANA tidak hanya tentang pelestarian budaya, tetapi juga tentang menciptakan 
                    peluang ekonomi bagi komunitas lokal. Melalui platform kami:
                  </p>
                  <ul className="ml-6 list-disc space-y-2">
                    <li>
                      <strong className="text-foreground">AI Voice Dataset:</strong> Rekaman suara penutur asli 
                      menjadi aset berharga untuk pengembangan teknologi <i>speech recognition</i> dan <i>text-to-speech</i>
                    </li>
                    <li>
                      <strong className="text-foreground">Konten Kreatif:</strong> Kreator budaya dapat 
                      menghasilkan pendapatan dari pembuatan materi pembelajaran, cerita rakyat, dan konten digital
                    </li>
                    <li>
                      <strong className="text-foreground">Pariwisata Budaya:</strong> Konten bahasa daerah 
                      menarik wisatawan untuk belajar dan mengalami budaya lokal secara autentik
                    </li>
                    <li>
                      <strong className="text-foreground">Kampanye Brand:</strong> Perusahaan dapat terhubung 
                      dengan konsumen lokal melalui konten berbahasa daerah yang autentik
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
