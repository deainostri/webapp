import React from "react";

const NavbarLinks = (props: any) => {
  return (
    <div className="">
      <button
        onClick={props.onClick}
        key={props.id}
        className="text-sm font-bold"
      >
        {props.title}
      </button>
    </div>
  );
};

export default NavbarLinks;
