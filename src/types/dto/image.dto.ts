interface UploadedImageDto {
  public_id: string;
  format: string;
}

interface UploadedRoomTypeImage {
  public_id: string;
  format: string;
  room_type_id: string;
}

interface UploadedHotelImage {
  public_id: string;
  format: string;
  hotel_id: string;
}

export type { UploadedImageDto, UploadedRoomTypeImage, UploadedHotelImage };
