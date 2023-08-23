"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

const MovingChevrons = ({ length }) => {
    const [chevronState, setChevronState] = useState(Array(length).fill(false));

    const toggleChevron = (index) => {
        const newChevronState = [...chevronState];
        chevronState[index] = !chevronState[index];
        setChevronState(newChevronState);
    };

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            toggleChevron(index);
            if (chevronState[index] === false) {
                index++;
            } else {
                toggleChevron(index + 1);
            }

            if (index > length) {
                index = 0;
            }
        }, 100);

        return () => clearInterval(interval);
    }, [length]);

    return (
        <div className="flex">
            {chevronState.map((on) => (
                <ChevronRight
                    key={Math.random()}
                    strokeWidth={3}
                    className={`-mr-3 w-5 h-5 ${
                        on ? null : "invisible"
                    } last:mr-0`}
                />
            ))}
        </div>
    );
};

export default MovingChevrons;
