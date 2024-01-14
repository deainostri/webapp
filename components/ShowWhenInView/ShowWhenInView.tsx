import { Waypoint } from "react-waypoint";

import { useState } from "react";
import { useSpring, animated } from "react-spring";

const ShowWhenInView = ({ children, className }: any) => {
  const [inView, setInview] = useState(false);

  const transition = useSpring({
    delay: 275,
    to: {
      y: !inView ? 24 : 0,
      opacity: !inView ? 0 : 1,
    },
  });

  return (
    <Waypoint onEnter={() => setInview(true)}>
      <animated.div style={transition} className={className}>
        {children}
      </animated.div>
    </Waypoint>
  );
};

export default ShowWhenInView;
