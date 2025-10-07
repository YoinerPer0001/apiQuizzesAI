import { Server, Socket } from 'socket.io';
import type Questions from '../models/questionsModel.js';
import { customAlphabet } from 'nanoid';
import questionsRepository from '../repository/questionsRepository.js';
import QuestionService from '../services/QustionsServices.js';
import quizzesService from '../services/quizzesService.js';
import { ApiResponse } from '../core/responseSchedule.js';
import usersServices from '../services/usersServices.js';

interface Room {
    hostId: string
    type: "public" | "private", 
    players: Array<{id: string, name: string, score: number}>
    questions: Array<Questions>
    actualQuestionIndex: number
    state: "pending" | "inProgress" | "finished"
    time: number
}

export interface GameSocket extends Socket {
  user_id?: string;
  room_code?: string;
}

let rooms = new Map<string, Room>();


// función que registra los eventos de conexión
export const registerSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`🟢 Cliente conectado: ${socket.id}`);

    createRoom(io, socket);
    
    socket.on('disconnect', () => {
      console.log(`🔴 Cliente desconectado: ${socket.id}`);
    });
  });
};


function createRoom(io: Server, socket:GameSocket) {

    socket.on("create_room", async (data, callback) => {

        try {
            if (typeof data === 'string') {
                data = JSON.parse(data)
            }

            console.log(data)

            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
            const nanoidLetters = customAlphabet(alphabet, 6)
            const roomCode = nanoidLetters()
            
            //fetch questions from database
            const questions = await QuestionService.findQuestionsByQuizId(data.quiz_id)
            
            let time = questions?.data ? questions.data[0]?.dataValues.time_limit : 4

            

            const room : Room = {
                hostId: data.user_id,
                type: data.type, // 'public' o 'private'
                players: [],
                questions: questions.data ?? [],
                actualQuestionIndex: 0,
                state: "pending",
                time: time
            };


            const player = {
                id: data.user_id,
                name: data.user_name,
                score:0
            }

            room.players.push(player)

            rooms.set(roomCode, room)



            socket.join(roomCode);

            //save data in socket
            socket.user_id = data.user_id
            socket.room_code = roomCode

            const dataSend = {
                roomCode,
                hostId: room.hostId,
                players: room.players,
            }

            callback(new ApiResponse(200, "success", dataSend))

        } catch (error) {

            console.error("Error creating room:", error)
            if (callback) {
                callback( new ApiResponse(500, (error as Error).message, null) )
            }
        }



    });
}

