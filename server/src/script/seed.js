const { faker } = require("@faker-js/faker");
const { Event, EventGenre } = require("../models");

const seedEvents = async (numEvents, batchSize = 1000) => {
  try {
    const genres = [1, 2, 3, 4, 5, 6, 7];
    const totalBatches = Math.ceil(numEvents / batchSize);

    for (let batch = 0; batch < totalBatches; batch++) {
      const events = [];
      const newEventData = [];

      for (let i = 0; i < batchSize && batch * batchSize + i < numEvents; i++) {
        const eventData = {
          title: faker.lorem.words(),
          details: faker.lorem.paragraph(),
          thumbnailUrl: faker.image.url(),
          location: faker.location.city(),
          startDate: faker.date.future(),
          endDate: faker.date.future(),
          userId: faker.number.int({ min: 1, max: 10 }), // assuming 10 users
        };

        newEventData.push(eventData);
      }

      // Bulk insert events
      const createdEvents = await Event.bulkCreate(newEventData, {
        returning: true,
      });

      // Add genres to each event
      for (const event of createdEvents) {
        const numGenres = faker.number.int({ min: 1, max: 3 });
        const randomGenres = faker.helpers.arrayElements(genres, numGenres);
        console.log("randomgenre: ", randomGenres);
        for (const genre of randomGenres) {
          await EventGenre.create({
            eventId: event.id,
            genreId: genre,
          });
        }

        events.push(event);
      }

      console.log(`Batch ${batch + 1} processed successfully.`);
    }

    console.log(`${numEvents} events seeded successfully.`);
  } catch (error) {
    console.error("Error seeding events:", error);
  }
};

// Usage: call the function with 10,000 events and a batch size of 1000
seedEvents(10000, 1000);
