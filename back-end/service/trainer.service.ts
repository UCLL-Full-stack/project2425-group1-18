import { AuthenticationResponse, PokemonInput } from "../types";
import { Trainer } from "../model/trainer";
import trainerDb from "../repository/trainer.db";
import { Pokemon } from "../model/pokemon";
import { User } from "../model/user";
import bcrypt from 'bcrypt';
import { Nurse } from "@prisma/client";
import { id } from "date-fns/locale";


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
    if (name=='') throw new Error('name is required.');
    if (type=='') throw new Error('type is required.')
    if (health <0) throw new Error('health cannot be negative.');
    if (stats.hp <= 0) throw new Error('hp cannot be smaller then or equal to 0.');
    if (stats.attack <= 0) throw new Error('attack cannot be smaller then or equal to 0.');
    if (stats.defence <= 0) throw new Error('defence cannot be smaller then or equal to 0.');
    if (stats.specialAttack <= 0) throw new Error('special attack cannot be smaller then or equal to 0.');
    if (stats.specialDefence <= 0) throw new Error('special defence cannot be smaller then or equal to 0.');
    if (stats.speed <= 0) throw new Error('speed cannot be smaller then or equal to 0.');
    if (stats.hp < health) throw new Error('current health cannot be higher then hp.');

    //hier boven is een domain test en geen service test 

    const pokemon = new Pokemon({name:name,type:type,stats:stats,health:health,canEvolve:canEvolve})
    const trainer = trainerDb.addPokemonToTrainerById({id, pokemon});
    if (!trainer) throw new Error(`Trainer with id ${id} does not exist.`);
    return trainer;
}

const removePokemonAndAddToNurse = async (idPokemon:number,idNurse:number): Promise<Trainer> => {
    const trainer = await trainerDb.removePokemonAndAddToNurse({idPokemon,idNurse});
    return trainer
}


export default {
    getAllTrainers,
    getTrainerByEmail,
    addPokemonToTrainerById,
    removePokemonAndAddToNurse,
};
