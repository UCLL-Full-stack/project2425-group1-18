  import { Nurse, Trainer } from "@types";

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const nurseService = {

    getAllNurses: async (): Promise<Nurse[]> =>{
    const user = localStorage.getItem('loggedInUser');
    let token = null
    if (user){
      token = JSON.parse(user).token;
    }
    // Make the GET request to fetch trainers
    const response = await fetch(`${API_URL}/nurses`, {
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data as Nurse[]; 
    },

    getNurseByEmail: async (email: string): Promise<Nurse> => {
      const user = localStorage.getItem('loggedInUser');
      let token = null;
      if (user) {
        token = JSON.parse(user).token;
      }

      try {
        const response = await fetch(`${API_URL}/nurses/${encodeURIComponent(email)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch nurse data: ${errorText}`);
        }

        const data = await response.json();
        return data as Nurse;
      } catch (error) {
        console.error('Error fetching nurse data:', error);
        throw error;
      }
    },

    healPokemon: async (nurseId: number, pokemonId: number): Promise<any> => {
      const user = localStorage.getItem('loggedInUser');
      let token = null;
      if (user) {
        token = JSON.parse(user).token;
      }

      try {
        const response = await fetch(`${API_URL}/nurses/heal/${pokemonId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to heal Pokémon: ${errorText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error healing Pokémon:', error);
        throw error;
      }
    },

    removePokemonFromNurse: async ( idPokemon: number ): Promise<any> => {
      const user = localStorage.getItem('loggedInUser');
      let token = null;
      if (user) {
        token = JSON.parse(user).token;
      }
  
      try {
        // Send a DELETE request to the server to remove the Pokémon from the Nurse
        const response = await fetch(`${API_URL}/nurses/pokemon/${idPokemon}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to remove Pokémon from nurse: ${errorText}`);
        }
  
        const data = await response.json();
        return data; // Return the response data if successful (e.g., confirmation message, updated nurse state)
      } catch (error) {
        console.error('Error removing Pokémon from Nurse:', error);
        throw error;
      }
    },

    addPokemonToTrainer: async (pokemonId: number): Promise<Trainer> => {
        const user = localStorage.getItem('loggedInUser');
        let token = null;
        if (user) {
          token = JSON.parse(user).token;
        }
    
        try {
          const response = await fetch(`${API_URL}/nurses/pokemon/${pokemonId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
    
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Failed to add Pokémon to Trainer: ${errorText}`);
          }
    
          const data = await response.json();
          return data as Trainer;  // Return updated trainer object
        } catch (error) {
          console.error('Error adding Pokémon to Trainer:', error);
          throw error;
        }
      },
  };


  export default nurseService;
