import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT, User, AuthOptions, Session, DefaultSession } from 'next-auth';
import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  providers: [
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID as string,
    //   clientSecret: process.env.GITHUB_SECRET as string,
    // }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.username)
          .single();

        if (error || !user) {
          console.error('Error fetching user or user not found', error);
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (isPasswordValid) {
          // Return the user object in the expected format
          return { 
            id: user.id.toString(), 
            name: user.name, 
            email: user.email, 
            role: user.role 
          };
        }
        
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).role = (user as any).role; // Cast to any
      }
      return token;
    },
    async session({ session, token, user, newSession, trigger }): Promise<Session | DefaultSession> {
      if (session.user) {
        (session.user as any).role = (token as any).role; // Cast to any for role
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
    error: '/auth/error', // Custom error page
  },
};