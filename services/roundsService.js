import { playDealerTurn, calculateCards, getCard } from "./utils.js";

export function roundsService(roundsRepo, playersRepo) {
    async function existInProgress(id) {
        const result = await roundsRepo.findActiveByPlayerId(id);
        return result;
    }
    
    return {
        create: async (player, bet) => {
            if (bet <= 0 || bet > player.chips) {
                const err = new Error("invalid bet");
                err.status = 400;
                throw err;
            }

            const exist = await existInProgress(player._id);
            if (exist) {
                const err = new Error("already have round in progress");
                err.status = 409;
                throw err;
            }

            const playerCards = [getCard(), getCard()];
            const dealerCards = [getCard(), getCard()];

            const updatedPlayer = await playersRepo.updateChips(
                player._id,
                -bet,
            );

            const round = {
                playerId: player._id,
                bet,
                playerCards,
                dealerCards,
                status: "in_progress",
                createdAt: new Date().toISOString(),
            };

            const result = await roundsRepo.create(round);

            return {
                roundId: result,
                playerCards,
                dealerUpCard: dealerCards[0],
                chips: updatedPlayer.chips,
            };
        },

        hit: async (player) => {
            const existRound = await existInProgress(player._id);
            if (!existRound) {
                const err = new Error("No round in progress");
                err.status = 404;
                throw err;
            }
            existRound.playerCards.push(getCard());
            const total = calculateCards(existRound.playerCards);
            if (total > 21) {
                await roundsRepo.update(existRound._id, {
                    status: "player_bust",
                });
            }
            const result = await roundsRepo.update(existRound._id, {
                playerCards: existRound.playerCards,
            });
            return {
                playerCards: result.playerCards,
                playerTotal: total,
                status: result.status,
                chips: player.chips,
            };
        },

        stand: async (player) => {
            const existRound = await existInProgress(player._id);
            if (!existRound) {
                const err = new Error("No round in progress");
                err.status = 404;
                throw err;
            }

            const { cards: updatedDealerCards, total: dealerTotal } =
                playDealerTurn(existRound.dealerCards);
            const playerTotal = calculateCards(existRound.playerCards);

            let updatedPlayer;
            if (dealerTotal > 21) {
                existRound.status = "dealer_bust";
                updatedPlayer = await playersRepo.updateChips(
                    player._id,
                    existRound.bet * 2,
                );
            } else if (playerTotal > dealerTotal) {
                existRound.status = "player_win";
                updatedPlayer = await playersRepo.updateChips(
                    player._id,
                    existRound.bet * 2,
                );
            } else if (dealerTotal > playerTotal) {
                existRound.status = "dealer_win";
                updatedPlayer = player;
            } else {
                existRound.status = "push";
                updatedPlayer = await playersRepo.updateChips(
                    player._id,
                    existRound.bet,
                );
            }

            const result = await roundsRepo.update(existRound._id, {
                status: existRound.status,
                dealerCards: updatedDealerCards,
            });
            return {
                playerCards: result.playerCards,
                dealerCards: result.dealerCards,
                dealerTotal,
                playerTotal,
                status: result.status,
                chips: updatedPlayer.chips,
            };
        },

        myRound: async (player) => {
            const existRound = await existInProgress(player._id);
            if (!existRound) {
                return { round: null };
            }
            return existRound;
        },
    };
}
