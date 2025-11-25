import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Header from '@/components/Header';
import DataTable from '@/components/DataTable';
import FormContribution from '@/components/FormContribution';
import { Tooltip } from '@/components/ui/tooltip';
import { CheckCircle2, XCircle, FileAudio, FileText, BookOpen, Languages, FileSearch, Percent } from 'lucide-react';
import { mockRecordings } from '@/lib/dummy';
import { INITIAL_FORM_CONTRIBUTION } from '@/lib/constants';
import { validateForm, thousandSeparator } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import moment from "moment";

const columnsValidations = ({ setSelectedContribution, setFormData }) => [
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
    id: "user_name",
    name: "Dibuat Oleh",
  },
  {
    id: "created_at",
    name: "Tanggal Dibuat",
    render: ({ value }) => <span>{moment(value).format("DD/MM/YYYY")}</span>,
  },
  {
    id: "action",
    name: "Aksi",
    actions: [
      {
        id: "review",
        label: "Tinjau",
        action: (row) => {
          setFormData(row);
          setSelectedContribution(true);
        },
      },
    ],
    render: ({ row }) => (
      <Tooltip label="Tinjau">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => {
            setFormData(row);
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
    id: "text",
    name: "Kosakata",
    render: ({ value }) => <span className="font-medium">{value}</span>
  },
  {
    id: "languageName",
    name: "Bahasa",
  },
  {
    id: "user_name",
    name: "Dibuat Oleh",
  },
  {
    id: "validated_at",
    name: "Tanggal Terverifikasi",
    render: ({ value }) => <span>{moment(value).format("DD/MM/YYYY")}</span>,
  },
  {
    id: "notes",
    name: "Catatan",
  },
];

const ValidatorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContribution, setSelectedContribution] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_CONTRIBUTION);
  const [reviewLoading, setReviewLoading] = useState(false);
  const itemsPerPage = 5;

  // Separate pending and validated recordings
  const pendingRecordings = mockRecordings.filter(r => r.status === 'pending');
  const validatedRecordings = mockRecordings.filter(r => r.status === 'approved' || r.status === 'rejected');
  
  // Pagination for pending recordings
  const totalPages = Math.ceil(pendingRecordings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecordings = pendingRecordings.slice(startIndex, startIndex + itemsPerPage);

  // Pagination for validated recordings
  const totalPagesValidated = Math.ceil(validatedRecordings.length / itemsPerPage);

  // Stats calculations
  const totalValidated = validatedRecordings.length;
  const totalPending = pendingRecordings.length;
  const totalRecordings = mockRecordings.length;
  const percentageValidated = totalRecordings > 0 ? Math.round((totalValidated / totalRecordings) * 100) : 0;

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

  const getContributionTypeIcon = (type: string) => {
    switch (type) {
      case 'voice': return <FileAudio className="h-4 w-4" />;
      case 'vocabulary': return <FileText className="h-4 w-4" />;
      case 'folktale': return <BookOpen className="h-4 w-4" />;
      case 'translation': return <Languages className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getContributionTypeLabel = (type: string) => {
    const labels = {
      voice: 'Rekam Suara',
      vocabulary: 'Kosakata',
      folktale: 'Cerita Rakyat',
      translation: 'Terjemahan'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(formData)) {
      toast({ title: "Silahkan lengkapi field kontribusi yang diperlukan!" });
      return;
    };
    setReviewLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({ title: "Kontribusi berhasil dikirim! Terima kasih atas partisipasi Anda." });
    
    setReviewLoading(false);
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
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
                  <p className="text-3xl font-bold text-foreground">{thousandSeparator(totalValidated)}</p>
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
                  <p className="text-3xl font-bold text-foreground">{thousandSeparator(totalPending)}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Persentase Tervalidasi</p>
                  <p className="text-3xl font-bold text-foreground">{percentageValidated}%</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Percent className="h-6 w-6 text-accent" />
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
            <DataTable
              columns={columnsValidations({ setSelectedContribution, setFormData })}
              rows={paginatedRecordings}
              totalPages={totalPages}
            />
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
            <DataTable
              columns={columnsHistory}
              rows={validatedRecordings}
              totalPages={totalPagesValidated}
            />
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
          <FormContribution
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            loading={reviewLoading}
            isReview
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ValidatorDashboard;
