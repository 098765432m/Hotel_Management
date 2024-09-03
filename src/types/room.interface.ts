import { Status_Room } from "@prisma/client";

export interface Room {
  id: string;
  name: string;
  description?: string;
  status_room?: Status_Room;
  hotel_id: string;
  room_type_id: string;
}
