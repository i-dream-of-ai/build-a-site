'use client'

import { useEffect } from 'react';

export default function VerifyPage() {

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        const token = urlParams.get('token');

        // Make a POST request to your API
        fetch('/api/checkdetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Include the email and token in the request body
            body: JSON.stringify({ email, token }),  // Note: Since your API endpoint seems to expect a GET request with query parameters, we don't need this line.
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Token is valid') {
                    // Redirect to the provided URL
                    window.location.href = data.redirectUrl;
                } else {
                    console.error(data.message);
                }
            })
            .catch(error => {
                console.error('There was an error:', error);
            });

    }, []);

    return (
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
            please wait
        </div>
    );
}
