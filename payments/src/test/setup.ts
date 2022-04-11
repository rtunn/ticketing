import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

jest.setTimeout(10000);

let mongoServer: MongoMemoryServer;

jest.mock("../nats-wrapper");

process.env.STRIPE_KEY =
  "sk_test_51KnB4UL4wHEjjtVL0lf2BsaV4Hz1nPk3rGioaSfRzzUnRY6PQXqHVeaUaaNM3e8wFgHOw0PkNcp1RQu5sA1blkOc00Cc6vYMeB";

beforeAll(async () => {
  process.env.JWT_KEY = "adsfasdf";
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.resetAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
