"use client";

import { API_URL } from "@/lib/api";

import Image from "next/image";
import { useState, useEffect, useContext } from "react";

import AvatarUploadStyles from '@/app/styles/components/avatarupload.module.css';
import { AuthContext } from "@/context/AuthContext";

import UploadIcon from "@/public/upload.svg"

type Props = {
  userId: number;
  username: string;
  size: number;
  onUploadSuccess: () => void;
};

export default function AvatarUpload({ userId, username, size, onUploadSuccess }: Props) {
    const { user, setUser } = useContext(AuthContext)!;
    const [avatarUrl, setAvatarUrl] = useState<string>("/avatar.svg");
    const [uploaded, setUploaded] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/api/users/${username}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.avatar) {
            setAvatarUrl(`${API_URL}/uploads/avatars/${data.avatar}`);
            }
        });
    }, [userId]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
            `${API_URL}/api/users/${userId}/avatar`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await response.json();

        if (data.avatarUrl) {
            const newAvatarUrl = `${API_URL}/uploads/avatars/${data.avatarUrl}`;
            setAvatarUrl(newAvatarUrl);

            if (user && setUser) {
                setUser({ ...user, avatar: data.avatarUrl });
                setUploaded(true);
                onUploadSuccess();
            }
        }
    };

  return (
    <div className={AvatarUploadStyles.avatar}>
        <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{width: size, height: size}}
        />

      <div className={`${AvatarUploadStyles.image} ${!uploaded && AvatarUploadStyles.showUpload}`}>
        <Image
          src={avatarUrl}
          width={size}
          height={size}
          alt="avatar"
        />
        {!uploaded && <UploadIcon className={AvatarUploadStyles.uploadIcon} style={{width: size/2, height: size/2}} /> }
        
      </div>
    </div>
  );
}