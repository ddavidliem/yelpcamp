const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelpers');
const cities = require('./cities');

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp', {

})
    .then(() => {
        console.log('connected')
    })
    .catch((err) => {
        console.log('Connection Error');
        console.log(err);
    })


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const price = Math.floor(Math.random() * +20) + 10;
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '665e39528b8670ccd1adcecf',
            location: `${(cities[random1000].city)}, ${(cities[random1000].state)}`,
            title: `${sample(descriptors)}, ${sample(places)}`,
            image: [{
                url: 'https://res.cloudinary.com/dsbtugvtv/image/upload/v1718792548/YelpCamp/rxlczf1jnhoi5s7op5v1.jpg',
                filename: 'YelpCamp/rxlczf1jnhoi5s7op5v1',
            },
            {
                url: 'https://res.cloudinary.com/dsbtugvtv/image/upload/v1718792548/YelpCamp/hxcunophgsdrqaxilllf.jpg',
                filename: 'YelpCamp/hxcunophgsdrqaxilllf'
            }],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti, recusandae dignissimos, nihil, quasi iste iure necessitatibus excepturi reiciendis esse voluptatibus a velit ad. Non, cum nulla? Architecto blanditiis delectus ut.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})