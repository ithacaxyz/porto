'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import type * as React from 'react'
import XIcon from '~icons/lucide/x'

import { cn } from '~/utils'

export function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

export namespace Dialog {
  export function Trigger({
    ...props
  }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
  }

  export function Portal({
    ...props
  }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
  }

  export function Close({
    ...props
  }: React.ComponentProps<typeof DialogPrimitive.Close>) {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
  }

  export function Overlay({
    className,
    ...props
  }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
    return (
      <DialogPrimitive.Overlay
        data-slot="dialog-overlay"
        className={cn(
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=open]:animate-in',
          className,
        )}
        {...props}
      />
    )
  }

  export function Content({
    className,
    children,
    ...props
  }: React.ComponentProps<typeof DialogPrimitive.Content>) {
    return (
      <Dialog.Portal>
        <Dialog.Overlay />
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className={cn(
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 -translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-50 grid max-h-[calc(100%-2rem)] w-full max-w-[calc(100%-2rem)] gap-4 overflow-y-auto rounded-xl border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:max-w-100',
            className,
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close className="group absolute top-3 right-3 flex size-7 items-center justify-center rounded outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none">
            <XIcon className="size-4 opacity-60 transition-opacity group-hover:opacity-100" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </Dialog.Portal>
    )
  }

  export function Header({ className, ...props }: React.ComponentProps<'div'>) {
    return (
      <div
        data-slot="alert-dialog-header"
        className={cn(
          'flex flex-col gap-1 text-center sm:text-left',
          className,
        )}
        {...props}
      />
    )
  }

  export function Footer({ className, ...props }: React.ComponentProps<'div'>) {
    return (
      <div
        data-slot="alert-dialog-footer"
        className={cn(
          'flex flex-col-reverse gap-3 sm:flex-row sm:justify-end',
          className,
        )}
        {...props}
      />
    )
  }

  export function Title({
    className,
    ...props
  }: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
      <DialogPrimitive.Title
        data-slot="alert-dialog-title"
        className={cn('font-semibold text-lg leading-none', className)}
        {...props}
      />
    )
  }

  export function Description({
    className,
    ...props
  }: React.ComponentProps<typeof DialogPrimitive.Description>) {
    return (
      <DialogPrimitive.Description
        data-slot="alert-dialog-description"
        className={cn('text-muted-foreground text-sm', className)}
        {...props}
      />
    )
  }
}
