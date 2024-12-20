import { User } from './user';
import { Pokemon } from './pokemon';

import {
    Nurse as NursePrisma,
    User as UserPrisma,
    Pokemon as PokemonPrisma,
    Stats as StatsPrisma
} from '@prisma/client';

export class Nurse {
    readonly id?: number;
    readonly user: User;
    readonly pokemon: Pokemon[];

    constructor(nurse: {
        id?: number;
        user: User;
        pokemon: Pokemon[];
    }) {
        this.id = nurse.id;
        this.user = nurse.user;
        this.pokemon = nurse.pokemon;
    }

    getId(): undefined | number {
        return this.id;
    }

    getUser(): User {
        return this.user;
    }

    getPokemon(): Pokemon[] {
        return this.pokemon;
    }

    equals(nurse: Nurse): boolean {
        return (
            this.id === nurse.getId() &&
            this.user.equals(nurse.getUser()) &&
            this.pokemon.length === nurse.getPokemon().length &&
            this.pokemon.every((pokemon, index) => pokemon.equals(nurse.getPokemon()[index]))
        );
    }

    static from({
        id,
        user,
        pokemon
    }: NursePrisma & {
        user: UserPrisma;
        pokemon: (PokemonPrisma & { stats: StatsPrisma })[];
    }): Nurse {
        return new Nurse({
            id,
            user: User.from(user), 
            pokemon: pokemon.map((pokemonData) =>
                Pokemon.from(pokemonData, pokemonData.stats) 
            )
        });
    }

}
