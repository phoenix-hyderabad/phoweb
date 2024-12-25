"use server";

import { db } from "~/server/db";

export const getProfessors = async () => {
  return await db.query.professors.findMany({
    orderBy(fields, { desc }) {
      return desc(fields.faculty);
    },
  });
};
