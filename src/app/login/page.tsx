'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    async function redirectToDiscord() {
      const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!)}&response_type=code&scope=identify%20guilds.members.read`;
      window.location.href = discordAuthUrl;
    }

    redirectToDiscord();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-3xl font-semibold text-gray-600 animate-pulse">Redirecting to Discord...</div>
    </div>
  );
}