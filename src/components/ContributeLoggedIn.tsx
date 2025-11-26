import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Header from "./Header";
import FormContribution from "./FormContribution";
import DataTable from "./DataTable";
import { Award, Pencil } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { leaderboard } from "@/lib/dummy";
import { INITIAL_FORM_CONTRIBUTION } from "@/lib/constants";
import { validateForm, thousandSeparator } from "@/lib/utils";
import { mockRecordings } from "@/lib/dummy";
import moment from "moment";
import { contributionService, Contribution } from "@/services/contribution.service";

const columnsHistory = ({ setFormDataModal, setOpenEditModal }: any) => [
  {
    id: "target_text",
    name: "Kosakata",
    render: ({ value }: any) => <span className="font-medium">{value}</span>
  },
  {
    id: "language",
    name: "Bahasa",
  },
  {
    id: "status",
    name: "Status",
    render: ({ value }: any) => {
      let color = "text-yellow-600 bg-yellow-100";
      if (value === "approved") color = "text-green-600 bg-green-100";
      if (value === "rejected") color = "text-red-600 bg-red-100";
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {value === "pending" ? "Menunggu" : value === "approved" ? "Diterima" : "Ditolak"}
        </span>
      );
    }
  },
  {
    id: "created_at",
    name: "Tanggal Dibuat",
    render: ({ value }: any) => <span>{moment(value).format("DD/MM/YYYY")}</span>
  },
  {
    id: "action",
    name: "Aksi",
    actions: [
      {
        id: "edit",
        label: "Ubah",
        action: (row: any) => {
          // Map back to form data structure
          const formData = {
            province: row.province ? [row.province] : [], // Adjust based on how province is stored
            region: row.region ? [row.region] : [],
            language: row.language,
            ethnic: row.ethnic,
            dialect: row.dialect,
            text: row.target_text,
            textTranslation: row.source_text,
            sentence: row.example_target,
            sentenceTranslation: row.example_source,
            textAudio: row.audio_url,
            notes: row.notes
          };
          setFormDataModal(formData);
          setOpenEditModal(true);
        },
      },
    ],
    render: ({ row }: any) => (
      <Tooltip label="Ubah">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            const formData = {
              province: row.province ? [row.province] : [],
              region: row.region ? [row.region] : [],
              language: row.language,
              ethnic: row.ethnic,
              dialect: row.dialect,
              text: row.target_text,
              textTranslation: row.source_text,
              sentence: row.example_target,
              sentenceTranslation: row.example_source,
              textAudio: row.audio_url,
              notes: row.notes
            };
            setFormDataModal(formData);
            setOpenEditModal(true);
          }}
        >
          <Pencil className="text-primary" />
        </Button>
      </Tooltip>
    ),
  },
];

const ContributeLoggedIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: userContext } = useUser();

  const [user, setUser] = useState(userContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_CONTRIBUTION);

  // History state
  const [history, setHistory] = useState<Contribution[]>([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);

  // edit modal
  const [openEditModal, setOpenEditModal] = useState(false);
  const [formDataModal, setFormDataModal] = useState(INITIAL_FORM_CONTRIBUTION);
  const [editLoading, setEditLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const response = await contributionService.getMyContributions(historyPage, 5);
      setHistory(response.items);
      setHistoryTotalPages(Math.ceil(response.total / 5));
    } catch (error) {
      console.error("Failed to fetch contribution history:", error);
    }
  }, [historyPage]);

  useEffect(() => {
    if (userContext) {
      fetchHistory();
    }
  }, [userContext, fetchHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!validateForm(formData)) {
      toast({ title: "Silahkan lengkapi field kontribusi yang diperlukan!" });
      return;
    }

    // Additional validation for specific fields
    if (!formData.province || formData.province.length === 0) {
      toast({ title: "Provinsi harus dipilih!" });
      return;
    }

    if (!formData.language || formData.language.trim() === "") {
      toast({ title: "Bahasa Daerah harus dipilih!" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Map form data to API schema
      const contributionData = {
        contribution_type: "vocabulary",
        province: String(formData.province[0] || ""), // Ensure string
        region: String(formData.region[0] || ""), // Ensure string
        language: formData.language,
        dialect: formData.dialect,
        ethnic: formData.ethnic,
        source_text: formData.textTranslation, // Indonesian
        target_text: formData.text, // Regional
        example_source: formData.sentenceTranslation, // Indonesian
        example_target: formData.sentence, // Regional
        audio_url: typeof formData.textAudio === 'string' ? formData.textAudio : null, // Only send URLs, not Blob objects
        notes: formData.notes
      };

      await contributionService.create(contributionData);

      toast({ title: "Kontribusi berhasil dikirim! Terima kasih atas partisipasi Anda." });

      // Reset form
      setFormData(INITIAL_FORM_CONTRIBUTION);

      // Refresh history
      fetchHistory();
    } catch (error: any) {
      console.error("Failed to submit contribution:", error);
      console.error("Error response:", error.response?.data);

      // Safely extract error message
      let errorMessage = "Terjadi kesalahan";
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          // If detail is array of errors (Pydantic style), take the first one
          const firstError = error.response.data.detail[0];
          errorMessage = `${firstError.loc?.join('.')} ${firstError.msg}`;
        } else {
          errorMessage = error.response.data.detail;
        }
      }

      toast({
        title: "Gagal mengirim kontribusi",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(formDataModal)) {
      toast({ title: "Silahkan lengkapi field kontribusi yang diperlukan!" });
      return;
    };
    setEditLoading(true);

    // TODO: Implement update API if needed, currently just simulating
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({ title: "Kontribusi berhasil diubah! Terima kasih atas partisipasi Anda." });

    // Reset form
    setFormDataModal(INITIAL_FORM_CONTRIBUTION);
    setEditLoading(false);
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
                <CardTitle>Formulir</CardTitle>
                <CardDescription>
                  Lengkapi semua kolom kontribusi yang diperlukan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormContribution
                  formData={formData}
                  setFormData={setFormData}
                  handleSubmit={handleSubmit}
                  loading={isSubmitting}
                />
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
                    <span className="text-sm text-muted-foreground">Total Poin</span>
                    <span className="font-bold text-primary">{thousandSeparator(user.points || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tingkat</span>
                    <span className="font-medium">{thousandSeparator(user.level || 1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Lencana</span>
                    <span className="font-medium">{thousandSeparator(user.badges?.length || 0)}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle>Kontributor Teratas</CardTitle>
                <CardDescription>Peringkat berdasarkan Poin minggu ini</CardDescription>
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
                        <p className="text-sm font-bold">{thousandSeparator(contributor.points)}</p>
                        <p className="text-xs text-muted-foreground">Poin</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* History */}
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Kontribusi</CardTitle>
                <CardDescription>Daftar kontribusi yang sudah Anda buat</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={columnsHistory({ setFormDataModal, setOpenEditModal })}
                  rows={history}
                  totalPages={historyTotalPages}
                  onChangePage={setHistoryPage}
                />
              </CardContent>
            </Card>
          </div>
        </div>
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
    </div>
  );
};

export default ContributeLoggedIn;
