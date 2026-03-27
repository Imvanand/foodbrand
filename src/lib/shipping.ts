export interface PincodeServiceability {
    status: 'success' | 'error';
    pincode: string;
    isServiceable: boolean;
    estimatedDeliveryDays?: number;
    message?: string;
}

export async function checkPincodeServiceability(pincode: string): Promise<PincodeServiceability> {
    const token = process.env.DELHIVERY_API_TOKEN;
    
    // Fallback for development if token is missing
    if (!token) {
        console.warn("Delhivery API Token missing. Using mock response.");
        await new Promise(r => setTimeout(r, 800)); // Simulate network delay
        
        // Simple mock logic for testing
        if (pincode.startsWith('9')) {
            return {
                status: 'success',
                pincode,
                isServiceable: false,
                message: "Sorry, we don't deliver to this location yet."
            };
        }
        
        return {
            status: 'success',
            pincode,
            isServiceable: true,
            estimatedDeliveryDays: 3 + Math.floor(Math.random() * 3),
            message: "Fast delivery available!"
        };
    }

    try {
        // Delhivery Pincode Serviceability API
        const response = await fetch(`https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}`, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        const deliveryCode = data.delivery_codes && data.delivery_codes[0];
        const isServiceable = !!deliveryCode;
        const codAvailable = deliveryCode?.postal_code?.cod === 'Y';
        
        return {
            status: 'success',
            pincode,
            isServiceable: isServiceable,
            estimatedDeliveryDays: isServiceable ? 4 : undefined,
            message: isServiceable 
                ? `Serviceable${codAvailable ? ' (COD Available)' : ' (Prepaid Only)'}` 
                : "Not Serviceable"
        };
    } catch (error) {
        console.error("Delhivery API Error:", error);
        return {
            status: 'error',
            pincode,
            isServiceable: false,
            message: "Failed to check serviceability. Please try again later."
        };
    }
}
