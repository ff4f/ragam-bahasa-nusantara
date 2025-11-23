import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import { ArrowLeftRight, Volume2, Database } from "lucide-react";
import { dictionaryService } from "@/services/dictionary.service";
import { useToast } from "@/hooks/use-toast";

const Dictionary = () => {
  const { toast } = useToast();
  const [sourceText, setSourceText] = useState("");
  const [targetText, setTargetText] = useState("");
  const [sourceLang, setSourceLang] = useState("id");
  const [targetLang, setTargetLang] = useState("Bahasa Jawa Banyumasan");
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const languages = [
    { code: "id", name: "Bahasa Indonesia" },
    { code: "Bahasa Jawa Banyumasan", name: "Jawa Ngapak (Banyumasan)" },
    { code: "jv", name: "Bahasa Jawa (Umum)" },
    { code: "sd", name: "Bahasa Sunda" },
  ];

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setTargetText("");
      return;
    }

    setIsLoading(true);
    try {
      const result = await dictionaryService.translate(sourceText, sourceLang, targetLang);
      setTargetText(result.translated_text);
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Gagal menerjemahkan",
        description: "Terjadi kesalahan saat menghubungi server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce translation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sourceText.trim()) {
        handleTranslate();
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [sourceText, sourceLang, targetLang]);

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(targetText);
    setTargetText(sourceText);
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const result = await dictionaryService.seed();
      toast({
        title: "Database Diperbarui",
        description: "Data kamus Ngapak berhasil ditambahkan!",
      });
    } catch (error: any) {
      // Ignore if already seeded
      if (error.response?.status === 400 || error.response?.status === 200) {
        toast({
          title: "Info",
          description: "Database sudah berisi data.",
        });
      } else {
        toast({
          title: "Gagal Seed",
          description: "Gagal mengisi database.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Header
          title="Kamus Bahasa Daerah"
          description="Terjemahkan teks antara Bahasa Indonesia dan bahasa daerah"
        />

        {/* Admin Tool (Temporary) */}
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSeedData}
            disabled={isSeeding}
            className="gap-2"
          >
            <Database className="h-4 w-4" />
            {isSeeding ? "Mengisi Data..." : "Isi Data Awal (Ngapak)"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Translator</CardTitle>
            <CardDescription>
              Ketik teks untuk menerjemahkan secara otomatis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Source Language */}
              <div className="space-y-4">
                <Select value={sourceLang} onValueChange={setSourceLang}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih bahasa" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative">
                  <Textarea
                    placeholder="Ketik teks di sini..."
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute bottom-2 right-2"
                    onClick={() => {
                      const utterance = new SpeechSynthesisUtterance(sourceText);
                      window.speechSynthesis.speak(utterance);
                    }}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  {sourceText.length} karakter
                </div>
              </div>

              {/* Target Language */}
              <div className="space-y-4">
                <Select value={targetLang} onValueChange={setTargetLang}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih bahasa" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative">
                  <Textarea
                    placeholder={isLoading ? "Menerjemahkan..." : "Terjemahan akan muncul di sini..."}
                    value={targetText}
                    readOnly
                    className="min-h-[200px] resize-none bg-muted"
                  />
                  {targetText && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute bottom-2 right-2"
                      onClick={() => {
                        const utterance = new SpeechSynthesisUtterance(targetText);
                        window.speechSynthesis.speak(utterance);
                      }}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  {targetText.length} karakter
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapLanguages}
                className="shrink-0"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleTranslate}
                disabled={!sourceText.trim() || isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Menerjemahkan..." : "Terjemahkan"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Contoh Frasa (Ngapak)</CardTitle>
            <CardDescription>
              Klik untuk mencoba
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: "apa kabar", jv: "piye kabare" },
                { id: "terima kasih", jv: "kesuwun" },
                { id: "saya mau makan", jv: "nyong arep madang" },
                { id: "jangan lupa", jv: "aja kelalen" },
                { id: "kamu mau ke mana", jv: "koe arep ngendi" },
                { id: "saya tidak tahu", jv: "nyong ora ngerti" }
              ].map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  className="justify-start h-auto py-3 px-4"
                  onClick={() => {
                    setSourceText(item.id);
                    setSourceLang("id");
                    setTargetLang("Bahasa Jawa Banyumasan");
                  }}
                >
                  <div className="text-left">
                    <div className="font-medium">{item.id}</div>
                    <div className="text-sm text-muted-foreground">{item.jv}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dictionary;
