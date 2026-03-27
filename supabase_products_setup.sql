-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    price INTEGER NOT NULL,
    mrp INTEGER NOT NULL,
    discount_percentage INTEGER DEFAULT 0,
    unit_price_text_en TEXT,
    unit_price_text_hi TEXT,
    
    name_en TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    
    full_name_en TEXT NOT NULL,
    full_name_hi TEXT NOT NULL,
    
    tagline_en TEXT,
    tagline_hi TEXT,
    
    breadcrumb_en TEXT,
    breadcrumb_hi TEXT,
    
    offer_title_en TEXT,
    offer_title_hi TEXT,
    
    offer_text_en TEXT,
    offer_text_hi TEXT,
    
    moq_notice_en TEXT,
    moq_notice_hi TEXT,
    
    about_items_en JSONB DEFAULT '[]'::jsonb,
    about_items_hi JSONB DEFAULT '[]'::jsonb,
    
    specifications_en JSONB DEFAULT '[]'::jsonb,
    specifications_hi JSONB DEFAULT '[]'::jsonb,
    
    additional_info_en JSONB DEFAULT '[]'::jsonb,
    additional_info_hi JSONB DEFAULT '[]'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on products"
    ON public.products FOR SELECT
    USING (true);

-- Delete existing product if any to avoid conflicts
DELETE FROM public.products WHERE id = 'kalsa-spicemix-100g';

-- Insert the initial product data
INSERT INTO public.products (
    id, price, mrp, discount_percentage, unit_price_text_en, unit_price_text_hi,
    name_en, name_hi,
    full_name_en, full_name_hi,
    tagline_en, tagline_hi,
    breadcrumb_en, breadcrumb_hi,
    offer_title_en, offer_title_hi,
    offer_text_en, offer_text_hi,
    moq_notice_en, moq_notice_hi,
    about_items_en, about_items_hi,
    specifications_en, specifications_hi,
    additional_info_en, additional_info_hi
) VALUES (
    'kalsa-spicemix-100g', 
    139, 
    179, 
    22, 
    '(₹139 /100 g)', 
    '(₹139 /100 ग्राम)',
    
    'Kalsa foods 100% Natural Spice Mix Masala Powder 100gm',
    'कालसा फूड्स 100% प्राकृतिक स्पाइस मिक्स मसाला पाउडर 100 ग्राम',
    
    'Spice Mix Masala | All-Purpose Indian Spice Blend | For Sabzi, Paneer & Curry | Rich Aroma & Authentic Taste | No Added Colors | 100g',
    'स्पाइस मिक्स मसाला | सर्व-उद्देशीय भारतीय मसाला मिश्रण | सब्जी, पनीर और करी के लिए | भरपूर सुगंध और असली स्वाद | कोई अतिरिक्त रंग नहीं | 100ग्राम',
    
    'Experience the true taste of homemade goodness',
    'घर के बने खाने के असली स्वाद का अनुभव करें',
    
    'Kalsa Foods > Spices & Masalas',
    'कालसा फूड्स > मसाले',
    
    '🚀 Launch Offer',
    '🚀 लॉन्च ऑफर',
    
    'Buy 3 or more Packs & Get Free Delivery (₹60 charge for 1-2 packs)',
    '3 या अधिक पैक खरीदें और मुफ्त डिलीवरी पाएं (1-2 पैक पर ₹60 चार्ज)',
    
    'Special Offer: 3+ Packs for Free Delivery',
    'विशेष ऑफर: 3+ पैक पर मुफ्त डिलीवरी',
    
    '["Inspired by Generations of Home Cooking: Crafted from our family’s time-tested recipe, bringing the warmth and authenticity of traditional Indian kitchens to your meals.", "One Masala, Multiple Dishes: Perfect all-purpose blend for sabzi, curry, paneer, chicken, egg, and everyday recipes.", "Rich Aroma & Balanced Flavor: Expertly blended spices deliver a soulful fragrance, vibrant color, and perfectly balanced taste in every bite.", "Premium Quality Whole Spices: Made from carefully selected, high-quality spices to ensure purity, freshness, and consistency.", "No Artificial Colors or Preservatives: Free from added colors and harmful preservatives – just pure, authentic spice goodness.", "Elevates Everyday Cooking: Transforms simple ingredients into flavorful, restaurant-style dishes at home."]'::jsonb,
    '["पीढ़ियों की घर की कुकिंग से प्रेरित: हमारे परिवार के समय की कसौटी पर खरी उतरी रेसिपी से तैयार, जो आपके भोजन में पारंपरिक भारतीय रसोई की गर्माहट और प्रामाणिकता लाती है।", "एक मसाला, कई व्यंजन: सब्जी, करी, पनीर, चिकन, अंडे और रोजमर्रा की रेसिपी के लिए एकदम सही सर्व-उद्देशीय मिश्रण।", "भरपूर सुगंध और संतुलित स्वाद: कुशलता से मिश्रित मसाले हर निवाले में एक रूहानी खुशबू, जीवंत रंग और पूरी तरह से संतुलित स्वाद देते हैं।", "प्रीमियम गुणवत्ता वाले खड़े मसाले: शुद्धता, ताजगी और निरंतरता सुनिश्चित करने के लिए सावधानीपूर्वक चुने गए, उच्च गुणवत्ता वाले मसालों से बने।", "कोई कृत्रिम रंग या संरक्षक नहीं: अतिरिक्त रंगों और हानिकारक संरक्षकों से मुक्त - बस शुद्ध, असली मसालों की अच्छाई।", "रोजमर्रा की कुकिंग को बेहतर बनाता है: घर पर ही साधारण सामग्री को स्वादिष्ट, रेस्टोरेंट जैसे व्यंजनों में बदल देता है।"]'::jsonb,
    
    '[{"label": "Brand Name", "value": "Kalsa Foods"}, {"label": "Item Form", "value": "Powder"}, {"label": "Diet Type", "value": "Vegetarian"}, {"label": "Specialty", "value": "Natural"}, {"label": "Container Type", "value": "Standup pouch"}, {"label": "Country of Origin", "value": "India"}]'::jsonb,
    '[{"label": "ब्रांड का नाम", "value": "कालसा फूड्स"}, {"label": "आइटम फॉर्म", "value": "पाउडर"}, {"label": "आहार प्रकार", "value": "शाकाहारी"}, {"label": "विशेषता", "value": "प्राकृतिक"}, {"label": "कंटेनर प्रकार", "value": "स्टैंडअप पाउच"}, {"label": "उत्पत्ति का देश", "value": "भारत"}]'::jsonb,
    
    '[{"label": "Importer Contact Information", "value": "Kalsa Foods"}, {"label": "Item Type Name", "value": "Kalsa Foods Spice Mix Masala (मसाला मिश्रण), 100 gm"}, {"label": "Manufacturer", "value": "Kalsa Foods"}, {"label": "Manufacturer Contact Information", "value": "Kalsa Foods"}, {"label": "Packer Contact Information", "value": "Kalsa Foods"}]'::jsonb,
    '[{"label": "आयातक संपर्क जानकारी", "value": "कालसा फूड्स"}, {"label": "आइटम प्रकार का नाम", "value": "कालसा फूड्स स्पाइस मिक्स मसाला, 100 ग्राम"}, {"label": "निर्माता", "value": "कालसा फूड्स"}, {"label": "निर्माता संपर्क जानकारी", "value": "कालसा फूड्स"}, {"label": "पैकर संपर्क जानकारी", "value": "कालसा फूड्स"}]'::jsonb
);
