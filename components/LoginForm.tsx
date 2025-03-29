'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { setUser ,accessToken, setAccessToken } = useUserStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (accessToken) {
      router.replace('/');
    }
  }, [accessToken]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setFocus,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (errors.email) setFocus('email');
    else if (errors.password) setFocus('password');
  }, [errors, setFocus]);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError('email', { message: 'Invalid email or password' });
          setError('password', { message: 'Invalid email or password' });
        } else {
          throw new Error('Login failed');
        }
        return;
      }

      const { name, email, phone, accessToken, favItems } = await res.json();
      setAccessToken(accessToken);
      setUser({ name, email, phone, favItems }); // Store user data in userStore
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('root', { message: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email"
          {...register('email')}
          className="w-full"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <Input
          type="password"
          placeholder="Password"
          {...register('password')}
          className="w-full"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </Button>
      {errors.root && <p className="text-red-500">{errors.root.message}</p>}
    </form>
  );
}
