"use client";
import { Room } from "@/types/room.interface";
import { locationToString } from "@/utils/helpers";
import Image from "next/image";
import Card from "./Card";
import Link from "next/link";
import Button from "./Button";

interface Props {
  Room: Room;
}

export default function RoomCard({ Room }: Props) {
  return (
    <Card>
      <div className="block ">
        <div className="relative ">
          <div className=" overflow-hidden w-[300px] h-[175px]">
            <Image
              src={Room.image_url}
              width={300}
              height={200}
              alt={Room.name}
            ></Image>
          </div>
          <div className="flex justify-between absolute bottom-0 left-0 w-full px-6 text-stone-200 text-lg font-bold">
            <div>{Room.location.city}</div>
            <div>{Room.price}đ</div>
          </div>
        </div>
      </div>
      <div className="mt-3 px-4 w-[300px] overflow-hidden ">
        <div className="text-xl text-ellipsis overflow-hidden text-nowrap mb-1">
          {Room.name}
        </div>
        <div className="text-sm">{locationToString(Room)}</div>
        <div className="text-sm">Show more map</div>
        <div className="flex justify-center mt-4">
          <Link href={`/room/${Room.id}`}>
            <Button>Xem chi tiết</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}