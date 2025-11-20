import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { Target, Eye, Users, Sparkles } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Misi Kami",
      description: "Melestarikan dan menghidupkan kembali bahasa daerah Indonesia melalui teknologi AI dan kolaborasi komunitas, menciptakan ekosistem digital yang berkelanjutan untuk warisan budaya Nusantara.",
    },
    {
      icon: Eye,
      title: "Visi Kami",
      description: "Menjadi platform pelestarian bahasa terdepan di Indonesia, di mana setiap bahasa daerah memiliki tempat di era digital dan generasi muda bangga untuk belajar dan menggunakan bahasa leluhur mereka.",
    },
    {
      icon: Users,
      title: "Pendekatan Kolaboratif",
      description: "Menggabungkan kearifan penutur asli, kreativitas kreator konten, dan kekuatan teknologi AI untuk menciptakan pengalaman belajar yang autentik dan menarik.",
    },
    {
      icon: Sparkles,
      title: "Inovasi Digital",
      description: "Memanfaatkan AI voice dataset, pembelajaran interaktif, dan ekonomi kreatif untuk memberikan nilai nyata bagi pelestari bahasa dan komunitas lokal.",
    },
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <Header
          title="Tentang RANA"
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
                  <p>
                    Indonesia adalah rumah bagi lebih dari 700 bahasa daerah, menjadikannya salah satu 
                    negara dengan keberagaman linguistik tertinggi di dunia. Namun, banyak dari bahasa-bahasa 
                    ini menghadapi risiko kepunahan karena dominasi bahasa nasional dan kurangnya dokumentasi digital.
                  </p>
                  <p>
                    RANA (Ragam Bahasa Nusantara) lahir dari keprihatinan dan kecintaan terhadap kekayaan budaya Indonesia. 
                    Kami percaya bahwa setiap bahasa adalah jendela unik untuk memahami dunia, dan kehilangan 
                    satu bahasa berarti kehilangan cara berpikir, bercerita, dan memahami alam yang tidak dapat 
                    digantikan.
                  </p>
                  <p>
                    Dengan menggabungkan teknologi AI terkini, metode pembelajaran interaktif, dan kekuatan 
                    kolaborasi komunitas, kami menciptakan ekosistem digital yang tidak hanya mendokumentasikan 
                    bahasa, tetapi juga menghidupkannya kembali dalam kehidupan sehari-hari generasi muda.
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
            {values.map((value, index) => (
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
                      menjadi aset berharga untuk pengembangan teknologi speech recognition dan text-to-speech
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
