import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  href?: string;
  className?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function Logo({
  href = "/",
  className,
  imageClassName,
  width = 180,
  height = 50,
  priority = false,
}: LogoProps) {
  return (
    <Link href={href} className={className}>
      <Image
        src="/softdrive-logo.svg"
        alt="SoftDrive"
        width={width}
        height={height}
        priority={priority}
        className={imageClassName}
      />
    </Link>
  );
}
