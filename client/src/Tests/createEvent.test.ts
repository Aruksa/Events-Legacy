import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createEvent } from "@/services/eventService";

describe("createEvent service", () => {
  let mock: InstanceType<typeof MockAdapter>;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should post event data successfully", async () => {
    const mockData = "Event created successfully";

    const eventData = {
      title: "Test Event",
      details: "Detailed description of the event.",
      location: "Event Location",
      startDate: "2024-01-01T10:00:00.000Z",
      endDate: "2024-01-01T12:00:00.000Z",
      genreId: [1, 2],
      thumbnailUrl: "https://example.com/image.jpg",
    };
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkaHJ1Ym9AZ21haWwuY29tIiwiaWF0IjoxNzMxOTM0MTMxLCJleHAiOjE3MzIwMjA1MzF9.lt19xDwom1Tjf6qxjTuLlhiZzlW2RNglQUhUXXk9DTQ";

    // Mock the POST request
    mock.onPost("/events").reply(201, mockData);

    // Call the createEvent function
    const response: any = await createEvent(eventData, token);

    // Assert the response
    expect(response.message).toEqual(mockData);
  });

  it("should throw an error if the request fails", async () => {
    const eventData = {
      title: "Test Event",
    };
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkaHJ1Ym9AZ21haWwuY29tIiwiaWF0IjoxNzMxOTM0MTMxLCJleHAiOjE3MzIwMjA1MzF9.lt19xDwom1Tjf6qxjTuLlhiZzlW2RNglQUhUXXk9DTQ";

    // Mock the POST request to return a 400 error
    mock.onPost("/events").reply(400);

    // Call the createEvent function and expect it to throw an error
    await expect(createEvent(eventData, token)).rejects.toThrow(
      "Request failed with status code 400"
    );
  });
});
