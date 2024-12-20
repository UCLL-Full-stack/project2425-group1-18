import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'; 

const prisma = new PrismaClient();

const main = async () => {
    await prisma.badge.deleteMany();
    await prisma.gymBattle.deleteMany();
    await prisma.pokemon.deleteMany();
    await prisma.trainer.deleteMany({});

    await prisma.nurse.deleteMany(); 

    await prisma.user.deleteMany();

    await prisma.stats.deleteMany();

    const pikachuStats = await prisma.stats.create({
        data: {
            hp: 40,
            attack: 74,
            defence: 50,
            specialAttack: 80,
            specialDefence: 64,
            speed: 80,
        },
    });

    const charizardStats = await prisma.stats.create({
        data: {
            hp: 200,
            attack: 150,
            defence: 120,
            specialAttack: 140,
            specialDefence: 140,
            speed: 60,
        },
    });

    const hashedPasswordRed = await bcrypt.hash('GonnaBeTheBest151', 10); 
    const hashedPasswordBlue = await bcrypt.hash('Sm3llY4L4ter', 10);  
    const hashedPasswordNurse = await bcrypt.hash('easyNurse', 10); 
    const hashedPasswordOak = await bcrypt.hash("GoAsh!Go4", 10);

    const userRed = await prisma.user.create({
        data: {
            firstName: "Red",
            lastName: 'pokemon',
            email: 'red@gmail.com',
            password: hashedPasswordRed,  
            role: 'trainer',
        },
    });

    const userBlue = await prisma.user.create({
        data: {
            firstName: "Blue",
            lastName: 'pokemon',
            email: 'blue@gmail.com',
            password: hashedPasswordBlue,  
            role: 'trainer',
        },
    });

    const userOak = await prisma.user.create({
        data: {
            firstName: 'Proffesor',
            lastName: 'Oak',
            email: "oak@gmail.com",
            password: hashedPasswordOak,
            role: 'admin'
        }
    })

        const userJoy = await prisma.user.create({
            data: {
                firstName: "Nurse",
                lastName: "Joy",
                email: 'joy@gmail.com',
                password: hashedPasswordNurse,
                role: 'nurse',
            },
        });

    const NurseJoy = await prisma.nurse.create({
        data:{
            id:1,
            userId: userJoy.id,

        },
    })

    const trainerRed = await prisma.trainer.create({
        data: {
            userId: userRed.id,  
        },
    });

    const trainerBlue = await prisma.trainer.create({
        data: {
            userId: userBlue.id,  
        },
    });

    const pikachu = await prisma.pokemon.create({
        data: {
            name: "pikachu",
            type: "electric",
            health: 38,
            canEvolve: true,
            stats: {
                connect: { id: pikachuStats.id },  
            },
            trainer: {
                connect: { id: trainerRed.id },  
            },
        },
    });

    const charizard = await prisma.pokemon.create({
        data: {
            name: "charizard",
            type: "fire/flying",
            health: 200,
            canEvolve: false,
            stats: {
                connect: { id: charizardStats.id },  
            },
            trainer: {
                connect: { id: trainerRed.id }, 
            },
        },
    });

    const rattata = await prisma.pokemon.create({
        data: {
            name: "rattata",
            type: "normal",
            health: 50,
            canEvolve: true,
            stats: {
                create: {  
                    hp: 50,
                    attack: 55,
                    defence: 40,
                    specialAttack: 30,
                    specialDefence: 24,
                    speed: 75,
                },
            },
            trainer: {
                connect: { id: trainerBlue.id },  
            },
        },
    });

    const blastoise = await prisma.pokemon.create({
        data: {
            name: "blastoise",
            type: "water",
            health: 250,
            canEvolve: false,
            stats: {
                create: {  
                    hp: 250,
                    attack: 140,
                    defence: 130,
                    specialAttack: 100,
                    specialDefence: 150,
                    speed: 65,
                },
            },
            trainer: {
                connect: { id: trainerBlue.id },  
            },
        },
    });


    const boulderBadge = await prisma.badge.create({
        data: {
            name: "Boulder badge",
            location: "Pewter city",
            difficulty: 1,
            trainer: { 
                connect: { id: trainerRed.id },
            },
        },
    });

    const cascadeBadge = await prisma.badge.create({
        data: {
            name: "Cascade badge",
            location: "Cerulean city",
            difficulty: 1.5,
            trainer: {  
                connect: { id: trainerBlue.id },
            },
        },
        
    });


    await prisma.trainer.update({
        where: { id: trainerRed.id },
        data: {
            badges: {
                connect: { id: boulderBadge.id },  
            },
        },
    });

    await prisma.trainer.update({
        where: { id: trainerBlue.id },
        data: {
            badges: {
                connect: [{ id: boulderBadge.id }, { id: cascadeBadge.id }],  
            },
        },
    });



    console.log('Seed data created successfully!');
};

main()
    .catch(e => {
        console.error(e);
        prisma.$disconnect();
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
