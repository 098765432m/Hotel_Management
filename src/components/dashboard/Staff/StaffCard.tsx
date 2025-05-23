"use client";

import CardDefault from "@/components/custom-component/CardDefault";
import MantineButton from "@/components/custom-component/MantineButton";
import NextImage from "@/components/custom-component/NextImage";
import { axiosCustomFetcher } from "@/lib/swr";
import usersService from "@/services/users.service";
import styles from "@/styles/dashboard/staff/StaffPage.module.scss";
import { UserUpdateDto } from "@/types/dto/user.dto";
import { roleEnum, roleToLabel } from "@/types/enum/role.enum";
import { Modal, Switch } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  Button,
  Form,
  Input,
  Radio,
  Switch as AntdSwitch,
  message,
} from "antd";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import useSWR from "swr";

interface Props {
  userId: string;
  staffMutate: () => void;
}

export default function StaffCard({ userId, staffMutate }: Props) {
  const [isEditFormOpened, { open: openEditForm, close: closeEditForm }] =
    useDisclosure(false);
  //Hiển thị thông báo
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [isPasswordDisabled, setIsPasswordDisabled] = useState(true);

  const [isActive, setIsActive] = useState(false);
  const { data: user, mutate: userMutate } = useSWR(
    () => `/api/users/${userId}`,
    axiosCustomFetcher
  );

  const handleSubmit = async (body: UserUpdateDto) => {
    await usersService.UpdateOne(userId, { ...body });
    userMutate();
    staffMutate();
    closeEditForm();
    messageApi.success("Cập nhật thành công");
  };

  async function handleDeleteUser(id: string) {
    await usersService.DeleteOne(id);
    userMutate();
    staffMutate();
    closeEditForm();
    messageApi.success("Xóa thành công");
  }

  if (user)
    return (
      <>
        {contextHolder}
        <CardDefault className={styles.staff_card_container}>
          <div className={styles.staff_avatar_container}>
            <div className={styles.round_border}>
              <NextImage
                src={
                  (user.image
                    ? `${process.env.NEXT_PUBLIC_CLOUDINARY_PATHNAME}/${user.image.public_id}.${user.image.format}`
                    : process.env
                        .NEXT_PUBLIC_CLOUDINARY_DEFAULT_IMAGE) as string
                }
                height={80}
                width={80}
                alt="Default"
              ></NextImage>
            </div>
            <div className={styles.staff_edit_button}>
              <MantineButton
                color="yellow"
                size="compact-sm"
                onClick={openEditForm}
              >
                <FaEdit></FaEdit>
              </MantineButton>
            </div>
          </div>
          <div>
            <span className={styles.label_text}>Tên tài khoản:</span>{" "}
            {user.username}
          </div>
          <div>
            <span className={styles.label_text}>Họ tên: </span>
            {user.full_name}
          </div>
          <div>
            <span className={styles.label_text}>Số điện thoại: </span>
            {user.phone_number}
          </div>
          <div>
            <span className={styles.label_text}>Email: </span>
            {user.email}
          </div>
          <div>
            <span className={styles.label_text}>Vai trò: </span>
            {roleToLabel[user.role as keyof typeof roleEnum]}
          </div>
        </CardDefault>
        <Modal
          title="Chỉnh sửa"
          opened={isEditFormOpened}
          onClose={closeEditForm}
          className={styles.edit_modal_form}
          size="lg"
        >
          <Form
            form={form}
            labelAlign="left"
            labelCol={{ span: 6 }}
            onFinish={handleSubmit}
            className={styles.edit_staff_form_layout}
          >
            <Form.Item
              name={"username"}
              label="Tên tài khoản"
              initialValue={user.username}
            >
              <Input></Input>
            </Form.Item>

            <Form.Item
              name={"password"}
              label="Mật khẩu mới"
              initialValue={undefined}
            >
              <Input.Password
                addonAfter={
                  <Switch
                    onChange={() => {
                      setIsPasswordDisabled((value) => !value);
                      form.setFieldValue("password", undefined);
                    }}
                  ></Switch>
                }
                disabled={isPasswordDisabled}
              ></Input.Password>
            </Form.Item>
            <Form.Item
              name={"fullName"}
              label="Họ tên"
              initialValue={user.full_name}
            >
              <Input></Input>
            </Form.Item>
            <Form.Item
              name={"phoneNumber"}
              label="Số điện thoại"
              initialValue={user.phone_number}
            >
              <Input></Input>
            </Form.Item>
            <Form.Item name={"email"} label="Email" initialValue={user.email}>
              <Input></Input>
            </Form.Item>
            <Form.Item name={"role"} label="Chức vụ" initialValue={user.role}>
              <Radio.Group
                optionType="button"
                options={[
                  {
                    label: "Nhân viên",
                    value: roleEnum.STAFF,
                  },
                  {
                    label: "Quản lý",
                    value: roleEnum.MANAGER,
                  },
                ]}
              ></Radio.Group>
            </Form.Item>
            <Form.Item
              name={"isActive"}
              label="Trạng thái"
              initialValue={isActive}
            >
              <AntdSwitch
                unCheckedChildren="Ngừng"
                checkedChildren="Kích hoạt"
              ></AntdSwitch>
            </Form.Item>

            <div className={styles.edit_form_control}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  <IoMdCheckmarkCircleOutline
                    size={20}
                  ></IoMdCheckmarkCircleOutline>{" "}
                  Lưu
                </Button>
              </Form.Item>

              <Button
                type="primary"
                danger
                onClick={() => handleDeleteUser(user.id)}
              >
                <IoTrashBinOutline size="20"></IoTrashBinOutline>Xóa
              </Button>
            </div>
          </Form>
        </Modal>
      </>
    );
}
