'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/backend/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await AuthService.login(email, password);
      if (user.token) {
        localStorage.setItem('authToken', user.token);
        router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Finance Guard</h1>
          <p className="mt-2 text-muted-foreground">
            Acesse sua conta para gerenciar suas finanças
          </p>
        </div>
        
        {error && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>

        <div className="text-center text-sm">
          Não tem uma conta?{' '}
          <button 
            onClick={() => router.push('/register')}
            className="text-primary underline-offset-4 hover:underline"
          >
            Cadastre-se
          </button>
        </div>
      </div>
    </div>
  );
}