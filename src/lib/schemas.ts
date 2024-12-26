import { z } from "zod";
import { type members, teams } from "~/server/db/schema";

const emptyStringToUndefined = (e?: string) => (e === "" ? undefined : e);

export const addMemberSchema: z.ZodType<typeof members.$inferInsert> = z.object(
  {
    uid: z.string().nonempty("UID cannot be empty"),
    name: z
      .string()
      .trim()
      .min(4, "Name should have at least 4 characters")
      .max(48, "Name should have at most 48 characters"),
    year: z.coerce
      .number()
      .int()
      .min(2020, "Year cannot be less than 2020")
      .max(
        new Date().getFullYear(),
        "Must be equal to or less than the current year",
      ),
    ispor: z.boolean().optional(),
    designation: z.string().optional().transform(emptyStringToUndefined),
    team: z.union([z.null(), z.enum(teams.enumValues)]).optional(),
    project: z.string().optional().transform(emptyStringToUndefined),
    ispoc: z.boolean().optional(),
    link: z
      .union([z.string().url("Link must be a valid URL"), z.string().length(0)])
      .optional()
      .transform(emptyStringToUndefined),
    contact: z
      .union([
        z.string().length(10, "Phone number should have 10 digits"),
        z.string().length(0),
      ])
      .optional()
      .transform(emptyStringToUndefined),
  },
);

export const deleteMemberSchema = z.object({
  uid: z.string().nonempty("UID cannot be empty"),
  year: z.number().int(),
});
