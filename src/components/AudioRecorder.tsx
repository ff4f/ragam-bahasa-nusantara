import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Square, Play, Trash2 } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/use-audio-recorder';

interface AudioRecorderProps {
  onSave?: (audioURL: string) => void;
  showButtonSave?: boolean;
  reset?: boolean;
  disabled?: boolean;
}

export const AudioRecorder = ({ onSave, showButtonSave, reset, disabled }: AudioRecorderProps) => {
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

  useEffect(() => {
    if (!showButtonSave) onSave(audioURL);
  }, [audioURL]);

  useEffect(() => {
    if (reset) resetRecording();
  }, [reset]);

  return (
    <Card className="bg-transparent">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Recording controls */}
          <div className="flex items-center justify-center gap-4 w-full">
            {!isRecording && !audioURL && (
              <Button
                type="button"
                size="lg"
                onClick={startRecording}
                className="h-16 w-16 rounded-full"
                disabled={disabled}
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
                  disabled={disabled}
                >
                  <Square className="h-6 w-6" />
                </Button>
              </>
            )}

            {audioURL && !isRecording && (
              <div className="flex flex-col items-center gap-4 w-full min-w-80">
                <audio src={audioURL} controls className="w-full" />
                <div className="flex gap-2">
                  {showButtonSave && onSave && (
                    <Button onClick={handleSave} size="sm" disabled={disabled}>
                      <Play className="mr-2 h-4 w-4" />
                      Simpan Rekaman
                    </Button>
                  )}
                  <Button onClick={resetRecording} variant="outline" size="sm" disabled={disabled}>
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
