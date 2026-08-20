import express from "express";
import { playersService } from "../services/playersService.js";
import { playersRepo } from "../repos/players.js";
import { roundsService } from "../services/roundsService.js";
import { roundsRepo } from "../repos/rounds.js";
import { auth } from "./middleware.js";

const playersServices = playersService(playersRepo);
const roundServices = roundsService(roundsRepo);

export const router = express.Router();

router.post("/start-game", async (req, res) => {
    const result = await playersServices.createPlayer();
    res.status(201).send(result);
});

router.post("/start-round", auth, async (req, res) => {
        const bet = req.body.bet;
        const player = req.player;
        const result = await roundServices.create(player, bet);
        res.status(201).send(result);
});

router.post("/hit", auth, async (req, res) => {
    const player = req.player;
    const result = await roundServices.hit(player);
    res.status(201).send(result);
});

router.post("/stand", auth, async (req, res) => {
    const player = req.player;
    const result = await roundServices.stand(player);
    res.status(201).send(result);
});

router.get("/my-round", auth, async (req, res) => {
    const player = req.player;
    const result = await roundServices.myRound(player);
    res.status(200).send(result);
});
