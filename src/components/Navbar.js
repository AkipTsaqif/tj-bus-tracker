"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowDownUp } from "lucide-react";

const Navbar = () => {
    return (
        <div className="sticky top-0 left-0">
            <div className="relative px-6 flex items-center min-h-[48px] border-b-[1px] border-white">
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
                            <DropdownMenuContent className="bg-waybase absolute right-0 drop-shadow-xl border-neutral-300 border-[2px] z-[1002]">
                                <DropdownMenuLabel className="text-white font-wayfinding font-bold">
                                    Wilayah Operasi
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem className="focus:bg-waybus">
                                        <Link
                                            href="/kci/1"
                                            className="text-white font-wayfinding w-full h-full"
                                        >
                                            Daop I
                                        </Link>
                                    </DropdownMenuItem>
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
