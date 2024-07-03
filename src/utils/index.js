import format from "date-fns/format";

export const preferredDateFormat = "yyyy-MM-dd HH:mm (z)";
export const formatDate = (date, dateFormat = preferredDateFormat) => (date ? format(new Date(date), dateFormat) : "");

export * from "./api";
export * from "./environment";
export * from "./misc";
export * from "./document";
