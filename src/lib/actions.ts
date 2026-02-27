"use server";

import fs from 'fs';
import path from 'path';

export async function getProductImages() {
    const imagesDirectory = path.join(process.cwd(), 'public/Product_images');

    try {
        if (!fs.existsSync(imagesDirectory)) {
            console.warn("Directory not found:", imagesDirectory);
            return [];
        }

        const fileNames = fs.readdirSync(imagesDirectory);

        // Filter for image files and exclude hidden files like .DS_Store
        const imageFiles = fileNames.filter(fileName => {
            const ext = path.extname(fileName).toLowerCase();
            return (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp' || ext === '.svg')
                && !fileName.startsWith('.');
        });

        // Map to public URLs with cache busting
        return imageFiles.map(fileName => {
            const filePath = path.join(imagesDirectory, fileName);
            const stats = fs.statSync(filePath);
            return `/Product_images/${fileName}?v=${stats.mtimeMs}`;
        });
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

        return imageFiles.map(fileName => {
            const filePath = path.join(imagesDirectory, fileName);
            const stats = fs.statSync(filePath);
            return `/Slider/${fileName}?v=${stats.mtimeMs}`;
        });
    } catch (error) {
        console.error("Error reading slider images directory:", error);
        return [];
    }
}
