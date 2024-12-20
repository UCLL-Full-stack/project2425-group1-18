import { Badge as BadgePrisma } from "@prisma/client";

export class Badge {
    private id?: number;
    private name: string;
    private location: string;
    private difficulty: number;

    constructor(badge: {
        id?: number;
        name: string;
        location: string;
        difficulty: number;
    }) {

        if (badge.name.trim() === "") throw new Error("badge name is required");
        if (badge.difficulty <= 0 || badge.difficulty > 5) throw new Error("difficulty must be between 1 and 5");
        if (badge.location.trim() === "") throw new Error("location is required");

        this.id = badge.id;
        this.name = badge.name;
        this.location = badge.location;
        this.difficulty = badge.difficulty;
    }

    getId(): number | undefined {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getLocation(): string {
        return this.location;
    }

    getDifficulty(): number {
        return this.difficulty;
    }

    equals(badge: Badge): boolean {
        return (
            this.id === badge.getId() &&
            this.name === badge.getName() &&
            this.location === badge.getLocation() &&
            this.difficulty === badge.getDifficulty()
        );
    }

    static from({ id, name, location, difficulty }: BadgePrisma) {
        return new Badge({
            id,
            name,
            location,
            difficulty,
        });
    }
}
