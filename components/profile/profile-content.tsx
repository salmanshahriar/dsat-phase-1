"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Shield, Fingerprint, Server, Hash, Globe } from "lucide-react";

interface DeviceFingerprint {
  success: boolean;
  device_id: string;
  accessToken: string;
  ipAddress: string;
  fingerprint: string;
}

interface ProfileData {
  email: string;
  full_name: string;
  phone: string;
  userRole: string;
  rewardPoint: number;
  deviceFingerprint: DeviceFingerprint[];
  creationTime: string;
  schoolId: string | null;
}

export default function ProfileContent({ profileData }: { profileData: ProfileData }) {
  return (
    <div className="h-[calc(100vh-64px)] overflow-auto  p-6 md:p-8 bg-gray-50 dark:bg-slate-900">
      <div className="mx-auto space-y-6 md:space-y-8 w-full md:max-w-none">
        {/* Profile Card */}
        <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-lg md:text-xl font-medium tracking-tight">
            Profile
        </div>
        <Card className="border-0 shadow-sm rounded-lg bg-white dark:bg-slate-800 overflow-hidden">
          
          <CardContent className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-6">
            <ProfileItem icon={<User className="h-4 w-4 md:h-5 md:w-5 text-indigo-500" />} label="Name" value={profileData.full_name} />
            <ProfileItem icon={<Mail className="h-4 w-4 md:h-5 md:w-5 text-indigo-500" />} label="Email" value={profileData.email} />
            <ProfileItem icon={<Phone className="h-4 w-4 md:h-5 md:w-5 text-indigo-500" />} label="Phone" value={profileData.phone} />
            <ProfileItem
              icon={<Shield className="h-4 w-4 md:h-5 md:w-5 text-indigo-500" />}
              label="Role"
              value={<Badge variant="outline" className="border-indigo-500 text-indigo-500 text-xs md:text-sm py-0 md:py-0.5">{profileData.userRole}</Badge>}
            />
          </CardContent>
        </Card>
        </div>

        {/* Device Logs */}
        <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-lg md:text-xl font-medium tracking-tight">
        Device Logs
        </div>
        <Card className="border-0 shadow-sm rounded-lg bg-white dark:bg-slate-800 overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <ScrollArea className="max-h-[200px] md:max-h-[400px] w-full rounded-md border border-indigo-500/10">
              <div className="p-3 md:p-4 space-y-3 md:space-y-4">
                {profileData.deviceFingerprint.map((device, index) => (
                  <HoverCard key={device.device_id} openDelay={100} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <div className="flex items-center gap-3 text-xs md:text-sm font-mono bg-indigo-500/5 p-2 md:p-3 rounded-md cursor-pointer hover:bg-indigo-500/10 transition-colors duration-150">
                        <span className="text-indigo-500 w-10 md:w-12 shrink-0">[#{index + 1}]</span>
                        <span className="truncate">{device.device_id} | {device.ipAddress} | {device.fingerprint.substring(0, 20)}...</span>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-full md:w-[800px] bg-white dark:bg-slate-800 border-indigo-500/10 shadow-md p-4 md:p-5">
                      <div className="space-y-3 text-xs md:text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                          <div className="flex items-center gap-2">
                            <Server className="h-4 w-4 text-indigo-500" />
                            <span><strong>Device ID:</strong> {device.device_id}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-indigo-500" />
                            <span><strong>IP Address:</strong> {device.ipAddress}</span>
                          </div>
                        </div>
                        <Separator className="bg-indigo-500/20" />
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start gap-2">
                            <Fingerprint className="h-4 w-4 text-indigo-500 mt-0.5" />
                            <span className="break-all"><strong>Fingerprint:</strong> {device.fingerprint}</span>
                          </div>
                        </div>
                        <Separator className="bg-indigo-500/20" />
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-indigo-500" />
                          <span><strong>Success:</strong> <Badge variant={device.success ? "default" : "destructive"} className={device.success ? "bg-indigo-500" : ""}>{device.success ? "Yes" : "No"}</Badge></span>
                        </div>
                        <Separator className="bg-indigo-500/20" />
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-indigo-500" />
                          <span><strong>Logged At:</strong> {new Date().toLocaleString()} <span className="text-gray-500 dark:text-gray-400 text-xs">(Estimated)</span></span>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-md hover:bg-indigo-500/5 transition-colors duration-150">
      <div className="p-1 md:p-1.5 rounded-full bg-indigo-500/10">{icon}</div>
      <div className="min-w-0">
        <dt className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 tracking-tight">{label}</dt>
        <dd className="text-sm md:text-base font-medium truncate">{value}</dd>
      </div>
    </div>
  );
}