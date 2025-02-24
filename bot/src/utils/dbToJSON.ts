// import prisma from "db";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const submissions = await prisma.chargeSubmission.findMany();

const filteredSubmissions = submissions.map(({ created_at, updated_at, ...rest }) => rest);
const data = JSON.stringify(filteredSubmissions, null, 2);


prisma.$disconnect();

fs.writeFileSync(path.join(__dirname, "submissions.json"), data);

