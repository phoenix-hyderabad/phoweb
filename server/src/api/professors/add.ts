import { AppError, HttpCode } from "@/config/errors";
import db from "@/lib/db";
import { professors } from "@/lib/db/schema/professors";
import { checkAccess } from "@/lib/middleware/resources";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import { z } from "zod";
import { fromError } from "zod-validation-error";
const router = express.Router();

const bodySchema = z.object({
    id: z.number(),
    faculty: z.string(),
    designation: z.string(),
    qualification: z.string(),
    joinedBits: z.string(),
    interests: z.string(),
    coursesTaught: z.string(),
    experiences: z.string().optional(),
    labWebsite: z.string().optional(),
    researchLab: z.string().optional(),
});

router.post(
    "/",
    //only admins can add porfessors for now
    checkAccess("professors:add"),
    expressAsyncHandler(async (req, res, next) => {
        const parsed = bodySchema.safeParse(req.body);
        if (!parsed.success) {
            return next(
                new AppError({
                    httpCode: HttpCode.BAD_REQUEST,
                    description: fromError(parsed.error).toString(),
                })
            );
        }
        try {
            // Add professor to database
            const added = await db
                .insert(professors)
                .values(parsed.data)
                .returning();

            if (added.length) res.status(HttpCode.CREATED).json(added[0]);
            else
                next(
                    new AppError({
                        httpCode: HttpCode.BAD_REQUEST,
                        description: "Professor could not be added",
                    })
                );
        } catch (e) {
            return next(
                new AppError({
                    httpCode: HttpCode.INTERNAL_SERVER_ERROR,
                    description: "Database error",
                    feedback: JSON.stringify(e as object),
                })
            );
        }
    })
);
export default router;
