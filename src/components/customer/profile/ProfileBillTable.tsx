"use client";

import styles from "@/styles/customer/profile/ProfilePage.module.scss";
import CardDefault from "@/components/custom-component/CardDefault";
import CustomTable from "@/components/custom-component/CustomTable";
import useCustomSWRInfinite from "@/hooks/use-swr-infinite";
import {
  BillCustomerApiResponse,
  BillCustomerPayload,
} from "@/types/dto/bill.dto";
import MantinePagination from "@/components/custom-component/pagination/MantinePagination";
import EmptyData from "@/components/custom-component/EmptyData";
import dayjs from "dayjs";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import MantineLoading from "@/components/custom-component/loading/MantineLoading";
import { message } from "antd";

interface Props {
  user_fullName: string;
}

export default function ProfileBillTable(props: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  const [selectedBill, setSelectedBill] = useState<BillCustomerPayload | null>(
    null
  );
  const { data: billApiResponse, size: billSize } =
    useCustomSWRInfinite<BillCustomerApiResponse>(
      props.user_fullName
        ? `/api/bills/customer?fullName=${props.user_fullName}`
        : null
    );

  const billData: { bills: BillCustomerPayload[]; totalBill: number } | null =
    billApiResponse?.[billSize - 1].success &&
    billApiResponse?.[billSize - 1]?.data
      ? (billApiResponse[billSize - 1].data as {
          bills: BillCustomerPayload[];
          totalBill: number;
        })
      : null;

  return (
    <CardDefault className={styles.profile_bill_table_container}>
      <div className={styles.profile_bill_table_heading}>
        Lịch sử thanh toán
      </div>
      <CustomTable>
        <thead>
          <tr>
            <th>Tên khách sạn</th>
            <th>Tổng tiền</th>
            <th>Thời gian thanh toán</th>
          </tr>
        </thead>
        <tbody>
          {billData && billData.bills.length > 0 ? (
            billData.bills.map((bill) => {
              return (
                <tr
                  onClick={() => {
                    setSelectedBill(bill);
                    open();
                  }}
                  key={bill.id}
                >
                  <td>{bill.hotel_name}</td>
                  <td>{bill.total_price}</td>
                  <td>{dayjs(bill.date_billed).toISOString()}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3}>
                <EmptyData></EmptyData>
              </td>
            </tr>
          )}
        </tbody>
      </CustomTable>
      <MantinePagination
        total={billData ? billData.totalBill : 0}
      ></MantinePagination>
      <Modal opened={opened} onClose={close} title={"Thanh toán"}>
        {selectedBill ? (
          <>
            <div>{selectedBill.hotel_name}</div>
            <div>{selectedBill.total_price}</div>
            <div>{dayjs(selectedBill.date_billed).toISOString()}</div>
          </>
        ) : (
          <MantineLoading></MantineLoading>
        )}
      </Modal>
    </CardDefault>
  );
}
