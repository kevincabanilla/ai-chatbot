// lib/utils.ts
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
  isValid,
  isThisYear,
  type Day,
} from "date-fns";
import type { MessageItem } from "@/interfaces";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error("Failed to copy text:", error);
  }
};

export function getMessageDate(item: MessageItem) {
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const date = new Date(item.dateCreated || (item.timestamp ?? Date.now()));
  return isValid(date) ? date : null;
}

export function getDateLabel(date: string | number | Date) {
  const weekStartsOn = ((new Date().getDay() + 1) % 7) as Day;

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isThisWeek(date, { weekStartsOn })) return format(date, "EEEE");
  return format(date, isThisYear(date) ? "MMM d" : "MMM d, yyyy");
}
