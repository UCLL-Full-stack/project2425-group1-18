  import { Nurse } from "@types";

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const nurseService = {

    getAllNurses: async (): Promise<Nurse[]> =>{
    const user = localStorage.getItem('loggedInUser');
    let token = null
    if (user){
      token = JSON.parse(user).token;
    }
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
    },

    healPokemon: async (nurseId: number, pokemonId: number): Promise<any> => {
      const user = localStorage.getItem('loggedInUser');
      let token = null;
      if (user) {
        token = JSON.parse(user).token;
      }


        const response = await fetch(`${API_URL}/nurses/${nurseId}/heal/${pokemonId}`, {
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
    },

    removePokemonFromNurse: async ( idPokemon: number ): Promise<any> => {
      const user = localStorage.getItem('loggedInUser');
      let token = null;
      if (user) {
        token = JSON.parse(user).token;
      }
  

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
        return data;

    },
  };


  export default nurseService;
