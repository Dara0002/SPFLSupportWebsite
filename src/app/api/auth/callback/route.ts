import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code'); // Get code from query parameters
  
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = tokenResponse.data;

    // Get user information
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Get user's roles from the guild
    const guildMemberResponse = await axios.get(`https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${userResponse.data.id}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    });

    const userRoles = guildMemberResponse.data.roles;
    const staffRoles = [1342077472988205087, 1342116758168928389, 1342088931788722176, 1342075350280048670];
    const isStaff = userRoles.includes(...staffRoles) || userResponse.data.id === '811931057548689468';

    // Create a JWT token and set it as a cookie
    const token = jwt.sign({ id: userResponse.data.id, isStaff }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    // Redirect user based on their role
    const response = NextResponse.redirect(isStaff ? 'https://spfl.vercel.app/transcripts' : 'https://spfl.vercel.app/');
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 3600, // 1 hour
    });
    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}