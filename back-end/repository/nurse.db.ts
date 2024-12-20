import database from "../util/database"; 
import { Nurse } from "../model/nurse"; 


const getAllNurse = async (): Promise<Nurse[]> => {
    const nursePrisma = await database.nurse.findMany({
        include:{
            user: true,
            pokemon: {include: {stats:true}},
        },
    });

    return nursePrisma.map((nursePrisma) => {
        return Nurse.from({
            ...nursePrisma,
        });
    });
};

const getNurseByEmail = async (email: string): Promise<Nurse | null> => {

    const user = await database.user.findFirst({
        where: { email },
    });

    if (!user) {
        throw new Error(`User with email${email} not found.`);
    }


    const nursePrisma = await database.nurse.findFirst({ 
        where: {
            userId: user.id, 
        },
        include: {
            user: true,
            pokemon: {
                include: {
                    stats: true,
                },
            },
        },
    });

    if (!nursePrisma) {
        throw new Error(`nurse with userId ${user.id} not found.`);
    }


    return Nurse.from({
        ...nursePrisma,
        
    });
};

import { Pokemon } from "../model/pokemon";
import { Trainer } from "../model/trainer";


const healPokemon = async (id: number): Promise<Pokemon> => {

    const pokemonWithStats = await database.pokemon.findUnique({
        where: {
            id,
        },
        include: {
            stats: true,
        },
    });


    if (!pokemonWithStats) {
        throw new Error(`Pokemon with ID ${id} not found.`);
    }


    const healedPokemon = Pokemon.from(pokemonWithStats, pokemonWithStats.stats);


    const newHealth = pokemonWithStats.stats.hp;


    await database.pokemon.update({
        where: { id },
        data: {
            health: newHealth,
        },
    });


    return new Pokemon({
        id: healedPokemon.getId(),
        name: healedPokemon.getName(),
        type: healedPokemon.getType(),
        stats: healedPokemon.getStats(),
        health: newHealth,
        canEvolve: healedPokemon.getCanEvolve(),
    });
};

const removePokemonFromNurse = async ({
    idPokemon,
}: { idPokemon: number }): Promise<Pokemon> => {

    const pokemon = await database.pokemon.findUnique({
        where: { id: idPokemon },
        include: { nurse: true }, 
    });

    if (!pokemon) {
        throw new Error(`Pokemon with id ${idPokemon} does not exist.`);
    }

    if (!pokemon.nurse) {
        throw new Error(`Pokemon with id ${idPokemon} is not assigned to any nurse.`);
    }

    await database.pokemon.update({
        where: { id: idPokemon },
        data: {
            nurse: { disconnect: true }, 
        },
    });

    const updatedPokemon = await database.pokemon.findUnique({
        where: { id: idPokemon },
        include: { nurse: true, stats: true }, 
    });

    if (!updatedPokemon) {
        throw new Error(`Pokemon with id ${idPokemon} could not be found after update.`);
    }


    return new Pokemon(updatedPokemon); 
};


const addPokemonToTrainer = async ({
    idPokemon,
}: { idPokemon: number }): Promise<Trainer> => {
    const pokemon = await database.pokemon.findUnique({
        where: { id: idPokemon },
        include: {
            nurse: true,          
        },
    });

    if (!pokemon) {
        throw new Error(`Pokémon with id ${idPokemon} does not exist.`);
    }

    if (!pokemon.previousTrainerId) {
        throw new Error(`Pokémon with id ${idPokemon} does not have a previous trainer.`);
    }

    if (!pokemon.nurseId) {
        throw new Error(`Pokémon with id ${idPokemon} is not currently assigned to any Nurse.`);
    }

    const previousTrainer = await database.trainer.findUnique({
        where: { id: pokemon.previousTrainerId },
        include: {
            pokemon: true,
        },
    });

    if (!previousTrainer) {
        throw new Error(`Trainer with id ${pokemon.previousTrainerId} does not exist.`);
    }

    await database.pokemon.update({
        where: { id: idPokemon },
        data: {
            trainer: {
                connect: { id: pokemon.previousTrainerId },
            },
            previousTrainerId: pokemon.trainerId, 
        },
    });

    const updatedTrainer = await database.trainer.findUnique({
        where: { id: pokemon.previousTrainerId },
        include: {
            user: true,
            pokemon: { include: { stats: true } },
            gymBattles: true,
            badges: true,
        },
    });

    if (!updatedTrainer) {
        throw new Error(`Failed to retrieve updated trainer with id ${pokemon.previousTrainerId}.`);
    }

    return Trainer.from({
        ...updatedTrainer,
        badge: updatedTrainer.badges,
        gymBattle: updatedTrainer.gymBattles,
    });
};









export default { getAllNurse, getNurseByEmail,healPokemon,removePokemonFromNurse,addPokemonToTrainer };
