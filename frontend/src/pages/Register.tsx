import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Bus, User, Key, Mail, AlertCircle, CheckCircle } from 'lucide-react';

const registerSchema = z.object({
  nome: z.string().min(2, { message: 'Nome deve conter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Insira um e-mail válido.' }),
  senha: z.string().min(4, { message: 'A senha deve possuir pelo menos 4 caracteres.' }),
  confirmarSenha: z.string().min(4, { message: 'A confirmação de senha é obrigatória.' }),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem.',
  path: ['confirmarSenha'],
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await api.post('/auth/register', {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        perfil: 'ESTUDANTE' // Default self-registration profile
      });
      
      setSuccess('Cadastro realizado com sucesso! Redirecionando para a tela de login...');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao realizar cadastro. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in z-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/25 mb-4">
            <Bus className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-100">
            Crie sua conta
          </h1>
          <p className="text-sm text-zinc-400 mt-1.5 font-medium">
            Cadastro de Estudante no OrleansTrans
          </p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl border border-zinc-800/40 relative">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-xs text-red-400 font-medium">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-xs text-emerald-400 font-medium">
              <CheckCircle size={16} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                type="text"
                label="Nome Completo"
                placeholder="Seu nome"
                error={errors.nome?.message}
                {...register('nome')}
              />
            </div>

            <div>
              <Input
                type="email"
                label="E-mail Acadêmico"
                placeholder="nome@exemplo.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div>
              <Input
                type="password"
                label="Criar Senha"
                placeholder="Mínimo 4 caracteres"
                error={errors.senha?.message}
                {...register('senha')}
              />
            </div>

            <div>
              <Input
                type="password"
                label="Confirmar Senha"
                placeholder="Repita sua senha"
                error={errors.confirmarSenha?.message}
                {...register('confirmarSenha')}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-4 py-2.5 font-bold"
              disabled={loading || !!success}
            >
              {loading ? 'Cadastrando...' : 'Confirmar Cadastro'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-800/60 text-center">
            <p className="text-sm text-zinc-400">
              Já possui uma conta?{' '}
              <Link
                to="/login"
                className="text-violet-400 hover:text-violet-300 font-semibold underline decoration-violet-500/30 underline-offset-4"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
