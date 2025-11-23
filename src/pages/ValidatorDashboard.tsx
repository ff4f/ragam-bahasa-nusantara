import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Header from '@/components/Header';
import DataTable from '@/components/DataTable';
import FormContribution from '@/components/FormContribution';
import { Tooltip } from '@/components/ui/tooltip';
import { CheckCircle2, XCircle, FileSearch, Loader2 } from 'lucide-react';
import { INITIAL_FORM_CONTRIBUTION } from '@/lib/constants';
import { validateForm } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import moment from "moment";
import { contributionService, Contribution } from '@/services/contribution.service';

const columnsValidations = ({ setSelectedContribution, setFormData }: any) => [
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
    id: "user_name",
    name: "Dibuat Oleh",
  },
  {
    id: "created_at",
    name: "Tanggal Dibuat",
    render: ({ value }: any) => <span>{moment(value).format("DD/MM/YYYY")}</span>,
  },
  {
    id: "action",
    name: "Aksi",
    render: ({ row }: any) => (
      <Tooltip label="Tinjau">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            // Map API data to form data structure
            const formData = {
              ...INITIAL_FORM_CONTRIBUTION,
              id: row.id,
              contribution_type: row.contribution_type,
              province: [row.province], // MultiSelect expects array
              region: [row.region], // MultiSelect expects array
              language: row.language,
              dialect: row.dialect,
              ethnic: row.ethnic,
              text: row.target_text,
              textTranslation: row.source_text,
              sentence: row.example_target,
              sentenceTranslation: row.example_source,
              textAudio: row.audio_url,
              notes: row.notes
            };
            setFormData(formData);
            setSelectedContribution(true);
          }}
        >
          <FileSearch className="text-primary" style={{ width: "1.5rem", height: "1.5rem" }} />
        </Button>
      </Tooltip>
    ),
  },
];

