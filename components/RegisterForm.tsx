'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUserStore } from '@/store/userStore';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, { message: 'Invalid phone number' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Password confirmation must match' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { setUser ,setAccessToken} = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setFocus,
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (errors.name) setFocus('name');
    else if (errors.email) setFocus('email');
    else if (errors.phone) setFocus('phone');
    else if (errors.password) setFocus('password');
    else if (errors.confirmPassword) setFocus('confirmPassword');
  }, [errors, setFocus]);

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 409) {
          setError('email', { message: 'Email already in use' });
        } else {
          throw new Error(`Registration failed: ${res.status}`);
        }
        return;
      }

      const { name, email, phone, accessToken, favItems } = await res.json();
      setAccessToken(accessToken);
      setUser({ name, email, phone, favItems }); // Store user data in userStore
      router.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      setError('root', { message: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input type="text" placeholder="Name" {...register('name')} className="w-full" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <Input type="email" placeholder="Email" {...register('email')} className="w-full" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <Input type="tel" placeholder="Phone Number" {...register('phone')} className="w-full" />
        {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
      </div>
      <div>
        <Input type="password" placeholder="Password" {...register('password')} className="w-full" />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>
      <div>
        <Input type="password" placeholder="Confirm Password" {...register('confirmPassword')} className="w-full" />
        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </Button>
      {errors.root && <p className="text-red-500">{errors.root.message}</p>}
    </form>
  );
}
