import React from "react";
import Link from "next/link";

const SocialButton = (props: any) => {
  return (
    <div>
      <button onClick={props.onClick} key={props.id}>
        <Link href={props.href}>
          <a target="_blank" rel="noreferrer">
            <img src={props.image} draggable="false" alt="social" />
          </a>
        </Link>
      </button>
    </div>
  );
};

export default SocialButton;
