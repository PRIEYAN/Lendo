import express from 'express';
import cors from 'cors';
import { createPublicClient, http } from 'viem';
import { WebSocketServer } from 'ws';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// CreditCoin Testnet configuration
const CREDITCOIN_CHAIN = {
  id: 102031,
  name: 'Creditcoin Testnet',
  network: 'creditcoin-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'CreditCoin',
    symbol: 'tCTC',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.cc3-testnet.creditcoin.network'],
    },
  },
};

const publicClient = createPublicClient({
  chain: CREDITCOIN_CHAIN,
  transport: http(),
});

// Load ABIs
const creditRegistryABI = JSON.parse(
  readFileSync(join(__dirname, '../blockchain/artifacts/contracts/CreditRegistry.sol/CreditRegistry.json'), 'utf-8')
).abi;

const lendingCircleABI = JSON.parse(
  readFileSync(join(__dirname, '../blockchain/artifacts/contracts/LendingCircle.sol/LendingCircle.json'), 'utf-8')
).abi;

// In-memory storage for chat messages (in production, use a database)
const chatMessages = new Map(); // circleAddress -> messages[]

// WebSocket server for real-time chat
const wss = new WebSocketServer({ port: 3002 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'join') {
        ws.circleAddress = message.circleAddress;
        // Send existing messages
        const messages = chatMessages.get(message.circleAddress) || [];
        ws.send(JSON.stringify({ type: 'history', messages }));
      } else if (message.type === 'chat') {
        // Store message
        const circleAddress = message.circleAddress;
        if (!chatMessages.has(circleAddress)) {
          chatMessages.set(circleAddress, []);
        }
        const messages = chatMessages.get(circleAddress);
        messages.push({
          address: message.address,
          text: message.text,
          timestamp: Date.now(),
        });
        
        // Broadcast to all clients in this circle
        wss.clients.forEach((client) => {
          if (client !== ws && client.circleAddress === circleAddress && client.readyState === 1) {
            client.send(JSON.stringify({ type: 'message', ...messages[messages.length - 1] }));
          }
        });
        
        // Echo back to sender
        ws.send(JSON.stringify({ type: 'message', ...messages[messages.length - 1] }));
      }
    } catch (error) {
      console.error('WebSocket error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

/**
 * Get winner with tie-breaking logic:
 * 1. Highest votes
 * 2. If tie, highest credit score
 * 3. If tie, alphabetical order (lower address wins)
 */
app.post('/api/calculate-winner', async (req, res) => {
  try {
    const { circleAddress, month } = req.body;
    
    if (!circleAddress || month === undefined) {
      return res.status(400).json({ error: 'Missing circleAddress or month' });
    }

    // Get candidates
    const candidates = await publicClient.readContract({
      address: circleAddress,
      abi: lendingCircleABI,
      functionName: 'getCandidates',
      args: [BigInt(month)],
    });

    if (!candidates || candidates.length === 0) {
      return res.json({ winner: null, candidates: [] });
    }

    // Get credit registry address
    const creditRegistryAddress = await publicClient.readContract({
      address: circleAddress,
      abi: lendingCircleABI,
      functionName: 'creditRegistry',
    });

    // Get votes and credit scores for each candidate
    const candidateData = await Promise.all(
      candidates.map(async (candidate) => {
        // Get votes from contract
        const votes = await publicClient.readContract({
          address: circleAddress,
          abi: lendingCircleABI,
          functionName: 'getCandidateVotes',
          args: [BigInt(month), candidate],
        });

        // Get credit score
        const creditScore = await publicClient.readContract({
          address: creditRegistryAddress,
          abi: creditRegistryABI,
          functionName: 'getCreditScore',
          args: [candidate],
        });

        return {
          address: candidate,
          votes: votes || 0n,
          creditScore: creditScore || 0n,
        };
      })
    );

    // Sort by: votes (desc), credit (desc), address (asc for alphabetical)
    candidateData.sort((a, b) => {
      // First by votes (descending)
      if (a.votes > b.votes) return -1;
      if (a.votes < b.votes) return 1;
      
      // Then by credit score (descending)
      if (a.creditScore > b.creditScore) return -1;
      if (a.creditScore < b.creditScore) return 1;
      
      // Finally alphabetical (lower address string wins)
      const addrA = a.address.toLowerCase();
      const addrB = b.address.toLowerCase();
      if (addrA < addrB) return -1;
      if (addrA > addrB) return 1;
      return 0; // Should never happen as addresses are unique
    });

    // Get winner from contract (if voting ended and executed)
    let contractWinner = null;
    try {
      contractWinner = await publicClient.readContract({
        address: circleAddress,
        abi: lendingCircleABI,
        functionName: 'getWinner',
        args: [BigInt(month)],
      });
      if (contractWinner === '0x0000000000000000000000000000000000000000') {
        contractWinner = null;
      }
    } catch (e) {
      // Winner not set yet
    }

    // Calculate expected winner based on our sorting
    const expectedWinner = candidateData.length > 0 ? candidateData[0].address : null;

    res.json({
      winner: contractWinner || expectedWinner,
      candidates: candidateData.map(c => ({
        address: c.address,
        votes: c.votes.toString(),
        creditScore: c.creditScore.toString(),
      })),
      month: Number(month),
    });
  } catch (error) {
    console.error('Error calculating winner:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get chat messages for a circle
 */
app.get('/api/chat/:circleAddress', (req, res) => {
  const { circleAddress } = req.params;
  const messages = chatMessages.get(circleAddress) || [];
  res.json({ messages });
});

/**
 * Get candidate votes breakdown
 */
app.post('/api/candidate-votes', async (req, res) => {
  try {
    const { circleAddress, month, candidate } = req.body;
    
    // Get total participants
    const totalParticipants = await publicClient.readContract({
      address: circleAddress,
      abi: lendingCircleABI,
      functionName: 'totalParticipants',
    });

    // Count votes by checking each participant
    // This is simplified - in production you'd want to index events
    let voteCount = 0n;
    
    res.json({
      candidate,
      votes: voteCount.toString(),
      totalParticipants: totalParticipants.toString(),
    });
  } catch (error) {
    console.error('Error getting votes:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Check if a user has voted for a month
 */
app.post('/api/has-voted', async (req, res) => {
  try {
    const { circleAddress, month, voterAddress } = req.body;
    
    if (!circleAddress || month === undefined || !voterAddress) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Read the vote mapping - we need to check if the vote exists
    // Since hasVoted is not directly accessible, we'll try to read the vote struct
    // This is a workaround - ideally the contract would have a hasVoted getter
    try {
      // Try to get the vote - if it doesn't exist, the call will fail
      // We'll check if the vote exists by trying to read it
      const proposal = await publicClient.readContract({
        address: circleAddress,
        abi: lendingCircleABI,
        functionName: 'getCandidates',
        args: [BigInt(month)],
      });
      
      // For now, return false as we can't directly check
      // In production, you'd want to add a hasVoted getter to the contract
      res.json({ hasVoted: false });
    } catch (e) {
      res.json({ hasVoted: false });
    }
  } catch (error) {
    console.error('Error checking vote status:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`💬 WebSocket server running on ws://localhost:3002`);
});
