import { Badge } from '../../model/badge'; // Adjust the import path accordingly
import { Badge as BadgePrisma } from '@prisma/client';

describe('Badge Class', () => {

  const badgeData = {
    id: 1,
    name: 'Boulder Badge',
    location: 'Pewter City',
    difficulty: 1,
  };

  let badge: Badge;

  beforeEach(() => {
    badge = new Badge(badgeData);
  });

  test('should create a Badge instance with valid data', () => {
    expect(badge).toBeInstanceOf(Badge);
    expect(badge.getId()).toBe(1);
    expect(badge.getName()).toBe('Boulder Badge');
    expect(badge.getLocation()).toBe('Pewter City');
    expect(badge.getDifficulty()).toBe(1);
  });

  test('should correctly compare two identical Badge instances', () => {
    const anotherBadge = new Badge(badgeData);
    expect(badge.equals(anotherBadge)).toBe(true);
  });

  test('should return false for unequal Badge instances', () => {
    const differentBadgeData = { ...badgeData, name: 'Cascade Badge' };
    const differentBadge = new Badge(differentBadgeData);
    expect(badge.equals(differentBadge)).toBe(false);
  });

  test('should create a Badge instance using the from() static method', () => {
    const prismaBadgeData: BadgePrisma = {
        id: 1,
        name: 'Boulder Badge',
        location: 'Pewter City',
        difficulty: 1,
        trainerId: 1
    };

    const createdBadge = Badge.from(prismaBadgeData);

    expect(createdBadge).toBeInstanceOf(Badge);
    expect(createdBadge.getId()).toBe(prismaBadgeData.id);
    expect(createdBadge.getName()).toBe(prismaBadgeData.name);
    expect(createdBadge.getLocation()).toBe(prismaBadgeData.location);
    expect(createdBadge.getDifficulty()).toBe(prismaBadgeData.difficulty);
  });

});
