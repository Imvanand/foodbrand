"use server";

import fs from 'fs';
import path from 'path';

export async function getProductImages() {
    const imagesDirectory = path.join(process.cwd(), 'public/product_images');

    try {
        if (!fs.existsSync(imagesDirectory)) {
            return [];
        }

        const fileNames = fs.readdirSync(imagesDirectory);

        // Filter for image files and exclude hidden files like .DS_Store
        const imageFiles = fileNames.filter(fileName => {
            const ext = path.extname(fileName).toLowerCase();
            return (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp' || ext === '.svg')
                && !fileName.startsWith('.');
        });

        // Map to public URLs
        return imageFiles.map(fileName => `/product_images/${fileName}`);
    } catch (error) {
        console.error("Error reading product images directory:", error);
        return [];
    }
}

export async function getSliderImages() {
    const imagesDirectory = path.join(process.cwd(), 'public/Slider');

    try {
        if (!fs.existsSync(imagesDirectory)) {
            return [];
        }

        const fileNames = fs.readdirSync(imagesDirectory);

        const imageFiles = fileNames.filter(fileName => {
            const ext = path.extname(fileName).toLowerCase();
            return (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp' || ext === '.svg')
                && !fileName.startsWith('.');
        });

        return imageFiles.map(fileName => `/Slider/${fileName}`);
    } catch (error) {
        console.error("Error reading slider images directory:", error);
        return [];
    }
}
