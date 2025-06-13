type SVGIconProps = {
  size?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  viewBox?: string;
};
export const SVGIcon: React.FC<SVGIconProps> = ({
  size = 20,
  stroke = 'currentColor',
  fill = 'currentColor',
  strokeWidth = 0.25,
  className,
  children,
  viewBox,
}) => {
  const intrinsicContentDimension = 20;
  const defaultViewBox = `0 0 ${intrinsicContentDimension} ${intrinsicContentDimension}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox || defaultViewBox}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      xmlns='http://www.w3.org/2000/svg'>
      {children}
    </svg>
  );
};
