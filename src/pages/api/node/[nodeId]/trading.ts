import { faker } from "@faker-js/faker";
import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { NodeType } from "../../../../types/node.type";

const createNode = (): NodeType => {
  const node: NodeType = {
    imageUrl: faker.image.imageUrl(640, 480, "house", true),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    distance: faker.datatype.number(),
    price: faker.datatype.number(),
    lat: faker.address.latitude(47.5, 47.45),
    long: faker.address.longitude(8.25, 8.15),
    strategy: faker.datatype
      .number({ min: 1, max: 3, precision: 1 })
      .toString(),
  };
  return node;
};

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const {
      query: { nodeId },
      method,
    } = req;
    await NextCors(req, res, {
      // Options
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      origin: "*",
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });
    switch (method) {
      case "GET":
        const node: NodeType = createNode();
        const nodes: NodeType[] = Array.from({ length: 10 }).map(() =>
          createNode()
        );
        node.connectedNodes = nodes;
        res.status(200).json(node);
        break;
      default:
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error: error?.message });
  }
}
