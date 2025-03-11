'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import jwt from 'jsonwebtoken';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuthorization() {
      try {
        const response = await axios.get('/api/auth/check', { withCredentials: true });
        const { token } = response.data;

        if (token) {
          const decoded = jwt.decode(token) as { isStaff: boolean };
          if (decoded?.isStaff) {
            router.push('/transcripts');
          } else {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error during authorization check:', error);
        router.push('/login');
      }
    }

    checkAuthorization();
  }, [router]);

  return null; // Return null as the user will be redirected immediately
}
