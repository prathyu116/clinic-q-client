// client/src/components/AlertMessage.jsx
import React from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

const AlertMessage = ({ type = "info", message }) => {
  if (!message) return null;

  let bgColor, textColor, Icon;

  switch (type) {
    case "success":
      bgColor = "bg-green-100";
      textColor = "text-green-700";
      Icon = CheckCircleIcon;
      break;
    case "error":
      bgColor = "bg-red-100";
      textColor = "text-red-700";
      Icon = XCircleIcon;
      break;
    case "info":
    default:
      bgColor = "bg-blue-100";
      textColor = "text-blue-700";
      Icon = InformationCircleIcon;
      break;
  }

  return (
    <div className={`p-4 rounded-md ${bgColor} my-4`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${textColor}`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default AlertMessage;
