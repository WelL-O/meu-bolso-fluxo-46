import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: string;
}

export function ComingSoon({ title, description, icon = "🚧" }: ComingSoonProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full financial-card text-center">
        <CardContent className="p-8">
          <div className="mb-6">
            <div className="text-6xl mb-4">{icon}</div>
            <Construction className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          </div>

          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground mb-6">
            {description}
          </p>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Esta funcionalidade está em desenvolvimento e estará disponível em breve.
            </p>

            <Button
              onClick={() => navigate('/')}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}