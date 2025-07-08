import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent';
const GEMINI_API_KEY = 'AIzaSyBfwFZMSJcq3_BUpCTMbDPTyPA2U5IEX0M'; // Replace with your actual token
import { GoogleGenAI } from "@google/genai";


export const generateEmbedding = async (text) => {
    try {
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                content: {
                    parts: [{
                        text: text
                    }]
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return response.data.embedding.values;
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
    }
};


export const generateChatResponse = async (messages) => {
    try {
        // const response = await axios.post(
        //     `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        //     {
        //         contents: messages,
        //         generationConfig: {
        //             temperature: 0.7,
        //             topP: 0.9,
        //             topK: 40
        //         }
        //     },
        //     {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         timeout: 10000
        //     }
        // );

        // if (!response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
        //     throw new Error('Invalid chat response format');
        // }

        const ai = new GoogleGenAI({ apiKey: "AIzaSyBfwFZMSJcq3_BUpCTMbDPTyPA2U5IEX0M" });
        let response2;
        async function main() {
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: messages,
            });
            console.log(response.text);

            response2 = response.text;
            
        }
        await main();

        return response2;
        
    } catch (error) {
        console.error('Error generating chat response:', error);
        throw new Error(`Chat generation failed: ${error.message}`);
    }
};