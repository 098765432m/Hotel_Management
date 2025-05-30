"use server";

import { hashedPassword } from "@/lib/auth";
import { prisma } from "@/lib/client";
import ShortUniqueId from "short-unique-id";

interface DetailInfo {
  id: string;
  name: string;
}

interface contactRequest {
  hotel_name: string;
  user_fullName: string;
  user_email: string;
  user_phoneNumber: string;
  street: string;
  ward: DetailInfo;
  district: DetailInfo;
  province: DetailInfo;
}

// Create new Hotel and User via Transaction
export async function createContact(formData: FormData) {
  //Lấy dữ liệu từ formData
  const newContact: contactRequest = {
    hotel_name: formData.get("hotel_name") as string,
    user_fullName: formData.get("user_fullName") as string,
    user_email: formData.get("user_email") as string,
    user_phoneNumber: formData.get("user_phoneNumber") as string,
    street: formData.get("street") as string,
    ward: JSON.parse(formData.get("ward") as string),
    district: JSON.parse(formData.get("district") as string),
    province: JSON.parse(formData.get("province") as string),
  };

  //Check empty input
  if (
    newContact.hotel_name == "" ||
    newContact.user_fullName == "" ||
    newContact.user_email == "" ||
    newContact.street == "" ||
    newContact.ward == null ||
    newContact.district == null ||
    newContact.province == null
  )
    throw new Error("Request fail");

  //Transaction for create Hotel and User
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const newHotel = await prisma.hotel.create({
        data: {
          name: newContact.hotel_name,
          address: {
            street: newContact.street,
            ward: newContact.ward.name,
            district: newContact.district.name,
            province: newContact.province.name,
          },
        },
      });

      //Create UID for user
      const uid = new ShortUniqueId({ length: 6 });

      const newUser = await prisma.user.create({
        data: {
          id: uid.rnd(),
          username: newContact.user_email,
          password: await hashedPassword("113446"), //Mật khẩu mặc định
          full_name: newContact.user_fullName,
          email: newContact.user_email,
          phone_number: newContact.user_phoneNumber,
          role: "MANAGER",

          hotel_id: newHotel.id,
        },
      });
      return { newHotel, newUser };
    });
  } catch (error: any) {
    console.log("*Error: " + error.message);
  }
}

// Create new Manager/Staff via Manager user
export async function createDashboardUser(formData: FormData) {
  //Lấy dữ liệu từ formData
  const newDashBoardUser = {
    hotel_name: formData.get("username") as string,
    user_fullName: formData.get("fullName") as string,
    user_email: formData.get("email") as string,
    street: formData.get("role") as string,
  };

  // const user = await prisma.user.create({})
}

export async function updateAccount(formData: FormData) {
  //Lây dữ liệu từ formData
  const userRequest = {
    username: formData.get("username") as string,
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
  };

  const updatedUser = await prisma.user.update({
    where: {
      username: userRequest.username,
    },
    data: {
      username: userRequest.username,
      full_name: userRequest.fullName,
      email: userRequest.email,
    },
  });

  // const response: UserUpdateResponse = updatedUser;
}
