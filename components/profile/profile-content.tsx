"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Shield, Fingerprint, Loader2, Server } from "lucide-react";

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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <Card className="backdrop-blur-md bg-opacity-80 border shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="border-b p-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <User className="h-6 w-6" />
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileItem icon={<User className="h-5 w-5" />} label="Name" value={profileData.full_name} />
            <ProfileItem icon={<Mail className="h-5 w-5" />} label="Email" value={profileData.email} />
            <ProfileItem icon={<Phone className="h-5 w-5" />} label="Phone" value={profileData.phone} />
            <ProfileItem
              icon={<Shield className="h-5 w-5" />}
              label="Role"
              value={<Badge variant="secondary">{profileData.userRole}</Badge>}
            />
          </CardContent>
        </Card>

        {/* Device Fingerprint Card */}
        <Card className="backdrop-blur-md bg-opacity-80 border shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="border-b p-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <Fingerprint className="h-6 w-6" />
              Device Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow className="border-b hover:bg-transparent">
                  <TableHead className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Device ID
                  </TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Fingerprint</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profileData.deviceFingerprint.map((device) => (
                  <TableRow
                    key={device.device_id}
                    className="border-b hover:bg-opacity-10 transition-colors duration-200"
                  >
                    <TableCell className="font-mono text-sm">{device.device_id}</TableCell>
                    <TableCell className="text-sm">{device.ipAddress}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm font-mono" title={device.fingerprint}>
                      {device.fingerprint}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-opacity-10 hover:bg-opacity-20 transition-colors duration-200">
      <div className="p-2 bg-opacity-20 rounded-lg">{icon}</div>
      <div>
        <dt className="text-sm">{label}</dt>
        <dd className="text-lg font-medium">{value}</dd>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <Card className="backdrop-blur-md bg-opacity-80 border shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="border-b p-6">
            <div className="h-8 w-1/3 bg-opacity-30 rounded"></div>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-opacity-10">
                <div className="h-10 w-10 bg-opacity-20 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-opacity-30 rounded"></div>
                  <div className="h-6 w-32 bg-opacity-30 rounded"></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-opacity-80 border shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="border-b p-6">
            <div className="h-8 w-1/3 bg-opacity-30 rounded"></div>
          </CardHeader>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  {[...Array(3)].map((_, i) => (
                    <TableHead key={i}>
                      <div className="h-4 w-24 bg-opacity-30 rounded"></div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(3)].map((_, i) => (
                  <TableRow key={i} className="border-b">
                    {[...Array(3)].map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 w-full bg-opacity-30 rounded"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}