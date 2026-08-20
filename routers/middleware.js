import { playersRepo } from "../repos/players.js";


export const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url} called`)
    next()
}

export const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500).send({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

export const auth = async (req, res, next) => {
    const playerId = req.headers["x-player-id"];
    if (!playerId) {
        const err = new Error("Missing player id");
        err.status = 401;
        throw err;
    }

    const player = await playersRepo.findById(playerId);
    if (!player) {
        const err = new Error("Player not found");
        err.status = 401;
        throw err;
    }
    
    req.player = player;
    next();
};
