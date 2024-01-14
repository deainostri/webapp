//
import cn from "classnames";
import styles from "./SideBySide.module.scss";
import { useIsNotDesktop } from "@/hooks/useResponsive";

const SideBySide = (props: any) => {
  const isMobile = useIsNotDesktop();
  const { className, imageProps, reverse, children } = props;

  const imageStyle: any = {};

  if (isMobile) {
    imageStyle.marginBottom = imageProps.mobileGap;
  } else if (reverse) {
    imageStyle.marginRight = imageProps.desktopGap;
  } else {
    imageStyle.marginLeft = imageProps.desktopGap;
  }

  return (
    <div
      className={cn(
        "container flex flex-col-reverse justify-between items-center overflow-hidden",
        {
          ["md:flex-row-reverse"]: reverse,
          ["md:flex-row"]: !reverse,
        },
        styles.root,
        className
      )}
    >
      {children}
      <SideBySide_Image {...imageProps} style={imageStyle} />
    </div>
  );
};

export const SideBySide_Image = (props: any) => {
  const isMobile = useIsNotDesktop();
  const isDesktop = !isMobile;

  const {
    mobileMaxHeight,
    maxWidth,
    height,
    mobileGap,
    desktopGap,
    className,
    style,
  } = props;
  const imageStyle: any = {};

  if (isMobile) {
    imageStyle.maxHeight = mobileMaxHeight;
    imageStyle.marginBottom = mobileGap;
  } else {
    imageStyle.marginLeft = desktopGap;
    imageStyle.height = height;
    imageStyle.maxWidth = maxWidth;
  }

  return (
    <div
      className={cn(styles.image, className)}
      style={{
        backgroundImage: `url(${props.src || "/sazicem.png"})`,
        ...style,
        ...imageStyle,
      }}
    />
  );
};

export default SideBySide;
