import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { MapPin, Users, Volume2, ArrowLeft, BadgeCheck, Flag } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getStatusColor, capitalize } from "@/lib/utils";
import { statusList } from "@/lib/constants";
import { vocabulary } from "@/lib/dummy";

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
              {statusList.find(item => item.id === language.status)?.name || ""}
            </Badge>
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">{language.vocabularyCount}</div>
                <div className="text-sm text-muted-foreground">Kosakata</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">{language.audioCount}</div>
                <div className="text-sm text-muted-foreground">Rekaman Audio</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">{language.contributorCount}</div>
                <div className="text-sm text-muted-foreground">Jumlah Kontributor</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content */}
        <h2 className="mb-4 text-2xl font-bold text-foreground">Kosakata</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vocabulary.map((item, index) => (
            <Card key={index} className="border-border relative">
              <CardHeader>
                <div className="flex justify-between">
                  <div className="flex items-center gap-1">
                    <CardTitle className="text-xl">
                      {capitalize(item.word)}
                    </CardTitle>
                    <Tooltip label="Dengar Kosakata">
                      <Button
                        variant="ghost"
                        className="h-6 w-6 p-2"
                        onClick={() => {
                          const utterance = new SpeechSynthesisUtterance(item.word);
                          window.speechSynthesis.speak(utterance);
                        }}
                      >
                        <Volume2 />
                      </Button>
                    </Tooltip>
                    {item.verified ? (
                      <Tooltip label="Terverifikasi">
                        <BadgeCheck className="text-[#1f8493ff]"/>
                      </Tooltip>
                    ) : null}
                  </div>
                  <div className="flex gap-1">
                    <Tooltip label="Laporkan">
                      <Button
                        variant="ghost"
                        className="h-6 w-6 p-2"
                      >
                        <Flag/>
                      </Button>
                    </Tooltip>
                  </div>
                </div>
                <CardDescription>{capitalize(item.translation)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-3 space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Tingkatan: <span className="font-medium text-foreground">{capitalize(item.level)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Contoh: <span className="font-medium text-foreground italic">{item.example}</span>
                    <span className="ext-foreground italic"> - {item.exampleTranslation}</span>
                    <Tooltip label="Dengar Contoh Kalimat">
                      <Button
                        variant="ghost"
                        className="ml-1 h-6 w-6 p-0"
                        onClick={() => {
                          const utterance = new SpeechSynthesisUtterance(item.example);
                          window.speechSynthesis.speak(utterance);
                        }}
                      >
                        <Volume2 />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageDetail;
