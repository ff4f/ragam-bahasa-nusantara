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
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import authService from "@/services/auth.service";

const Auth = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { toast } = useToast();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const ShowPasswordIcon = showPassword ? EyeOff : Eye;

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call backend login API
      await authService.login({ email, password });

      // Get current user data
      const userData = await authService.getCurrentUser();

      // Update user context
      setUser(userData);

      toast({
        title: "Berhasil masuk!",
        description: `Selamat datang, ${userData.name}`
      });

      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login gagal",
        description: error.response?.data?.detail || "Email atau password salah",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      toast({
        title: "Pilih peran terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call backend register API
      const newUser = await authService.register({
        email,
        password,
        name,
        role: role as 'contributor' | 'validator'
      });

      // Auto login after registration
      await authService.login({ email, password });

      // Get current user data
      const userData = await authService.getCurrentUser();

      // Update user context
      setUser(userData);

      toast({
        title: "Akun berhasil dibuat!",
        description: `Selamat datang, ${newUser.name}`
      });

      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registrasi gagal",
        description: error.response?.data?.detail || "Terjadi kesalahan saat membuat akun",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
                    disabled={isLoading}
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
                      disabled={isLoading}
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Memproses..." : "Masuk"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Peran</Label>
                  <Select value={role} onValueChange={(value) => setRole(value)} disabled={isLoading}>
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                      minLength={6}
                      disabled={isLoading}
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Memproses..." : "Daftar"}
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

