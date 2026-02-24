import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { message: 'Gemini API key not configured in environment variables.' },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            systemInstruction: `You are a helpful and expert cooking assistant for Kalsa Foods.

Your goal is to have a natural, helpful conversation with users. Avoid being repetitive or dumping too much information at once.

Key Guidelines:
1. **Interactive Cooking**: If a user asks for a recipe, start with a brief overview and the secret touch of Kalsa Spice Mix. Ask if they want the step-by-step instructions before providing them.
2. **Masala Usage**: When mentioned, suggest using 1-2 teaspoons of Kalsa All Purpose Spice Mix for 500g of the main ingredient (sabzi/meat). Mention its unique aroma.
3. **Natural Tone**: Use a friendly, professional, yet conversational Indian tone (Hinglish words like 'Namaste', 'Bilkul', 'Zaroor' are welcome).
4. **Smart Sells**: Don't mention ordering or bulk orders in every single message. Only bring it up if the user expresses interest in buying, quality, or large quantities.
5. **Helpful & Concise**: Keep answers easy to read. Use bullet points for lists but don't overdo it.
6. **Support**: If they need to reach out, share the WhatsApp (+91 87094 38350) or the Contact Page inquiry form only when relevant.`
        });

        // Use only the last 10 messages to keep it efficient
        const recentMessages = messages.slice(-10);

        // Convert message format to Gemini format
        const history = recentMessages.slice(0, -1).map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        const lastMessage = recentMessages[recentMessages.length - 1].content;

        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
            message: text,
        });
    } catch (error: any) {
        console.error('Gemini Chat API Error:', error);
        return NextResponse.json(
            { message: `Chat Error: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}
