"use client"; // Add this to make it a Client Component

import { Suspense, useEffect, useState } from "react";
import ProfileContent from "@/components/profile/profile-content";

async function getProfileData() {
  const sessionData = typeof window !== "undefined" ? document.cookie.split('; ').find(row => row.startsWith('session_data='))?.split('=')[1] || "" : "";
  console.log("Session Data:", sessionData);

  const res = await fetch("https://zoogle.projectdaffodil.xyz/api/v1/getProfile", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionData}`,
    },
  });

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

  useEffect(() => {
    getProfileData()
      .then(data => setProfileData(data))
      .catch(err => setError(err.message));
  }, []);

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
    <div className="h-[calc(100vh-64px)] overflow-auto  mx-auto p-4 space-y-4 animate-pulse ">
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