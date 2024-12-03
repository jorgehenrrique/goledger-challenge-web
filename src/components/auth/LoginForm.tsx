'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {
      username: '',
      password: '',
    };

    if (!formData.username) newErrors.username = 'Usuário é obrigatório';
    if (!formData.password) newErrors.password = 'Senha é obrigatória';

    setErrors(newErrors);
    return !newErrors.username && !newErrors.password;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await api.login(formData.username, formData.password);

      login(formData.username, formData.password);

      toast.success('Login realizado com sucesso!');
      router.push('/');
    } catch (error: unknown) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.', {
        description:
          error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='w-full max-w-md p-8 space-y-6 bg-zinc-900 rounded-lg shadow-xl'
    >
      <h2 className='text-2xl font-bold text-center text-white'>Login</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <Input
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                username: e.target.value.trim(),
              }))
            }
            placeholder='Usuário'
            className='w-full'
          />
          {errors.username && (
            <span className='text-sm text-red-500'>{errors.username}</span>
          )}
        </div>
        <div>
          <Input
            type='password'
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                password: e.target.value.trim(),
              }))
            }
            placeholder='Senha'
            className='w-full'
          />
          {errors.password && (
            <span className='text-sm text-red-500'>{errors.password}</span>
          )}
        </div>
        <Button
          type='submit'
          className={`w-full bg-indigo-600 hover:bg-indigo-700`}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className='animate-spin' />
          ) : (
            <span className='text-white'>Entrar</span>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
