import LoginForm from '@/components/LoginForm';

export const metadata = {
  title: 'Login | Kent Of Kids',
  description: 'Log in to your Kent Of Kids account.',
};

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-8 text-center">Tekrar Hoşgeldin</h1>
      <LoginForm />
    </div>
  );
}