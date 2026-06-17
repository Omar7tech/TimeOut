import { type PropsWithChildren } from 'react';

export default function AppLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <main className="flex-1">{children}</main>

            <footer className="border-t">
                <div className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} TimeOut
                </div>
            </footer>
        </div>
    );
}
