-- Update the offer text in the products table to remove the MOQ 3 condition

UPDATE public.products
SET 
  offer_text_en = 'Launch Offer: Free Delivery All Over India',
  offer_text_hi = 'लॉन्च ऑफर: पूरे भारत में मुफ्त डिलीवरी',
  moq_notice_en = 'Launch Offer: Free Delivery All Over India',
  moq_notice_hi = 'लॉन्च ऑफर: पूरे भारत में मुफ्त डिलीवरी'
WHERE id = 'kalsa-spicemix-100g';
