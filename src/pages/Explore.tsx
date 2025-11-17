import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Volume2, FileText } from "lucide-react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import geoJson from "../assets/indonesia-geo.json";
import * as Tooltip from "@radix-ui/react-tooltip";

const Explore = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [ethnicFilter, setEthnicFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProvince, setSelectedProvince] = useState("");

  const languagesByProvince: Record<string, string[]> = {
    Aceh: ["Acehnese", "Gayo", "Alas"],
    "Sumatera Utara": ["Batak Toba", "Mandailing"],
    "Jawa Tengah": ["Javanese"],
    Bali: ["Balinese"],
  };

  const languagePoints = [
    { name: "Acehnese", coords: [95.32, 5.55], region: "Aceh" },
    { name: "Batak Toba", coords: [99.07, 2.38], region: "Sumatera Utara" },
    { name: "Minangkabau", coords: [100.36, -0.95], region: "Sumatera Barat" },
    { name: "Javanese", coords: [110.37, -7.0], region: "Jawa Tengah" },
    { name: "Balinese", coords: [115.09, -8.37], region: "Bali" },
  ];

  const languageArchive = [
    {
      name: "Bahasa Jawa",
      region: "Jawa Tengah, Jawa Timur",
      ethnic: "Jawa",
      speakers: "84,3 juta",
      status: "Aktif",
      vocabularyCount: 2500,
      phrasesCount: 800,
      folkloreCount: 45,
      audioCount: 1200,
    },
    {
      name: "Bahasa Sunda",
      region: "Jawa Barat",
      ethnic: "Sunda",
      speakers: "42 juta",
      status: "Aktif",
      vocabularyCount: 1800,
      phrasesCount: 600,
      folkloreCount: 32,
      audioCount: 950,
    },
    {
      name: "Bahasa Batak Toba",
      region: "Sumatera Utara",
      ethnic: "Batak",
      speakers: "2 juta",
      status: "Terancam Punah",
      vocabularyCount: 1200,
      phrasesCount: 400,
      folkloreCount: 28,
      audioCount: 600,
    },
    {
      name: "Bahasa Bali",
      region: "Bali",
      ethnic: "Bali",
      speakers: "3,3 juta",
      status: "Aktif",
      vocabularyCount: 1500,
      phrasesCount: 500,
      folkloreCount: 38,
      audioCount: 750,
    },
    {
      name: "Bahasa Minangkabau",
      region: "Sumatera Barat",
      ethnic: "Minangkabau",
      speakers: "5,5 juta",
      status: "Aktif",
      vocabularyCount: 1600,
      phrasesCount: 550,
      folkloreCount: 30,
      audioCount: 800,
    },
    {
      name: "Bahasa Bugis",
      region: "Sulawesi Selatan",
      ethnic: "Bugis",
      speakers: "5 juta",
      status: "Terancam Punah",
      vocabularyCount: 1100,
      phrasesCount: 380,
      folkloreCount: 25,
      audioCount: 550,
    },
    {
      name: "Bahasa Sasak",
      region: "Nusa Tenggara Barat",
      ethnic: "Sasak",
      speakers: "2,7 juta",
      status: "Aktif",
      vocabularyCount: 900,
      phrasesCount: 300,
      folkloreCount: 18,
      audioCount: 450,
    },
    {
      name: "Bahasa Dayak Ngaju",
      region: "Kalimantan Tengah",
      ethnic: "Dayak",
      speakers: "900 ribu",
      status: "Terancam Punah",
      vocabularyCount: 750,
      phrasesCount: 250,
      folkloreCount: 15,
      audioCount: 380,
    },
    {
      name: "Bahasa Toraja",
      region: "Sulawesi Selatan",
      ethnic: "Toraja",
      speakers: "1,2 juta",
      status: "Terancam Punah",
      vocabularyCount: 850,
      phrasesCount: 280,
      folkloreCount: 20,
      audioCount: 420,
    },
  ];

  const filteredLanguages = languageArchive.filter((lang) => {
    const matchesSearch = lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lang.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = regionFilter === "all" || lang.region.includes(regionFilter);
    const matchesEthnic = ethnicFilter === "all" || lang.ethnic === ethnicFilter;
    const matchesStatus = statusFilter === "all" || lang.status === statusFilter;
    
    return matchesSearch && matchesRegion && matchesEthnic && matchesStatus;
  });

  const regions = [
    {
      name: "Sumatera",
      languages: 52,
      endangered: 12,
      highlighted: ["Minangkabau", "Batak Toba", "Aceh", "Lampung"],
    },
    {
      name: "Jawa & Bali",
      languages: 11,
      endangered: 2,
      highlighted: ["Jawa", "Sunda", "Madura", "Bali"],
    },
    {
      name: "Kalimantan",
      languages: 74,
      endangered: 18,
      highlighted: ["Dayak", "Banjar", "Kutai"],
    },
    {
      name: "Sulawesi",
      languages: 114,
      endangered: 28,
      highlighted: ["Bugis", "Makassar", "Toraja", "Minahasa"],
    },
    {
      name: "Maluku & Papua",
      languages: 449,
      endangered: 156,
      highlighted: ["Dani", "Asmat", "Ambon", "Ternate"],
    },
    {
      name: "Nusa Tenggara",
      languages: 67,
      endangered: 15,
      highlighted: ["Sasak", "Bima", "Manggarai", "Timor"],
    },
  ];

  const featuredLanguages = [
    {
      name: "Bahasa Jawa",
      speakers: "84,3 juta",
      status: "Aman",
      script: "Aksara Jawa",
      description: "Bahasa dengan penutur terbanyak kedua di Indonesia setelah bahasa Indonesia.",
    },
    {
      name: "Bahasa Batak Toba",
      speakers: "2 juta",
      status: "Rentan",
      script: "Aksara Batak",
      description: "Bahasa dari Sumatera Utara dengan sistem tulisan unik yang masih digunakan.",
    },
    {
      name: "Bahasa Bali",
      speakers: "3,3 juta",
      status: "Aman",
      script: "Aksara Bali",
      description: "Bahasa dengan tingkatan bahasa yang kompleks mencerminkan struktur sosial Bali.",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aman":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "Rentan":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "Terancam":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Eksplor Bahasa Nusantara
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Jelajahi keberagaman luar biasa dari lebih dari 700 bahasa daerah 
            yang tersebar di seluruh kepulauan Indonesia
          </p>
        </div>

        {/* Map Section */}
        <section className="mb-16">
          <Card className="overflow-hidden border-border shadow-warm">
            {/* <div className="relative">
              <img 
                src={mapImage} 
                alt="Peta Bahasa Indonesia" 
                className="h-[400px] w-full object-cover md:h-[500px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                <h2 className="mb-2 text-2xl font-bold text-foreground">
                  Peta Interaktif Bahasa Daerah
                </h2>
                <p className="mb-4 text-muted-foreground">
                  Klik pada wilayah untuk menjelajahi bahasa-bahasa lokal
                </p>
                <Button className="bg-primary hover:bg-primary/90">
                  Lihat Peta Interaktif
                </Button>
              </div>
            </div> */}
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 950,
                center: [118, -2],
              }}
              height={330}
            >
              <Geographies geography={geoJson}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const province = geo.properties.province_bps_name;
                    const langs = languagesByProvince[province] || [];
                    // console.log('LIAT HERE', { geo, province, langs });

                    return (
                      <Tooltip.Root key={geo.rsmKey}>
                        <Tooltip.Trigger asChild>
                          <Geography
                            geography={geo}
                            style={{
                              default: {
                                fill: geo.properties.province_bps_code === selectedProvince ? "#F53" : "#D6D6DA",
                                stroke: "#FFF",
                                strokeWidth: 0.5,
                                outline: "none",
                              },
                              hover: {
                                fill: "#F53",
                                outline: "none",
                                cursor: "pointer",
                              },
                              pressed: {
                                fill: "#E42",
                                outline: "none",
                              },
                            }}
                            onClick={() => setSelectedProvince(geo.properties.province_bps_code)}
                          />
                        </Tooltip.Trigger>

                        <Tooltip.Portal>
                          <Tooltip.Content
                            side="top"
                            align="center"
                            className="bg-gray-800 text-white px-2 py-1 rounded text-sm shadow-lg"
                          >
                            <span className="font-medium">{province}</span>
                            {langs.length > 0 && (
                              <span className="ml-1 text-gray-300">
                                — {langs.join(", ")}
                              </span>
                            )}
                            <Tooltip.Arrow className="fill-gray-800" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    );
                  })
                }
              </Geographies>

              {languagePoints.map((lang) => (
                <Tooltip.Root key={lang.name}>
                  <Tooltip.Trigger asChild>
                    <Marker coordinates={lang.coords}>
                      <circle r={6} fill="#F53" stroke="#fff" strokeWidth={2} />
                    </Marker>
                  </Tooltip.Trigger>

                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="top"
                      align="center"
                      className="bg-gray-800 text-white px-2 py-1 rounded text-sm shadow-lg"
                    >
                      <strong>{lang.name}</strong>
                      <div className="text-gray-300 text-xs">{lang.region}</div>
                      <Tooltip.Arrow className="fill-gray-800" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              ))}
            </ComposableMap>
          </Card>
        </section>

        {/* Search and Filters */}
        <section className="mb-16">
          <Card className="border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Arsip Bahasa Interaktif
              </CardTitle>
              <CardDescription>
                Cari dan filter bahasa daerah berdasarkan wilayah, suku, atau status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari bahasa atau wilayah..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Wilayah
                    </label>
                    <Select value={regionFilter} onValueChange={setRegionFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Wilayah" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Wilayah</SelectItem>
                        <SelectItem value="Jawa">Jawa</SelectItem>
                        <SelectItem value="Sumatera">Sumatera</SelectItem>
                        <SelectItem value="Kalimantan">Kalimantan</SelectItem>
                        <SelectItem value="Sulawesi">Sulawesi</SelectItem>
                        <SelectItem value="Bali">Bali</SelectItem>
                        <SelectItem value="Nusa Tenggara">Nusa Tenggara</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Suku
                    </label>
                    <Select value={ethnicFilter} onValueChange={setEthnicFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Suku" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Suku</SelectItem>
                        <SelectItem value="Jawa">Jawa</SelectItem>
                        <SelectItem value="Sunda">Sunda</SelectItem>
                        <SelectItem value="Batak">Batak</SelectItem>
                        <SelectItem value="Bali">Bali</SelectItem>
                        <SelectItem value="Minangkabau">Minangkabau</SelectItem>
                        <SelectItem value="Bugis">Bugis</SelectItem>
                        <SelectItem value="Dayak">Dayak</SelectItem>
                        <SelectItem value="Toraja">Toraja</SelectItem>
                        <SelectItem value="Sasak">Sasak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Status
                    </label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Terancam Punah">Terancam Punah</SelectItem>
                        <SelectItem value="Punah">Punah</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Language Archive Results */}
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              Hasil Pencarian ({filteredLanguages.length})
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLanguages.map((language, index) => (
              <Card key={index} className="border-border shadow-soft transition-all hover:shadow-warm">
                <CardHeader>
                  <div className="mb-2 flex items-start justify-between">
                    <CardTitle className="text-xl">{language.name}</CardTitle>
                    <Badge className={getStatusColor(language.status)}>
                      {language.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {language.region}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Suku:</span>
                      <span className="font-medium text-foreground">{language.ethnic}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Penutur:</span>
                      <span className="font-medium text-foreground">{language.speakers}</span>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-2 rounded-lg bg-muted/30 p-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{language.vocabularyCount}</div>
                      <div className="text-xs text-muted-foreground">Kosakata</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{language.phrasesCount}</div>
                      <div className="text-xs text-muted-foreground">Frasa</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{language.folkloreCount}</div>
                      <div className="text-xs text-muted-foreground">Cerita</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{language.audioCount}</div>
                      <div className="text-xs text-muted-foreground">Audio</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" size="sm">
                      <Volume2 className="mr-1 h-4 w-4" />
                      Dengar
                    </Button>
                    <Button 
                      className="flex-1" 
                      size="sm"
                      onClick={() => navigate(`/explore/${encodeURIComponent(language.name)}`, { state: { language } })}
                    >
                      <FileText className="mr-1 h-4 w-4" />
                      Detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredLanguages.length === 0 && (
            <Card className="border-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Tidak ada bahasa yang sesuai dengan filter Anda. Coba ubah kriteria pencarian.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

      </div>
    </div>
  );
};

export default Explore;
