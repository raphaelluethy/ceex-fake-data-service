import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import { DSOType } from '../../../types/dso.type';
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
				const dsos: DSOType[] = [
					{
						id: '1',
						name: 'M31',
					},
					{
						id: '2',
						name: 'M42',
					},
					{
						id: '3',
						name: 'M45',
					},
				];
				res.status(200).json(dsos);
			default:
				res.setHeader('Allow', ['GET']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (error: any) {
		res.status(400).json({ error: error?.message });
	}
}
