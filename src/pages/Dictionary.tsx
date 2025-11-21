import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import { ArrowLeftRight, Volume2 } from "lucide-react";

const Dictionary = () => {
  const [sourceText, setSourceText] = useState("");
  const [targetText, setTargetText] = useState("");
  const [sourceLang, setSourceLang] = useState("id");
  const [targetLang, setTargetLang] = useState("jv");

  const languages = [
    { code: "id", name: "Bahasa Indonesia" },
    { code: "jv", name: "Bahasa Jawa" },
    { code: "sd", name: "Bahasa Sunda" },
    { code: "ms", name: "Bahasa Minang" },
    { code: "bg", name: "Bahasa Bugis" },
    { code: "bl", name: "Bahasa Bali" },
  ];

  const mockTranslations: Record<string, Record<string, string>> = {
    "id-jv": {
      "halo": "halo",
      "selamat pagi": "sugeng enjing",
      "terima kasih": "matur nuwun",
      "apa kabar": "piye kabare",
    },
    "jv-id": {
      "halo": "halo",
      "sugeng enjing": "selamat pagi",
      "matur nuwun": "terima kasih",
      "piye kabare": "apa kabar",
    },
  };

  const handleTranslate = () => {
    const key = `${sourceLang}-${targetLang}`;
    const lowerText = sourceText.toLowerCase().trim();
    const translation = mockTranslations[key]?.[lowerText] || `[Terjemahan ${sourceText}]`;
    setTargetText(translation);
  };

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(targetText);
    setTargetText(sourceText);
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Header
          title="Kamus Bahasa Daerah"
          description="Terjemahkan teks antara Bahasa Indonesia dan bahasa daerah"
        />

        <Card>
          <CardHeader>
            <CardTitle>Translator</CardTitle>
            <CardDescription>
              Masukkan teks yang ingin diterjemahkan
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
                    placeholder="Terjemahan akan muncul di sini..."
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
                disabled={!sourceText.trim()}
                className="w-full sm:w-auto"
              >
                Terjemahkan
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Frasa Umum</CardTitle>
            <CardDescription>
              Klik untuk menyalin ke translator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(mockTranslations["id-jv"] || {}).map(([id, jv]) => (
                <Button
                  key={id}
                  variant="outline"
                  className="justify-start h-auto py-3 px-4"
                  onClick={() => {
                    setSourceText(id);
                    setSourceLang("id");
                    setTargetLang("jv");
                    setTargetText(jv);
                  }}
                >
                  <div className="text-left">
                    <div className="font-medium">{id}</div>
                    <div className="text-sm text-muted-foreground">{jv}</div>
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
