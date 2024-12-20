import express, { Request, Response, NextFunction } from 'express';
import nurseService from '../service/nurse.service';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     Nurse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the Nurse
 *         userId:
 *           type: integer
 *           description: The ID of the user associated with this nurse
 *         user:
 *           $ref: '#/components/schemas/User'
 *         pokemon:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Pokemon'
 *       required:
 *         - id
 *         - userId
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, trainer, nurse, guest]
 *
 *     Pokemon:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         health:
 *           type: integer
 *         canEvolve:
 *           type: boolean
 *         previousTrainerId:
 *           type: integer
 *         trainerId:
 *           type: integer
 *         nurseId:
 *           type: integer
 *         stats:
 *           $ref: '#/components/schemas/Stats'
 *
 *     Stats:
 *       type: object
 *       properties:
 *         hp:
 *           type: integer
 *         attack:
 *           type: integer
 *         defence:
 *           type: integer
 *         specialAttack:
 *           type: integer
 *         specialDefence:
 *           type: integer
 *         speed:
 *           type: integer
 *
 *     Trainer:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         pokemon:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Pokemon'
 *
 * /nurses:
 *   get:
 *     summary: Retrieve a list of all nurses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of nurses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Nurse'
 *       500:
 *         description: Server error
 */
const nurseRouter = express.Router();

nurseRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const nurses = await nurseService.getAllNurse();
        res.status(200).json(nurses);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /nurses/{email}:
 *   get:
 *     summary: Retrieve a nurse by email
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nurse details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Nurse'
 *       404:
 *         description: Nurse not found
 */
nurseRouter.get('/:email', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const nurse = await nurseService.getNurseByEmail(req.params.email);
        if (!nurse) {
            return res.status(404).json({ message: 'Nurse not found' });
        }
        res.status(200).json(nurse);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /nurses/pokemon/{pokemonId}:
 *   delete:
 *     summary: Remove a Pokémon from a Nurse and disassociate it
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pokemonId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Pokémon to be removed from the Nurse
 *     responses:
 *       200:
 *         description: Successfully removed Pokémon from Nurse
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pokemon removed from nurse"
 *                 updatedNurse:
 *                   $ref: '#/components/schemas/Nurse'
 *       404:
 *         description: Pokémon not found or not assigned to any Nurse
 *       500:
 *         description: Server error
 */
nurseRouter.delete('/pokemon/:pokemonId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { pokemonId } = req.params;
        // Logic to remove the Pokémon from the nurse's care
        const updatedNurse = await nurseService.removePokemonFromNurse(Number(pokemonId));
        res.status(200).json({ message: 'Pokemon removed from nurse', updatedNurse });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /nurses/heal/{pokemonId}:
 *   put:
 *     summary: Heal a Pokémon by Nurse
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pokemonId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully healed the Pokémon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pokemon healed successfully by Nurse"
 *                 pokemon:
 *                   $ref: '#/components/schemas/Pokemon'
 *       404:
 *         description: Nurse or Pokémon not found
 *       500:
 *         description: Server error
 */
nurseRouter.put('/heal/:pokemonId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { pokemonId } = req.params;

        // Fetch the Pokémon and its stats
        const pokemonWithStats = await nurseService.healPokemon(Number(pokemonId));
        if (!pokemonWithStats) {
            return res.status(404).json({ message: `Pokemon with ID ${pokemonId} not found.` });
        }

        // Heal the Pokémon by setting its health to max (using the Pokémon's stats)
        const healedPokemon = await nurseService.healPokemon(Number(pokemonId));

        // Return the healed Pokémon details
        res.status(200).json({
            message: "Pokemon healed successfully by Nurse",
            pokemon: healedPokemon,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /nurses/pokemon/{idPokemon}:
 *   post:
 *     summary: Return the Pokémon to the previous trainer  (using previousTrainerId)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPokemon
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Pokémon to add to its previous trainer
 *     responses:
 *       200:
 *         description: Pokémon successfully added to the trainer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trainer'
 *       400:
 *         description: Invalid input or data
 *       404:
 *         description: Pokémon or previous trainer not found
 *       500:
 *         description: Server error
 */
nurseRouter.post('/pokemon/:idPokemon', async (req: Request, res: Response, next: NextFunction) => {
    try { 
        const idPokemon = Number(req.params.idPokemon);

        // Validate Pokémon ID format
        if (isNaN(idPokemon)) {
            return res.status(400).json({ message: 'Pokémon ID must be a valid number.' });
        }

        // Call the service function to handle business logic
        const updatedTrainer = await nurseService.addPokemonToTrainer(idPokemon);

        // Return the updated trainer
        res.status(200).json(updatedTrainer);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });  // Return error message
        }
        next(error);  // Pass the error to the next middleware (global error handler)
    }
});

export { nurseRouter };
