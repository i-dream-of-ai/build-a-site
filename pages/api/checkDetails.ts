import { NextApiRequest, NextApiResponse } from 'next';
import { users } from "@/app/db/userApi";

const domain = process.env.NEXT_PUBLIC_APP_URL;

async function resetToken(email: string, token: string): Promise<boolean> {

    const user = await users.getByEmail(email);

    if (!user || user.resetToken !== token) {
        console.error("Token not found or email mismatch.");
        return false;
    }

    if (user.resetTokenExp < Date.now()) {
        console.error("Token has expired.");
        return false;
    }

    return true;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === 'POST') {
            const { email, token } = req.body;  // Retrieve email and token from the request body

            if (!token || !email) {
                return res.status(400).json({ message: 'Both email and token are required' });
            }

            const isValid = await resetToken(email, token);

            if (isValid) {
                return res.status(200).json({
                    message: 'Token is valid',
                    redirectUrl: `${domain}/resetpass?email=${email}&token=${token}`
                });
            } else {
                return res.status(401).json({ message: 'Token is invalid or expired' });
            }

        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
