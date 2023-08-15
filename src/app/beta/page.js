"use client";

import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import { Button } from "@/components/ui/button";
import { BusFront, TrainFront } from "lucide-react";

const Experimental = () => {
    const [buttonTab, setButtonTab] = useState(0);
    return (
        <div className="font-wayfinding text-white font-bold mt-8">
            <div className="flex w-full">
                <CSSTransition
                    classNames={{
                        enter: buttonTab === 0 ? "w-11/12" : "w-1/12",
                        exit: buttonTab === 0 ? "w-1/12" : "w-11/12",
                    }}
                >
                    <Button
                        className={`transition-all ease-in-out duration-500 w-${
                            buttonTab === 0 ? "11/12" : "1/12"
                        } gap-2 uppercase bg-${
                            buttonTab === 0 ? "waybike" : "transparent"
                        } hover:bg-gray-700 tracking-wide font-wayfinding font-bold border-white border-b-[1px]`}
                        onClick={() => setButtonTab(0)}
                    >
                        <TrainFront className="w-5 h-5" />
                        <CSSTransition>
                            <div
                                className={`transition-opacity ease-in-out duration-300 ${
                                    buttonTab === 0
                                        ? "opacity-100 static"
                                        : "opacity-0 absolute"
                                }`}
                            >
                                KRL
                            </div>
                        </CSSTransition>
                    </Button>
                </CSSTransition>
                <CSSTransition
                    classNames={{
                        enter: buttonTab === 1 ? "w-11/12" : "w-1/12",
                        exit: buttonTab === 1 ? "w-1/12" : "w-11/12",
                    }}
                >
                    <Button
                        key="btn-tj"
                        className={`transition-all ease-in-out duration-500 w-${
                            buttonTab === 0 ? "1/12" : "11/12"
                        } gap-2 uppercase hover:bg-gray-700 tracking-wide font-wayfinding bg-${
                            buttonTab === 1 ? "waybike" : "transparent"
                        } font-bold border-white border-b-[1px]`}
                        onClick={() => setButtonTab(1)}
                    >
                        <BusFront className="w-5 h-5 transition-all duration-500 ease-in-out" />
                        <CSSTransition>
                            <div
                                className={`transition-opacity ease-in-out duration-300 ${
                                    buttonTab === 1
                                        ? "opacity-100 static"
                                        : "opacity-0 absolute"
                                }`}
                            >
                                Transjakarta
                            </div>
                        </CSSTransition>
                    </Button>
                </CSSTransition>
            </div>
        </div>
    );
};

export default Experimental;
