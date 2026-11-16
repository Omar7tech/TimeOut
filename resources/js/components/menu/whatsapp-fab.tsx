import { usePage } from '@inertiajs/react';
import { Send } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { buildWhatsAppUrl } from '@/lib/whatsapp-order';

/**
 * Floating WhatsApp button pinned to the bottom-right corner (lifted above the
 * order bar while it shows, via `raised`). Opens a small
 * dialog where the customer types a message, then hands off to WhatsApp with it
 * pre-filled. Controlled by the WhatsApp badge settings.
 */
export function WhatsAppFab({ raised = false }: { raised?: boolean }) {
    const { whatsappBadge } = usePage().props;
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleSend = (): void => {
        const trimmed = message.trim();

        if (trimmed === '' || !whatsappBadge.number) {
            return;
        }

        window.open(
            buildWhatsAppUrl(whatsappBadge.number, trimmed),
            '_blank',
            'noopener,noreferrer',
        );

        setOpen(false);
        setMessage('');
    };

    if (!whatsappBadge.show || !whatsappBadge.number) {
        return null;
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Chat on WhatsApp"
                className={cn(
                    'fixed right-4 z-40 flex size-14 items-center justify-center rounded-full bg-[#25d366] shadow-[0_12px_28px_-10px_rgb(37_211_102/0.8)] transition-[bottom,scale] duration-300 ease-out hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-95 md:right-6',
                    raised
                        ? 'bottom-[calc(6.5rem+env(safe-area-inset-bottom))] md:bottom-[calc(7.5rem+env(safe-area-inset-bottom))]'
                        : 'bottom-[calc(1rem+env(safe-area-inset-bottom))] md:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]',
                )}
            >
                <img
                    src="/social-icons/whatsapp.svg"
                    alt=""
                    className="size-7 brightness-0 invert"
                />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <img
                                src="/social-icons/whatsapp.svg"
                                alt=""
                                className="size-6"
                            />
                            Chat with us · راسلنا
                        </DialogTitle>
                        <p className="text-sm font-semibold text-muted-foreground">
                            Send us a message on WhatsApp and we'll get back to
                            you.
                        </p>
                    </DialogHeader>

                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleSend();
                        }}
                        className="flex flex-col gap-3"
                    >
                        <textarea
                            autoFocus
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            rows={4}
                            placeholder="Type your message… · اكتب رسالتك"
                            dir="auto"
                            className="w-full resize-none rounded-2xl bg-muted px-4 py-3 text-base ring-1 ring-border placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        />

                        <button
                            type="submit"
                            disabled={message.trim() === ''}
                            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25d366] px-4 font-semibold text-black transition-[scale,opacity] duration-200 hover:opacity-90 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Send className="size-4" />
                            Send on WhatsApp
                        </button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
