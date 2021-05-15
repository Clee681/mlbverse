import { format } from "date-fns";

export const fmtDate = (d: Date) => format(d, "MM/dd/yyyy");
