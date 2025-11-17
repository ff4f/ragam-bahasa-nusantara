import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Users, Volume2, BookOpen, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const LanguageDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const language = location.state?.language;

  if (!language) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Bahasa tidak ditemukan</p>
            <Button className="mt-4" onClick={() => navigate('/explore')}>
              Kembali ke Eksplor
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "Terancam Punah":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      case "Punah":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Sample vocabulary data
  const vocabulary = [
    { word: "Halo", translation: "Hello", pronunciation: "ha-lo", category: "Greeting" },
    { word: "Terima kasih", translation: "Thank you", pronunciation: "te-ri-ma ka-sih", category: "Greeting" },
    { word: "Selamat pagi", translation: "Good morning", pronunciation: "se-la-mat pa-gi", category: "Greeting" },
    { word: "Air", translation: "Water", pronunciation: "a-ir", category: "Nature" },
    { word: "Makan", translation: "Eat", pronunciation: "ma-kan", category: "Action" },
    { word: "Rumah", translation: "House", pronunciation: "ru-mah", category: "Place" },
  ];

  // Sample folklore data
  const folklore = [
    {
      title: "Cerita Rakyat 1",
      summary: "Kisah tentang kepahlawanan seorang pemuda yang menyelamatkan desanya dari bencana.",
      duration: "15 menit",
    },
    {
      title: "Cerita Rakyat 2",
      summary: "Legenda tentang asal-usul nama daerah dan makna budayanya.",
      duration: "12 menit",
    },
    {
      title: "Cerita Rakyat 3",
      summary: "Dongeng tradisional yang mengajarkan nilai-nilai kehidupan kepada generasi muda.",
      duration: "10 menit",
    },
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/explore')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Eksplor
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-foreground">{language.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {language.region}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {language.speakers} penutur
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(language.status)}>
              {language.status}
            </Badge>
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-border">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">{language.vocabularyCount}</div>
                <div className="text-sm text-muted-foreground">Kosakata</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">{language.phrasesCount}</div>
                <div className="text-sm text-muted-foreground">Frasa</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">{language.folkloreCount}</div>
                <div className="text-sm text-muted-foreground">Cerita Rakyat</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">{language.audioCount}</div>
                <div className="text-sm text-muted-foreground">Rekaman Audio</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="vocabulary" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto">
            <TabsTrigger value="vocabulary">Kosakata</TabsTrigger>
            <TabsTrigger value="folklore">Cerita Rakyat</TabsTrigger>
          </TabsList>

          <TabsContent value="vocabulary" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vocabulary.map((item, index) => (
                <Card key={index} className="border-border">
                  <CardHeader>
                    <CardTitle className="text-xl">{item.word}</CardTitle>
                    <CardDescription>{item.translation}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3 space-y-1">
                      <div className="text-sm text-muted-foreground">
                        Pengucapan: <span className="font-medium text-foreground">{item.pronunciation}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Volume2 className="mr-2 h-4 w-4" />
                      Dengar Pengucapan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="folklore" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {folklore.map((story, index) => (
                <Card key={index} className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      {story.title}
                    </CardTitle>
                    <CardDescription>{story.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3 text-sm text-muted-foreground">
                      Durasi: {story.duration}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Volume2 className="mr-2 h-4 w-4" />
                        Dengar
                      </Button>
                      <Button size="sm" className="flex-1">
                        Baca
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LanguageDetail;
