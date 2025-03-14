import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Ticket from '@/schemas/Ticket'; // Ensure this import path is correct

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: 'Ticket ID is required' }, { status: 400 });
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(mongoUri);

    const ticket = await Ticket.findOne({ ticketId: id });

    if (!ticket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(ticket, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
  } finally {
    await mongoose.disconnect();
  }
}
