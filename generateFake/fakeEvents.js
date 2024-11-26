const axios = require('axios');
const { faker } = require('@faker-js/faker');

const userTokens = [
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJkaHJ1Ym9AZ21haWwuY29tIiwiaWF0IjoxNzMyNjE2NDIxLCJleHAiOjE3MzI3MDI4MjF9.sfMzo3tsIbzOUwZbk1M5f75txdSkdrKgsRKZXDx5Ofo",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbnVzaHVhQGdtYWlsLmNvbSIsImlhdCI6MTczMjYxNjgyMywiZXhwIjoxNzMyNzAzMjIzfQ.3gKDoawDKd1J4Cu-XqymO6FkxgtByyN3J8AV0ZVYkTU"
];

// Helper function to get a random future date
const getRandomFutureDate = (startDate, maxDaysAhead = 60) => {
  const date = new Date(startDate);
  const randomDays = faker.number.int({ min: 1, max: maxDaysAhead });
  date.setDate(date.getDate() + randomDays);
  return date.toISOString();
};

// Helper function to select two unique random numbers between 1 and 10
const getRandomCategories = () => {
  const categories = new Set();
  while (categories.size < 2) {
    categories.add(faker.number.int({ min: 1, max: 6 }));
  }
  return Array.from(categories).map(value => ({ value }))
};

// Function to create a fake event
const createFakeEvent = () => {
  const startDate = getRandomFutureDate(new Date(), 30); // Start date is within the next 30 days
  const endDate = getRandomFutureDate(new Date(startDate), 30); // End date is after start date

  return {
    title: faker.company.catchPhrase(),
    details: faker.lorem.sentence(),
    thumbnailUrl: faker.image.url({ width: 256, height: 256 }),
    location: faker.location.country(),
    startDate,
    endDate,
    genreId: getRandomCategories(),
  };
};

// Function to post a fake event for a specific user
const postFakeEvent = async (event, token) => {
  try {
    const response = await axios.post('http://127.0.0.1:3000/api/events', event, {
      headers: { 'Authorization': `bearer ${token}`},
    });
    console.log('Event created:', response.data);
  } catch (error) {
    console.error('Error creating event:', error.message);
  }
};

// Main function to generate and post 10 events for each user
const generateAndPostEvents = async () => {
  for (const token of userTokens) {
    console.log(`Generating events for user with token: ${token}`);

    const events = Array.from({ length: 10 }, createFakeEvent);
    for (const event of events) {
      await postFakeEvent(event, token);
    }
  }
};

// Run the script
generateAndPostEvents();