import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';

interface ErrorPageProps {
    status: number;
}

const messages: Record<number, { title: string; description: string }> = {
    403: {
        title: 'Access denied',
        description: 'You don’t have permission to view this page.',
    },
    404: {
        title: 'Page not found',
        description:
            'The page you’re looking for has moved or no longer exists.',
    },
    419: {
        title: 'Session expired',
        description: 'Your session timed out. Please refresh and try again.',
    },
    500: {
        title: 'Something went wrong',
        description:
            'We hit an unexpected error. Please try again in a moment.',
    },
    503: {
        title: 'Be right back',
        description:
            'We’re carrying out some quick maintenance. Check back soon.',
    },
};

export default function ErrorPage({ status }: ErrorPageProps) {
    const { title, description } = messages[status] ?? {
        title: 'Something went wrong',
        description: 'An unexpected error occurred.',
    };

    return (
        <>
            <Head title={`${status} — ${title}`} />

            <main className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6 py-16 text-center">
                <BrandLogo isOpen className="h-12 md:h-16" />

                <div className="flex flex-col items-center gap-3">
                    <span className="text-7xl font-extrabold tracking-tight text-brand-red md:text-8xl">
                        {status}
                    </span>
                    <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
                    <p className="max-w-sm text-sm text-muted-foreground md:text-base">
                        {description}
                    </p>
                </div>

                <Button
                    asChild
                    size="lg"
                    className="h-11 bg-brand-red px-8 font-bold text-white hover:bg-brand-red/90"
                >
                    <Link href="/">Back to home</Link>
                </Button>
            </main>
        </>
    );
}
