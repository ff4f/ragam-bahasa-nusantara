import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { useUser } from "@/hooks/use-user";
import { CONTACT_INFO } from "@/lib/constants";

const Contact = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <Header
          title="Hubungi Kami"
          description="Punya pertanyaan, saran, atau ingin berkolaborasi? Kami senang mendengar dari Anda!"
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-border shadow-soft">
              <CardHeader>
                <CardTitle>Kirim Pesan</CardTitle>
                <CardDescription>
                  Isi formulir di bawah ini dan kami akan merespons secepat mungkin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input id="name" placeholder="Masukkan nama Anda" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Pos-el (<i>e-mail</i>)</Label>
                      <Input id="email" type="email" placeholder="nama@email.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subjek</Label>
                    <Input id="subject" placeholder="Tentang apa pesan Anda?" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Pesan</Label>
                    <Textarea
                      id="message"
                      placeholder="Tuliskan pesan Anda di sini..."
                      className="min-h-[150px]"
                    />
                  </div>

                  <Button type="submit" className="w-full md:w-auto">
                    Kirim Pesan
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="border-border shadow-soft">
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {CONTACT_INFO.map((info, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="mb-1 font-semibold text-foreground">
                        {info.title}
                      </div>
                      <div className="mb-1 text-sm font-medium text-primary">
                        {info.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {info.description}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Join Community CTA */}
            {!user && (
              <Card className="border-border bg-gradient-hero shadow-warm">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-semibold text-primary-foreground">
                    Bergabung dengan Komunitas
                  </h3>
                  <p className="mb-4 text-sm text-primary-foreground/90">
                    Terhubung dengan ribuan pelestari bahasa dari seluruh Nusantara
                  </p>
                  <Button className="w-full bg-secondary hover:bg-secondary/90" onClick={() => navigate("/auth")}>
                    Gabung Sekarang
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-foreground">
              Pertanyaan Umum
            </h2>
            <p className="text-muted-foreground">
              Cari jawaban cepat untuk pertanyaan yang sering diajukan
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
            {[
              {
                q: "Bagaimana cara berkontribusi?",
                a: "Kunjungi halaman Kontribusi untuk melihat berbagai cara berkontribusi, mulai dari merekam suara hingga mendokumentasikan cerita rakyat.",
              },
              {
                q: "Apakah gratis untuk belajar?",
                a: "Ya, semua materi pembelajaran dasar di RANA gratis untuk diakses oleh siapa saja.",
              },
              {
                q: "Bagaimana dengan privasi data?",
                a: "Kami sangat menghormati privasi Anda. Semua data dienkripsi dan tidak akan dibagikan tanpa izin Anda.",
              },
              {
                q: "Bisakah institusi berkolaborasi?",
                a: "Tentu! Kami terbuka untuk kolaborasi dengan universitas, NGO, dan institusi lainnya. Hubungi kami untuk diskusi lebih lanjut.",
              },
            ].map((faq, index) => (
              <Card key={index} className="border-border shadow-soft">
                <CardHeader>
                  <CardTitle className="text-base">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
