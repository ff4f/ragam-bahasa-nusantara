import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Info } from "lucide-react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import geoJson from "../assets/indonesia-province-38.json";
import { Tooltip } from '@/components/ui/tooltip';
import { getStatusColor } from '@/lib/utils';
import { statusList } from '@/lib/constants';
import { languageArchive } from '@/lib/dummy';

const Explore = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProvince, setSelectedProvince] = useState([]);

  const filteredLanguages = languageArchive.filter((lang) => {
    const matchesSearch = lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lang.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lang.status === statusFilter;
    const matchesProvince = selectedProvince.length === 0 || lang.regionId.some(item => selectedProvince.includes(item));
    return matchesSearch && matchesStatus && matchesProvince;
  });

  const handleClickProvince = useCallback((geo: any) => {
    const code = geo.properties.province_bps_code;
    let result = [ ...selectedProvince ];
    if (selectedProvince.indexOf(code) < 0) result.push(code);
    else result.splice(selectedProvince.indexOf(code), 1);
    setSelectedProvince(result);
  }, [selectedProvince]);

  useEffect(() => {

  }, [selectedProvince]);

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
        <section className="mb-8">
          <Card className="overflow-hidden border-border shadow-warm">
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
                    return (
                      <Tooltip label={province}>
                        <Geography
                          geography={geo}
                          style={{
                            default: {
                              fill: selectedProvince.includes(geo.properties.province_bps_code) ? "hsl(188 65% 35%)" : "#D6D6DA",
                              stroke: "#FFF",
                              strokeWidth: 0.5,
                              outline: "none",
                            },
                            hover: {
                              fill: "hsl(188 65% 35%)",
                              outline: "none",
                              cursor: "pointer",
                            },
                            pressed: {
                              fill: "hsla(188, 66%, 28%, 1.00)",
                              outline: "none",
                            },
                          }}
                          onClick={() => handleClickProvince(geo)}
                        />
                      </Tooltip>
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
            <div className="p-4 flex items-center gap-1 text-muted-foreground">
              <Info className="h-4 w-4" />
              <span className="text-sm">Pilih satu atau lebih provinsi untuk memfilter bahasa</span>
            </div>
            
          </Card>
        </section>

        {/* Search and Filters */}
        <section className="mb-8">
          <Card className="border-border shadow-soft">
            <CardContent className="pt-6">
              <div className="space-y-4 md:space-y-0 md:flex md:gap-4">
                <div className="relative flex-[2]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari bahasa atau wilayah..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex-1">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusList.map(item => <SelectItem value={item.id}>{item.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Language Archive Results */}
        <section className="mb-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLanguages.map((language, index) => (
              <Card
                key={index}
                className={`border-border shadow-soft transition-all hover:shadow-warm ${language?.status === "recorded" ? "cursor-pointer" : "cursor-default opacity-50"}`}
                onClick={() => language?.status === "recorded" && navigate(`/explore/${encodeURIComponent(language.id)}`, { state: { language } })}
              >
                <CardHeader>
                  {language?.status && (
                    <div className="mb-2 flex items-start justify-between">
                      <CardTitle className="text-xl">{language.name}</CardTitle>
                      <Badge className={getStatusColor(language.status)}>
                        {statusList.find(item => item.id === language.status)?.name || ""}
                      </Badge>
                    </div>
                  )}
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

                  <div className="mb-4 grid grid-cols-3 gap-2 rounded-lg bg-muted/30 p-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{language.vocabularyCount}</div>
                      <div className="text-xs text-muted-foreground">Kosakata</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{language.audioCount}</div>
                      <div className="text-xs text-muted-foreground">Audio</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{language.contributorCount}</div>
                      <div className="text-xs text-muted-foreground">Kontributor</div>
                    </div>
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
