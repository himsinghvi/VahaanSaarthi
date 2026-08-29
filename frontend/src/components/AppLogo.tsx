type Props = {
  className?: string;
  /** Full wordmark SVG or hex mark only */
  variant?: "full" | "mark";
  height?: number;
};

const SRC = {
  full: "/variant_h_hex_document_car.svg",
  mark: "/variant_h_hex_mark.svg",
};

export default function AppLogo({ className = "", variant = "full", height = 32 }: Props) {
  return (
    <img
      src={SRC[variant]}
      alt="Vaahan Saarthi"
      className={`app-logo app-logo--${variant} ${className}`.trim()}
      height={height}
      decoding="async"
    />
  );
}
