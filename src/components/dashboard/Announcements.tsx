
import React from "react";
import { Announcement, formatShortDate } from "@/lib/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BellRing, CalendarDays, CreditCard, PiggyBank, AlertCircle, MessageSquare } from "lucide-react";

interface AnnouncementsProps {
  announcements: Announcement[];
}

export function Announcements({ announcements }: AnnouncementsProps) {
  // Get the 3 most recent announcements
  const recentAnnouncements = [...announcements]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 3);

  // Get icon based on announcement category
  const getAnnouncementIcon = (category: string) => {
    switch (category) {
      case "dividend":
        return <PiggyBank className="h-4 w-4" />;
      case "loan":
        return <CreditCard className="h-4 w-4" />;
      case "event":
        return <CalendarDays className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Latest updates from SACCO</CardDescription>
          </div>
          <BellRing className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAnnouncements.length > 0 ? (
            recentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {announcement.isImportant && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Important
                    </Badge>
                  )}
                  <Badge variant="outline" className="gap-1">
                    {getAnnouncementIcon(announcement.category)}
                    <span className="capitalize">{announcement.category}</span>
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formatShortDate(announcement.date)}
                  </span>
                </div>
                <h3 className="font-medium text-sm">{announcement.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {announcement.content}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No recent announcements.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
