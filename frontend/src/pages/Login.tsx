import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Bus, Key, Mail, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Insira um e-mail válido.' }),
  senha: z.string().min(4, { message: 'A senha deve possuir pelo menos 4 caracteres.' }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setError(null);
    setLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      const { token, user } = response.data;
      login(token, user);
      
      if (user.perfil === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/my-transport');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao realizar login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/25 mb-4">
            <Bus className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-100">
            Acesse o OrleansTrans
          </h1>
          <p className="text-sm text-zinc-400 mt-1.5 font-medium">
            Gestão Integrada de Transporte Universitário
          </p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl border border-zinc-800/40 relative">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-xs text-red-400 font-medium">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="relative">
              <Input
                type="email"
                label="E-mail Acadêmico"
                placeholder="exemplo@estudante.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div className="relative">
              <Input
                type="password"
                label="Senha de Acesso"
                placeholder="••••••••"
                error={errors.senha?.message}
                {...register('senha')}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-2 py-2.5 font-bold"
              disabled={loading}
            >
              {loading ? 'Autenticando...' : 'Entrar no Sistema'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-800/60 text-center">
            <p className="text-sm text-zinc-400">
              É um estudante e ainda não possui conta?{' '}
              <Link
                to="/register"
                className="text-violet-400 hover:text-violet-300 font-semibold underline decoration-violet-500/30 underline-offset-4"
              >
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
