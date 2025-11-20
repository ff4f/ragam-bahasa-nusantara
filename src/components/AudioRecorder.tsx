import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Square, Play, Trash2 } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/use-audio-recorder';

interface AudioRecorderProps {
  onSave?: (audioURL: string) => void;
}

export const AudioRecorder = ({ onSave }: AudioRecorderProps) => {
  const { isRecording, audioURL, recordingTime, startRecording, stopRecording, resetRecording } = useAudioRecorder();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    if (audioURL && onSave) {
      onSave(audioURL);
      resetRecording();
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Recording controls */}
          <div className="flex items-center gap-4">
            {!isRecording && !audioURL && (
              <Button
                size="lg"
                onClick={startRecording}
                className="h-16 w-16 rounded-full"
              >
                <Mic className="h-6 w-6" />
              </Button>
            )}

            {isRecording && (
              <>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-16 w-16 rounded-full bg-destructive/20 flex items-center justify-center animate-pulse">
                    <div className="h-4 w-4 rounded-full bg-destructive" />
                  </div>
                  <p className="text-sm font-mono text-muted-foreground">
                    {formatTime(recordingTime)}
                  </p>
                </div>
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={stopRecording}
                  className="h-16 w-16 rounded-full"
                >
                  <Square className="h-6 w-6" />
                </Button>
              </>
            )}

            {audioURL && !isRecording && (
              <div className="flex flex-col items-center gap-4 w-full">
                <audio src={audioURL} controls className="w-full max-w-md" />
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm">
                    <Play className="mr-2 h-4 w-4" />
                    Simpan Rekaman
                  </Button>
                  <Button onClick={resetRecording} variant="outline" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          {!isRecording && !audioURL && (
            <p className="text-sm text-muted-foreground text-center">
              Klik tombol mikrofon untuk mulai merekam
            </p>
          )}
          {isRecording && (
            <p className="text-sm text-destructive text-center">
              Sedang merekam... Klik tombol stop untuk menghentikan
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
