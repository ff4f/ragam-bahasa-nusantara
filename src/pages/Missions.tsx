import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import { Trophy, Target, CheckCircle2, Clock, ChartNoAxesCombined } from 'lucide-react';
import { mockMissions } from '@/lib/dummy';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/use-user';

const Missions = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const completedMissions = mockMissions.filter(item => !!item.done).length || 0;
  const nextXp = user?.nextXp || 100;

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              Anda harus login untuk mengakses halaman misi
            </p>
            <Button onClick={() => navigate('/auth')}>Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleStartMission = (mission: { id: string }) => {
    navigate('/contribute', { state: { mission } });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <Header
          title="Misi"
          description="Selesaikan misi untuk mengumpulkan XP dan mendapatkan badge eksklusif"
        />

        {/* User Stats */}
        <div className="grid gap-6 md:grid-cols-5 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{user.xp}</p>
                  <p className="text-sm text-muted-foreground">Total XP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <ChartNoAxesCombined className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{user.level}</p>
                  <p className="text-sm text-muted-foreground">Level</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{completedMissions}</p>
                  <p className="text-sm text-muted-foreground">Misi Selesai</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{user.badges.length}</p>
                  <p className="text-sm text-muted-foreground">Badge</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {mockMissions.length - completedMissions}
                  </p>
                  <p className="text-sm text-muted-foreground">Tersedia</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress to next level */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground">Progress ke Level Berikutnya</p>
              <p className="text-sm text-muted-foreground">{user.xp} / {nextXp} XP</p>
            </div>
            <Progress value={(user.xp / nextXp) * 100} />
          </CardContent>
        </Card>

        {/* Missions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockMissions.map((mission) => {
            const isCompleted = mission.done;
            return (
              <Card key={mission.id} className={`relative pb-24 ${isCompleted ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg">{mission.title}</CardTitle>
                  </div>
                  <CardDescription>{mission.description}</CardDescription>
                </CardHeader>
                <CardContent className="absolute left-0 right-0 bottom-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getDifficultyColor(mission.difficulty)}`} />
                      <p className="text-sm text-muted-foreground capitalize">
                        {mission.difficulty === 'easy' ? 'Mudah' : mission.difficulty === 'medium' ? 'Sedang' : 'Sulit'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-foreground">
                        +{mission.reward_xp} XP
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full mt-4"
                    onClick={() => handleStartMission(mission)}
                    disabled={isCompleted}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Selesai
                      </>
                    ) : (
                      'Mulai Misi'
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Badges Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Badge Anda</h2>
          {user?.badges?.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-4">
              {user.badges.map((badge, index) => (
                <Card key={index}>
                  <CardContent className="p-4 text-center">
                    <div className="h-16 w-16 mx-auto mb-2 rounded-full bg-gradient-hero flex items-center justify-center">
                      <Trophy className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <p className="font-medium text-foreground">{badge}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">
              Belum ada badge yang diperoleh. Naikkan level dan selesaikan misi untuk mendapatkan badge.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Missions;
