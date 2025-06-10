import RegisterForm from '@/components/RegisterForm';

export const metadata = {
  title: 'Register | Kent Of Kids',
  description: 'Create an account with Kent Of Kids.',
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-8 text-center">Renkli Dünyamıza Katıl</h1>
      <RegisterForm />
    </div>
  );
}