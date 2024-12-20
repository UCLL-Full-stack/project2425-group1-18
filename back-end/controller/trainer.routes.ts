/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Trainer:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *           description: Unique identifier for the trainer
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: number
 *               description: Unique identifier for the user
 *             firstName:
 *               type: string
 *               description: First name of the user
 *             lastName:
 *               type: string
 *               description: Last name of the user
 *             email:
 *               type: string
 *               description: Email of the user
 *         pokemon:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Pokemon'
 *         badges:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Badge'
 *         gymBattles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/GymBattle'
 *     Pokemon:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *           description: Unique identifier for the pokemon
 *         name:
 *           type: string
 *           description: Name of the Pokemon
 *         type:
 *           type: string
 *           description: Type of the Pokemon (e.g., fire, water)
 *         health:
 *           type: number
 *           description: Health points of the Pokemon
 *         canEvolve:
 *           type: boolean
 *           description: Whether the Pokemon can evolve
 *         stats:
 *           type: object
 *           properties:
 *             hp:
 *               type: number
 *               description: Health points of the Pokemon
 *             attack:
 *               type: number
 *               description: Attack power of the Pokemon
 *             defence:
 *               type: number
 *               description: Defence power of the Pokemon
 *             specialAttack:
 *               type: number
 *               description: Special attack power of the Pokemon
 *             specialDefence:
 *               type: number
 *               description: Special defence power of the Pokemon
 *             speed:
 *               type: number
 *               description: Speed of the Pokemon
 *     Badge:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: Unique identifier for the badge
 *         name:
 *           type: string
 *           description: Name of the badge (e.g., Cascade badge)
 *         location:
 *           type: string
 *           description: Location where the badge can be earned (e.g., Cerulean city)
 *         difficulty:
 *           type: number
 *           description: Difficulty level of earning the badge
 *     GymBattle:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: Unique identifier for the gym battle
 *         opponent:
 *           type: string
 *           description: Name of the opponent gym leader
 *         result:
 *           type: string
 *           description: Result of the battle (e.g., win, lose)
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of the gym battle
 *     BadgeInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the badge
 *         location:
 *           type: string
 *           description: Location where the badge can be earned
 *         difficulty:
 *           type: number
 *           description: Difficulty level of earning the badge
 *       required:
 *         - name
 *         - location
 *         - difficulty
 */
import express, { NextFunction, Request, Response } from 'express';
import trainerService from '../service/trainer.service';
import { BadgeInput, PokemonInput } from '../types';

const trainerRouter = express.Router();

/**
 * @swagger
 * /trainers:
 *   get:
 *     summary: Retrieve a list of all trainers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of trainers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trainer'
 *       500:
 *         description: Server error
 */
trainerRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const trainers = await trainerService.getAllTrainers();
        res.status(200).json(trainers);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /trainers/email:
 *   get:
 *     summary: Get a trainer by email
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query    
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the trainer
 *     responses:
 *       200:
 *         description: A trainer object corresponding to the provided email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trainer'
 *       404:
 *         description: Trainer with the specified email not found
 *       500:
 *         description: Server error
 */
trainerRouter.get('/email', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.query; // Get email from query parameters

        // Validate email parameter
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ message: 'Email is required and should be a string.' });
        }

        // Fetch the trainer by email using the service
        const trainer = await trainerService.getTrainerByEmail(email as string); // Make sure email is treated as a string

        if (!trainer) {
            return res.status(404).json({ message: 'Trainer with the specified email not found' });
        }

        // Return the trainer object
        res.status(200).json(trainer);
    } catch (error) {
        next(error); // Global error handling
    }
});

/**
 * @swagger
 * /trainers/{id}:
 *   post:
 *     summary: Add a new Pokemon to a specific trainer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The numeric ID of the trainer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pokemon'
 *     responses:
 *       200:
 *         description: Pokemon successfully added to the trainer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pokemon'
 *       400:
 *         description: Invalid input or data
 *       404:
 *         description: Trainer not found
 *       500:
 *         description: Server error
 */
trainerRouter.post('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pokemon = <PokemonInput>req.body;
        const result = await trainerService.addPokemonToTrainerById(Number(req.params.id), pokemon);
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            next(error);
        }
    }
});

/**
 * @swagger
 * /trainers/{id}/badge:
 *   post:
 *     summary: Add a badge to a specific trainer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The numeric ID of the trainer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BadgeInput'
 *     responses:
 *       200:
 *         description: Badge successfully added to the trainer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trainer'
 *       400:
 *         description: Invalid input or data
 *       404:
 *         description: Trainer not found
 *       500:
 *         description: Server error
 */
trainerRouter.post('/:id/badge', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const badge = <BadgeInput>req.body;
        const result = await trainerService.addBadgeToTrainerById(Number(req.params.id), badge);
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            next(error);
        }
    }
});

/**
 * @swagger
 * /trainers/pokemon/{idPokemon}/nurse/{idNurse}:
 *   put:
 *     summary: Remove a Pokémon from a Trainer and add it to a Nurse
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idPokemon
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Pokémon to be removed
 *       - in: path
 *         name: idNurse
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Nurse to add the Pokémon to
 *     responses:
 *       200:
 *         description: Successfully removed Pokémon from Trainer and added to Nurse
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trainer'
 *       400:
 *         description: Invalid input or data
 *       404:
 *         description: Trainer or Pokémon not found
 *       500:
 *         description: Server error
 */
trainerRouter.put('/pokemon/:idPokemon/nurse/:idNurse', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idPokemon, idNurse } = req.params;

        // Validate the parameters
        if (isNaN(Number(idPokemon)) || isNaN(Number(idNurse))) {
            return res.status(400).json({ message: 'Both Pokemon ID and Nurse ID must be valid numbers.' });
        }

        const updatedTrainer = await trainerService.removePokemonAndAddToNurse(
            Number(idPokemon),
            Number(idNurse),
        );

        res.status(200).json(updatedTrainer);  // Respond with the updated trainer
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            next(error); // Pass other errors to the error handler
        }
    }
});

export { trainerRouter };
