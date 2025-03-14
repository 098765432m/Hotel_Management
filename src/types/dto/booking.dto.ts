import { BookingState } from "@/components/customer/hotel-page/AvailableRooms";
import { Status_Booking } from "@prisma/client";

export interface BookingsDtoCreate {
  check_in_date: string;
  check_out_date: string;
  booking_type_list: (string | number)[][];
  hotel_id: string;
  status?: Status_Booking;
  user_id?: string | null;
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
}

export interface GetBookingsByUserDtoResponse {
  id: string;
  check_in_date: string;
  check_out_date: string;
  hotel_name: string;
  room_type_name: string;
  room_id: string;
  room_name: string;
  price: number;
  status: Status_Booking;
}
