require('dotenv').config(); // Pastikan dotenv diimpor jika belum
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS;

async function fetchRandomPhoto() {
    const fetch = (await import('node-fetch')).default;
    try {
        const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${UNSPLASH_ACCESS_KEY}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data from Unsplash:', error);
        return null;
    }
}

module.exports = fetchRandomPhoto;