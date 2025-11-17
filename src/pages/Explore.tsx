import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, AlertCircle, BookOpen } from "lucide-react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import geoJson from "../assets/indonesia-geo.json";
import * as Tooltip from "@radix-ui/react-tooltip";

const Explore = () => {
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

        {/* Regions Grid */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Bahasa per Wilayah</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regions.map((region, index) => (
              <Card key={index} className="border-border shadow-soft transition-all hover:shadow-warm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {region.name}
                    <Badge variant="secondary">{region.languages} bahasa</Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {region.endangered} terancam punah
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 text-sm font-medium text-muted-foreground">
                    Bahasa Utama:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {region.highlighted.map((lang, i) => (
                      <Badge key={i} variant="outline" className="border-primary/20">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Languages */}
        <section className="mb-16">
          <div className="mb-8 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Bahasa Unggulan</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredLanguages.map((language, index) => (
              <Card key={index} className="border-border shadow-soft">
                <CardHeader>
                  <div className="mb-2 flex items-start justify-between">
                    <CardTitle className="text-xl">{language.name}</CardTitle>
                    <Badge className={getStatusColor(language.status)}>
                      {language.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {language.speakers} penutur
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <span className="text-sm font-medium text-muted-foreground">Aksara: </span>
                    <span className="text-sm text-foreground">{language.script}</span>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {language.description}
                  </p>
                  <Button variant="outline" className="w-full">
                    Pelajari Lebih Lanjut
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Statistics */}
        <section>
          <Card className="border-border bg-gradient-warm shadow-soft">
            <CardContent className="p-8 md:p-12">
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                Fakta Bahasa Daerah Indonesia
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="mb-4 text-3xl font-bold text-primary">700+</div>
                  <p className="text-muted-foreground">
                    Bahasa daerah yang tersebar di seluruh Indonesia, menjadikannya 
                    salah satu negara dengan keberagaman linguistik tertinggi di dunia
                  </p>
                </div>
                <div>
                  <div className="mb-4 text-3xl font-bold text-red-600 dark:text-red-400">
                    146
                  </div>
                  <p className="text-muted-foreground">
                    Bahasa yang terancam punah menurut UNESCO, membutuhkan upaya 
                    pelestarian segera untuk generasi mendatang
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Explore;
