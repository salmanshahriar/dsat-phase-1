"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import ProfileContent from "@/components/profile/profile-content";
import { useRouter } from "next/navigation";

// Define Router type
interface Router {
  push: (href: string, options?: { scroll?: boolean }) => void;
  replace: (href: string, options?: { scroll?: boolean }) => void;
  refresh: () => void;
  back: () => void;
  forward: () => void;
  prefetch: (href: string) => void;
}

// Updated ProfileData type based on error message
interface ProfileData {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  userRole: string;
  rewardPoint: number;
  createdAt: string;
  updatedAt?: string;
  bio?: string;
}

async function getProfileData(router: Router): Promise<ProfileData | null> {
  const sessionData =
    typeof window !== "undefined"
      ? document.cookie
          .split("; ")
          .find((row) => row.startsWith("session_data="))
          ?.split("=")[1] || ""
      : "";

  try {
    const res = await fetch("https://zoogle.projectdaffodil.xyz/api/v1/getProfile", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData}`,
      },
    });

    if (res.status === 401) {
      document.cookie.split(";").forEach((cookie) => {
        const [name] = cookie.trim().split("=");
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
      router.push("/login");
      router.refresh();
      return null;
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch profile: ${res.status} - ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Profile fetch error:", error);
    throw error;
  }
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    try {
      const data = await getProfileData(router);
      if (data) {
        setProfileData(data);
        setError(null);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading profile: {error}</p>
        <button onClick={fetchProfile}>Retry</button>
      </div>
    );
  }

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      {profileData ? (
        <ProfileContent profileData={profileData} />
      ) : (
        <ProfileSkeleton />
      )}
    </Suspense>
  );
}

function ProfileSkeleton() {
  return (
    <div className="h-[calc(100vh-64px)] overflow-auto mx-auto p-4 space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-3/4"></div>
        ))}
      </div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );
}