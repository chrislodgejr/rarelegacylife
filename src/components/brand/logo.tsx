import Image from "next/image";
import { BRAND_DIMENSIONS, BRAND_FILES } from "@/lib/brand";

/** "dark" is for dark backgrounds (cream artwork); "light" is for light backgrounds (black artwork). */
type LogoVariant = "dark" | "light";
/**
 * horizontal: the header spot. stacked: larger brand moments (footer, sign-in, CRM).
 * Both use the full logo today; point "horizontal" at a horizontal lockup here if one is added.
 * icon: the symbol on its own. It is wide, so size it by height and let the width follow.
 */
type LogoLockup = "horizontal" | "stacked" | "icon";

type LogoAsset = {
  src: string;
  width: number;
  height: number;
};

const fullLogo = (src: string): LogoAsset => ({ src, ...BRAND_DIMENSIONS.logo });
const symbol = (src: string): LogoAsset => ({ src, ...BRAND_DIMENSIONS.symbol });

const logoAssets: Record<LogoVariant, Record<LogoLockup, LogoAsset>> = {
  dark: {
    horizontal: fullLogo(BRAND_FILES.logoCreamSvg),
    stacked: fullLogo(BRAND_FILES.logoCreamSvg),
    icon: symbol(BRAND_FILES.symbolCreamSvg),
  },
  light: {
    horizontal: fullLogo(BRAND_FILES.logoBlackSvg),
    stacked: fullLogo(BRAND_FILES.logoBlackSvg),
    icon: symbol(BRAND_FILES.symbolBlackSvg),
  },
};

export function BrandLogo({
  variant = "dark",
  lockup = "horizontal",
  className = "",
  priority = false,
}: {
  variant?: LogoVariant;
  lockup?: LogoLockup;
  className?: string;
  priority?: boolean;
}) {
  const asset = logoAssets[variant][lockup];

  return (
    <Image
      alt="Rare Legacy Life Group"
      className={`block object-contain ${className}`}
      height={asset.height}
      priority={priority}
      src={asset.src}
      unoptimized
      width={asset.width}
    />
  );
}
