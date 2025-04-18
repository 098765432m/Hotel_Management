"use client";

import styles from "@/styles/customer/profile/ProfilePage.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import CustomTable from "@/components/custom-component/CustomTable";
import EmptyData from "@/components/custom-component/EmptyData";
import MantineButton from "@/components/custom-component/MantineButton";
import { axiosCustomFetcher } from "@/lib/swr";
import bookingsService from "@/services/bookings.service";
import { RootState } from "@/state/store";
import { GetBookingsByUserDtoResponse } from "@/types/dto/booking.dto";
import dayjs from "dayjs";
import { FaTrashCan } from "react-icons/fa6";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { message } from "antd";
import NextLink from "@/components/custom-component/NextLink";
import { NumberToMoneyFormat } from "@/utils/helpers";

export default function ProfileBookingTable() {
  const authStore = useSelector((state: RootState) => state.auth);

  // Display Message
  const [messageApi, contextHolder] = message.useMessage();

  // Get Booking Data Table
  const { data: bookings, mutate: bookingsMutate } = useSWR(
    () => `/api/bookings/user/${authStore.authInfo?.id}`,
    axiosCustomFetcher
  );

  // Handle Customer Remove Booking
  async function handleRemove(bookingId: string, roomId: string) {
    await bookingsService.unBookingOne(bookingId, roomId);
    messageApi.success("Hủy đặt phòng thành công!");
  }

  return (
    <>
      {contextHolder}
      <CardDefault className={styles.profile_table_container}>
        <div className={styles.profile_table_heading}>Phòng đặt trước</div>
        <div>
          <CustomTable>
            <thead>
              <tr>
                <th>Khách sạn</th>
                <th>Loại</th>
                <th>Phòng số</th>
                <th>Ngày nhận</th>
                <th>Ngày trả</th>
                <th>Giá</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings && bookings.length > 0 ? (
                bookings.map(
                  (booking: GetBookingsByUserDtoResponse, index: number) => {
                    return (
                      <tr key={index}>
                        <td>
                          <NextLink href={`/hotel/${booking.hotel_id}`}>
                            {booking.hotel_name}
                          </NextLink>
                        </td>
                        <td>{booking.room_type_name}</td>
                        <td>{booking.room_name}</td>
                        <td>
                          {dayjs(booking.check_in_date).format("DD-MM-YYYY")}
                        </td>
                        <td>
                          {dayjs(booking.check_out_date).format("DD-MM-YYYY")}
                        </td>

                        <td>
                          {NumberToMoneyFormat(
                            booking.price *
                              (dayjs(booking.check_out_date).diff(
                                dayjs(booking.check_in_date),
                                "day"
                              ) +
                                1)
                          )}
                          đ
                        </td>
                        <td>
                          {
                            <MantineButton
                              color="red"
                              size="compact-sm"
                              onClick={async () => {
                                await handleRemove(booking.id, booking.room_id);
                                bookingsMutate();
                              }}
                              disabled={booking.status != "BOOKED"}
                            >
                              <FaTrashCan></FaTrashCan>
                            </MantineButton>
                          }
                        </td>
                      </tr>
                    );
                  }
                )
              ) : (
                <tr>
                  <td colSpan={7}>
                    <EmptyData></EmptyData>
                  </td>
                </tr>
              )}
            </tbody>
          </CustomTable>
        </div>
      </CardDefault>
    </>
  );
}
