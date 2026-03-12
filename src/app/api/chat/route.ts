import { NextResponse } from 'next/server';
import { getLocalResponse } from '@/lib/chatLogic';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || messages.length === 0) {
            return NextResponse.json({ message: "Hello! How can I help you today?" });
        }

        const lastMessage = messages[messages.length - 1].content;
        const responseText = getLocalResponse(lastMessage);

        // Add a tiny artificial delay to make it feel natural (optional)
        // await new Promise(resolve => setTimeout(resolve, 300));

        return NextResponse.json({
            message: responseText,
        });
    } catch (error: any) {
        console.error('Local Chat API Error:', error);
        return NextResponse.json(
            { message: "Oops! Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
