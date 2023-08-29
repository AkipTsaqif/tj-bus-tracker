"use client";

import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import { Button } from "@/components/ui/button";
import { BusFront, Dot, MoveDown, TrainFront, TramFront } from "lucide-react";
import LineIcon from "@/components/LineIcon";
import Timeline from "@/components/Timeline";

const Experimental = () => {
    const [buttonTab, setButtonTab] = useState(0);

    const list = [
        {
            id: 0,
            name: "KRL",
            time: "10:00",
            transit: false,
        },
        {
            id: 1,
            name: "Bus",
            time: "11:00",
            transit: true,
        },
        {
            id: 2,
            name: "MRT",
            time: "12:00",
            transit: false,
        },
        {
            id: 3,
            name: "LRT",
            time: "13:00",
            transit: false,
        },
        {
            id: 4,
            name: "E",
            time: "143:00",
            transit: true,
        },
    ];

    return (
        <div className="bg-wayfinding rounded-lg border-white border-2">
            <TramFront color="#006eff" strokeWidth={3} className="w-6 h-6" />
        </div>
    );
};

export default Experimental;
