"use client";

import styles from "@/styles/auth/login.module.scss";
import authService from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import React from "react";
import { UserCookieResponse } from "@/types/dto/user.dto";
import { roleEnum } from "@/types/enum/role.enum";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { logIn } from "@/state/user/authSlice";
import CardDefault from "@/components/custom-component/CardDefault";
import { useForm } from "@mantine/form";
import { Box, LoadingOverlay, PasswordInput, TextInput } from "@mantine/core";
import MantineButton from "@/components/custom-component/MantineButton";
import NextLink from "@/components/custom-component/NextLink";
import ErrorCustomNotify from "@/components/custom-component/notification/ErrorCustomNotify";
import { AxiosError } from "axios";
import { RiLoginBoxLine } from "react-icons/ri";

export default function LoginPage() {
  const router = useRouter();
  const [loginStatus, setLoginStatus] = useState<null | {
    status: "LOADING" | "ERROR";
    message: string;
  }>(null);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) =>
        value.length < 5 ? "Tên đăng nhập không hợp lệ!" : null,
      password: (value) => (value.length < 5 ? "Mật khẩu không hợp lệ!" : null),
    },
  });
  // Global Dispatch START

  const dispatch = useDispatch<AppDispatch>();

  // Global Dispatch END

  // Xử lý Submit của Form
  const handleSubmit = async (username: string, password: string) => {
    // form.validate();
    try {
      setLoginStatus({ status: "LOADING", message: "" });
      const user: UserCookieResponse | null = await authService.login(
        username,
        password
      ); //Get user info
      setLoginStatus(null);

      if (user != null) {
        dispatch(logIn(user));

        // Chuyển hướng trang tùy theo role
        switch (user.role) {
          case roleEnum.ADMIN:
            router.push("/admin");
            break;
          case roleEnum.MANAGER || roleEnum.STAFF:
            router.push("/dashboard");
            break;
          case roleEnum.GUEST:
            router.push("/");
            break;

          default:
            break;
        }
      }
    } catch (error) {
      setLoginStatus({ status: "ERROR", message: "Đã có lỗi xảy ra" });
      if (error instanceof AxiosError) {
        setLoginStatus({
          status: "ERROR",
          message: error.response!.data.message,
        });
      }
    }
  };
  return (
    <CardDefault className={styles.login_form_container}>
      <Box pos={"relative"}>
        <LoadingOverlay
          visible={loginStatus?.status === "LOADING"}
        ></LoadingOverlay>
        <div className={styles.login_form_heading}>Đăng nhập</div>
        <form
          className={styles.login_form}
          onSubmit={form.onSubmit((values) =>
            handleSubmit(values.username, values.password)
          )}
        >
          <TextInput
            withAsterisk
            label="Tên đăng nhập"
            placeholder="Nhập tên đăng nhập hoặc email"
            key={form.key("username")}
            {...form.getInputProps("username")}
          ></TextInput>
          <div>
            <PasswordInput
              withAsterisk
              label="Mật khẩu"
              placeholder="Mật khẩu"
              key={form.key("password")}
              {...form.getInputProps("password")}
            ></PasswordInput>
            <div className={styles.register_link}>
              <NextLink href={`/register`}>Chưa có tài khoản</NextLink>
            </div>

            {/* Báo lỗi cho khách hàng */}
            {loginStatus?.status === "ERROR" && (
              <ErrorCustomNotify
                message={loginStatus.message}
              ></ErrorCustomNotify>
            )}
          </div>
          <div className={styles.login_form_control}>
            <MantineButton type="submit">
              <div className={styles.login_button_text}>
                <span>Đăng nhập</span>{" "}
                <RiLoginBoxLine size={20}></RiLoginBoxLine>
              </div>
            </MantineButton>
          </div>
        </form>
      </Box>
    </CardDefault>
  );
}
