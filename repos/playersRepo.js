import { Collection, ObjectId } from "mongodb";
import { dbConnection } from "../db/mongo.js";

const players = dbConnection.collection("players");

export const playersRepo = {
    create: async (player) => {
        const data = await players.insertOne(player);
        return data.insertedId.toString();
    },

    findById: async (id) => {
        const data = await players.findOne({ _id: new ObjectId(id) });
        data._id = data._id.toString();
        return data;
    },

    updateChips: async (playerId, amount) => {
        const result = await players.findOneAndUpdate(
            { _id: new ObjectId(playerId) },
            { $inc: { chips: amount } },
            { returnDocument: "after" },
        );
        return result
         
    },
};
