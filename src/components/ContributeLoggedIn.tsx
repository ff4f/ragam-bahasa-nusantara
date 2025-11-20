import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "./Header";
import MultiSelect from "./MultiSelect";
import { Award, Upload, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { provinceList, regionList, languageArchive, leaderboard } from "@/lib/dummy";

const ContributeLoggedIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: userContext } = useUser();
  const [user, setUser] = useState(userContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    province: [],
    region: [],
    language: "",
    ethnic: "",
    dialect: "",
    text: "",
    textTranslation: "",
    sentence: "",
    sentenceTranslation: "",
    textAudio: "",
    sentenceAudio: "",
    notes: "",
  });

  const validateForm = () => {
    const { province, language, text, textTranslation, sentence, sentenceTranslation, textAudio, sentenceAudio } = formData;
    return province.length > 0 && language && text && textTranslation && sentence && sentenceTranslation && textAudio && sentenceAudio;
  };

  const handleFile = (e: any, type: string) => {
    setFormData({ ...formData, [type]: e.target.files[0] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({ title: "Silahkan lengkapi field kontribusi yang diperlukan!" });
      return;
    };
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({ title: "Kontribusi berhasil dikirim! Terima kasih atas partisipasi Anda." });
    
    // Reset form
    setFormData({
      province: [],
      region: [],
      language: "",
      ethnic: "",
      dialect: "",
      text: "",
      textTranslation: "",
      sentence: "",
      sentenceTranslation: "",
      textAudio: "",
      sentenceAudio: "",
      notes: "",
    });
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (!userContext) {
      navigate("/auth");
      return;
    }
    setUser(userContext);
  }, [navigate]);

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <Header
          title="Kontribusi"
          description="Isi form di bawah untuk berkontribusi dalam pelestarian bahasa daerah Indonesia"
        />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Form</CardTitle>
                <CardDescription>
                  Lengkapi semua field kontribusi yang diperlukan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Province & Region */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="province">Provinsi *</Label>
                      <MultiSelect
                        placeholder="Pilih provinsi"
                        options={provinceList}
                        value={formData.province}
                        onChange={(value) =>
                          setFormData({ ...formData, province: value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="region">Asal Daerah</Label>
                      <MultiSelect
                        placeholder="Pilih asal daerah"
                        options={regionList}
                        value={formData.region}
                        onChange={(value) =>
                          setFormData({ ...formData, region: value })
                        }
                      />
                    </div>
                  </div>

                  {/* Language & Ethnic */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="language">Bahasa Daerah *</Label>
                      <Select
                        value={formData.language}
                        onValueChange={(value) =>
                          setFormData({ ...formData, language: value })
                        }
                        required
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Pilih bahasa" />
                        </SelectTrigger>
                        <SelectContent>
                          {languageArchive.map((lang) => (
                            <SelectItem key={lang.id} value={lang.id}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ethnic">Suku</Label>
                      <Input
                        id="ethnic"
                        placeholder="Contoh: Jawa, Sunda"
                        value={formData.ethnic}
                        onChange={(e) =>
                          setFormData({ ...formData, ethnic: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Dialect */}
                  <div className="space-y-2">
                    <Label htmlFor="dialect">Dialek Spesifik</Label>
                    <Input
                      id="dialect"
                      placeholder="Contoh: Jawa Ngapak, Sunda Priangan"
                      value={formData.dialect}
                      onChange={(e) =>
                        setFormData({ ...formData, dialect: e.target.value })
                      }
                    />
                  </div>

                  {/* Vocabulary & its Translation */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="text">
                        Kosakata *
                      </Label>
                      <Input
                        id="text"
                        placeholder="Masukkan kata dalam bahasa daerah"
                        value={formData.text}
                        onChange={(e) =>
                          setFormData({ ...formData, text: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="textTranslation">
                        Terjemahan Kosakata *
                      </Label>
                      <Input
                        id="textTranslation"
                        placeholder="Terjemahan kosakata dalam bahasa indonesia"
                        value={formData.textTranslation}
                        onChange={(e) =>
                          setFormData({ ...formData, textTranslation: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Sentence & its Translation */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sentence">
                        Contoh Kalimat *
                      </Label>
                      <Input
                        id="sentence"
                        placeholder="Masukkan contoh kalimat dalam bahasa daerah"
                        value={formData.sentence}
                        onChange={(e) =>
                          setFormData({ ...formData, sentence: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sentenceTranslation">
                        Terjemahan Contoh Kalimat *
                      </Label>
                      <Input
                        id="sentenceTranslation"
                        placeholder="Terjemahan contoh kalimat dalam bahasa indonesia"
                        value={formData.sentenceTranslation}
                        onChange={(e) =>
                          setFormData({ ...formData, sentenceTranslation: e.target.value })
                        }
                      />
                    </div>
                  </div>                  

                  {/* Audio Recording for Text */}
                  <div className="space-y-2">
                    <Label>Rekam Audio Kosakata *</Label>
                    <Input
                      id="textAudio"
                      type="file"
                      accept="audio/*"
                      className="cursor-pointer"
                      onChange={(e) => handleFile(e, "textAudio")}
                    />
                    <p className="text-xs text-muted-foreground">
                      Format: MP3, WAV, M4A (Maks. 10MB)
                    </p>
                  </div>

                  {/* Audio Recording for Sentence */}
                  <div className="space-y-2">
                    <Label>Rekam Audio Contoh Kalimat *</Label>
                    <Input
                      id="sentenceAudio"
                      type="file"
                      accept="audio/*"
                      className="cursor-pointer"
                      onChange={(e) => handleFile(e, "sentenceAudio")}
                    />
                    <p className="text-xs text-muted-foreground">
                      Format: MP3, WAV, M4A (Maks. 10MB)
                    </p>
                  </div>               

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Catatan Tambahan</Label>
                    <Textarea
                      id="notes"
                      placeholder="Tambahkan catatan atau konteks untuk kontribusi Anda"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Kirim Kontribusi
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Stats */}
            {user && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Statistik Anda
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total XP</span>
                    <span className="font-bold text-primary">{user.xp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Badge</span>
                    <span className="font-medium">{user.badges.length}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle>Kontributor Teratas</CardTitle>
                <CardDescription>Peringkat berdasarkan XP minggu ini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((contributor) => (
                    <div
                      key={contributor.rank}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {contributor.rank}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{contributor.name}</p>
                          <p className="text-xs text-muted-foreground">{contributor.region}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{contributor.xp}</p>
                        <p className="text-xs text-muted-foreground">XP</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributeLoggedIn;
