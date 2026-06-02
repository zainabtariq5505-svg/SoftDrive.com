import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  href?: string;
  className?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  variant?: "full" | "mark";
}

export function Logo({
  href = "/",
  className,
  imageClassName,
  width = 180,
  height = 50,
  priority = false,
  variant = "full",
}: LogoProps) {
  const isMark = variant === "mark";

  return (
    <Link href={href} className={className}>
      {isMark ? (
        <Image
          src="/softdrive-mark.svg"
          alt="SoftDrive"
          width={width}
          height={height}
          priority={priority}
          className={imageClassName}
        />
      ) : (
        <>
          <Image
            src="/softdrive-wordmark-light.svg"
            alt="SoftDrive"
            width={width}
            height={height}
            priority={priority}
            className={`dark:hidden ${imageClassName ?? ""}`.trim()}
          />
          <Image
            src="/softdrive-wordmark-dark.svg"
            alt="SoftDrive"
            width={width}
            height={height}
            priority={priority}
            className={`hidden dark:block ${imageClassName ?? ""}`.trim()}
          />
        </>
      )}
    </Link>
  );
}
