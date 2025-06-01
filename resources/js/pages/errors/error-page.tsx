import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, CloudAlert, House, LocateOff, Lock, LogIn, LucideIcon, Server, ShieldBan, TriangleAlert } from 'lucide-react';
import React from 'react';

const errorMap: Record<
    string,
    {
        title: string;
        description: string;
        icon?: LucideIcon | null;
        iconColor: string;
        bgColor: string;
        btnColor: string;
        btnHover: string;
    }
> = {
    500: {
        title: 'Internal Server Error',
        description: "Oops! Something went wrong on our end. Our team has been notified and we're working to fix it.",
        icon: Server,
        iconColor: 'text-red-500',
        bgColor: 'bg-red-100',
        btnColor: 'bg-red-500',
        btnHover: 'hover:bg-red-600',
    },
    503: {
        title: 'Service Unavailable',
        description: "We're currently undergoing maintenance. Please check back soon. We apologize for any inconvenience.",
        icon: CloudAlert,
        iconColor: 'text-yellow-500',
        bgColor: 'bg-yellow-100',
        btnColor: 'bg-yellow-500',
        btnHover: 'hover:bg-yellow-600',
    },
    404: {
        title: 'Page Not Found',
        description: "The page you're looking for doesn't exist or has been moved. Please check the URL and try again.",
        icon: LocateOff,
        iconColor: 'text-blue-500',
        bgColor: 'bg-blue-100',
        btnColor: 'bg-blue-500',
        btnHover: 'hover:bg-blue-600',
    },
    403: {
        title: 'Forbidden',
        description: "You don't have permission to access this resource. Please contact the administrator if you believe this is an error.",
        icon: ShieldBan,
        iconColor: 'text-purple-500',
        bgColor: 'bg-purple-100',
        btnColor: 'bg-purple-500',
        btnHover: 'hover:bg-purple-600',
    },
    401: {
        title: 'Unauthorized',
        description: 'You need to authenticate to access this page. Please log in with valid credentials.',
        icon: Lock,
        iconColor: 'text-indigo-500',
        bgColor: 'bg-indigo-100',
        btnColor: 'bg-indigo-500',
        btnHover: 'hover:bg-indigo-600',
    },
};

type Props = { status: number };

const ErrorPage: React.FC<Props> = ({ status }) => {
    const error = errorMap[String(status)] || {
        title: `${status}: Error`,
        description: 'An unexpected error has occurred.',
        icon: TriangleAlert,
        iconColor: 'text-gray-500',
        bgColor: 'bg-gray-100',
        btnColor: 'bg-gray-500',
        btnHover: 'hover:bg-gray-600',
    };

    const goBack = () => window.history.back();
    const goHome = () => router.get(route('dashboard'), {}, { preserveState: true });
    const login = () => router.get(route('login'), {}, { preserveState: true });

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
            <Head title={error.title} />
            <div className="mx-auto max-w-4xl overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl md:max-w-2xl">
                <div className="md:flex">
                    <div className={`flex items-center justify-center md:shrink-0 ${error.bgColor} p-8 md:w-1/3`}>
                        <div className="floating">{error.icon && React.createElement(error.icon, { className: `size-16 ${error.iconColor}` })}</div>
                    </div>
                    <div className="p-8 md:w-2/3">
                        <div className={`text-sm font-semibold tracking-wide uppercase ${error.iconColor}`}>{error.title}</div>
                        <h1 className="mt-1 block text-4xl font-bold text-gray-900">
                            {status} - {error.title}
                        </h1>
                        <p className="mt-4 text-gray-500">{error.description}</p>
                        <div className="mt-8">
                            <Button
                                onClick={goBack}
                                size={'lg'}
                                className={`p-6 ${error.btnColor} ${error.btnHover} font-semibold transition duration-300`}
                            >
                                <ArrowLeft className="mr-2" /> <span>Go Back</span>
                            </Button>

                            {status === 401 ? (
                                <Button
                                    onClick={login}
                                    size={'lg'}
                                    variant={'outline'}
                                    className="p-6 ml-4 bg-indigo-100 font-semibold text-indigo-800 transition duration-300 hover:bg-indigo-200"
                                >
                                    <LogIn className="mr-2" /> <span>Login</span>
                                </Button>
                            ) : (
                                <Button
                                    onClick={goHome}
                                    variant={'outline'}
                                    size={'lg'}
                                    className="p-6 ml-4 font-semibold text-gray-800 transition duration-300 hover:bg-gray-300"
                                >
                                    <House className="mr-2" /> <span>Home</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
