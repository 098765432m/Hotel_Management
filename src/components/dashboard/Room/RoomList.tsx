"use client";

import styles from "@/styles/dashboard/room/Room.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import useSWR from "swr";
import { axiosCustomFetcher } from "@/lib/swr";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import RoomCard from "./RoomCard";
import {
  RoomHotelListApiResponse,
  RoomHotelPayload,
} from "@/types/dto/room.dto";
import AntdPagination from "@/components/custom-component/pagination/AntdPagination";
import useCustomSWRInfinite from "@/hooks/use-swr-infinite";
import EmptyData from "@/components/custom-component/EmptyData";
import CustomSpinning from "@/components/custom-component/CustomSpinning";
import { RoomTypeHotelApiResponse } from "@/types/dto/room-types.dto";

export default function RoomList() {
  const authInfo = useSelector((state: RootState) => state.auth.authInfo);

  const {
    data: roomsApiResponse,
    size: sizeRoom,
    setSize: setSizeRoom,
    isValidating: isRoomValidating,
  } = useCustomSWRInfinite<RoomHotelListApiResponse>(
    authInfo?.hotelId ? `/api/rooms/hotel/${authInfo!.hotelId}?limit=6` : null
  );

  const roomCurrentData = roomsApiResponse
    ? roomsApiResponse[sizeRoom - 1]?.data ?? null
    : null;

  console.log(roomsApiResponse);

  const { data: roomTypeApiResponse } = useSWR<RoomTypeHotelApiResponse>(
    () => `/api/roomTypes/hotel/${authInfo!.hotelId}`,
    axiosCustomFetcher
  );

  return (
    <CardDefault>
      <div className={styles.room_list_container}>
        <div className={styles.room_list_heading}>Danh sách phòng</div>

        {isRoomValidating || !roomCurrentData ? (
          <CustomSpinning></CustomSpinning>
        ) : roomCurrentData.rooms.length > 0 ? (
          <>
            <div className={styles.room_list}>
              {roomCurrentData.rooms.map(
                (room: RoomHotelPayload, index: number) => (
                  <RoomCard
                    hotelId={room.hotel_id}
                    roomId={room.id}
                    roomTypes={roomTypeApiResponse?.data.roomTypes ?? null}
                    key={index}
                  ></RoomCard>
                )
              )}
            </div>
            <AntdPagination
              current={sizeRoom}
              onChange={(value: number) => setSizeRoom(value)}
              pageSize={6}
              total={roomCurrentData ? roomCurrentData.totalRoom : 0}
              size="default"
            ></AntdPagination>
          </>
        ) : (
          <EmptyData></EmptyData>
        )}
      </div>
    </CardDefault>
  );
}
