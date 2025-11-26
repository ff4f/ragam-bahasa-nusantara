import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { HOME_FEATURES, HOME_STATS } from "@/lib/constants";
import { useParallax } from "@/hooks/use-parallax";
import { motion } from "framer-motion";
import banner from "@/assets/banner-rana.svg";
import contributeBanner from "@/assets/home-contribute-banner.svg";

const Home = () => {
  const y = useParallax();
  const yPeople = useParallax(0.2);
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[200px] sm:min-h-[300px] md:min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 opacity-90" />
        <motion.div 
          className="absolute inset-0 bg-cover bg-center bg-[url('@/assets/map-indonesia.svg')]"
          style={{ y }}
        />
        <img src={banner} alt="Banner RANA" className="absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] w-[80%] max-h-[200px] sm:max-h-[600px]" />
      </section>

      {/* Stats Section */}
      <section className="border-b border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {HOME_STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Word of the Day Section */}
      <section
        className="py-16 relative overflow-hidden
          after:absolute after:inset-0
          after:bg-gradient-to-t after:from-background after:to-transparent"
      >
        <motion.div className="absolute inset-0 bg-[url('@/assets/home-people.svg')] bg-size-[unset] md:bg-cover bg-center bg-no-repeat opacity-20" style={{ y: yPeople }} ></motion.div>
        <div className="px-4 max-w-fit mx-auto relative z-10">
          <h2 className="mb-2 font-semibold uppercase tracking-wider uppercase text-center text-2xl text-muted-foreground">
            Kata Hari Ini
          </h2>
          <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl">
            <CardContent className="p-8 bg-[#FAE9D0]">
              <div className="text-center">
                <div className="bg-white rounded-2xl py-2 relative px-20 mb-2">
                  <Search className="text-foreground font-bold absolute top-[50%] -translate-y-[50%] left-4" size={32} />
                  <div className="text-4xl font-bold text-foreground md:text-5xl uppercase text-primary">
                    Sugeng
                  </div>
                </div>
                <p className="mb-2 text-lg text-muted-foreground">
                  (Bahasa Jawa)
                </p>
                <div className="mx-auto mb-4 max-w-md pt-4">
                  <p className="mb-2 text-foreground">
                    <span className="font-semibold">Arti:</span> Selamat
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Contoh:</span> "Sugeng enjing" - Selamat pagi
                  </p>
                </div>
                <Link to="/explore">
                  <Button variant="outline" size="sm" className="w-full rounded-xl">
                    Pelajari Lebih Banyak
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="container mx-auto px-4 mt-24 relative z-10">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary md:text-4xl [text-shadow:2px_2px_5px_rgba(0,0,0,0.15)]">
              Mengapa RANA?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground [text-shadow:2px_2px_5px_rgba(0,0,0,0.15)]">
              Platform lengkap untuk pelestarian bahasa daerah dengan teknologi AI modern 
              dan dukungan komunitas yang solid
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {HOME_FEATURES.map((feature, index) => (
              <Card key={index} className="border-border shadow-soft transition-all hover:shadow-warm">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex justify-center items-center">
        <div className="relative">
          <img src={contributeBanner} alt="Beranda Kontribusi"  />
          <Link to="/contribute" className="absolute left-[50%] -translate-x-[50%] bottom-[10%] md:bottom-[20%]">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 w-40 h-8 text-xs sm:w-[unset] sm:h-11 sm:text-sm">
              Mulai Berkontribusi
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
