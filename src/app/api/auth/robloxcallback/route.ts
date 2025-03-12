// pages/api/callback.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const CLIENT_ID = '4623992835895881840';  // Replace with your Roblox OAuth client ID
const CLIENT_SECRET = 'RBX-q696pdln-U-JXq1zf5IgCqWIC1eUuCtrCX2puFZ2Lb-BPDHpmE-YMiqpVB6kDkDZ';  // Replace with your Roblox OAuth client secret
const REDIRECT_URI = 'https://spfl.vercel.app/api/auth/robloxcallback';  // Replace with your actual redirect URI
const ROBLOX_OAUTH_URL = 'https://apis.roblox.com/oauth/v1/token';  // Roblox OAuth2 token endpoint

export async function GET(req: NextRequest) {
    const url = req.nextUrl;
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state'); // Optional, used to prevent CSRF attacks

    if (!code) {
        return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
    }

    try {
        // Step 2: Exchange the authorization code for an access token
        const tokenResponse = await exchangeCodeForToken(code);

        if (tokenResponse.status === 200) {
            const { access_token } = tokenResponse.data;

            // Optionally store the access token in a database or session here
            // For simplicity, we're just returning it in the response
            return NextResponse.json({
                message: 'Authorization successful!',
                access_token,
            });
        } else {
            return NextResponse.json({
                error: 'Failed to obtain access token',
                details: tokenResponse.data,
            }, { status: tokenResponse.status });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
    }
}

// Function to exchange the authorization code for an access token
const exchangeCodeForToken = async (code: string) => {
    try {
        const response = await axios.post(
            ROBLOX_OAUTH_URL,
            new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code',
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
}