const columnsHistory = [
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
    id: "user_name",
    name: "Dibuat Oleh",
  },
  {
    id: "reviewed_at",
    name: "Tanggal Verifikasi",
    render: ({ value }: any) => <span>{value ? moment(value).format("DD/MM/YYYY") : "-"}</span>,
  },
  {
    id: "status",
    name: "Status",
    render: ({ value }: any) => (
      <span className={`capitalize ${value === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
        {value === 'approved' ? 'Disetujui' : 'Ditolak'}
      </span>
    )
  },
];

const ValidatorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const [selectedContribution, setSelectedContribution] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_CONTRIBUTION);
  const [reviewLoading, setReviewLoading] = useState(false);

  // Data states
  const [pendingContributions, setPendingContributions] = useState<Contribution[]>([]);
  const [historyContributions, setHistoryContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    totalValidated: 0,
    totalPending: 0,
    percentageValidated: 0
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch pending
      const pendingRes = await contributionService.getAllContributions(1, 100, 'pending');
      setPendingContributions(pendingRes.items);

      // Fetch history (approved/rejected)
      // We need to fetch both and combine, or just fetch all and filter client side if not too many
      // For now let's fetch all without status filter and separate them
      const allRes = await contributionService.getAllContributions(1, 1000); // Get more items

      const pending = allRes.items.filter((c: Contribution) => c.status === 'pending');
      const history = allRes.items.filter((c: Contribution) => c.status !== 'pending');

      setPendingContributions(pending);
      setHistoryContributions(history);

      // Calculate stats
      const totalValidated = history.length;
      const totalPending = pending.length;
      const total = allRes.total;
      const percentage = total > 0 ? Math.round((totalValidated / total) * 100) : 0;

      setStats({
        totalValidated,
        totalPending,
        percentageValidated: percentage
      });

    } catch (error) {
      console.error("Failed to fetch contributions:", error);
      toast({ title: "Gagal memuat data kontribusi", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (user && (user.role === 'validator' || user.role === 'admin')) {
      fetchData();
    }
  }, [user, fetchData]);

  if (!user || (user.role !== 'validator' && user.role !== 'admin')) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              Anda tidak memiliki akses ke halaman ini. Halaman ini hanya untuk Validator.
            </p>
            <Button onClick={() => navigate('/')}>Kembali ke Beranda</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleReview = async (status: 'approved' | 'rejected') => {
    if (!formData.id) return;

    setReviewLoading(true);
    try {
      await contributionService.updateStatus(formData.id, status, formData.notes); // Use notes from form if any
      toast({ title: `Kontribusi berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}` });
      setSelectedContribution(false);
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({ title: "Gagal memproses kontribusi", variant: "destructive" });
    } finally {
      setReviewLoading(false);
    }
  };

  // We need to adapt FormContribution to support review actions (Approve/Reject)
  // Since FormContribution is designed for submission, we might need to pass a custom handler or render buttons outside
  // But FormContribution has `isReview` prop which renders verification buttons.
  // We need to check how FormContribution handles the buttons.
  // It calls `handleConfirmation` then `ConfirmationDialog`.
  // We need to pass the actual action to `handleSubmit` or similar.

  // Actually FormContribution calls `handleConfirmation` which sets state, then `ConfirmationDialog` calls `handleSubmit`.
  // So we need to pass a `handleSubmit` that handles the confirmation.
  // But `FormContribution` logic is a bit coupled.
  // Let's look at FormContribution again.

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <Header
          title="Dashboard Validasi"
          description="Validasi dan verifikasi kontribusi dari para kontributor"
        />

        {/* 1. Summary Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Validasi Selesai</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalValidated}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Validasi Menunggu</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalPending}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Persentase Tervalidasi</p>
                  <p className="text-3xl font-bold text-foreground">{stats.percentageValidated}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-secondary">{stats.percentageValidated}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2. Task Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Daftar Tugas Validasi</CardTitle>
            <CardDescription>
              Pilih kontribusi untuk divalidasi dan verifikasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <DataTable
                columns={columnsValidations({ setSelectedContribution, setFormData })}
                rows={pendingContributions}
                totalPages={1} // Client side pagination for now or implement server side
              />
            )}
          </CardContent>
        </Card>

        {/* 3. Validation History */}
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Validasi</CardTitle>
            <CardDescription>
              Daftar kontribusi yang sudah Anda verifikasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <DataTable
                columns={columnsHistory}
                rows={historyContributions}
                totalPages={1}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Forms Modal */}
      <Dialog open={!!selectedContribution} onOpenChange={(open) => !open && setSelectedContribution(false)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Tinjau Kontribusi:
            </DialogTitle>
            <DialogDescription>
              Anda bisa meninjau, dan memverifikasi kontribusi berikut
            </DialogDescription>
          </DialogHeader>

          {/* Custom review buttons wrapper or modify FormContribution to accept onApprove/onReject */}
          {/* FormContribution has internal logic for buttons. Let's see how to hook into it. */}
          {/* It calls handleSubmit when confirmation dialog is confirmed. */}
          {/* But it doesn't pass the type (verify/delete) to handleSubmit. */}
          {/* We might need to modify FormContribution to pass the action type or handle it differently. */}
          {/* For now, let's assume we can modify FormContribution or just render our own buttons if isReview is true. */}

          <div className="space-y-6">
            <FormContribution
              formData={formData}
              setFormData={setFormData}
              handleSubmit={() => { }} // Dummy, not used for review
              loading={reviewLoading}
              isReview
              onApprove={() => handleReview('approved')}
              onReject={() => handleReview('rejected')}
            />

            {/* We render our own buttons because FormContribution's buttons might not be flexible enough without modification */}
            {/* Actually FormContribution renders buttons if isReview is true. */}
            {/* Let's check FormContribution again. */}
            {/* It renders: Verifikasi (calls handleConfirmation('verification')) and Hapus (calls handleConfirmation('delete')) */}
            {/* handleConfirmation sets openConfirmation(true). */}
            {/* ConfirmationDialog calls handleSubmit prop when confirmed. */}
            {/* So handleSubmit is called for BOTH actions. We don't know which one. */}

            {/* To fix this properly, I should probably modify FormContribution to accept onApprove and onReject props. */}
            {/* OR, I can just hide the buttons in FormContribution (if I can) and render my own. */}
            {/* But I can't easily hide them. */}

            {/* Quick fix: Modify FormContribution to pass the action type to handleSubmit or accept separate handlers. */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ValidatorDashboard;
