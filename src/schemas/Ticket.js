import mongoose from 'mongoose'; // ✅ Use import instead

const ticketSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    modId: {
        type: String,
        default: "N/A"
    },
    ticketId: {
        type: String
    },
    channelId: {
        type: String
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    closedAt: {
        type: Date,
        default: Date.now
    },
    closedBy: {
        type: String,
        default: "N/A"
    },
    lastMessage: {
        type: Date,
        default: Date.now
    },
    messages: {
        type: Array,
        default: []
    }
});

export default mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema, 'Tickets');