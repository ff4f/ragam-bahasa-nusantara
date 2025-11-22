import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import Header from "@/components/Header";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";

const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Auto-fill name and email if user is logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const contactService = (await import("@/services/contact.service")).default;
      await contactService.submitContact(formData);

      toast({
        title: "Pesan terkirim!",
        description: "Terima kasih telah menghubungi kami. Kami akan segera merespons.",
      });

      // Reset form except name and email if user is logged in
      setFormData(prev => ({
        name: user ? user.name : "",
        email: user ? user.email : "",
        subject: "",
        message: "",
      }));
    } catch (error: any) {
      console.error("Submit contact error:", error);
      toast({
        title: "Gagal mengirim pesan",
        description: error.response?.data?.detail || "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "hello@rana.id",
      description: "Kirim email untuk pertanyaan umum",
    },
    {
      icon: Phone,
      title: "Telepon",
      value: "+62 812-3456-7890",
      description: "Senin - Jumat, 09:00 - 17:00 WIB",
    },
    {
      icon: MapPin,
      title: "Alamat",
      value: "Jakarta, Indonesia",
      description: "Kantor pusat RANA",
    },
    {
      icon: MessageCircle,
      title: "Forum Komunitas",
      value: "forum.rana.id",
      description: "Diskusi dengan sesama anggota",
    },
  ];

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
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input
                        id="name"
                        placeholder="Masukkan nama Anda"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="nama@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subjek</Label>
                    <Input
                      id="subject"
                      placeholder="Tentang apa pesan Anda?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Pesan</Label>
                    <Textarea
                      id="message"
                      placeholder="Tuliskan pesan Anda di sini..."
                      className="min-h-[150px]"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                    {isLoading ? "Mengirim..." : "Kirim Pesan"}
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
                {contactInfo.map((info, index) => (
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
