import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Ticket from '@/schemas/Ticket'; // Ensure this import path is correct

export async function GET() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(mongoUri);

    const tickets = await Ticket.find({});

    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  } finally {
    await mongoose.disconnect();
  }
}