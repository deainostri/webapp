//
const scrollToElem = (loc: string) => {
    if (typeof window !== "undefined") {
        const element = document.querySelector(loc);

        if (element) {
            // element.scrollIntoView({
            //     behavior: "smooth",
            //     block: "start",
            //     inline: "nearest",
            // });

            var headerOffset = 64;
            var elementPosition = element.getBoundingClientRect().top;
            var offsetPosition =
                elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    }
};

export default scrollToElem;
