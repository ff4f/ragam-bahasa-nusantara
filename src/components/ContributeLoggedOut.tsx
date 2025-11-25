import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "./Header";
import { Award, Sparkles } from "lucide-react";
import { CONTRIBUTION_TYPES } from "@/lib/constants";
import { leaderboard } from "@/lib/dummy";
import { thousandSeparator } from "@/lib/utils";

const ContributeLoggedOut = () => {
  const navigate = useNavigate();

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <Header
          title="Kontribusi Komunitas"
          description="Setiap kontribusi Anda membantu melestarikan warisan budaya Indonesia. Bergabunglah dengan ribuan pelestari bahasa dari seluruh Nusantara!"
        />

        {/* Contribution Types */}
        <section className="mb-16">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-foreground">
              Jenis Kontribusi yang Bisa Dilakukan
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {CONTRIBUTION_TYPES.map((type, index) => (
              <Card key={index} className="border-border shadow-soft transition-all hover:shadow-warm flex overflow-hidden">
                <div className="bg-primary/10 py-8 px-6 flex-1 flex justify-center">
                  <type.icon className="h-12 w-12 text-primary" />
                </div>
                <div className="flex-[6]">
                  <CardHeader>
                    <CardTitle>{type.title}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="mb-2 text-sm font-medium text-muted-foreground">
                        Manfaat:
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {type.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-accent" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </div>
                
              </Card>
            ))}
          </div>
        </section>

        {/* Leaderboard */}
        <section className="mb-16">
          <Card className="border-border shadow-soft">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                <CardTitle>Kontributor Teratas</CardTitle>
              </div>
              <CardDescription>
                Apresiasi untuk para pahlawan pelestari bahasa daerah
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((contributor) => (
                  <div
                    key={contributor.rank}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                          contributor.rank === 1
                            ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                            : contributor.rank === 2
                            ? "bg-gray-300/20 text-gray-700 dark:text-gray-400"
                            : contributor.rank === 3
                            ? "bg-orange-500/20 text-orange-700 dark:text-orange-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {contributor.rank}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {contributor.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {contributor.region}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {thousandSeparator(contributor.points)}
                      </div>
                      <div className="text-xs text-muted-foreground">Poin</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="border-border bg-gradient-hero shadow-warm">
            <CardContent className="p-8 text-center md:p-12">
              <h2 className="mb-4 text-2xl font-bold text-primary-foreground md:text-3xl">
                Jadilah Bagian dari Gerakan Pelestarian Bahasa
              </h2>
              <p className="mx-auto mb-6 max-w-2xl text-primary-foreground/90">
                Kontribusi Anda, sekecil apapun, sangat berarti untuk menjaga 
                kekayaan bahasa Indonesia tetap hidup untuk generasi mendatang
              </p>
              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90"
                onClick={() => navigate("/auth")}
              >
                Daftar sebagai Kontributor
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default ContributeLoggedOut;
