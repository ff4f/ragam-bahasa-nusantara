import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { navLinks } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [menus, setMenus] = useState(navLinks);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user: userContext, logout } = useUser();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/");
    toast({ title: "Berhasil keluar!" })
  };

  useEffect(() => {
    setUser(userContext);
    const specialMenuConditions = {
      "/missions": userContext?.role === "contributor",
      "/contribute": !userContext || userContext?.role === "contributor",
      "/validate": userContext?.role === "validator",
    };
    setMenus(navLinks.map(item => ({
      ...item,
      show: specialMenuConditions[item.to] ?? item.show
    })));
  }, [userContext]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <NavLink to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-hero" />
            <span className="text-xl font-bold text-foreground">RANA</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-6 md:flex">
            {menus.map((link) => link.show && (
              <NavLink
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeClassName="text-primary"
              >
                {link.label}
              </NavLink>
            ))}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <NavLink to="/auth">
                <Button size="sm" className="bg-gradient-hero">
                  Masuk
                </Button>
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background md:hidden">
            <div className="container mx-auto space-y-1 px-4 py-4">
              {menus.map((link) => link.show && (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  activeClassName="bg-primary/10 text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              {user ? (
                <>
                  <div className="border-t border-border pt-4">
                    <div className="mb-3 flex items-center gap-3 px-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <NavLink
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <UserIcon className="mr-2 inline-block h-4 w-4" />
                      Profil
                    </NavLink>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <LogOut className="mr-2 inline-block h-4 w-4" />
                      Keluar
                    </button>
                  </div>
                </>
              ) : (
                <NavLink to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="mt-2 w-full bg-gradient-hero">
                    Masuk
                  </Button>
                </NavLink>
              )}
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-hero" />
                <span className="text-lg font-bold">RANA</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Ragam Bahasa Nusantara - Melestarikan Bahasa, Menghidupkan Budaya Digital
              </p>
            </div>
            
            <div>
              <h4 className="mb-4 font-semibold">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><NavLink to="/learn" className="hover:text-foreground">Belajar Bahasa</NavLink></li>
                <li><NavLink to="/explore" className="hover:text-foreground">Eksplor Bahasa</NavLink></li>
                <li><NavLink to="/contribute" className="hover:text-foreground">Kontribusi</NavLink></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Komunitas</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><NavLink to="/blog" className="hover:text-foreground">Blog</NavLink></li>
                <li><NavLink to="/contact" className="hover:text-foreground">Kontak</NavLink></li>
                <li><a href="#" className="hover:text-foreground">Forum</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Ikuti Kami</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Instagram</a></li>
                <li><a href="#" className="hover:text-foreground">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground">YouTube</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 RANA - Ragam Bahasa Nusantara. Seluruh hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
