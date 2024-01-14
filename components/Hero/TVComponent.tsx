import { useRootStore } from "@/state/RootStore";
import { observer } from "mobx-react";
import { useEffect } from "react";
import cn from 'classnames';
import styles from "./TVComponent.module.scss";

const TVComponent = observer(() => {
    const store = useRootStore();

    return (
        <div className={cn(styles.tvContainer)}>
            <div className={styles.tvContent}>
                <TVContent />
            </div>

            <div className={styles.tvBg}></div>
        </div>
    );
});

const TVContent = observer(() => {
    const store = useRootStore();

    useEffect(() => {
        store.ui.start_tv();
    }, []);

    const imgUrl = store.ui.tvStatic
        ? `/assets/images/static-tv-static.gif`
        : `/gogo/${store.ui.tvIndex}.jpg`;

    return <img key="lol" src={imgUrl} />;
});

export default TVComponent;
