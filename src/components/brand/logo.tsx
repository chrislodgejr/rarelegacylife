import Image from "next/image";

type LogoVariant = "dark" | "light";
type LogoLockup = "horizontal" | "stacked" | "icon";
type LogoTreatment = "gold" | "original";

type LogoAsset = {
  src: string;
  width: number;
  height: number;
};

const logoAssets: Record<LogoVariant, Record<LogoLockup, LogoAsset>> = {
  dark: {
    horizontal: { src: "/brand/logo-dark-horizontal.png", width: 2939, height: 760 },
    stacked: { src: "/brand/logo-dark-stacked.png", width: 700, height: 956 },
    icon: { src: "/brand/icon-dark.png", width: 661, height: 719 },
  },
  light: {
    horizontal: { src: "/brand/logo-light-stacked.png", width: 761, height: 1125 },
    stacked: { src: "/brand/logo-light-stacked.png", width: 761, height: 1125 },
    icon: { src: "/brand/icon-light.png", width: 761, height: 841 },
  },
};

export function BrandLogo({
  variant = "dark",
  lockup = "horizontal",
  className = "",
  priority = false,
  treatment = "gold",
}: {
  variant?: LogoVariant;
  lockup?: LogoLockup;
  className?: string;
  priority?: boolean;
  treatment?: LogoTreatment;
}) {
  const asset = logoAssets[variant][lockup];

  if (treatment === "gold") {
    return (
      <span
        aria-label="Rare Legacy Life logo"
        className={`relative inline-block align-middle ${className}`}
        role="img"
        style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
      >
        <Image
          alt=""
          aria-hidden="true"
          className="block h-full w-auto opacity-0"
          height={asset.height}
          priority={priority}
          src={asset.src}
          width={asset.width}
        />
        <span
          aria-hidden="true"
          className="logo-gold-gradient absolute inset-0"
          style={{
            maskImage: `url(${asset.src})`,
            maskPosition: "center",
            maskRepeat: "no-repeat",
            maskSize: "contain",
            WebkitMaskImage: `url(${asset.src})`,
            WebkitMaskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
          }}
        />
      </span>
    );
  }

  return (
    <Image
      alt="Rare Legacy Life logo"
      className={`block object-contain ${className}`}
      height={asset.height}
      priority={priority}
      src={asset.src}
      width={asset.width}
    />
  );
}
