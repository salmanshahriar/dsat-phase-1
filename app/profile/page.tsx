"use client";

import { Suspense, useEffect, useState } from "react";
import ProfileContent from "@/components/profile/profile-content";
import { useRouter } from 'next/navigation';

const router = useRouter();
async function getProfileData {
  const sessionData = typeof window !== "undefined" ? 
    document.cookie.split('; ').find(row => row.startsWith('session_data='))?.split('=')[1] || "" : "";

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
      const [name] = cookie.split("=");
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    
    router.push("/login");
    router.refresh();
    return null; // Return null for unauthorized case
  }

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Fetch failed with status ${res.status}: ${errorText}`);
    throw new Error(`Failed to fetch profile data: ${res.status} - ${errorText}`);
  }

  return res.json();
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter(); // Move useRouter inside the component

  useEffect(() => {
    getProfileData(router)
      .then(data => {
        if (data) setProfileData(data); // Only set data if not null
      })
      .catch(err => setError(err.message));
  }, [router]); // Add router to dependency array

  if (error) {
    return <div>Error loading profile: {error}</div>;
  }

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      {profileData ? <ProfileContent profileData={profileData} /> : <ProfileSkeleton />}
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