import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";
import { getMockUser } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";

const Auth = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useUser();
  const { toast } = useToast();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const ShowPasswordIcon = showPassword ? EyeOff : Eye;

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in production this would call backend API
    const mockUser = getMockUser(email);
    if (!mockUser) {
      toast({ title: "Akun tidak terdaftar" });
      return;
    }
    mockUser.email = email;
    updateProfile(mockUser);
    toast({ title: "Berhasil masuk!" });
    navigate("/");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock signup - in production this would call backend API
    const mockUser = getMockUser(`${role}@gmail.com`);
    mockUser.email = email;
    mockUser.name = name;
    updateProfile(mockUser);
    toast({ title: "Akun berhasil dibuat!" });
    navigate("/");
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Selamat Datang</CardTitle>
          <CardDescription>
            Masuk atau buat akun untuk mulai melestarikan bahasa daerah
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Masuk</TabsTrigger>
              <TabsTrigger value="signup">Daftar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Pos-el (<i>e-mail</i>)</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Kata Sandi</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div className="absolute right-3 top-[50%] -translate-y-[50%]">
                      <Tooltip label={`${showPassword ? "Sembunyikan" : "Lihat"} Kata Sandi`}>
                        <ShowPasswordIcon
                          className="cursor-pointer text-foreground/60"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Masuk
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Peran</Label>
                  <Select value={role} onValueChange={(value) => setRole(value)}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Pilih peran yang diinginkan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contributor">Kontributor</SelectItem>
                      <SelectItem value="validator">Validator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nama Lengkap</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Nama Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Pos-el (<i>e-mail</i>)</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Kata Sandi</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div className="absolute right-3 top-[50%] -translate-y-[50%]">
                      <Tooltip label={`${showPassword ? "Sembunyikan" : "Lihat"} Kata Sandi`}>
                        <ShowPasswordIcon
                          className="cursor-pointer text-foreground/60"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Daftar
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Kembali ke Beranda
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
