'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Transcripts() {
  type Message = {
    author: string;
    content: string;
  };
  
  type ticket = {
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
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    async function fetchTicket() {
      const response = await fetch(`/api/tickets/${id}`);
      const data = await response.json();
      setTicket(data);
    }

    if (id) {
      fetchTicket();
    }
  }, [id]);

  if (!ticket) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-t-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center">🎟️ Ticket Transcript</h1>
        <p className="text-center text-lg mt-2">Review ticket details & messages</p>
      </div>

      {/* Ticket Details */}
      <div className="p-6 bg-gray-50 rounded-lg shadow-inner mt-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ticket Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p className="text-gray-700"><strong className="text-gray-900">Ticket ID:</strong> {ticket.ticketId}</p>
          <p className="text-gray-700"><strong className="text-gray-900">User ID:</strong> {ticket.userId}</p>
          <p className="text-gray-700"><strong className="text-gray-900">Mod ID:</strong> {ticket.modId}</p>
          <p className="text-gray-700"><strong className="text-gray-900">Channel ID:</strong> {ticket.channelId}</p>
          <p className="text-gray-700"><strong className="text-gray-900">Status:</strong> 
            <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full 
              ${ticket.status === 'closed' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
              {ticket.status}
            </span>
          </p>
          <p className="text-gray-700"><strong className="text-gray-900">Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
          <p className="text-gray-700"><strong className="text-gray-900">Closed At:</strong> {ticket.closedAt ? new Date(ticket.closedAt).toLocaleString() : 'N/A'}</p>
          <p className="text-gray-700"><strong className="text-gray-900">Closed By:</strong> {ticket.closedBy}</p>
          <p className="text-gray-700"><strong className="text-gray-900">Last Message:</strong> {new Date(ticket.lastMessage).toLocaleString()}</p>
        </div>
      </div>

      {/* Messages Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">📩 Messages</h2>
        <div className="space-y-4">
          {ticket.messages.map((message, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <p className="text-gray-800 font-medium">👤 <strong>{message.author}</strong></p>
              <p className="text-gray-700 mt-1">{message.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}