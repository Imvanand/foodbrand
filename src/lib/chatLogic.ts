interface ChatResponse {
    keywords: string[];
    response: string;
}

const knowledgeBase: ChatResponse[] = [
    {
        keywords: ['hi', 'hello', 'hey', 'namaste', 'hola'],
        response: "Namaste! Welcome to Kalsa Foods. I'm your cooking assistant. How can I help you today?"
    },
    {
        keywords: ['how much kalsa spice mix should i use', 'how much to use', 'how to use', 'usage', 'quantity', 'how many spoons'],
        response: "Kalsa All-Purpose Spice Mix use karna bahut asaan hai! 500g sabzi ya meat ke liye sirf 1-2 teaspoons (chhote chammach) masala kaafi hai. Isme sare spices balanced hain, toh aap swad anusar thoda namak adjust kar sakte hain. For detailed recipes, visit: https://www.kalsafoods.com/recipes"
    },
    {
        keywords: ['price', 'cost', 'mrp', 'rate', 'how much is', 'how much for', 'discount', 'delivery charge'],
        response: "Kalsa All-Purpose Spice Mix is currently priced at ₹107 (MRP ₹179). That's a flat 40% launch discount! Delivery for 1-2 packs is ₹60, but if you order 3 or more packs, delivery is absolutely FREE!"
    },
    {
        keywords: ['order', 'buy', 'purchase', 'how to buy'],
        response: "You can place your order directly on our website by clicking the 'Buy Now' button. It will take you to WhatsApp where we confirm your details and provide fast delivery."
    },
    {
        keywords: ['whatsapp', 'number', 'phone', 'contact', 'call', 'support'],
        response: "You can reach us on WhatsApp at +91 87094 38350 or email us at support@kalsafoods.com. We are based in Bangalore (560049)."
    },
    {
        keywords: ['potatoes and cauliflower', 'aloo gobhi', 'aloo gobi'],
        response: "Aap Kalsa Spice Mix use karke ek dum badhiya 'Aloo Gobhi' bana sakte hain! Iska base bilkul humare 'Mix Vegetable' jaisa hota hai. Recipe ke liye yahan dekhein: https://www.kalsafoods.com/recipes/mix-vegetable"
    },
    {
        keywords: ['suggest a quick recipe', 'suggest recipe'],
        response: "Bilkul! Agar aap jaldi me hain, toh 'Classic Egg Curry' ya 'Mix Veg' try kijiye. Dono hi 20-25 mins me ban jate hain. Yahan dekhein saari recipes: https://www.kalsafoods.com/recipes"
    },
    {
        keywords: ['aloo dum', 'aalu dam', 'dum aloo'],
        response: "Zaroor! Aloo Dum ke liye aap humara Kalsa Spice Mix use karke ek dum authentic swad pa sakte hain. Iski puri recipe yahan di gayi hai: https://www.kalsafoods.com/recipes/aloo-dum. Humare website par aur bhi kai saari recipes added hain!"
    },
    {
        keywords: ['recipe', 'cooking', 'suggest', 'make', 'dish', 'curry'],
        response: "Kalsa Spice Mix se aap Sabzi, Paneer, Chicken aur Egg Curry jaise kai dishes bana sakte hain. Humari sari recipes website ke 'Recipes' section me added hain: https://www.kalsafoods.com/recipes"
    },
    {
        keywords: ['bulk', 'wholesale', 'business', 'large quantity', 'restaurant'],
        response: "For bulk orders or business inquiries, please use our Inquiry Form on the Contact page or call us directly at +91 87094 38350. we offer special pricing for restaurants and retail shops."
    },
    {
        keywords: ['natural', 'pure', 'color', 'quality', 'ingredients'],
        response: "Kalsa Spice Mix is 100% natural with no added colors or preservatives. It's made from our mother's secret family recipe, using premium whole spices for that authentic homemade aroma."
    },
    {
        keywords: ['gstin', 'gst', 'tax'],
        response: "Our GSTIN is 29KOEPK2332M1ZI. All our prices are inclusive of taxes."
    },
    {
        keywords: ['location', 'address', 'bangalore', 'where'],
        response: "We are located in K R Puram, Bangalore, India - 560049. However, we deliver our spices all across India!"
    },
    {
        keywords: ['thank', 'thanks', 'ok', 'good', 'nice'],
        response: "You're welcome! Happy cooking with Kalsa Foods. Is there anything else I can help you with?"
    }
];

export const getLocalResponse = (input: string): string => {
    const userInput = input.toLowerCase().trim();

    // Find the first match based on keywords
    const match = knowledgeBase.find(item =>
        item.keywords.some(keyword => userInput.includes(keyword))
    );

    if (match) {
        return match.response;
    }

    // Default fallback
    return "I'm sorry, I'm still learning! Could you please ask about our product price, recipes, or how to order? You can also contact us on WhatsApp at +91 87094 38350.";
};
