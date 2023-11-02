import { NextApiRequest, NextApiResponse } from 'next';
import { users } from "@/app/db/userApi";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === 'POST') {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }
            await users.saveToken(email);
            return res.status(200).json({ message: 'Token saved successfully' });
        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
