import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/auth/signin'); // Redirect to sign-in if not authenticated
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-6 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">User Profile</h1>
        <p className="text-center text-gray-600 mb-8">Welcome, {session.user.name}!</p>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <p className="text-gray-800">{session.user.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <p className="text-gray-800">{session.user.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Role:</label>
          <p className="text-gray-800">{session.user.role}</p>
        </div>
        {/* Add more profile details as needed */}
      </div>
    </div>
  );
}
