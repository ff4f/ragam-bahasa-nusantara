import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Header from "./Header";
import FormContribution from "./FormContribution";
import DataTable from "./DataTable";
import { Award, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { leaderboard } from "@/lib/dummy";
import { INITIAL_FORM_CONTRIBUTION } from "@/lib/constants";
import { validateForm } from "@/lib/utils";
import { mockRecordings } from "@/lib/dummy";
import moment from "moment";

const columnsHistory = ({ setFormDataModal, setOpenEditModal }) => [
  {
    id: "text",
    name: "Kosakata",
    render: ({ value }) => <span className="font-medium">{value}</span>
  },
  {
    id: "languageName",
    name: "Bahasa",
  },
  {
    id: "created_at",
    name: "Tanggal Dibuat",
    render: ({ value }) => <span>{moment(value).format("DD/MM/YYYY")}</span>
  },
  {
    id: "action",
    name: "Aksi",
    render: ({ row }) => (
      <Tooltip label="Ubah">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            setFormDataModal(row);
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

  // edit modal
  const [openEditModal, setOpenEditModal] = useState(false);
  const [formDataModal, setFormDataModal] = useState(INITIAL_FORM_CONTRIBUTION);
  const [editLoading, setEditLoading] = useState(false);

  const totalPages = Math.ceil(mockRecordings.length / 5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(formData)) {
      toast({ title: "Silahkan lengkapi field kontribusi yang diperlukan!" });
      return;
    };
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({ title: "Kontribusi berhasil dikirim! Terima kasih atas partisipasi Anda." });

    // Reset form
    setFormData(INITIAL_FORM_CONTRIBUTION);
    setIsSubmitting(false);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
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
                <CardTitle>Form</CardTitle>
                <CardDescription>
                  Lengkapi semua field kontribusi yang diperlukan
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
                    <span className="text-sm text-muted-foreground">Total XP</span>
                    <span className="font-bold text-primary">{user.xp ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Level</span>
                    <span className="font-medium">{user.level ?? 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Badge</span>
                    <span className="font-medium">{user.badges?.length ?? 0}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle>Kontributor Teratas</CardTitle>
                <CardDescription>Peringkat berdasarkan XP minggu ini</CardDescription>
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
                        <p className="text-sm font-bold">{contributor.xp}</p>
                        <p className="text-xs text-muted-foreground">XP</p>
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
                  rows={mockRecordings}
                  totalPages={totalPages}
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
