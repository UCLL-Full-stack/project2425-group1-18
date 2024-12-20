
import { Badge, Pokemon, Trainer, User } from '@types';


const API_URL = process.env.NEXT_PUBLIC_API_URL;

const TrainerService = {
  getAllTrainers: async (): Promise<Trainer[]> => {
    const user = localStorage.getItem('loggedInUser');
    let token = null
    if (user){
      token = JSON.parse(user).token;
    }
    // Make the GET request to fetch trainers
    const response = await fetch(`${API_URL}/trainers`, {
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data as Trainer[]; 
  },



  getTrainerByEmail: async (email: string): Promise<Trainer> => {
    const user = localStorage.getItem('loggedInUser');
    let token = null
    if (user) {
      token =JSON.parse(user).token;
    }
    const response = await fetch(`${API_URL}/trainers/email?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
    });
    
    if (!response.ok) {
      const errorText = await response.text();  // Read response as text if error
      console.error('Error response:', errorText);
      throw new Error('Failed to fetch trainer data');
    }
    
    const data = await response.json();  // Parse the JSON if the response is OK
    return data as Trainer;
  },

  addPokemonToTrainerById: async(id:number,pokemon:Pokemon): Promise<Trainer> => {
    const user = localStorage.getItem('loggedInUser');
    let token = null
    if (user) {
      token =JSON.parse(user).token;
    }
    const response = await fetch(`${API_URL}/trainers/${id}`,{
      method: "POST",
      headers: {"content-type" : 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(pokemon)
    });
    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message || "validation error.")
      throw new Error('Failed to add pokemon to trainer.')
    }
    const trainer = await response.json();
    return trainer as Trainer;
  },

  addBadgeToTrainerById: async(id:number,badge:Badge): Promise<Trainer> => {
    const user = localStorage.getItem('loggedInUser');
    let token = null
    if (user) {
      token =JSON.parse(user).token;
    }
    const response = await fetch(`${API_URL}/trainers/${id}/badge`,{
      method: "POST",
      headers: {"content-type" : 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(badge)
    });
    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message || "validation error.")
      throw new Error('Failed to add badge to trainer.')
    }
    const trainer = await response.json();
    return trainer as Trainer;
  },

  transferPokemonToNurse: async (
    pokemonId: number,
    nurseId: number
  ): Promise<Trainer> => {
    const user = localStorage.getItem('loggedInUser');
    let token = null;

    if (user) {
      token = JSON.parse(user).token; // Retrieve JWT token from localStorage
    }

    const response = await fetch(
      `${API_URL}/trainers/pokemon/${pokemonId}/nurse/${nurseId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Attach token for authentication
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to transfer Pokémon.');
    }

    const updatedTrainer = await response.json();
    return updatedTrainer as Trainer; // Return the updated trainer data
  },
};






export default TrainerService;


// alert hoeven hiert niet moet enkel de simple dingen zijn 