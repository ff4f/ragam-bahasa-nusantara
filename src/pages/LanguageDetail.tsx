import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CommentsDialog from "@/components/CommentsDialog";
import { MapPin, Users, Volume2, ArrowLeft, BadgeCheck, EllipsisVertical, Search, Heart, MessageCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getStatusColor, capitalize, validateForm } from "@/lib/utils";
import { RECORDED_STATUS_LIST, VERIFIED_STATUS_LIST, INITIAL_FORM_CONTRIBUTION } from "@/lib/constants";
import { vocabulary, comments } from "@/lib/dummy";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { dictionaryService } from "@/services/dictionary.service";
import { useDebounce } from "@/hooks/use-debounce";
import FormContribution from "@/components/FormContribution";
import PaginationComponent from "@/components/Pagination";

const LanguageDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const language = location.state?.language;
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [vocabs, setVocabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // edit modal
  const [openEditModal, setOpenEditModal] = useState(false);
  const [formDataModal, setFormDataModal] = useState<any>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [selectedVocabId, setSelectedVocabId] = useState<number | null>(null);

  // comment modal
  const [openCommentModal, setOpenCommentModal] = useState(false);

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

  const handleSubmitEdit = async () => {
    if (!validateForm(formDataModal)) {
      toast({ title: "Silahkan lengkapi field kontribusi yang diperlukan!" });
      return;
    };
    setEditLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({ title: "Kontribusi berhasil diubah! Terima kasih atas partisipasi Anda." });

    // Reset form
    setFormDataModal(INITIAL_FORM_CONTRIBUTION);
    setEditLoading(false);
  };

  const handleLike = async (id: any) => {
    if (!user) return;
    try {
      const result = await dictionaryService.toggleLike(id);
      setVocabs(vocabs.map(item => ({
        ...item,
        liked: item.id === id ? result.liked : item.liked,
        like: item.id === id ? result.total_likes : item.like,
      })));
    } catch (error) {
      toast({ title: "Gagal menyukai konten", variant: "destructive" });
    }
  };

  useEffect(() => {
    const fetchVocabulary = async () => {
      if (language.id === "10") { // Bahasa Jawa Banyumasan
        setLoading(true);
        try {
          const response = await dictionaryService.search(debouncedSearch, "Bahasa Jawa Banyumasan", page, ITEMS_PER_PAGE);
          // Transform API response to match UI format
          const mappedVocabs = response.items.map((item: any) => ({
            id: item.id,
            word: item.target_text,
            translation: item.source_text,
            level: item.dialect || "Umum", // Use dialect as level/category for now
            example: item.example_target || "-",
            exampleTranslation: item.example_source || "-",
            verified: true, // Assume seeded data is verified
            like: item.like_count || 0,
            comment: item.comment_count || 0,
            liked: item.is_liked || false,
            created_by: "system"
          }));
          setVocabs(mappedVocabs);
          // Calculate total pages from API response
          setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE));
        } catch (error) {
          console.error("Failed to fetch vocabulary:", error);
          toast({ title: "Gagal memuat data kosakata", variant: "destructive" });
        } finally {
          setLoading(false);
        }
      } else {
        // Fallback to dummy data for other languages
        const filteredVocabulary = vocabulary.filter((vocab) => {
          const matchesSearch = vocab.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vocab.translation.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesStatus = statusFilter === "all" || vocab.verified === !!(statusFilter === "verified");
          return matchesSearch && matchesStatus;
        });
        setVocabs(filteredVocabulary);
        setTotalPages(Math.ceil(filteredVocabulary.length / ITEMS_PER_PAGE));
      }
    };

    fetchVocabulary();
  }, [language, debouncedSearch, statusFilter, page]);

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
              {RECORDED_STATUS_LIST.find(item => item.id === language.status)?.name || ""}
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
                <div className="text-sm text-muted-foreground">Kontributor</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content */}
        <h2 className="mb-4 text-2xl font-bold text-foreground">Kosakata</h2>

        {/* Search and Filter */}
        <Card className="border-border shadow-soft mb-4">
          <CardContent className="pt-6">
            <div className="space-y-4 md:space-y-0 md:flex md:gap-4">
              <div className="relative flex-[2]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari kosakata atau artinya..."
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
                    {VERIFIED_STATUS_LIST.map(item => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vocabs.map((item, index) => (
            <Card key={index} className="border-border relative">
              <CardHeader>
                <div className="flex justify-between min-h-8">
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
                        <BadgeCheck className="text-[#1f8493ff]" />
                      </Tooltip>
                    ) : null}
                  </div>

                  {user && item.created_by === user.email && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="rounded-[50%] h-6 w-6 p-4"
                        >
                          <EllipsisVertical style={{ width: "1.2rem", height: "1.2rem" }} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setFormDataModal(item);
                          setOpenEditModal(true);
                        }}>Ubah</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <CardDescription>{capitalize(item.translation)}</CardDescription>
              </CardHeader>
              <CardContent className="pb-12">
                <div className="mb-3 space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Tingkatan: <span className="font-medium text-foreground">{capitalize(item.level)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Contoh: <span className="font-medium text-foreground italic">{item.example}</span>
                    <span className="ext-foreground italic"> - {item.exampleTranslation}</span>
                  </div>
                </div>
              </CardContent>

              <div className="absolute bottom-6 right-6 flex items-end gap-2">
                <div className="flex items-center">
                  <span className="text-xs text-muted-foreground">{item.comment || 0}</span>
                  <Tooltip label="Komentar">
                    <Button
                      variant="ghost"
                      className="rounded-[50%] h-6 w-6 p-4"
                      onClick={() => {
                        setSelectedVocabId(item.id);
                        setOpenCommentModal(true);
                      }}
                      disabled={!user && item.comment <= 0}
                    >
                      <MessageCircle style={{ width: "1.2rem", height: "1.2rem" }} />
                    </Button>
                  </Tooltip>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-muted-foreground">{item.like || 0}</span>
                  <Tooltip label="Suka">
                    <Button
                      variant="ghost"
                      className="rounded-[50%] h-6 w-6 p-4"
                      onClick={() => handleLike(item.id)}
                      disabled={!user}
                    >
                      <Heart className={item?.liked ? "text-primary fill-primary" : ""} style={{ width: "1.2rem", height: "1.2rem" }} />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <PaginationComponent
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      </div>

      {/* Edit Modal */}
      <Dialog open={!!openEditModal} onOpenChange={(open) => !open && setOpenEditModal(false)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Ubah Kontribusi:
            </DialogTitle>
            <DialogDescription>
              Anda bisa mengubah kontribusi yang telah dibuat
            </DialogDescription>
          </DialogHeader>
          <FormContribution
            formData={formDataModal}
            setFormData={setFormDataModal}
            handleSubmit={handleSubmitEdit}
            loading={editLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Comments Modal */}
      <CommentsDialog
        open={openCommentModal}
        handleClose={() => {
          setOpenCommentModal(false);
          setSelectedVocabId(null);
        }}
        user={user}
        dictionaryId={selectedVocabId}
      />
    </div>
  );
};

export default LanguageDetail;
