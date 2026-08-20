import { Collection, ObjectId } from "mongodb";
import { dbConnection } from "../db/mongo.js";

const rounds = dbConnection.collection("rounds");

export const roundsRepo = {
    create: async (round) => {
        round.playerId = new ObjectId(round.playerId);
        const data = await rounds.insertOne(round);
        return data.insertedId.toString();
    },

    findByPlayerId: async (playerId) => {
        const data = await rounds.findOne({
            playerId: new ObjectId(playerId),
        });
        data._id = data._id.toString();
        return data;
    },

    findById: async (id) => {
        const data = await rounds.findOne({ _id: new ObjectId(id) });
        data._id = data._id.toString();
        data.playerId = data.playerId.toString();
        return data;
    },

    findActiveByPlayerId: async (playerId) => {
        const data = await rounds.findOne({
            playerId: new ObjectId(playerId),
            status: "in_progress",
        });
        if (data) {
            data._id = data._id.toString();
            data.playerId = data.playerId.toString();
        }
        return data;
    },

    update: async (id, newData) => {
        const data = await rounds.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: newData },
            { returnDocument: "after" },
        );
        return data
    },
};
