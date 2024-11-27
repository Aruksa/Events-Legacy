import client from "./config/elasticSearch";
const createEventIndex = async () => {
  const index = "events";
  const exists = await client.indices.exists({ index });
  if (!exists) {
    await client.indices.create({
      index,
      body: {
        mappings: {
          properties: {
            title: { type: "text" },
            details: { type: "text" },
            location: { type: "text" },
            thumbnailUrl: { type: "text" },
            genreId: { type: "integer" },
            visit: { type: "integer" },
            going: { type: "integer" },
            userId: { type: "integer" },
            startDate: { type: "date" },
            endDate: { type: "date" },
          },
        },
      },
    });
    console.log(`Index "${index}" created.`);
  } else {
    console.log(`Index "${index}" already exists.`);
  }
};
export default createEventIndex;
