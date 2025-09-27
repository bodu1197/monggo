import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    redirect('/auth/signin'); // Redirect to sign-in if not authenticated or not admin
  }

  // In a real application, you would fetch users from your database (Supabase) here.
  // For demonstration, we'll use a placeholder.
  const users = [
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    { id: '2', name: 'Regular User', email: 'user@example.com', role: 'user' },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center p-6 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mt-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Dashboard</h1>
        <p className="text-center text-gray-600 mb-8">Welcome, {session.user?.name} ({session.user?.role})</p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Management</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b">{user.id}</td>
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm mr-2">Edit</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}