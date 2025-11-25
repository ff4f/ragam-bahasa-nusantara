import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { HOME_FEATURES, HOME_STATS } from "@/lib/constants";
import { useParallax } from "@/hooks/use-parallax";
import { motion } from "framer-motion";
import map from "@/assets/map-indonesia.svg";
import banner from "@/assets/banner-rana.svg";

const Home = () => {
  const y = useParallax();
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[200px] sm:min-h-[300px] md:min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 opacity-90" />
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${map})`,
            y,
          }}
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
                  Kata Hari Ini
                </h2>
                <div className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
                  Sugeng
                </div>
                <p className="mb-2 text-lg text-muted-foreground">
                  (Bahasa Jawa)
                </p>
                <div className="mx-auto mb-4 max-w-md border-t border-border pt-4">
                  <p className="mb-2 text-foreground">
                    <span className="font-semibold">Arti:</span> Selamat
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Contoh:</span> "Sugeng enjing" - Selamat pagi
                  </p>
                </div>
                <Link to="/explore">
                  <Button variant="outline" size="sm">
                    Pelajari Lebih Banyak
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Mengapa RANA?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
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
      <section className="bg-gradient-hero py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
            Mari Bersama Lestarikan Bahasa Nusantara
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90">
            Setiap kontribusi Anda membantu menjaga kekayaan budaya Indonesia 
            untuk generasi mendatang. Bergabunglah dengan gerakan pelestarian bahasa hari ini!
          </p>
          <Link to="/contribute">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90">
              Mulai Berkontribusi
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
