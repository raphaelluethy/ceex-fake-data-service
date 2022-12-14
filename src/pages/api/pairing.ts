import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
export default async function userHandler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { method, query } = req;
		await NextCors(req, res, {
			// Options
			methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
			origin: '*',
			optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
		});

		switch (method) {
			case 'GET':
				res.status(200).json({
					consumerNodeId: `${query.dso}-${query.dsoClientId}consumer`,
					producerNodeId: `${query.dso}-${query.dsoClientId}producer`,
				});
				break;
			default:
				res.setHeader('Allow', ['GET']);
				res.status(405).end(`Method ${method} Not Allowed`);
				break;
		}
	} catch (error: any) {
		res.status(400).json({ error: error?.message });
	}
}
