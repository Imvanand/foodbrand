export interface Recipe {
    id: number;
    slug: string;
    title: string;
    category: string;
    image: string;
    summary: string;
    prepTime: string;
    cookTime: string;
    servings: string;
    difficulty: string;
    author: string;
    date: string;
    description: string;
    ingredients: string[];
    steps: string[];
}

export const recipes: Recipe[] = [
    {
        id: 1,
        slug: 'mix-vegetable',
        title: 'Mix Vegetable',
        category: 'Mix Veg',
        image: '/recipe_photos/Mixveg.png',
        summary: 'A wholesome and colorful mix of seasonal vegetables cooked in aromatic spices.',
        prepTime: '20 mins',
        cookTime: '25 mins',
        servings: '3-4',
        difficulty: 'Medium',
        author: 'Kalsa Kitchen',
        date: 'Feb 12, 2026',
        description: 'A delicious and healthy mix of fresh vegetables like cauliflower, potatoes, carrots, and peas cooked with paneer and aromatic spices. Perfect for a hearty meal.',
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
        ]
    },
    {
        id: 2,
        slug: 'aloo-dum',
        title: 'Aloo Dum',
        category: 'Aloo Dum',
        image: '/recipe_photos/AlooDum.png',
        summary: 'Baby potatoes simmered in a rich, spiced curd-based gravy.',
        prepTime: '15 mins',
        cookTime: '30 mins',
        servings: '3-4',
        difficulty: 'Medium',
        author: 'Kalsa Kitchen',
        date: 'Feb 12, 2026',
        description: 'A classic Kashmiri delicacy featuring golden-fried baby potatoes cooked in a velvety yogurt gravy infused with dry ginger and fennel powders.',
        ingredients: [
            '500g Baby potatoes',
            '1 cup Thick curd (whisked)',
            '1 tsp Ginger-garlic paste',
            '2 tsp Kalsa’s Spice Mix Masala',
            '1 tsp Kashmiri red chili powder',
            '1/2 tsp Turmeric powder',
            '1 tsp Fennel powder',
            '1/2 tsp Dry ginger powder',
            'Oil for deep frying',
            'Salt to taste'
        ],
        steps: [
            'Wash, boil, and peel the baby potatoes. Prick them with a fork.',
            'Deep fry the potatoes until they are golden brown and crispy.',
            'In a bowl, mix the whisked curd with chili powder, turmeric, fennel, and ginger powder.',
            'Heat 2 tbsp oil in a pan. Sauté ginger-garlic paste.',
            'Lower the flame and add the curd mixture. Stir continuously to prevent curdling.',
            'Cook until oil separates from the masala.',
            'Add Fried potatoes and 1 cup of water. Cover and simmer for 10-12 mins.',
            'Garnish and serve hot with naan or rice.'
        ]
    },
    {
        id: 3,
        slug: 'classic-egg-curry',
        title: 'Classic Egg Curry',
        category: 'Egg Curry',
        image: '/recipe_photos/EggCurry.png',
        summary: 'Hard-boiled eggs in a savory tomato-onion gravy with aromatic spices.',
        prepTime: '10 mins',
        cookTime: '20 mins',
        servings: '2-3',
        difficulty: 'Easy',
        author: 'Kalsa Kitchen',
        date: 'Feb 12, 2026',
        description: 'A simple yet flavorful egg curry that pairs perfectly with steamed rice or parathas. The key is in the slow-cooked onion-tomato base.',
        ingredients: [
            '4 Hard-boiled eggs',
            '2 Onions, finely chopped',
            '2 Tomatoes, pureed',
            '1 tsp Ginger-garlic paste',
            '2 tsp Kalsa’s Spice Mix Masala',
            '1/2 tsp Turmeric powder',
            '2 Green chillies, slit',
            'Fresh coriander for garnish',
            '3 tbsp Oil',
            'Salt to taste'
        ],
        steps: [
            'Peel the boiled eggs and make light slits on the sides.',
            'Heat oil and lightly fry the eggs until golden-yellow; set aside.',
            'In the same oil, sauté onions until translucent.',
            'Add ginger-garlic paste and green chillies. Sauté for 2 mins.',
            'Pour in tomato puree and add Kalsa Spice Mix, turmeric, and salt.',
            'Cook until the masala leaves the edges of the pan.',
            'Add 1.5 cups of water and bring to a boil.',
            'Add the eggs, simmer for 5 mins until the gravy thickens.',
            'Garnish with fresh coriander.'
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
