import { Pokemon as PokemonPrisma, Stats as StatsPrisma } from "@prisma/client";

export class Pokemon {
    private id?: number;
    private name: string;
    private type: string;
    private stats: {hp:number, attack:number, defence:number, specialAttack:number, specialDefence:number, speed:number};
    private health: number;
    private canEvolve: boolean;

    constructor(pokemon: {
        id?: number;
        name: string;
        type: string;
        stats: {hp:number, attack:number, defence:number, specialAttack:number, specialDefence:number, speed:number};
        health: number;
        canEvolve: boolean;
    }) {
        // Validation checks
        if (pokemon.name == '') throw new Error('name is required.');
        if (pokemon.type == '') throw new Error('type is required.');
        if (pokemon.health < 0) throw new Error('health cannot be negative.');
        if (pokemon.stats.hp <= 0) throw new Error('hp cannot be smaller than or equal to 0.');
        if (pokemon.stats.attack <= 0) throw new Error('attack cannot be smaller than or equal to 0.');
        if (pokemon.stats.defence <= 0) throw new Error('defence cannot be smaller than or equal to 0.');
        if (pokemon.stats.specialAttack <= 0) throw new Error('special attack cannot be smaller than or equal to 0.');
        if (pokemon.stats.specialDefence <= 0) throw new Error('special defence cannot be smaller than or equal to 0.');
        if (pokemon.stats.speed <= 0) throw new Error('speed cannot be smaller than or equal to 0.');
        if (pokemon.stats.hp < pokemon.health) throw new Error('current health cannot be higher than hp.');

        // If all validation passes, assign properties
        this.id = pokemon.id;
        this.name = pokemon.name;
        this.type = pokemon.type;
        this.stats = pokemon.stats;
        this.health = pokemon.health;
        this.canEvolve = pokemon.canEvolve;
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getType(): string {
        return this.type;
    }

    getStats(): {hp:number, attack:number, defence:number, specialAttack:number, specialDefence:number, speed:number} {
        return this.stats;
    }

    getHealth(): number {
        return this.health;
    }

    getCanEvolve(): boolean {
        return this.canEvolve;
    }

    equals(pokemon: Pokemon): boolean {
        return (
            this.id === pokemon.getId() &&
            this.name === pokemon.getName() &&
            this.type === pokemon.getType() &&
            JSON.stringify(this.stats) === JSON.stringify(pokemon.getStats()) &&
            this.health === pokemon.getHealth() &&
            this.canEvolve === pokemon.getCanEvolve()
        );
    }

    static from(
        { id, name, type, health, canEvolve }: PokemonPrisma,
        stats: StatsPrisma
    ): Pokemon {
        return new Pokemon({
            id,
            name,
            type,
            stats: {
                hp: stats.hp,
                attack: stats.attack,
                defence: stats.defence,
                specialAttack: stats.specialAttack,
                specialDefence: stats.specialDefence,
                speed: stats.speed,
            },
            health,
            canEvolve,
        });
    }
}
