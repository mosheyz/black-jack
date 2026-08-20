import assert from "node:assert/strict";
import test, { describe, it, mock } from "node:test";
import { roundsService } from "../services/roundsService.js";
import { playersService } from "../services/playersService.js";

describe("start-round", () => {
    it("happy path: should return round details", async () => {
        const player = { _id: "123", chips: 1000 };
        const bet = 100;

        const mockRoundsRepo = {
            create: mock.fn(async () => "round-id"),
            findActiveByPlayerId: mock.fn(async () => null),
        };
        const mockPlayersRepo = {
            updateChips: mock.fn(async (id, amount) => {
                return { _id: id, chips: 900 };
            }),
        };

        const roundServices = roundsService(mockRoundsRepo, mockPlayersRepo);
        const result = await roundServices.create(player, bet);

        assert.deepEqual(
            { roundId: result.roundId, chips: result.chips },
            { roundId: "round-id", chips: 900 },
        );
    });
    it("error: invalid bet", async () => {
        const player = { _id: "123", chips: 1000 };
        const bet = 1500;

        const mockRoundsRepo = {};
        const mockPlayersRepo = {};

        const roundServices = roundsService(mockRoundsRepo, mockPlayersRepo);
        await assert.rejects(roundServices.create(player, bet), {
            status: 400,
        });
    });
    it("error: existing player", async () => {
        const player = { _id: "123", chips: 1000 };
        const bet = 100;

        const mockRoundsRepo = {
            findActiveByPlayerId: mock.fn(async () => "123"),
        };
        const mockPlayersRepo = {};

        const roundServices = roundsService(mockRoundsRepo, mockPlayersRepo);

        await assert.rejects(roundServices.create(player, bet), {
            status: 409,
        });
    });
    
});
