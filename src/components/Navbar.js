"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowDownUp } from "lucide-react";

const Navbar = () => {
    return (
        <div className="sticky top-0 left-0 right-0 bg-waybase min-h-[42px] shadow-md-lg shadow-gray-950">
            <div className="px-6 flex items-center border-b-[1px]">
                <div className="flex justify-between gap-4 w-full items-center">
                    <Link
                        href="/"
                        className="text-white font-wayfinding font-bold"
                    >
                        Home
                    </Link>
                    <div className="flex gap-6 items-center">
                        <Link
                            href="/transjakarta"
                            className="text-white font-wayfinding font-bold"
                        >
                            Transjakarta
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="bg-waybase" asChild>
                                <Button className="text-white font-wayfinding font-bold focus-visible:ring-0 focus-visible:ring-offset-0">
                                    KCI
                                    <ArrowDownUp className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-waybase absolute w-[135px] -right-12 drop-shadow-xl border-neutral-300 border-[2px] z-[1002]">
                                <DropdownMenuLabel className="text-white font-wayfinding font-bold">
                                    Wilayah Operasi
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger className="text-white font-wayfinding focus:bg-waybase dark:focus:bg-waybase data-[state=open]:bg-wayout data-[state=open]:text-black data-[state=open]:font-bold">
                                            <span>Daop I</span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent className="bg-waybase mr-1.5 border-2">
                                                <DropdownMenuItem className="hover:opacity-75 focus:bg-waybase">
                                                    <Link
                                                        href="/kci/d1/all"
                                                        className="text-white font-wayfinding w-full h-full"
                                                    >
                                                        Seluruh Daop I
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="hover:opacity-75 focus:bg-waybase">
                                                    <Link
                                                        href="/kci/d1/stations"
                                                        className="text-white font-wayfinding w-full h-full"
                                                    >
                                                        Per Stasiun
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    <DropdownMenuItem className="focus:bg-waybus">
                                        <Link
                                            href="/kci/6"
                                            className="text-white font-wayfinding"
                                        >
                                            Daop VI
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {/* <Button
                            className="text-white font-wayfinding font-bold"
                            onClick={(e) => setIsMenuOpen(true)}
                            endIcon={
                                <KeyboardArrowDownIcon
                                    color="white"
                                    className="-ml-[5px]"
                                />
                            }
                        >
                            KCI
                        </Button>
                        <Menu
                            onClose={() => setIsMenuOpen(null)}
                            sx={{
                                "& .MuiPaper-root": {
                                    backgroundColor: "#00629F",
                                },
                            }}
                        >
                            <MenuItem>
                                <Link
                                    href="/kci/1"
                                    className="text-white font-wayfinding font-bold"
                                >
                                    Daop I
                                </Link>
                            </MenuItem>
                            <MenuItem>
                                <Link
                                    href="/kci/6"
                                    className="text-white font-wayfinding font-bold"
                                >
                                    Daop VI
                                </Link>
                            </MenuItem>
                        </Menu> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
