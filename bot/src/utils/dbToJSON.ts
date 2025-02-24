import prisma from "db";
import fs from "fs";
import path from "path";

const submissions = await prisma.chargeSubmission.findMany();

const filteredSubmissions = submissions.map(({ created_at, updated_at, ...rest }) => rest);
const data = JSON.stringify(filteredSubmissions, null, 2);

fs.writeFileSync(path.join(__dirname, "submissions.json"), data);

