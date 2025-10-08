import { Server, Socket } from "socket.io";
import type Questions from "../models/questionsModel.js";
import { customAlphabet } from "nanoid";
import questionsRepository from "../repository/questionsRepository.js";
import QuestionService from "../services/QustionsServices.js";
import quizzesService from "../services/quizzesService.js";
import { ApiResponse } from "../core/responseSchedule.js";
import usersServices from "../services/usersServices.js";
import { FirebaseTokenVerification } from "../middlewares/authFirebase.js";

interface Room {
  hostId: string;
  type: "public" | "private";
  players: Array<{ id: string; name: string; score: number }>;
  questions: Array<Questions>;
  actualQuestionIndex: number;
  state: "pending" | "inProgress" | "finished";
  time: number;
}

export interface GameSocket extends Socket {
  user_id?: string;
  room_code?: string;
}

let rooms = new Map<string, Room>();

// función que registra los eventos de conexión
export const registerSocketHandlers = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`🟢 Cliente conectado: ${socket.id}`);

    createRoom(io, socket);

    socket.on("disconnect", () => {
      console.log(`🔴 Cliente desconectado: ${socket.id}`);
    });
  });
};

function createRoom(io: Server, socket: GameSocket) {
  socket.on("create_room", async (data, callback) => {
    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      const userData = await FirebaseTokenVerification(data.token);

      if (userData.data != null) {

        const userName = userData.data.name
        const uid = userData.data.uid

        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const nanoidLetters = customAlphabet(alphabet, 6);
        const roomCode = nanoidLetters();

        //fetch questions from database
        const questions = await QuestionService.findQuestionsByQuizId(
          data.quiz_id
        );

        let time = questions?.data
          ? questions.data[0]?.dataValues.time_limit
          : 4;

        const room: Room = {
          hostId: uid,
          type: data.type, // 'public' o 'private'
          players: [],
          questions: questions.data ?? [],
          actualQuestionIndex: 0,
          state: "pending",
          time: time,
        };

        const player = {
          id: uid,
          name: userName,
          score: 0,
        };

        room.players.push(player);

        rooms.set(roomCode, room);

        socket.join(roomCode);

        //save data in socket
        socket.user_id = userName;
        socket.room_code = roomCode;

        const dataSend = {
          roomCode,
          hostId: room.hostId,
          players: room.players,
        };

        callback(new ApiResponse(200, "success", dataSend));
      }else{
        callback(new ApiResponse(403, "Token error", null));
      }
    } catch (error) {
      console.error("Error creating room:", error);
      if (callback) {
        callback(new ApiResponse(500, (error as Error).message, null));
      }
    }
  });
}
