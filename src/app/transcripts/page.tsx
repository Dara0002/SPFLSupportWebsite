'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Message = {
  author: string;
  content: string;
};

type Ticket = {
  ticketId: string;
  userId: string;
  modId: string;
  channelId: string;
  status: string;
  createdAt: string;
  closedAt?: string;
  closedBy?: string;
  lastMessage: string;
  messages: Message[];
};

export default function Transcripts() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTickets() {
      const response = await fetch('/api/tickets');
      const data: Ticket[] = await response.json();
      setTickets(data);
      setLoading(false); // Set loading to false after the data has been fetched
    }

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-3xl font-semibold text-gray-600 animate-pulse">Loading tickets...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg mt-10">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-6">All Tickets</h1>
      <ul className="space-y-4">
        {tickets.map((ticket) => (
          <Link key={ticket.ticketId} href={`/transcripts/${ticket.ticketId}`}>
            <div className="block p-6 bg-gray-50 rounded-lg shadow-inner mt-6 shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Ticket ID: {ticket.ticketId}</h2>
              <p className="text-gray-700 mb-1"><strong className="text-gray-900">User ID:</strong> {ticket.userId}</p>
              <p className="text-gray-700 mb-1"><strong className="text-gray-900">Mod ID:</strong> {ticket.modId}</p>
              <p className="text-gray-700 mb-1"><strong className="text-gray-900">Channel ID:</strong> {ticket.channelId}</p>
              <p className="text-gray-700 mb-1"><strong className="text-gray-900">Status:</strong> 
                <span className={`ml-2 px-3 py-1 text-sm font-semibold rounded-full 
                  ${ticket.status === 'closed' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`} >
                  {ticket.status}
                </span>
              </p>
              <p className="text-gray-700 mb-1"><strong className="text-gray-900">Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
              <p className="text-gray-700 mb-1"><strong className="text-gray-900">Closed At:</strong> {ticket.closedAt ? new Date(ticket.closedAt).toLocaleString() : 'N/A'}</p>
              <p className="text-gray-700 mb-1"><strong className="text-gray-900">Closed By:</strong> {ticket.closedBy || 'N/A'}</p>
              <p className="text-gray-700 mb-1"><strong className="text-gray-900">Last Message:</strong> {new Date(ticket.lastMessage).toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
}