import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatedLogo } from '@/components/animated-logo';
import { MAPS_URL } from '@/components/menu/footer-shared';
import type { SiteFooterProps } from '@/components/menu/footer-shared';
import { useSeen } from '@/hooks/use-seen';
import { cn } from '@/lib/utils';
import { buildWhatsAppUrl } from '@/lib/whatsapp-order';

/** Today's date and the time, as a till prints them. Ticks every minute. */
function useTillStamp(): string {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 60_000);

        return () => window.clearInterval(timer);
    }, []);

    const pad = (value: number): string => String(value).padStart(2, '0');

    return `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} · ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

/** A dashed rule across the receipt, like the cut lines on a till roll. */
function Cut() {
    return (
        <span
            aria-hidden
            className="my-4 block border-t-2 border-dashed border-foreground/20"
        />
    );
}

/** One printed line: the item, a dotted leader, and what it costs. */
function Line({
    item,
    value,
    href,
    onClick,
    strong = false,
}: {
    item: ReactNode;
    value: ReactNode;
    href?: string;
    onClick?: () => void;
    strong?: boolean;
}) {
    const content = (
        <>
            <span
                dir="auto"
                className={cn(
                    'shrink-0',
                    strong ? 'font-black' : 'font-bold',
                )}
            >
                {item}
            </span>
            <span aria-hidden className="leader mx-2 h-2 min-w-6 flex-1" />
            <span
                className={cn(
                    'shrink-0 text-sm transition-colors',
                    strong
                        ? 'font-black text-brand-red-ink'
                        : 'font-semibold text-muted-foreground group-hover:text-brand-red-ink',
                )}
            >
                {value}
            </span>
        </>
    );

    const className =
        'group flex min-h-10 w-full items-baseline text-start font-display text-[0.9375rem] focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

    if (href) {
        return (
            <a href={href} target="_blank" rel="noreferrer" className={className}>
                {content}
            </a>
        );
    }

    if (onClick) {
        return (
            <button type="button" onClick={onClick} className={className}>
                {content}
            </button>
        );
    }

    return <div className={className}>{content}</div>;
}

/**
 * The funky one: the footer as a till receipt. A torn paper slip, tilted and
 * taped onto an orange slab printed with the brand's food doodles. It is
 * printed with today's date and time, the two things to do next (WhatsApp,
 * the map) as order lines, every section of the menu as an item with a
 * dotted leader to tap through, the socials, and a total that's always
 * "100% طيبة". The paper follows the page's theme; the logo at its head
 * draws itself in when the receipt scrolls into view.
 */
export function ReceiptFooter({ categories, onSelectCategory }: SiteFooterProps) {
    const { socials, whatsappNumber, whatsappBadge } = usePage().props;
    const chatNumber = whatsappNumber ?? whatsappBadge.number;
    const stamp = useTillStamp();
    const [receiptRef, seen] = useSeen<HTMLDivElement>(0.15);

    return (
        <footer className="relative isolate mt-20 overflow-hidden bg-brand-red px-4 pt-16 pb-10 md:pt-20 md:pb-14">
            {/* The doodles, printed in ink on the orange and fading out
                towards the top so the slab starts clean. */}
            <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-brand-ink opacity-[0.12] [mask-image:url('/images/doodles.webp')] [mask-size:480px] [mask-repeat:repeat]"
            />
            <div
                aria-hidden
                className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-brand-red to-transparent"
            />

            <div
                ref={receiptRef}
                dir="rtl"
                className="relative mx-auto w-full max-w-md rotate-[-1.5deg] drop-shadow-[0_18px_26px_rgb(0_0_0/0.35)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:rotate-0"
            >
                {/* The tape holding it on. */}
                <span
                    aria-hidden
                    className="absolute -top-3 left-1/2 z-10 h-7 w-28 -translate-x-1/2 rotate-[3deg] rounded-sm bg-white/45 backdrop-blur-sm"
                />

                <div className="receipt bg-card px-6 pt-9 pb-10 text-card-foreground md:px-8">
                    <div className="mx-auto w-48">
                        <AnimatedLogo animate={seen} title="Time Out Snack" />
                    </div>
                    <p className="mt-3 text-center text-xs font-semibold tracking-[0.14em] text-muted-foreground">
                        عاليه، لبنان · ALEY
                    </p>
                    <p
                        dir="ltr"
                        className="mt-1 text-center font-display text-xs font-bold text-muted-foreground tabular-nums"
                    >
                        {stamp}
                    </p>

                    <Cut />

                    <p className="font-display text-2xl leading-tight font-black">
                        جوعان؟
                        <span className="block text-lg">
                            ما إلك إلا تايم آوت
                        </span>
                    </p>
                    <div className="mt-2">
                        {chatNumber && (
                            <Line
                                item="١× اطلب"
                                value="واتساب ←"
                                href={buildWhatsAppUrl(chatNumber, 'مرحبا Time Out')}
                            />
                        )}
                        <Line
                            item="١× وين نحنا؟"
                            value="الخريطة ←"
                            href={MAPS_URL}
                        />
                    </div>

                    <Cut />

                    <p className="mb-1 text-xs font-semibold tracking-[0.14em] text-muted-foreground">
                        الأقسام · ITEMS
                    </p>
                    {categories.map((category) => (
                        <Line
                            key={category.id}
                            item={category.title}
                            value="←"
                            onClick={() => onSelectCategory?.(category.id)}
                        />
                    ))}

                    {socials.length > 0 && (
                        <>
                            <Cut />
                            <div className="flex items-center justify-between gap-3">
                                <span className="font-display text-sm font-bold">
                                    تابعنا
                                </span>
                                <ul className="flex gap-1.5">
                                    {socials.map((social) => (
                                        <li key={social.platform}>
                                            <a
                                                href={social.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                aria-label={social.label}
                                                title={social.label}
                                                className="grid size-11 place-items-center rounded-xl bg-muted transition-[translate,background-color] duration-200 hover:-translate-y-0.5 hover:bg-raised focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                            >
                                                <img
                                                    src={social.icon}
                                                    alt=""
                                                    className="size-5"
                                                />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    <Cut />

                    <Line item="المجموع" value="١٠٠٪ طيبة" strong />

                    <p className="mt-5 text-center font-display text-lg font-black">
                        شكراً لزيارتكم!
                    </p>
                    <p className="mt-0.5 text-center text-xs text-muted-foreground">
                        Thanks for taking a Time Out
                    </p>
                    <p
                        dir="ltr"
                        className="mt-4 text-center text-[0.6875rem] text-muted-foreground"
                    >
                        © {new Date().getFullYear()} Time Out Snack
                    </p>
                </div>
            </div>
        </footer>
    );
}
