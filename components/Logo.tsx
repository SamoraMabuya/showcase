import Image from "next/image";

const Logo = () => {
  return (
    <Image
      priority
      src="/images/product_exhibit_logo.svg"
      alt="logo"
      className="object-contain"
      fill={true}
    />
  );
};

const ShortenedLogo = () => {
  return (
    <Image
      priority
      src="/images/shortenedLogo.svg"
      alt="logo"
      className="object-contain"
      fill={true}
    />
  );
};

export { Logo, ShortenedLogo };
