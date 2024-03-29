import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req;

  switch (method) {

    case "GET":
      const demographics = await prisma.demographic.findMany();
      res.status(200).json(demographics);
      break;

    case "POST":
      const demographic = await prisma.demographic.create({ data: body });
      res.status(201).json(demographic);
      break;

    default:
      res.status(405).json({ message: "Method not allowed" });
  }
};
