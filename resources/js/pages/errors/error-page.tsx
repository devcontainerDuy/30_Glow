import { Head } from '@inertiajs/react';
import type React from 'react';

const errorMap: Record<string, { title: string; description: string }> = {
    503: {
        title: 'Service Unavailable',
        description: 'Sorry, we are doing some maintenance. Please check back soon.',
    },
    500: {
        title: 'Server Error',
        description: 'Whoops, something went wrong on our servers.',
    },
    404: {
        title: 'Page Not Found',
        description: 'Sorry, the page you are looking for could not be found.',
    },
    403: {
        title: 'Forbidden',
        description: 'Sorry, you are forbidden from accessing this page.',
    },
    401: {
        title: 'Unauthorized',
        description: 'Sorry, you are not authorized to access this page.',
    },
};

const ErrorPage: React.FC<{ status: number }> = ({ status }) => {
    const { title, description } = errorMap[String(status)] || {
        title: `${status}: Error`,
        description: 'An unexpected error has occurred.',
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <Head title={title} />
            <h1 className="text-4xl font-bold text-red-600">{status}: {title}</h1>
            <p className="mt-4 text-lg text-gray-700">{description}</p>
        </div>
    );
};

export default ErrorPage;
