import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Header from '@/components/Header';
import { CheckCircle2, XCircle, Play, Volume2, TrendingUp, Award } from 'lucide-react';
import { mockRecordings } from '@/lib/dummy';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';

const ValidatorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const [selectedRecording, setSelectedRecording] = useState<string | null>(null);
  const [editedTranscript, setEditedTranscript] = useState('');
  const [recordings, setRecordings] = useState(mockRecordings.filter(r => r.status === 'pending'));

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

  const handleSelectRecording = (recordingId: string) => {
    setSelectedRecording(recordingId);
    const recording = recordings.find(r => r.id === recordingId);
    if (recording) {
      setEditedTranscript(recording.transcript_ai);
    }
  };

  const handleApprove = () => {
    if (!selectedRecording) return;
    
    setRecordings(prev => prev.filter(r => r.id !== selectedRecording));
    setSelectedRecording(null);
    setEditedTranscript('');
    
    toast({
      title: 'Rekaman Disetujui',
      description: 'Rekaman telah disetujui dan ditambahkan ke dataset.',
    });
  };

  const handleReject = () => {
    if (!selectedRecording) return;
    
    setRecordings(prev => prev.filter(r => r.id !== selectedRecording));
    setSelectedRecording(null);
    setEditedTranscript('');
    
    toast({
      title: 'Rekaman Ditolak',
      description: 'Rekaman telah ditolak dan dihapus dari antrian.',
      variant: 'destructive',
    });
  };

  const selectedRecordingData = recordings.find(r => r.id === selectedRecording);

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <Header
          title="Dashboard Validator"
          description="Validasi dan koreksi transkripsi rekaman dari kontributor"
        />

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Volume2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{recordings.length}</p>
                  <p className="text-sm text-muted-foreground">Antrian Validasi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{user.validationCount || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Validasi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{user.accuracy || 0}%</p>
                  <p className="text-sm text-muted-foreground">Akurasi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recordings Queue */}
          <Card>
            <CardHeader>
              <CardTitle>Antrian Rekaman</CardTitle>
              <CardDescription>
                Pilih rekaman untuk divalidasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dialek</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recordings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          Tidak ada rekaman dalam antrian
                        </TableCell>
                      </TableRow>
                    ) : (
                      recordings.map((recording) => (
                        <TableRow key={recording.id}>
                          <TableCell>{recording.dialect}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(recording.created_at).toLocaleDateString('id-ID')}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant={selectedRecording === recording.id ? 'default' : 'outline'}
                              onClick={() => handleSelectRecording(recording.id)}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              {selectedRecording === recording.id ? 'Dipilih' : 'Pilih'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Validation Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Panel Validasi</CardTitle>
              <CardDescription>
                Dengarkan audio dan koreksi transkripsi jika diperlukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedRecordingData ? (
                <div className="text-center py-12 text-muted-foreground">
                  Pilih rekaman dari antrian untuk mulai validasi
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Audio Player */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Audio Rekaman
                    </label>
                    <div className="border rounded-md p-4 bg-muted/30">
                      <div className="flex items-center justify-center gap-4">
                        <Button size="icon" variant="outline">
                          <Play className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 h-2 bg-muted rounded-full">
                          <div className="h-full bg-primary rounded-full" style={{ width: '0%' }} />
                        </div>
                        <span className="text-sm text-muted-foreground">0:00</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Audio demo - Klik play untuk mendengar
                      </p>
                    </div>
                  </div>

                  {/* AI Transcript */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Transkripsi AI
                      <Badge variant="outline" className="ml-2">Auto-generated</Badge>
                    </label>
                    <div className="border rounded-md p-3 bg-muted/30">
                      <p className="text-sm text-foreground">{selectedRecordingData.transcript_ai}</p>
                    </div>
                  </div>

                  {/* Human Correction */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Koreksi Manual
                    </label>
                    <Textarea
                      value={editedTranscript}
                      onChange={(e) => setEditedTranscript(e.target.value)}
                      className="min-h-[100px]"
                      placeholder="Edit transkripsi jika ada kesalahan..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleApprove}
                      className="flex-1"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Setuju
                    </Button>
                    <Button
                      onClick={handleReject}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Tolak
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Achievement Badge */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-hero flex items-center justify-center">
                <Award className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Validator Terpercaya
                </h3>
                <p className="text-sm text-muted-foreground">
                  Terima kasih atas kontribusi Anda dalam menjaga kualitas dataset RANA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ValidatorDashboard;
