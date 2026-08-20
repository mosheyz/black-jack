import { playersRepo } from "../repos/players.js";
import { roundsRepo } from "../repos/rounds.js";

export function getCard() {
    const ranks = ["A", 2, 3, 4, 5, 6, 7, 8, 9, "J", "Q", "K"];
    const suits = ["diamonds", "hearts", "clubs", "spades"];
    return {
        rank: ranks[Math.floor(Math.random() * 12)],
        suit: suits[Math.floor(Math.random() * 4)],
    };
}

export async function existInProgress(id) {
    const result = await roundsRepo.findActiveByPlayerId(id);
    return result;
}

export function calculateCards(cards) {
    let aceCounter = 0;
    const total = cards.reduce((sum, card) => {
        if (["J", "Q", "K"].includes(card.rank)) {
            sum += 10;
        } else if (card.rank === "A") {
            aceCounter += 1;
            sum += 11;
        } else sum += card.rank;

        if (sum > 21 && aceCounter) {
            sum -= 10;
            aceCounter -= 1;
        }
        return sum;
    }, 0);

    return total;
}

export function playDealerTurn(cards) {
    let total = calculateCards(cards);
    while (total <= 17) {
        cards.push(getCard());
        total = calculateCards(cards);
    }
    return { cards: cards, total };
}
