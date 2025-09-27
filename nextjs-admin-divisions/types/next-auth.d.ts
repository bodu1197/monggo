import 'next-auth';
import { DefaultSession, DefaultJWT } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      role?: string; // Add role property
    } & DefaultSession['user'];
  }

  interface JWT extends DefaultJWT {
    role?: string; // Add role property
  }
}