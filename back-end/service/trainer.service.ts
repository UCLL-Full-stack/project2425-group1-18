import { AuthenticationResponse, BadgeInput, PokemonInput } from "../types";
import { Trainer } from "../model/trainer";
import trainerDb from "../repository/trainer.db";
import { Pokemon } from "../model/pokemon";
import { User } from "../model/user";
import bcrypt from 'bcrypt';
import { Nurse } from "@prisma/client";
import { id } from "date-fns/locale";
import { Badge } from "../model/badge";


const getAllTrainers = async (): Promise<Trainer[]> => trainerDb.getAllTrainers();




const getTrainerByEmail = async (email: string): Promise<Trainer| null > => {
    const trainer = await trainerDb.getTrainerByEmail(email);
    return trainer
}


const addPokemonToTrainerById = async (id:number,{
    name,
    type,
    stats,
    health,
    canEvolve
}:PokemonInput): Promise<Trainer | null> => {
    const pokemon = new Pokemon({name:name,type:type,stats:stats,health:health,canEvolve:canEvolve})
    const trainer = trainerDb.addPokemonToTrainerById({id, pokemon});
    if (!trainer) throw new Error(`Trainer with id ${id} does not exist.`);
    return trainer;
}

const addBadgeToTrainerById = async (id:number, {
    name,
    difficulty,
    location
}: BadgeInput) : Promise<Trainer | null> => {
    const badge = new Badge({name,location,difficulty})
    const trainer = trainerDb.addBadgeToTrainerById({id,badge});
    if (!trainer) throw new Error(`Trainer with id ${id} does not exist.`)
    return trainer
}

const removePokemonAndAddToNurse = async (idPokemon:number,idNurse:number): Promise<Trainer> => {
    const trainer = await trainerDb.removePokemonAndAddToNurse({idPokemon,idNurse});
    return trainer
}


export default {
    getAllTrainers,
    getTrainerByEmail,
    addPokemonToTrainerById,
    addBadgeToTrainerById,
    removePokemonAndAddToNurse,
};
