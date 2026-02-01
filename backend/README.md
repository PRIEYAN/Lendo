# Lending Circle Backend

Express + WebSocket backend for the Lending Circle application, providing chat functionality and winner calculation API.

## Features

- **Real-time Chat**: WebSocket-based chat for circle participants to discuss payouts
- **Winner Calculation**: API endpoint to calculate payout winners with tie-breaking logic:
  1. Highest votes
  2. If tied, highest credit score
  3. If still tied, alphabetical order (lower address)

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will start on:
- HTTP API: `http://localhost:3001`
- WebSocket: `ws://localhost:3002`

## API Endpoints

### POST `/api/calculate-winner`
Calculate the winner for a month's payout with tie-breaking logic.

**Request Body:**
```json
{
  "circleAddress": "0x...",
  "month": 1
}
```

**Response:**
```json
{
  "winner": "0x...",
  "candidates": [
    {
      "address": "0x...",
      "votes": "5",
      "creditScore": "350"
    }
  ],
  "month": 1
}
```

### GET `/api/chat/:circleAddress`
Get chat messages for a circle.

**Response:**
```json
{
  "messages": [
    {
      "address": "0x...",
      "text": "Message text",
      "timestamp": 1234567890
    }
  ]
}
```

## WebSocket Events

### Join Circle
```json
{
  "type": "join",
  "circleAddress": "0x..."
}
```

### Send Message
```json
{
  "type": "chat",
  "circleAddress": "0x...",
  "address": "0x...",
  "text": "Message text"
}
```

### Receive Message
```json
{
  "type": "message",
  "address": "0x...",
  "text": "Message text",
  "timestamp": 1234567890
}
```

## Environment Variables

- `PORT`: HTTP server port (default: 3001)

## Notes

- Chat messages are stored in-memory and will be lost on server restart
- For production, consider using a database (Redis, PostgreSQL, etc.) for persistent chat storage
- The winner calculation uses the contract's `getCandidateVotes` function to get accurate vote counts
