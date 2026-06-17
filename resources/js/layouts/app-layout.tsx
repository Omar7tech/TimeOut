import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AppLayoutProps {
    title?: string;
}

export default function AppLayout({ title = 'TimeOut', children }: PropsWithChildren<AppLayoutProps>) {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <header className="border-b">
                <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
                    <Link href="/" className="text-lg font-semibold">
                        {title}
                    </Link>
                    <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                        <Link href="/" className="transition-colors hover:text-foreground">
                            Home
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>

            <footer className="border-t">
                <div className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} TimeOut
                </div>
            </footer>
        </div>
    );
}
