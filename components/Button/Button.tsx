//
import cn from "classnames";
import styles from "./Button.module.scss";

const Button = (props: {
  label?: string;
  variant?: string;
  size?: string;
  children?: any;
  className?: string;
  onClick?: any;
  style?: any;
}) => {
  let { variant, size, label, children, className, style, onClick } = props;

  variant = variant || "cta";
  size = size || "md";

  return (
    <button
      className={cn(styles.root, styles[variant], styles[size], className)}
      style={style}
      onClick={onClick}
    >
      {label || children}
    </button>
  );
};

export default Button;
