"use client";

import { useState } from "react";
import {
    AppBar,
    Button,
    CssBaseline,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Link from "next/link";

const Navbar = () => {
    const [anchor, setAnchor] = useState(null);
    const menuOpen = Boolean(anchor);

    return (
        <AppBar position="sticky" className="bg-waybase">
            <CssBaseline />
            <Toolbar className="min-h-[48px] border-b-[1px] border-white">
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
                        <Button
                            className="text-white font-wayfinding font-bold"
                            onClick={(e) => setAnchor(e.currentTarget)}
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
                            anchorEl={anchor}
                            open={menuOpen}
                            onClose={() => setAnchor(null)}
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
                        </Menu>
                    </div>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
