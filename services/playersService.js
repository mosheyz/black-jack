export function playersService(playersRepo) {
    return {
        createPlayer: async () => {
            const playerId = await playersRepo.create({
                chips: 1000,
                createdAt: new Date().toISOString(),
            });
            return playerId;
        },
    };
}
