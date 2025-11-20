import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Award, Edit2, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: userContext, updateProfile } = useUser();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (!userContext) {
      navigate("/auth");
      return;
    }
    setUser(userContext);
    setFormData({
      name: userContext.name,
      email: userContext.email,
    });
  }, [navigate]);

  const handleSave = () => {
    if (user) {
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
      };
      updateProfile(updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
      toast({ title: "Profil berhasil diperbarui!" });
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
      setIsEditing(false);
    }
  };

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold text-foreground">Profil Saya</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Informasi Profil</CardTitle>
                {!isEditing ? (
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X className="mr-2 h-4 w-4" />
                      Batal
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Simpan
                    </Button>
                  </div>
                )}
              </div>
              <CardDescription>Kelola informasi profil Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {user.role === "contributor" && "Kontributor"}
                    {user.role === "validator" && "Validator"}
                    {user.role === "admin" && "Admin"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={user.role} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">XP</span>
                  <span className="text-2xl font-bold text-primary">{user.xp}</span>
                </div>
                {user.role === "validator" && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Validasi</span>
                      <span className="text-2xl font-bold">{user.validationCount || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Akurasi</span>
                      <span className="text-2xl font-bold">{user.accuracy || 0}%</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Badge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.badges.map((badge, index) => (
                    <Badge key={index} variant="outline">
                      {badge}
                    </Badge>
                  ))}
                  {user.badges.length === 0 && (
                    <p className="text-sm text-muted-foreground">Belum ada badge</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
