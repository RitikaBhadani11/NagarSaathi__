const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
require('dotenv').config();

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat completion endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    // Create a system prompt that defines the chatbot's role and capabilities
    const systemPrompt = `
You are a helpful assistant for the Nagarsaathi complaint management system. 
You help administrators manage citizen complaints efficiently.

Key information about the current system state:
- Total complaints: ${context.stats.total}
- Pending: ${context.stats.pending}
- In Progress: ${context.stats.inProgress}
- Resolved: ${context.stats.resolved}
- Rejected: ${context.stats.rejected}

Capabilities you can help with:
1. Providing statistics and analytics about complaints
2. Explaining how to update complaint status
3. Helping with filtering and searching complaints
4. Guiding on exporting reports
5. Answering questions about the Nagarsaathi system
6. Providing insights about complaint categories and trends
7. Helping with ward-wise analysis

Always be helpful, concise, and focused on complaint management. If asked about something unrelated, politely redirect to Nagarsaathi topics.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    
    // Fallback responses if OpenAI fails
    const fallbackResponses = {
      greetings: ["Hello! How can I assist you with Nagarsaathi today?", "Hi there! How can I help with complaint management?"],
      statistics: [
        `There are ${context.stats.total} total complaints in the system.`,
        `Currently, ${context.stats.pending} complaints are pending review.`,
        `Great news! ${context.stats.resolved} complaints have been resolved.`
      ],
      default: "I'm experiencing technical difficulties. Please try again later."
    };
    
    const lowerMessage = message.toLowerCase();
    let fallbackReply = fallbackResponses.default;
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      fallbackReply = fallbackResponses.greetings[Math.floor(Math.random() * fallbackResponses.greetings.length)];
    } else if (lowerMessage.includes('total') || lowerMessage.includes('complaint') || lowerMessage.includes('stat')) {
      fallbackReply = fallbackResponses.statistics[Math.floor(Math.random() * fallbackResponses.statistics.length)];
    }
    
    res.json({ reply: fallbackReply });
  }
});

module.exports = router;