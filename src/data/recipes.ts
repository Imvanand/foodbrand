export interface Recipe {
    id: number;
    slug: string;
    title: string;
    titleHi?: string;
    category: string;
    categoryHi?: string;
    image: string;
    summary: string;
    summaryHi?: string;
    prepTime: string;
    cookTime: string;
    servings: string;
    difficulty: string;
    difficultyHi?: string;
    author: string;
    date: string;
    description: string;
    descriptionHi?: string;
    ingredients: string[];
    ingredientsHi?: string[];
    steps: string[];
    stepsHi?: string[];
}

export const recipes: Recipe[] = [
    {
        id: 1,
        slug: 'mix-vegetable',
        title: 'Mix Vegetable',
        titleHi: 'मिक्स वेजिटेबल (Mix Veg)',
        category: 'Mix Veg',
        categoryHi: 'मिक्स वेज',
        image: '/recipe_photos/Mixveg.png',
        summary: 'A wholesome and colorful mix of seasonal vegetables cooked in aromatic spices.',
        summaryHi: 'ताजी सब्जियों और कालसा के स्पेशल मसाले से बनी एक स्वादिष्ट और हेल्दी डिश।',
        prepTime: '20 mins',
        cookTime: '25 mins',
        servings: '3-4',
        difficulty: 'Medium',
        difficultyHi: 'मध्यम',
        author: 'Kalsa Kitchen',
        date: 'Feb 12, 2026',
        description: 'A delicious and healthy mix of fresh vegetables like cauliflower, potatoes, carrots, and peas cooked with paneer and aromatic spices. Perfect for a hearty meal.',
        descriptionHi: 'गोभी, आलू, गाजर और मटर जैसी ताजी सब्जियों को पनीर और खुशबूदार मसालों के साथ पकाकर बनाई गई एक स्वादिष्ट डिश। यह आपके खाने के लिए एकदम सही है।',
        ingredients: [
            '1/2 cup Green peas',
            '1 cup Carrots, diced',
            '1 1/2 cup Cauliflower florets',
            '1 1/2 cup Potatoes, diced',
            '1 cup Capsicum, diced',
            '1 cup Paneer cubes',
            '1 Onion, diced',
            '2 Tomatoes, chopped',
            '1 tsp Finely chopped ginger',
            '1 tsp Finely chopped garlic',
            '1 tsp Finely chopped green chillies',
            '3-4 tbsp Oil',
            '2 tsp Kalsa’s Spice Mix Masala',
            '1/2 tsp Turmeric Powder',
            '1 tsp Cumin seeds',
            'Salt as per taste',
            'Fresh coriander for garnish'
        ],
        ingredientsHi: [
            '1/2 कप हरी मटर',
            '1 कप गाजर, कटी हुई',
            '1 1/2 कप फूलगोभी',
            '1 1/2 कप आलू, कटे हुए',
            '1 कप शिमला मिर्च',
            '1 कप पनीर के टुकड़े',
            '1 प्याज, बारीक कटा हुआ',
            '2 टमाटर, कटे हुए',
            '1 चम्मच बारीक कटा अदरक',
            '1 चम्मच बारीक कटा लहसुन',
            '1 चम्मच बारीक कटी हरी मिर्च',
            '3-4 चम्मच तेल',
            '2 चम्मच कालसा स्पाइस मिक्स मसाला',
            '1/2 चम्मच हल्दी पाउडर',
            '1 चम्मच जीरा',
            'नमक स्वादानुसार',
            'हरा धनिया सजाने के लिए'
        ],
        steps: [
            'Pre-fry the vegetables (cauliflower, potatoes, carrots, capsicum) and keep aside.',
            'Heat 3 tbsp oil in a pan.',
            'Add cumin seeds, onion, ginger, garlic, and green chillies. Sauté till evenly browned.',
            'Add the chopped tomatoes and cook till softened and mushy.',
            'Add Kalsa’s Spice Mix Masala, turmeric powder, and salt. Stir well to combine.',
            'Add green peas and cook for a few minutes.',
            'Add the pre-fried vegetables and paneer cubes.',
            'Cook at medium flame for 8–10 mins until vegetables are fully cooked and flavors are absorbed.',
            'Garnish with fresh coriander, and your Mixed Vegetable dish is ready to serve!'
        ],
        stepsHi: [
            'सब्जियों (गोभी, आलू, गाजर, शिमला मिर्च) को पहले ही फ्राई कर लें और अलग रख दें।',
            'एक पैन में 3 चम्मच तेल गरम करें।',
            'जीरा, प्याज, अदरक, लहसुन और हरी मिर्च डालें। अच्छी तरह भूने।',
            'कटे हुए टमाटर डालें और उनके गलने तक पकाएं।',
            'कालसा का स्पाइस मिक्स मसाला, हल्दी और नमक डालें। अच्छी तरह मिलाएं।',
            'हरी मटर डालें और कुछ मिनट पकाएं।',
            'तली हुई सब्जियां और पनीर के टुकड़े डालें।',
            '8-10 मिनट तक मध्यम आंच पर पकाएं जब तक सब्जियां पूरी तरह पक न जाएं।',
            'ताजा धनिया से सजाएं, आपकी मिक्स वेजिटेबल तैयार है!'
        ]
    },
    {
        id: 2,
        slug: 'aloo-dum',
        title: 'Aloo Dum',
        titleHi: 'दम आलू (Aloo Dum)',
        category: 'Aloo Dum',
        categoryHi: 'दम आलू',
        image: '/recipe_photos/AlooDum.png',
        summary: 'Baby potatoes simmered in a rich, spiced curd-based gravy.',
        summaryHi: 'मसालेदार दही की ग्रेवी में पके हुए छोटे आलू (दम आलू)।',
        prepTime: '15 mins',
        cookTime: '30 mins',
        servings: '3-4',
        difficulty: 'Medium',
        difficultyHi: 'मध्यम',
        author: 'Kalsa Kitchen',
        date: 'Feb 12, 2026',
        description: 'A classic and flavorful delicacy featuring golden-fried baby potatoes cooked in a velvety yogurt gravy with aromatic onions and Kalsa spices.',
        descriptionHi: 'एक लाजवाब डिश जिसमें सुनहरे तले हुए छोटे आलू को दही की ग्रेवी, प्याज और कालसा के खास मसालों के साथ पकाया जाता है।',
        ingredients: [
            '500g Baby potatoes',
            '1 cup Thick curd (whisked)',
            '1 Finely chopped Onion',
            '1 tsp Ginger-garlic paste',
            '2 tsp Kalsa’s Spice Mix Masala',
            '1 tsp Kashmiri red chili powder',
            '1/2 tsp Turmeric powder',
            'Oil for deep frying',
            'Salt to taste'
        ],
        ingredientsHi: [
            '500 ग्राम छोटे आलू (Baby potatoes)',
            '1 कप गाढ़ा दही',
            '1 बारीक कटा हुआ प्याज',
            '1 चम्मच अदरक-लहसुन पेस्ट',
            '2 चम्मच कालसा स्पाइस मिक्स मसाला',
            '1 चम्मच कश्मीरी लाल मिर्च पाउडर',
            '1/2 चम्मच हल्दी पाउडर',
            'तलने के लिए तेल',
            'नमक स्वादानुसार'
        ],
        steps: [
            'Wash, boil, and peel the baby potatoes. Prick them with a fork.',
            'Deep fry the potatoes until they are golden brown and crispy.',
            'In a bowl, mix the whisked curd with chili powder, turmeric, and Kalsa Spice Mix Masala.',
            'Heat 2 tbsp oil in a pan. Sauté onions and ginger-garlic paste.',
            'Lower the flame and add the curd mixture. Stir continuously to prevent curdling.',
            'Cook until oil separates from the masala.',
            'Add Fried potatoes and 1 cup of water. Cover and simmer for 10-12 mins.',
            'Garnish and serve hot with naan or rice.'
        ],
        stepsHi: [
            'आलू को धोकर उबाल लें और छील लें। कांटे (fork) से उनमें छेद करें।',
            'आलुओं को सुनहरा और कुरकुरा होने तक डीप फ्राई करें।',
            'एक कटोरे में दही के साथ मिर्च, हल्दी और कालसा स्पाइस मिक्स मसाला मिलाएं।',
            'पैन में 2 चम्मच तेल गरम करें। प्याज और अदरक-लहसुन पेस्ट भूनें।',
            'आंच धीमी करें और दही का मिश्रण डालें। लगातार चलाते रहें।',
            'मसाले से तेल अलग होने तक पकाएं।',
            'तले हुए आलू और 1 कप पानी डालें। ढक्कर 10-12 मिनट तक पकने दें।',
            'हरा धनिया डालें और गरमागरम रोटी या चावल के साथ परोसें।'
        ]
    },
    {
        id: 3,
        slug: 'classic-egg-curry',
        title: 'Classic Egg Curry',
        titleHi: 'क्लासिक एग करी (Egg Curry)',
        category: 'Egg Curry',
        categoryHi: 'एग करी',
        image: '/recipe_photos/EggCurry.png',
        summary: 'Hard-boiled eggs in a savory tomato-onion gravy with aromatic spices.',
        summaryHi: 'स्वादिष्ट प्याज-टमाटर की ग्रेवी और खुशबूदार मसालों के साथ उबले हुए अंडों की करी।',
        prepTime: '10 mins',
        cookTime: '20 mins',
        servings: '2-3',
        difficulty: 'Easy',
        difficultyHi: 'आसान',
        author: 'Kalsa Kitchen',
        date: 'Feb 12, 2026',
        description: 'A simple yet flavorful egg curry that pairs perfectly with steamed rice or parathas. The key is in the slow-cooked onion-tomato base.',
        descriptionHi: 'एक सरल लेकिन स्वादिष्ट अंडा करी जो उबले हुए चावल या परांठे के साथ बहुत अच्छी लगती है।',
        ingredients: [
            '4 Hard-boiled eggs',
            '2 Onions, finely chopped',
            '2 Tomatoes, pureed',
            'Whole Masala (Cumin seeds, bay leaves, cinnamon, black cardamom)',
            '1 tsp Ginger-garlic paste',
            '2 tsp Kalsa’s Spice Mix Masala',
            '1/2 tsp Turmeric powder',
            '2 Green chillies, slit',
            'Fresh coriander for garnish',
            '3 tbsp Oil',
            'Salt to taste'
        ],
        ingredientsHi: [
            '4 उबले हुए अंडे',
            '2 प्याज, बारीक कटे हुए',
            '2 टमाटर की प्यूरी',
            'खड़ा मसाला (जीरा, तेजपत्ता, दालचीनी, बड़ी इलायची)',
            '1 चम्मच अदरक-लहसुन पेस्ट',
            '2 चम्मच कालसा स्पाइस मिक्स मसाला',
            '1/2 चम्मच हल्दी पाउडर',
            '2 हरी मिर्च',
            'हरा धनिया सजाने के लिए',
            '3 चम्मच तेल',
            'नमक स्वादानुसार'
        ],
        steps: [
            'Peel the boiled eggs and make light slits on the sides.',
            'Heat oil and lightly fry the eggs until golden-yellow; set aside.',
            'In the same oil add whole Masala like ( Cumin seeds, bay leaves, cinemon, black cardomom ) and sauté onions until translucent.',
            'Add ginger-garlic paste and green chillies. Sauté for 2 mins.',
            'Pour in tomato puree and add Kalsa Spice Mix, turmeric, and salt.',
            'Cook until the masala leaves the edges of the pan.',
            'Add 1.5 cups of water and bring to a boil.',
            'Add the eggs, simmer for 5 mins until the gravy thickens.',
            'Garnish with fresh coriander.'
        ],
        stepsHi: [
            'उबले हुए अंडों को छील लें और उनके किनारों पर हल्के कट लगा लें।',
            'तेल गरम करें और अंडों को सुनहरा होने तक हल्का तलें; फिर अलग रख दें।',
            'उसी तेल में खड़े मसाले (जीरा, तेजपत्ता, दालचीनी, बड़ी इलायची) डालें और प्याज को हल्का भूरा होने तक भूनें।',
            'अदरक-लहसुन पेस्ट और हरी मिर्च डालें। 2 मिनट तक भूनें।',
            'टमाटर की प्यूरी डालें और कालसा स्पाइस मिक्स, हल्दी और नमक मिलाएं।',
            'मसाले से तेल अलग होने तक पकाएं।',
            '1.5 कप पानी डालें और उबाल आने दें।',
            'अंडे डालें और ग्रेवी गाढ़ी होने तक 5 मिनट तक पकने दें।',
            'ताजा धनिया से सजाएं।'
        ]
    },
    {
        id: 4,
        slug: 'homestyle-matar-paneer',
        title: 'Homestyle Matar Paneer',
        category: 'Matar Paneer',
        image: '/recipe_photos/matarpaneer.png',
        summary: 'Soft paneer cubes and green peas in a creamy, spiced tomato gravy.',
        prepTime: '15 mins',
        cookTime: '20 mins',
        servings: '3-4',
        difficulty: 'Easy',
        author: 'Kalsa Kitchen',
        date: 'Feb 12, 2026',
        description: 'A staple of North Indian cuisine, this Matar Paneer is light, nutritious, and packed with the goodness of organic peas and paneer.',
        ingredients: [
            '200g Paneer cubes',
            '1 cup Green peas (fresh or frozen)',
            '2 Onions, pureed',
            '2 Tomatoes, pureed',
            '1 tsp Ginger-garlic paste',
            '2 tsp Kalsa’s Spice Mix Masala',
            '1/2 tsp Turmeric powder',
            '1/2 cup Fresh cream or milk (optional)',
            '2 tbsp Oil or Ghee',
            'Salt and sugar to taste'
        ],
        steps: [
            'Heat oil/ghee and lightly sauté paneer cubes until edges are golden; soak in warm water for softness.',
            'In a pan, sauté onion puree until golden brown.',
            'Add ginger-garlic paste and cook for a minute.',
            'Add tomato puree and spices (Kalsa Masala, turmeric, salt). Cook until oil separates.',
            'Add green peas and 1/2 cup water. Cook for 5 mins.',
            'Add the paneer cubes and simmer for another 5 mins.',
            'Stir in fresh cream for a rich texture and garnish with coriander.'
        ]
    },
    {
        id: 5,
        slug: 'chicken-curry',
        title: 'Chicken Curry',
        category: 'Chicken Curry',
        image: '/recipe_photos/ChickenCurry.png',
        summary: 'Tender chicken pieces slow-cooked in a traditional Masala gravy.',
        prepTime: '20 mins',
        cookTime: '40 mins',
        servings: '4',
        difficulty: 'Medium',
        author: 'Kalsa Kitchen',
        date: 'Feb 12, 2026',
        description: 'A classic, hearty chicken curry made with fresh organic spices that bring out the true flavors of traditional Indian cooking.',
        ingredients: [
            '500g Chicken, curry cut',
            '2 Large onions, sliced',
            '2 Tomatoes, chopped',
            '2 tbsp Ginger-garlic paste',
            '3 tsp Kalsa’s Spice Mix Masala',
            '1 tsp Red chili powder',
            '2 Bay leaves',
            '3 Cloves',
            '4 tbsp Oil',
            'Salt to taste'
        ],
        steps: [
            'Marinate chicken with a little salt, turmeric, and ginger-garlic paste for 30 mins.',
            'Heat oil in a heavy-bottomed pot. Add bay leaves and cloves.',
            'Add sliced onions and sauté until deep golden brown.',
            'Add ginger-garlic paste and tomatoes. Cook until soft.',
            'Add the marinated chicken and sear on high heat for 5 mins.',
            'Add Kalsa Spice Mix and chili powder. Stir well.',
            'Add 2 cups of water, cover, and cook on low-medium flame for 25-30 mins until chicken is tender.',
            'Adjust salt and garnish with plenty of fresh coriander.'
        ]
    }
];
