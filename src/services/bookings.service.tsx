import axiosInstance from "@/lib/axiosConfig";
import { BookingsDtoCreate } from "@/types/dto/bookingsCreate.dto";

class BookingsService {
  private api: any;
  constructor(baseUrl = "/api/bookings") {
    this.api = axiosInstance(baseUrl);
  }

  async getAll() {
    try {
      return (await this.api.get("/")).data;
    } catch (error) {
      console.log(error);
    }
  }

  //Create A Booking
  async CreateOne(body: BookingsDtoCreate) {
    try {
      return (await this.api.post(`/`, body)).data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

const bookingsService = new BookingsService();

export default bookingsService;
