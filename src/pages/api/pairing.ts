import type { NextApiRequest, NextApiResponse } from 'next';
import Error from 'next/error';
import NextCors from 'nextjs-cors';
export default async function userHandler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { method } = req;
		await NextCors(req, res, {
			// Options
			methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
			origin: '*',
			optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
		});

		switch (method) {
			case 'GET':
				res.status(200).json({ message: 'GET', endpoint: 'pairing' });
			default:
				res.setHeader('Allow', ['GET']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (error: any) {
		res.status(400).json({ error: error?.message });
	}
}
