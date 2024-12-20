import database from "../../util/database";
import nurseService from "../../service/nurse.service";
import { Pokemon } from "../../model/pokemon";
import { Trainer } from "../../model/trainer";
import { Nurse } from "../../model/nurse";

// Mock the database interaction
jest.mock("../../util/database", () => ({
  nurse: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
  },
  user: {
    findFirst: jest.fn(),
  },
  pokemon: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  trainer: {
    findUnique: jest.fn(),
  },
}));

describe("Nurse Service", () => {
  
  const mockUser = {
    id: 1,
    firstName: "Nurse",
    lastName: "Joy",
    email: "nursejoy@example.com",
    password: "hashedPassword",
    role: "nurse",
  };

  const mockPokemon = {
    id: 1,
    name: "Pikachu",
    type: "Electric",
    stats: { 
      hp: 100, 
      attack: 50, 
      defence: 30, 
      specialAttack: 80, 
      specialDefence: 70, 
      speed: 90 
    },
    health: 100,
    canEvolve: true,
    statsId: 1,
    nurseId: 1,
    previousTrainerId:1,
  };

  const mockNurse = {
    id: 1,
    userId: 1,
    user: mockUser,
    pokemon: [mockPokemon],
  };

  // Test getAllNurse function
  test("should fetch all nurses with user and pokemon data", async () => {
    // Mock the database response
    (database.nurse.findMany as jest.Mock).mockResolvedValue([mockNurse]);

    const nurses = await nurseService.getAllNurse();

    expect(nurses).toHaveLength(1);
    expect(nurses[0].user.firstName).toBe("Nurse");
    expect(nurses[0].pokemon[0].getName()).toBe("Pikachu");
  });

  // Test getNurseByEmail function
  test("should fetch a nurse by email with user and pokemon data", async () => {
    (database.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
    (database.nurse.findFirst as jest.Mock).mockResolvedValue(mockNurse);

    const nurse = await nurseService.getNurseByEmail("nursejoy@example.com");

    expect(nurse).toBeTruthy();
    expect(nurse?.user.email).toBe("nursejoy@example.com");
    expect(nurse?.pokemon[0].getName()).toBe("Pikachu");
  });

  it("should throw an error when nurse is not found by email", async () => {
    (database.user.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(nurseService.getNurseByEmail("unknown@example.com"))
      .rejects
      .toThrow("User with emailunknown@example.com not found.");
  });

  // Test healPokemon function
  test("should heal a pokemon and set its health to hp stat", async () => {
    const healedPokemon = {
      ...mockPokemon,
      health: mockPokemon.stats.hp,
    };

    (database.pokemon.findUnique as jest.Mock).mockResolvedValue({
      ...mockPokemon,
      stats: mockPokemon.stats,
    });
    (database.pokemon.update as jest.Mock).mockResolvedValue(healedPokemon);

    const result = await nurseService.healPokemon(1);

    expect(result.getHealth()).toBe(100); // Health set to the hp stat value
  });

  it("should throw an error if pokemon is not found during healing", async () => {
    (database.pokemon.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(nurseService.healPokemon(999))
      .rejects
      .toThrow("Pokemon with ID 999 not found.");
  });

  // Test removePokemonFromNurse function

  test("should throw an error if pokemon is not assigned to any nurse", async () => {
    (database.pokemon.findUnique as jest.Mock).mockResolvedValue({ ...mockPokemon, nurseId: null });

    await expect(nurseService.removePokemonFromNurse(1))
      .rejects
      .toThrow("Pokemon with id 1 is not assigned to any nurse.");
  });

  // Test addPokemonToTrainer function
  test("should add a pokemon to the previous trainer", async () => {
    const trainer = {
      id: 1,
      user: mockUser,
      pokemon: [mockPokemon],
      gymBattles: [],
      badges: [],
    };

    (database.pokemon.findUnique as jest.Mock).mockResolvedValue({
      ...mockPokemon,
      previousTrainerId: 1,
    });
    (database.trainer.findUnique as jest.Mock).mockResolvedValue(trainer);
    (database.pokemon.update as jest.Mock).mockResolvedValue({ ...mockPokemon, trainerId: 1 });

    const result = await nurseService.addPokemonToTrainer(1);

    expect(result.getUser().firstName).toBe("Nurse");
    expect(result.getPokemon()[0].getName()).toBe("Pikachu");
  });

  test("should throw an error if pokemon does not have a previous trainer", async () => {
    (database.pokemon.findUnique as jest.Mock).mockResolvedValue({ ...mockPokemon, previousTrainerId: null });

    await expect(nurseService.addPokemonToTrainer(1))
      .rejects
      .toThrow("Pokémon with id 1 does not have a previous trainer.");
  });

  test("should throw an error if pokemon is not assigned to any nurse", async () => {
    (database.pokemon.findUnique as jest.Mock).mockResolvedValue({ ...mockPokemon, nurseId: null });

    await expect(nurseService.addPokemonToTrainer(1))
      .rejects
      .toThrow("Pokémon with id 1 is not currently assigned to any Nurse.");
  });
});
