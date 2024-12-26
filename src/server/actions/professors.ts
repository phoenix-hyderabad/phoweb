"use server";

import { db } from "~/server/db";
import { auth } from "~/server/auth";
import { checkAccess } from "~/lib/auth";
import { professors } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const getProfessors = async () => {
  return await db.query.professors.findMany({
    orderBy(fields, { desc }) {
      return desc(fields.faculty);
    },
  });
};

export const AddProfessor = async (data: typeof professors.$inferInsert) => {
  const session = await auth();
  checkAccess(session, "professors:edit");
  await db
    .insert(professors)
    .values(data)
    .onConflictDoUpdate({
      set: {
        ...data,
      },
      target: professors.id,
    });
};

export const DeleteProfessor = async (id: number) => {
  const session = await auth();
  checkAccess(session, "professors:edit");
  await db.delete(professors).where(eq(professors.id, id));
};
