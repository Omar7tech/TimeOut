import { usePage } from '@inertiajs/react';
import { Send } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { buildWhatsAppUrl } from '@/lib/whatsapp-order';

/**
 * Floating WhatsApp button pinned to the bottom-right corner. Opens a small
 * dialog where the customer types a message, then hands off to WhatsApp with it
 * pre-filled. Controlled by the WhatsApp badge settings.
 */
export function WhatsAppFab() {
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
                className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex size-14 items-center justify-center rounded-full border-2 border-black bg-brand-yellow shadow-[3px_3px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#000] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:translate-y-0 active:shadow-[2px_2px_0_0_#000] md:right-6 md:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] md:size-16"
            >
                <img
                    src="/social-icons/whatsapp.svg"
                    alt=""
                    className="size-7 brightness-0 md:size-8"
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
                            Chat with us
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
                            placeholder="Type your message…"
                            className="w-full resize-none rounded-md border-2 border-black bg-card px-3 py-2 text-sm font-medium shadow-[2px_2px_0_0_#000] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        />

                        <button
                            type="submit"
                            disabled={message.trim() === ''}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-black bg-brand-yellow px-4 py-3 font-extrabold tracking-wide text-black uppercase shadow-[3px_3px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#000] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0_0_#000]"
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
