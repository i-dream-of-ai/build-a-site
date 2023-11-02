import { NextApiRequest, NextApiResponse } from 'next';
import {users} from "@/app/db/userApi";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === 'POST') {
            const { email, token, newpassword } = req.body;

            if (!email || !token || !newpassword) {
                return res.status(400).json({ message: 'Email, token, and new password are required' });
            }

            const redirectUrl = await users.updatePassword(email, token, newpassword);
            return res.status(200).json({ message: 'Password updated successfully', redirectUrl });
        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
