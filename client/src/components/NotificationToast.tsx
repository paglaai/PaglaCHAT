import React from "react";
import { X, Pin, Check, AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { Notification } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
  onMarkAsRead: () => void;
  onTogglePin: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onMarkAsRead,
  onTogglePin,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Check className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${getBgColor()} shadow-md animate-slide-in`}
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-foreground">{notification.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>

        {notification.action && notification.actionLabel && (
          <Button
            variant="link"
            size="sm"
            className="mt-2 p-0 h-auto"
            onClick={() => {
              // Handle action
              window.location.href = notification.action || "#";
            }}
          >
            {notification.actionLabel}
          </Button>
        )}
      </div>

      <div className="flex gap-1 flex-shrink-0">
        {!notification.isRead && (
          <button
            onClick={onMarkAsRead}
            className="p-1 hover:bg-black/10 rounded transition-colors"
            title="Mark as read"
          >
            <Check className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={onTogglePin}
          className={`p-1 rounded transition-colors ${
            notification.isPinned ? "bg-black/10" : "hover:bg-black/10"
          }`}
          title={notification.isPinned ? "Unpin" : "Pin"}
        >
          <Pin className="w-4 h-4" />
        </button>

        <button
          onClick={onClose}
          className="p-1 hover:bg-black/10 rounded transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
