import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
import PaginationComponent from '@/components/Pagination';
import { MapPin, Search, Info } from "lucide-react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import geoJson from "../assets/indonesia-province-38.json";
import { Tooltip } from '@/components/ui/tooltip';
import { getStatusColor, thousandSeparator } from '@/lib/utils';
import { RECORDED_STATUS_LIST } from '@/lib/constants';
import { languageArchive } from '@/lib/dummy';
import { useDebounce } from '@/hooks/use-debounce';

const Explore = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300); // Debounce search for better performance
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProvince, setSelectedProvince] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12; // 12 items per page (4 rows of 3 on desktop)

  // Memoize filtered languages to prevent unnecessary recalculations
  const filteredLanguages = useMemo(() => {
    return languageArchive.filter((lang) => {
      const matchesSearch = lang.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        lang.region.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = statusFilter === "all" || lang.status === statusFilter;
      const matchesProvince = selectedProvince.length === 0 || lang.regionId.some(item => selectedProvince.includes(item));
      return matchesSearch && matchesStatus && matchesProvince;
    });
  }, [debouncedSearch, statusFilter, selectedProvince]);

  // Calculate total pages based on filtered data
  const totalPages = Math.ceil(filteredLanguages.length / ITEMS_PER_PAGE);

  // Get paginated data
  const paginatedLanguages = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredLanguages.slice(startIndex, endIndex);
  }, [filteredLanguages, page]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, selectedProvince]);

  const handleClickProvince = useCallback((geo: any) => {
    const code = geo.properties.province_bps_code;
    setSelectedProvince(prev => {
      const index = prev.indexOf(code);
      if (index < 0) {
        return [...prev, code];
      } else {
        const result = [...prev];
        result.splice(index, 1);
        return result;
      }
    });
  }, []);

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <Header
          title="Eksplor Bahasa Nusantara"
          description="Jelajahi keberagaman luar biasa dari lebih dari 700 bahasa daerah yang tersebar di seluruh Nusantara."
        />

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
                      <Tooltip label={province} key={geo.rsmKey}>
                        <Geography
                          geography={geo}
                          style={{
                            default: {
                              fill: selectedProvince.includes(geo.properties.province_bps_code) ? "hsl(var(--primary))" : "#D6D6DA",
                              stroke: "#FFF",
                              strokeWidth: 0.5,
                              outline: "none",
                              transition: "fill 0.3s ease, transform 0.3s ease",
                            },
                            hover: {
                              fill: "hsl(var(--primary))",
                              outline: "none",
                              cursor: "pointer",
                            },
                            pressed: {
                              fill: "hsl(var(--primary) / 0.9)",
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
              <span className="text-sm">Pilih satu atau lebih provinsi untuk menyaring bahasa</span>
            </div>

          </Card>
        </section>

        {/* Search and Filter */}
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
                      {RECORDED_STATUS_LIST.map(item => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
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
            {paginatedLanguages.map((language, index) => (
              <Card
                key={index}
                className={`border-border shadow-soft transition ${language?.status === "recorded" ? "cursor-pointer hover:scale-[1.03] hover:shadow-xl" : "cursor-default opacity-50"}`}
                onClick={() => language?.status === "recorded" && navigate(`/explore/${encodeURIComponent(language.id)}`, { state: { language } })}
              >
                <CardHeader>
                  {language?.status && (
                    <div className="mb-2 flex items-start justify-between">
                      <CardTitle className="text-xl">{language.name}</CardTitle>
                      <Badge className={getStatusColor(language.status)}>
                        {RECORDED_STATUS_LIST.find(item => item.id === language.status)?.name || ""}
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
                      <div className="text-lg font-bold text-primary">{thousandSeparator(language.vocabularyCount)}</div>
                      <div className="text-xs text-muted-foreground">Kosakata</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{thousandSeparator(language.audioCount)}</div>
                      <div className="text-xs text-muted-foreground">Audio</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{thousandSeparator(language.contributorCount)}</div>
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

        {/* Pagination */}
        <section>
          <PaginationComponent
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </section>

      </div>
    </div>
  );
};

export default Explore;
