import { GymBattle } from '../../model/gymBattle'; // Adjust the import path accordingly
import { Badge } from '../../model/badge'; // Adjust the import path accordingly
import { Badge as BadgePrisma, GymBattle as GymBattlePrisma } from '@prisma/client';

describe('GymBattle Class', () => {
  
  // Mock badge data for creating GymBattle instances
  const badgeData = {
    id: 1,
    name: 'Boulder Badge',
    location: 'Pewter City',
    difficulty: 1,
  };

  const badge = new Badge(badgeData); // Create Badge instance

  // Mock GymBattle data
  const gymBattleData = {
    id: 1,
    date: new Date('2024-12-20T10:00:00Z'),
    time: new Date('2024-12-20T10:00:00Z'),
    badge: badge,
  };

  let gymBattle: GymBattle;

  beforeEach(() => {
    gymBattle = new GymBattle(gymBattleData);
  });

  test('should create a GymBattle instance with valid data', () => {
    expect(gymBattle).toBeInstanceOf(GymBattle);
    expect(gymBattle.getId()).toBe(1);
    expect(gymBattle.getDate()).toEqual(new Date('2024-12-20T10:00:00Z'));
    expect(gymBattle.getTime()).toEqual(new Date('2024-12-20T10:00:00Z'));
    expect(gymBattle.getBadge()).toBeInstanceOf(Badge);
    expect(gymBattle.getBadge().getName()).toBe('Boulder Badge');
  });

  test('should correctly compare two identical GymBattle instances', () => {
    const anotherGymBattle = new GymBattle(gymBattleData);
    expect(gymBattle.equals(anotherGymBattle)).toBe(true);
  });

  test('should return false for unequal GymBattle instances', () => {
    const differentGymBattleData = { ...gymBattleData, date: new Date('2024-12-21T10:00:00Z') };
    const differentGymBattle = new GymBattle(differentGymBattleData);
    expect(gymBattle.equals(differentGymBattle)).toBe(false);
  });

  test('should create a GymBattle instance using the from() static method', () => {
    const prismaGymBattleData: GymBattlePrisma = {
        id: 1,
        date: new Date('2024-12-20T10:00:00Z'),
        time: new Date('2024-12-20T10:00:00Z'),
        badgeId: 1,
        trainerId: 1
    };

    const prismaBadgeData: BadgePrisma = {
        id: 1,
        name: 'Boulder Badge',
        location: 'Pewter City',
        difficulty: 1,
        trainerId: 1
    };

    const createdGymBattle = GymBattle.from({
      ...prismaGymBattleData,
      badge: prismaBadgeData,
    });

    expect(createdGymBattle).toBeInstanceOf(GymBattle);
    expect(createdGymBattle.getId()).toBe(prismaGymBattleData.id);
    expect(createdGymBattle.getDate()).toEqual(prismaGymBattleData.date);
    expect(createdGymBattle.getTime()).toEqual(prismaGymBattleData.time);
    expect(createdGymBattle.getBadge()).toBeInstanceOf(Badge);
    expect(createdGymBattle.getBadge().getName()).toBe('Boulder Badge');
  });
});
