import { generateChatResponse, generateEmbedding } from '../lib/utils/geminiHelper.js';
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://chamikanimnajith:kPWIpkakK1h1umkp@cluster0.nsjjr.mongodb.net/MERNTwitter20?retryWrites=true&w=majority&appName=Cluster0";


// In-memory conversation store (replace with database in production)
const conversationStore = new Map();
const client = new MongoClient(uri);

export const startChatSession = async (req, res) => {
    try {
        const userId = req.user._id;
        const sessionId = `session_${Date.now()}`;
        
        conversationStore.set(sessionId, {
            userId,
            history: [],
            context: null
        });

        res.status(200).json({ 
            sessionId,    //this should be attached again from the frontend when calling the api/chat endpoint
            message: "Chat session started successfully" 
        });
    } catch (error) {
        console.error('Error starting chat session:', error);
        res.status(500).json({ error: "Failed to start chat session" });
    }
};

export const chatWithContext = async (req, res) => {
    let mongoClient;
    try {
        const { sessionId, message } = req.body;
        
        if (!sessionId || !message) {
            return res.status(400).json({ error: "Session ID and message are required" });
        }

        const conversation = conversationStore.get(sessionId);
        if (!conversation) {
            return res.status(404).json({ error: "Session not found" });
        }

        // Step 1: Generate embedding for the user's query
        const queryEmbedding = await generateEmbedding(message);

        // Step 2: Perform vector search in MongoDB
        mongoClient = new MongoClient(uri);
        await mongoClient.connect();
        
        const database = mongoClient.db("MERNTwitter20");
        const coll = database.collection("posts");
        
        const agg = [
            {
                '$vectorSearch': {
                    'index': 'vector_index2',
                    'path': 'title_embedding',
                    'queryVector': queryEmbedding,
                    'numCandidates': 150,
                    'limit': 10
                }
            }, {
                '$project': {
                    '_id': 0,
                    'description': 1,
                    'title': 1,
                    'text': 1,
                    'category': 1,
                    'score': {
                        '$meta': 'vectorSearchScore'
                    }
                }
            }
        ];

        const result = await coll.aggregate(agg).toArray();
        if (result.length === 0) {
            return res.status(404).json({ message: "No relevant information found" });
        }

        // Step 3: Update conversation context
        const newContext = result.map(post => 
            `[Document Title: ${post.title}]\n${post.description}\n${post.text}`
        ).join('\n\n---\n\n');

        conversation.context = newContext;
        conversation.history.push({ role: 'user', content: message });

        // Step 4: Prepare conversation history with context
        const messages = [
            {
                role: "system",
                content: `You are a helpful assistant that answers questions based on the following context. 
                If you don't know the answer, say so. Don't make up answers.
                \n\nContext:\n${conversation.context}`
            },
            ...conversation.history.map(msg => ({
                role: msg.role,
                content: msg.content
            }))
        ];

        // Step 5: Call Gemini using the helper function
        const answer = await generateChatResponse(
            messages.map(msg => ({
                role: msg.role === 'system' ? 'user' : msg.role,
                parts: [{ text: msg.content }]
            }))
        );
        
        // Update conversation history
        conversation.history.push({ role: 'assistant', content: answer });

        res.status(200).json({
            answer,
            sources: result.map(post => ({
                title: post.title,
                category: post.category,
                score: post.score.toFixed(4),
                
            }))
        });

    } catch (error) {
        console.error('Error in chatWithContext:', error);
        res.status(500).json({ 
            error: "Internal server error",
            details: error.message // Using error.message from the helper function
        });
    } finally {
        if (mongoClient) {
            await mongoClient.close();
        }
    }
};

export const endChatSession = async (req, res) => {
    try {
        const { sessionId } = req.body;
        
        if (!sessionId) {
            return res.status(400).json({ error: "Session ID is required" });
        }

        if (!conversationStore.has(sessionId)) {
            return res.status(404).json({ error: "Session not found" });
        }

        conversationStore.delete(sessionId);
        res.status(200).json({ message: "Chat session ended successfully" });

    } catch (error) {
        console.error('Error ending chat session:', error);
        res.status(500).json({ error: "Failed to end chat session" });
    }
};


// change the vector database name