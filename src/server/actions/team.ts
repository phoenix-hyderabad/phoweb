"use server";

import { db } from "~/server/db";
import type { Team } from "~/server/db/schema";

const CURRENT_YEAR = 2024;

export const getTeam = async () => {
  const members = await db.query.members.findMany();

  const accum: Record<
    string,
    {
      year: string;
      current: boolean;
      pors: {
        student: string;
        designation: string;
        contact?: string;
        socials?: { site: string; username: string }[];
      }[];
      members: Record<
        Team,
        { student: string; link?: string; ispoc?: boolean }[]
      >;
    }
  > = {};

  const groupedAndSortedMembers = members.reduce((acc, member) => {
    const year =
      member.year.toString() +
      `-${member.year % 100 ? member.year % 100 : member.year}`;

    if (!acc[year]) {
      acc[year] = {
        year,
        current: member.year === CURRENT_YEAR,
        pors: [],
        members: {
          it: [],
          tech: [],
          editorial: [],
          design: [],
        },
      };
    }
    if (member.ispor) {
      acc[year].pors.push({
        student: member.name,
        designation: member.designation,
        contact: member.contact ?? undefined,
        socials: [],
      });
    }

    if (member.team) {
      const team = member.team;
      if (!acc[year].members[team]) {
        acc[year].members[team] = [];
      }
      acc[year].members[team].push({
        student: member.name,
        link: member.link ?? undefined,
        ispoc: member.ispoc || undefined,
      });
    }

    return acc;
  }, accum);

  return Object.values(groupedAndSortedMembers);
};

export type TeamType = Awaited<ReturnType<typeof getTeam>>[number];
