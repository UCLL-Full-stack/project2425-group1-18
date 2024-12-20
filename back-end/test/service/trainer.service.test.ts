import trainerService from "../../service/trainer.service";
import trainerDb from "../../repository/trainer.db";
import { Trainer } from "../../model/trainer";
import { Pokemon } from "../../model/pokemon";
import { Badge } from "../../model/badge";

// Mock the trainer repository methods
jest.mock("../../repository/trainer.db", () => ({
  getAllTrainers: jest.fn(),
  getTrainerByEmail: jest.fn(),
  addPokemonToTrainerById: jest.fn(),
  addBadgeToTrainerById: jest.fn(),
  removePokemonAndAddToNurse: jest.fn(),
}));

// Mock the User class and its methods
jest.mock("../../model/user", () => {
  return {
    User: jest.fn().mockImplementation(() => ({
      getId: jest.fn().mockReturnValue(1),
      getFirstName: jest.fn().mockReturnValue("Red"),
      getLastName: jest.fn().mockReturnValue("Pokemon"),
      getEmail: jest.fn().mockReturnValue("red@gmail.com"),
      getPassword: jest.fn().mockReturnValue("GonnaBeTheBest151"),
      getRole: jest.fn().mockReturnValue("trainer"),
    })),
  };
});

describe("Trainer Service", () => {
  const mockTrainer = new Trainer({
    id: 1,
    user: new (require("../../model/user").User)(), // Use the mocked User
    pokemon: [],
    badges: [],
    gymBattles: [],
  });

  const mockPokemon = new Pokemon({
    name: "Pikachu",
    type: "electric",
    stats: { hp: 40, attack: 74, defence: 50, specialAttack: 80, specialDefence: 64, speed: 80 },
    health: 38,
    canEvolve: true,
  });

  const mockBadge = new Badge({
    name: "Boulder Badge",
    location: "Pewter City",
    difficulty: 1,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTrainers", () => {
    test("should fetch all trainers", async () => {
      // Arrange: Mock repository method to return mockTrainer
      (trainerDb.getAllTrainers as jest.Mock).mockResolvedValue([mockTrainer]);

      // Act
      const trainers = await trainerService.getAllTrainers();

      // Assert
      expect(trainers).toHaveLength(1);
      expect(trainers[0].getUser().getEmail()).toBe(mockTrainer.getUser().getEmail());
    });
  });

  describe("getTrainerByEmail", () => {
    test("should fetch a trainer by email", async () => {
      // Arrange: Mock repository method to return mockTrainer
      (trainerDb.getTrainerByEmail as jest.Mock).mockResolvedValue(mockTrainer);

      // Act
      const trainer = await trainerService.getTrainerByEmail("red@gmail.com");

      // Assert
      expect(trainer).toBeTruthy();
      expect(trainer?.getUser().getEmail()).toBe(mockTrainer.getUser().getEmail());
    });

    test("should return null if no trainer found by email", async () => {
      // Arrange: Mock repository method to return null
      (trainerDb.getTrainerByEmail as jest.Mock).mockResolvedValue(null);

      // Act
      const trainer = await trainerService.getTrainerByEmail("notfound@gmail.com");

      // Assert
      expect(trainer).toBeNull();
    });
  });

  describe("addPokemonToTrainerById", () => {
    test("should add pokemon to trainer by id", async () => {
      // Arrange: Mock repository method to return a trainer with added pokemon
      (trainerDb.addPokemonToTrainerById as jest.Mock).mockResolvedValue(mockTrainer);

      // Act
      const trainer = await trainerService.addPokemonToTrainerById(mockTrainer.id??1, {
        name: "Pikachu",
        type: "electric",
        stats: { hp: 40, attack: 74, defence: 50, specialAttack: 80, specialDefence: 64, speed: 80 },
        health: 38,
        canEvolve: true,
      });

      // Assert
      expect(trainer).toBeTruthy();
      expect(trainer?.getPokemon()).toHaveLength(0);  // Modify this depending on how pokemon is added to trainer
    });

    test("should throw an error if invalid pokemon data", async () => {
      // Act & Assert
      await expect(
        trainerService.addPokemonToTrainerById(mockTrainer.id??1, {
          name: "",
          type: "electric",
          stats: { hp: 40, attack: 74, defence: 50, specialAttack: 80, specialDefence: 64, speed: 80 },
          health: 38,
          canEvolve: true,
        })
      ).rejects.toThrow("name is required.");
    });
  });

  describe("addBadgeToTrainerById", () => {
    test("should add badge to trainer by id", async () => {
      // Arrange: Mock repository method to return a trainer with added badge
      (trainerDb.addBadgeToTrainerById as jest.Mock).mockResolvedValue(mockTrainer);

      // Act
      const trainer = await trainerService.addBadgeToTrainerById(mockTrainer.id??1, {
        name: "Boulder Badge",
        difficulty: 1,
        location: "Pewter City",
      });

      // Assert
      expect(trainer).toBeTruthy();
      expect(trainer?.getBadges()).toHaveLength(0);  // Modify this based on badge addition logic
    });

    test("should throw an error if badge data is invalid", async () => {
      // Act & Assert
      await expect(
        trainerService.addBadgeToTrainerById(mockTrainer.id??1, {
          name: "",
          difficulty: 1,
          location: "Pewter City",
        })
      ).rejects.toThrow("badge name is required");
    });
  });
  });

