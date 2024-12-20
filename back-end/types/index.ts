
type Role = "admin" | "trainer" | "nurse" ;



type PokemonStats = {
  hp: number;
  attack: number;
  defence: number;
  specialAttack: number;
  specialDefence: number;
  speed: number;
};


type Userinput = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
};


type Badge = {
  id?: number;
  name: string;
  location: string;
  difficulty: number;
};


type GymBattle = {
  id?: number;
  date: Date;
  time: Date;
  badge: Badge;
};


type PokemonInput = {
  id?: number;
  name: string;
  type: string;
  stats: PokemonStats;
  health: number;
  canEvolve: boolean;
};

type BadgeInput = {
  id?: number;
  name: string;
  location: string;
  difficulty: number;
};


type Trainer = {
  id?: number;
  user: Userinput;
  pokemon: PokemonInput[];
  badges: Badge[];
  gymBattles: GymBattle[];
};


type AuthenticationResponse = {
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
};



export {
  Role,
  PokemonStats,
  Userinput,
  Badge,
  GymBattle,
  PokemonInput,
  BadgeInput,
  Trainer,
  AuthenticationResponse,
};
