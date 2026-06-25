"use client";

import Link from "next/link";
import { type ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/30 hover:bg-yellow-300 active:scale-95 active:bg-yellow-500",
  secondary:
    "bg-white/25 text-white backdrop-blur-sm hover:bg-white/35 active:scale-95",
  ghost:
    "bg-transparent text-white hover:bg-white/15 active:scale-95",
};

interface ButtonBaseProps {
  variant?: Variant;
  fullWidth?: boolean;
  children: React.ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<ComponentProps<"button">, keyof ButtonBaseProps>;

type ButtonAsLink = ButtonBaseProps & {
  href: string;
} & Omit<ComponentProps<typeof Link>, keyof ButtonBaseProps | "href">;

type ButtonProps = ButtonAsButton | ButtonAsLink;

function isLink(props: ButtonProps): props is ButtonAsLink {
  return "href" in props;
}

export function Button(props: ButtonProps) {
  const { variant = "primary", fullWidth = false, children, ...rest } = props;

  const className = [
    "inline-flex items-center justify-center gap-3",
    "rounded-2xl px-8 py-4 text-xl md:text-2xl font-semibold",
    "transition-all duration-150 ease-out",
    "min-h-[56px] min-w-[180px]",
    "cursor-pointer",
    variants[variant],
    fullWidth ? "w-full" : "",
  ].join(" ");

  if (isLink(props)) {
    const { href, variant: _, fullWidth: __, ...linkRest } = props;
    return (
      <Link href={href} className={className} {...(linkRest as Omit<ComponentProps<typeof Link>, "href" | "className">)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} {...(rest as ComponentProps<"button">)}>
      {children}
    </button>
  );
}
