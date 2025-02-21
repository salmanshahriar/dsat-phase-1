"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ProfileData {
  email: string;
  full_name: string;
  phone: string;
  userRole: string;
  rewardPoint: number;
  deviceFingerprint: {
    success: boolean;
    device_id: string;
    accessToken: string;
    ipAddress: string;
    fingerprint: string;
  }[];
  creationTime: string;
  schoolId: string | null;
}

export default function ProfileContent({ profileData }: { profileData: ProfileData }) {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading with useEffect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="font-medium text-gray-500">Full Name</dt>
              <dd>{profileData.full_name}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Email</dt>
              <dd>{profileData.email}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Phone</dt>
              <dd>{profileData.phone}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">User Role</dt>
              <dd>
                <Badge>{profileData.userRole}</Badge>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Device Fingerprint Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device ID</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Fingerprint</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profileData.deviceFingerprint.map((device) => (
                <TableRow key={device.device_id}>
                  <TableCell>{device.device_id}</TableCell>
                  <TableCell>{device.ipAddress}</TableCell>
                  <TableCell className="max-w-xs truncate">{device.fingerprint}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 animate-pulse">
      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Device Fingerprint Logs Card */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><div className="h-4 bg-gray-200 rounded w-20"></div></TableHead>
                <TableHead><div className="h-4 bg-gray-200 rounded w-20"></div></TableHead>
                <TableHead><div className="h-4 bg-gray-200 rounded w-20"></div></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => ( // Simulate 3 rows
                <TableRow key={i}>
                  <TableCell><div className="h-4 bg-gray-200 rounded w-full"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded w-full"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded w-full max-w-xs"></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}