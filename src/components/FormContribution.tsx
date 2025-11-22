import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MultiSelect from "./MultiSelect";
import ConfirmationDialog from "./ConfirmationDialog";
import { AudioRecorder } from "./AudioRecorder";
import { Upload, Loader2, CheckCircle2, Trash2 } from "lucide-react";
import { provinceList, regionList, languageArchive } from "@/lib/dummy";

interface FormContributionProps {
  formData: any;
  setFormData: (form: any) => void;
  handleSubmit: (e: any) => void;
  loading?: boolean;
  isReview?: boolean;
}

const FormContribution = ({ formData, setFormData, handleSubmit, loading, isReview }: FormContributionProps) => {

  const [notesValidator, setNotesValidator] = useState("");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [tabText, setTabText] = useState("upload");

  const textAudioURL = tabText === "upload" && (formData?.textAudio && formData.textAudio instanceof Blob ? URL.createObjectURL(formData.textAudio) : formData?.textAudio);

  const handleFile = (e: any, type: string) => {
    setFormData({ ...formData, [type]: e.target.files[0] });
  };

  const handleRecord = (url: any, type: string) => {
    setFormData({ ...formData, [type]: url });
  };

  const handleChangeTab = (value: string) => {
    setFormData({ ...formData, textAudio: "" });
    setTabText(value);
  };

  const handleConfirmation = (type: string) => {
    if (type === "verification") setConfirmation({ title: "Verifikasi", description: "memverifikasi" });
    else setConfirmation({ title: "Hapus", description: "menghapus" });
    setOpenConfirmation(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Province & Region */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="province">Provinsi *</Label>
            <MultiSelect
              placeholder={!isReview ? "Pilih provinsi" : ""}
              options={provinceList}
              value={formData.province}
              onChange={(value) =>
                setFormData({ ...formData, province: value })
              }
              disabled={isReview}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Asal Daerah</Label>
            <MultiSelect
              placeholder={!isReview ? "Pilih asal daerah" : ""}
              options={regionList}
              value={formData.region}
              onChange={(value) =>
                setFormData({ ...formData, region: value })
              }
              disabled={isReview}
            />
          </div>
        </div>

        {/* Language & Ethnic */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="language">Bahasa Daerah *</Label>
            <Select
              value={formData.language}
              onValueChange={(value) =>
                setFormData({ ...formData, language: value })
              }
              required
              disabled={isReview}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder={!isReview ? "Pilih bahasa" : ""} />
              </SelectTrigger>
              <SelectContent>
                {languageArchive.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ethnic">Suku</Label>
            <Input
              id="ethnic"
              placeholder={!isReview ? "Contoh: Jawa, Sunda" : ""}
              value={formData.ethnic}
              onChange={(e) =>
                setFormData({ ...formData, ethnic: e.target.value })
              }
              disabled={isReview}
            />
          </div>
        </div>

        {/* Dialect */}
        <div className="space-y-2">
          <Label htmlFor="dialect">Dialek Spesifik</Label>
          <Input
            id="dialect"
            placeholder={!isReview ? "Contoh: Jawa Ngapak, Sunda Priangan" : ""}
            value={formData.dialect}
            onChange={(e) =>
              setFormData({ ...formData, dialect: e.target.value })
            }
            disabled={isReview}
          />
        </div>

        {/* Vocabulary & its Translation */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="text">
              Kosakata *
            </Label>
            <Input
              id="text"
              placeholder={!isReview ? "Masukkan kata dalam bahasa daerah" : ""}
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              disabled={isReview}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="textTranslation">
              Terjemahan Kosakata *
            </Label>
            <Input
              id="textTranslation"
              placeholder={!isReview ? "Terjemahan kosakata dalam bahasa indonesia" : ""}
              value={formData.textTranslation}
              onChange={(e) =>
                setFormData({ ...formData, textTranslation: e.target.value })
              }
              disabled={isReview}
            />
          </div>
        </div>

        {/* Sentence & its Translation */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sentence">
              Contoh Kalimat
            </Label>
            <Input
              id="sentence"
              placeholder={!isReview ? "Masukkan contoh kalimat dalam bahasa daerah" : ""}
              value={formData.sentence}
              onChange={(e) =>
                setFormData({ ...formData, sentence: e.target.value })
              }
              disabled={isReview}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sentenceTranslation">
              Terjemahan Contoh Kalimat
            </Label>
            <Input
              id="sentenceTranslation"
              placeholder={!isReview ? "Terjemahan contoh kalimat dalam bahasa indonesia" : ""}
              value={formData.sentenceTranslation}
              onChange={(e) =>
                setFormData({ ...formData, sentenceTranslation: e.target.value })
              }
              disabled={isReview}
            />
          </div>
        </div>                  

        {/* Audio Recording for Text */}
        <div className="space-y-2">
          <Label>Audio Kosakata</Label>
          {isReview ? (
            formData?.textAudio ? <audio src={formData.textAudio} controls className="w-full" /> : <p className="text-muted-foreground text-center text-sm opacity-60">Tidak ada file yang di upload.</p>
          ) : (
            <Tabs value={tabText} className="w-full" onValueChange={(value) => handleChangeTab(value)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload File</TabsTrigger>
                <TabsTrigger value="record">Rekam Suara</TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <div className="space-y-2">
                  <Input
                    id="textAudio"
                    type="file"
                    accept="audio/*"
                    className="cursor-pointer"
                    onChange={(e) => handleFile(e, "textAudio")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: MP3, WAV, M4A (Maks. 10MB)
                  </p>
                  {textAudioURL && <audio src={textAudioURL} controls className="w-full" />}
                </div>
              </TabsContent>
              <TabsContent value="record">
                <AudioRecorder
                  onSave={(url) => handleRecord(url, "textAudio")}
                  reset={!formData?.textAudio}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Catatan Tambahan</Label>
          <Textarea
            id="notes"
            placeholder={!isReview ? "Tambahkan catatan atau konteks untuk kontribusi Anda" : ""}
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            rows={3}
            disabled={isReview}
          />
        </div>

        {!isReview && (
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Kirim Kontribusi
              </>
            )}
          </Button>
        )}
      </form>

      {isReview && (
        <>
          <hr className="mt-4 mb-2" />
          
          {/* Notes Validator */}
          <div className="space-y-2">
            <Label htmlFor="notesValidator">Catatan Validator</Label>
            <Textarea
              id="notesValidator"
              placeholder={"Tambahkan catatan atau feedback untuk kontribusi ini..." }
              value={notesValidator}
              onChange={(e) => setNotesValidator(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={() => handleConfirmation("verification")} className="flex-1">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Verifikasi
            </Button>
            <Button onClick={() => handleConfirmation("delete")} variant="destructive" className="flex-1">
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </Button>
          </div>
        </>
      )}

      <ConfirmationDialog
        open={openConfirmation}
        handleClose={() => setOpenConfirmation(false)}
        handleSubmit={() => setOpenConfirmation(false)}
        title={confirmation?.title || ""}
        description={confirmation?.description ? `Apakah anda yakin untuk ${confirmation.description} dataset ini?` : ""}
      />
    </>
  );
};

export default FormContribution;