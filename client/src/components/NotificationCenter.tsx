import React, { useState } from "react";
import { Bell, X, Trash2 } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { NotificationToast } from "./NotificationToast";

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    removeNotification,
    markAsRead,
    markAllAsRead,
    togglePin,
    clearAll,
  } = useNotifications();

  const pinnedNotifications = notifications.filter(n => n.isPinned);
  const unpinnedNotifications = notifications.filter(n => !n.isPinned);

  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-black/5 rounded-lg transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Notifications</h2>
            <div className="flex gap-2">
              {notifications.length > 0 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    title="Mark all as read"
                  >
                    Mark all read
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="text-red-600 hover:text-red-700"
                    title="Clear all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-black/10 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {/* Pinned Notifications */}
                {pinnedNotifications.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-muted-foreground">
                      Pinned
                    </div>
                    {pinnedNotifications.map(notif => (
                      <div
                        key={notif.id}
                        className={`p-3 border-l-4 border-yellow-400 ${
                          notif.isRead ? "bg-gray-50" : "bg-blue-50"
                        }`}
                      >
                        <NotificationToast
                          notification={notif}
                          onClose={() => removeNotification(notif.id)}
                          onMarkAsRead={() => markAsRead(notif.id)}
                          onTogglePin={() => togglePin(notif.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Unpinned Notifications */}
                {unpinnedNotifications.length > 0 && (
                  <div>
                    {pinnedNotifications.length > 0 && (
                      <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-muted-foreground">
                        Recent
                      </div>
                    )}
                    {unpinnedNotifications.map(notif => (
                      <div
                        key={notif.id}
                        className={`p-3 ${notif.isRead ? "bg-gray-50" : "bg-blue-50"}`}
                      >
                        <NotificationToast
                          notification={notif}
                          onClose={() => removeNotification(notif.id)}
                          onMarkAsRead={() => markAsRead(notif.id)}
                          onTogglePin={() => togglePin(notif.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
