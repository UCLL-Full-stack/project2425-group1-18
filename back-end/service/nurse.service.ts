import { Pokemon } from '../model/pokemon';
import { Nurse } from '../model/nurse'; 
import nurseDb from '../repository/nurse.db';
import { Trainer } from '../model/trainer';


const getAllNurse = async (): Promise<Nurse[]> => nurseDb.getAllNurse();



const getNurseByEmail = async (email: string): Promise<Nurse | null> => {
    
    const nurse = await nurseDb.getNurseByEmail(email)
    return nurse;  
};

const healPokemon = async (id: number): Promise<Pokemon> => {
    const heal = await nurseDb.healPokemon(id); 
    return heal
};

const addPokemonToTrainer = async (
    idPokemon: number,
): Promise<Trainer> => {
    
    const trainer = await nurseDb.addPokemonToTrainer({idPokemon});
    return trainer; 
};

const removePokemonFromNurse = async (idPokemon: number): Promise<Pokemon>=>{
    const remove = await nurseDb.removePokemonFromNurse({idPokemon});
    return remove
}


export default {
    getAllNurse,
    getNurseByEmail,
    healPokemon,
    addPokemonToTrainer,
    removePokemonFromNurse,
};
