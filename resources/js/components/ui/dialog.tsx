import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close
const DialogPortal = DialogPrimitive.Portal

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-scrim/70 backdrop-blur-[3px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * Responsive dialog content: anchored to the bottom of the screen and sliding
 * up on mobile (like a native bottom sheet), centered on larger viewports.
 */
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      {/* Full-screen flex wrapper centers on desktop / bottom-aligns on mobile.
          It ignores pointer events so clicks outside the panel still close. */}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className={cn(
            "pointer-events-auto relative flex w-full max-h-[88dvh] flex-col gap-4 overflow-y-auto rounded-t-[1.75rem] bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-card-foreground shadow-[0_-12px_40px_rgb(0_0_0/0.35)] ring-1 ring-border sm:max-w-lg sm:rounded-[1.75rem] sm:pb-5",
            "duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            className
          )}
          {...props}
        >
          {/* Grab handle hint for the mobile bottom-sheet feel. */}
          <span aria-hidden className="mx-auto -mt-1 mb-1 h-1 w-10 shrink-0 rounded-full bg-foreground/20 sm:hidden" />

          {children}

          {showCloseButton && (
            <DialogPrimitive.Close className="absolute right-3 top-3 z-10 inline-flex size-11 items-center justify-center rounded-full bg-background/80 text-foreground ring-1 ring-border backdrop-blur transition-[scale,background-color] hover:bg-background active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </div>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1 text-left", className)}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("font-display text-2xl font-extrabold leading-tight", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
