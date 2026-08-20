import { MongoClient } from "mongodb";
import "dotenv/config";


async function connectToMongo() {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect()
        console.log("Connected successfully to MongoDB!")
        const db = client.db("black-jack");
        return db;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        await client.close();
        throw error
    }
}

export const dbConnection = await connectToMongo();
