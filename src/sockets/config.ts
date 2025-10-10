import { Server, Socket } from "socket.io";
import type Questions from "../models/questionsModel.js";
import { customAlphabet } from "nanoid";
import questionsRepository from "../repository/questionsRepository.js";
import QuestionService from "../services/QustionsServices.js";
import quizzesService from "../services/quizzesService.js";
import { ApiResponse } from "../core/responseSchedule.js";
import usersServices from "../services/usersServices.js";
import { FirebaseTokenVerification } from "../middlewares/authFirebase.js";
import type Answers from "../models/answersModel.js";
import { start } from "repl";

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
    JoinRoomSocket(io, socket);
    LeaveRoom(io, socket);
    getQuestionsRooms(io, socket);
    CheckQuestion(io, socket);
    StartGame(io, socket);

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
        const userName = userData.data.name;
        const uid = userData.data.uid;

        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const nanoidLetters = customAlphabet(alphabet, 6);
        const roomCode = nanoidLetters();

        console.log("Room code generated:", roomCode);

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
      } else {
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

export function JoinRoomSocket(io: Server, socket: GameSocket) {
  socket.on("join_server", async (data, callback) => {
    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
      const userData = await FirebaseTokenVerification(data.token);

      if (userData.data == null) {
        callback(new ApiResponse(403, "Token error", null));
        return;
      }

      const userName = userData.data.name;
      const uid = userData.data.uid;

      const player = {
        id: uid,
        name: userName,
        score: 0,
      };

      const room = rooms.get(data.code);

      console.log("Joining room:", data.code, room);

      if (room) {
        if (room.players.length < 25 && room.state == "pending") {
          const playerisRegistered = room.players.find((p) => p.id === uid);

          const dataSend = {
            roomCode: data.code,
            hostId: room.hostId,
            players: room.players,
          };

          if (playerisRegistered) {
            io.to(data.code).emit("new_joined", {
              roomCode: data.code,
              players: room.players,
            });

            callback(new ApiResponse(201, "success", dataSend));
          } else {
            room.players.push(player);

            socket.join(data.code);

            socket.user_id = uid;
            socket.room_code = data.code;

            io.to(data.code).emit("new_joined", {
              roomCode: data.code,
              players: room.players,
            });

            callback(new ApiResponse(201, "success", dataSend));
          }
        } else {
          callback(new ApiResponse(409, "Room is full", null));
          return;
        }
      } else {
        callback(new ApiResponse(404, "Room not found", null));
      }
    } catch (error) {
      console.error("Error", error);
      callback(new ApiResponse(500, "server error", null));
    }
  });
}

export function LeaveRoom(io: Server, socket: GameSocket) {
  socket.on("leave_room", async (data) => {
    try {
      if (typeof data === "string") data = JSON.parse(data);

      const { roomCode, token } = data;
      const room = rooms.get(roomCode);

      const userData = await FirebaseTokenVerification(token);

      const uid = userData.data?.uid ?? "";
      const userName = userData.data?.name ?? "";

      if (room && userData.data != null) {
        room.players = room.players.filter((p) => p.id !== uid);

        // Si la sala queda vacía, puedes eliminarla

        if (uid === room.hostId) {
          io.to(roomCode).emit("host_leave", {
            name: userName,
          });

          console.log("Eliminado host");

          rooms.delete(roomCode);
        } else {
          socket.to(roomCode).emit("player_leave", {
            name: userName,
            players: room.players,
          });
          console.log("Eliminado player");
        }

        if (room.players.length < 2) {
          // Notificar a los demás que un jugador se fue
          console.log("Elimino la sala vacia");
          io.to(roomCode).emit("insuficient_participants");
          if (room.state != "pending") {
            rooms.delete(roomCode);
          }

          console.log(rooms.size);
          console.log("NOTIFICO");
        }

        socket.leave(roomCode); //eliminar usuario del socket
      }
    } catch (error) {
      console.error("Error", error);
    }
  });
}

export function getQuestionsRooms(io: Server, socket: GameSocket) {
  socket.on("get_question", async (data) => {
    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      const room = rooms.get(data.code);

      const userData = await FirebaseTokenVerification(data.token);

      if (room && userData.data?.uid == room.hostId) {
        const index = room.actualQuestionIndex;

        if (index < room.questions.length) {
          const question = room.questions[index];

          io.to(data.code).emit("actual_question", {
            hostId: room.hostId,
            question: question,
            questionIndex: index + 1,
            totalQuestions: room.questions.length,
            totalPlayers: room.players.length,
            time: room.time,
          });
          room.actualQuestionIndex++; // Incrementa solo en esa sala
        } else {
          // ✅ Solo 1 vez: respuesta general
          console.log("finalizo");
          room.state = "finished";
          io.to(data.code).emit("game_finished", {
            players: room.players.map((p) => ({
              user_id: p.id,
              user_name: p.name,
              score: p.score || 0,
            })),
          });
        }
      }
    } catch (error) {
      console.error("Error", error);
    }
  });
}

export function CheckQuestion(io: Server, socket: GameSocket) {
  socket.on("check_question", async (data, callback) => {
    try {
      if (typeof data === "string") data = JSON.parse(data);
      console.log(data);
      const userData = await FirebaseTokenVerification(data.token);
      const uid = userData.data?.uid ?? "";
      const name = userData.data?.name ?? "";

      const room = rooms.get(data.code);
      if (!room) return;

      const index = room.actualQuestionIndex - 1;
      const question = room.questions[index];

      console.log(question?.dataValues.answers);

      const selectedAnswer = question?.dataValues.answers.find(
        (a: Answers) => a.dataValues.answer_id === data.answer_id
      );

      if (!selectedAnswer) return;

      const player = room.players.find((p) => p.id === uid);
      console.log(player);
      if (!player) return;

      const isCorrect = selectedAnswer.is_correct;

      if (isCorrect) {
        player.score += 400 + Math.trunc(400 * parseFloat(data.percent));
      }

      console.log(player);

      // ✅ Solo 1 vez: respuesta personal
      callback({
        isCorrect,
        score: player.score,
      });
    } catch (error) {
      console.error("Error", error);
    }
  });
}

export function StartGame(io: Server, socket: GameSocket) {
  socket.on("start_Game", async (data, callback) => {
    try {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      const userData = await FirebaseTokenVerification(data.token);
      const uid = userData.data?.uid ?? "";
      const name = userData.data?.name ?? "";

      const room = rooms.get(data.code);

      if (room && room.hostId == uid) {
        room.state = "inProgress";

        io.to(data.code).emit("game_Started", {
          success: true,
          hostId: room.hostId,
        });
      } else {
        callback(new ApiResponse(403, "Error to start", null));
      }
    } catch (error) {
      console.error("Error", error);
    }
  });
}
