
import React from "react";
import { 
  Bell, 
  Info, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Clock 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock notification data
const notifications = [
  {
    id: 1,
    type: "info",
    title: "Monthly Contribution",
    message: "Your monthly contribution of KES 5,000 has been received.",
    date: "Today, 9:30 AM",
    read: false
  },
  {
    id: 2,
    type: "alert",
    title: "Loan Payment Due",
    message: "Your loan payment of KES 12,500 is due in 3 days.",
    date: "Yesterday, 2:15 PM",
    read: true
  },
  {
    id: 3,
    type: "success",
    title: "Loan Approved",
    message: "Your loan application for KES 100,000 has been approved.",
    date: "Mar 15, 2025",
    read: true
  },
  {
    id: 4,
    type: "info",
    title: "Interest Credited",
    message: "Interest of KES 1,250 has been credited to your savings account.",
    date: "Mar 10, 2025",
    read: true
  },
  {
    id: 5,
    type: "alert",
    title: "Document Verification",
    message: "Please update your KRA PIN certificate before April 30th.",
    date: "Mar 5, 2025",
    read: false
  },
  {
    id: 6,
    type: "info",
    title: "Annual General Meeting",
    message: "The AGM will be held on April 25th at 10:00 AM at Kiambu Town Hall.",
    date: "Mar 1, 2025",
    read: true
  }
];

// Mock announcement data
const announcements = [
  {
    id: 1,
    title: "New Education Loan Product",
    message: "We are pleased to announce our new education loan product with reduced interest rates for all members.",
    date: "Mar 20, 2025",
    important: true
  },
  {
    id: 2,
    title: "System Maintenance Notice",
    message: "Our online systems will be undergoing maintenance on March 30th from 11 PM to 2 AM.",
    date: "Mar 18, 2025",
    important: false
  },
  {
    id: 3,
    title: "New Kiambu Branch Opening",
    message: "We are excited to announce the opening of our new branch in Kiambu Town on April 1st.",
    date: "Mar 15, 2025",
    important: true
  }
];

// Upcoming events data
const upcomingEvents = [
  {
    id: 1,
    title: "Financial Literacy Workshop",
    date: "April 5, 2025",
    time: "10:00 AM - 1:00 PM",
    location: "Kiambu SACCO Hall"
  },
  {
    id: 2,
    title: "Annual General Meeting",
    date: "April 25, 2025",
    time: "10:00 AM - 2:00 PM",
    location: "Kiambu Town Hall"
  },
  {
    id: 3,
    title: "Investment Opportunities Seminar",
    date: "May 10, 2025",
    time: "2:00 PM - 5:00 PM",
    location: "Kiambu SACCO Hall"
  }
];

const NotificationItem = ({ notification }: { notification: any }) => {
  const getIcon = () => {
    switch (notification.type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className={`p-4 border-b ${!notification.read ? 'bg-blue-50' : ''}`}>
      <div className="flex gap-3">
        <div className="mt-1">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">
              {notification.title}
              {!notification.read && (
                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">New</Badge>
              )}
            </h3>
            <span className="text-sm text-gray-500">{notification.date}</span>
          </div>
          <p className="text-gray-600 mt-1">{notification.message}</p>
        </div>
      </div>
    </div>
  );
};

const AnnouncementItem = ({ announcement }: { announcement: any }) => {
  return (
    <div className="p-4 border-b">
      <div className="flex gap-3">
        <div className="mt-1">
          <Info className={`h-5 w-5 ${announcement.important ? 'text-red-500' : 'text-blue-500'}`} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">
              {announcement.title}
              {announcement.important && (
                <Badge variant="destructive" className="ml-2">Important</Badge>
              )}
            </h3>
            <span className="text-sm text-gray-500">{announcement.date}</span>
          </div>
          <p className="text-gray-600 mt-1">{announcement.message}</p>
        </div>
      </div>
    </div>
  );
};

const EventItem = ({ event }: { event: any }) => {
  return (
    <div className="p-4 border-b">
      <div className="flex gap-3">
        <div className="mt-1">
          <Calendar className="h-5 w-5 text-indigo-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{event.title}</h3>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Clock className="h-4 w-4 mr-1" />
            <span>{event.time}</span>
          </div>
          <p className="text-gray-600 mt-1">{event.location}</p>
        </div>
      </div>
    </div>
  );
};

const Notifications = () => {
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notifications & Updates</h1>
        <p className="text-muted-foreground">
          Stay informed about your account, announcements, and upcoming events
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">
                  Unread
                  {unreadCount > 0 && (
                    <Badge className="ml-2 bg-blue-100 text-blue-800" variant="secondary">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>
              
              <Button variant="outline" size="sm">
                Mark All as Read
              </Button>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>All Notifications</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map(notification => (
                        <NotificationItem key={notification.id} notification={notification} />
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No notifications to display
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="unread" className="mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Unread Notifications</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {notifications.filter(n => !n.read).length > 0 ? (
                    <div>
                      {notifications
                        .filter(notification => !notification.read)
                        .map(notification => (
                          <NotificationItem key={notification.id} notification={notification} />
                        ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No unread notifications
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="announcements" className="mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Announcements</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {announcements.length > 0 ? (
                    <div>
                      {announcements.map(announcement => (
                        <AnnouncementItem key={announcement.id} announcement={announcement} />
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No announcements to display
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="events" className="mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {upcomingEvents.length > 0 ? (
                    <div>
                      {upcomingEvents.map(event => (
                        <EventItem key={event.id} event={event} />
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No upcoming events
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-500" />
                    <span>Total Notifications</span>
                  </div>
                  <Badge>{notifications.length}</Badge>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <span>Unread</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {notifications.filter(n => !n.read).length}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-red-500" />
                    <span>Important Announcements</span>
                  </div>
                  <Badge variant="destructive">
                    {announcements.filter(a => a.important).length}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-500" />
                    <span>Upcoming Events</span>
                  </div>
                  <Badge variant="outline">{upcomingEvents.length}</Badge>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-amber-500" />
                    <span>Loan Alerts</span>
                  </div>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    {notifications.filter(n => n.title.includes("Loan")).length}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <span>Payment Notifications</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {notifications.filter(n => 
                      n.title.includes("Payment") || 
                      n.title.includes("Contribution") || 
                      n.title.includes("Interest")
                    ).length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Notification Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
