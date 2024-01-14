//
import cn from "classnames";

const TrimmedAddress = ({
  className,
  address,
  size,
  hideStart,
  hideEnd,
}: any) => {
  //
  size = size || 9;

  return (
    <div
      className={cn("relative overflow-hidden whitespace-nowrap", className)}
    >
      <span className="hidden-text-ref">{address}</span>
      {!hideStart && (
        <span className="select-none">{address.substring(0, size)}</span>
      )}
      {!hideStart && !hideEnd && <span className="select-none">...</span>}
      {!hideEnd && (
        <span className="select-none">
          {address.substring(address.length - size)}
        </span>
      )}
    </div>
  );
};

export default TrimmedAddress;
