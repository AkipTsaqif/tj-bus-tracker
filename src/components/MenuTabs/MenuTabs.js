"use client";

import React from "react";
import { useState } from "react";
import { CSSTransition } from "react-transition-group";
import { Button } from "@/components/ui/button";

const MenuTabs = ({ menus, children }) => {
    const [buttonTab, setButtonTab] = useState(menus[0]?.id || "");

    return (
        <div className="font-wayfinding text-white font-bold mt-4">
            <div className="flex w-full">
                {menus.length > 0 &&
                    menus.map((menu, index) => (
                        <CSSTransition key={menu.id} timeout={500}>
                            <Button
                                onClick={() => setButtonTab(menu.id)}
                                style={{
                                    width: `${
                                        buttonTab === menu.id
                                            ? `${
                                                  ((21 - menus.length) / 20) *
                                                  100
                                              }%`
                                            : "5%"
                                    }`,
                                }}
                                className={`transition-all ease-in-out duration-500 ${
                                    buttonTab === menu.id
                                        ? `bg-waybike`
                                        : `bg-transparent`
                                } gap-2 uppercase hover:bg-gray-700 tracking-wide font-wayfinding font-bold border-white border-b-2`}
                            >
                                {menu.icon}
                                <CSSTransition timeout={300}>
                                    <div
                                        className={`transition-opacity ease-in-out duration-300 ${
                                            buttonTab === menu.id
                                                ? "opacity-100 static"
                                                : "opacity-0 absolute"
                                        }`}
                                    >
                                        {menu.name}
                                    </div>
                                </CSSTransition>
                            </Button>
                        </CSSTransition>
                    ))}
            </div>
            {React.Children.toArray(children).map((child) => {
                if (child.props.content === buttonTab)
                    return <div className="mt-2">{child}</div>;
            })}
        </div>
    );
};

export default MenuTabs;
