import { LogOutIcon, Menu, School } from 'lucide-react'
import React, { useEffect } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DarkMode } from './DarkMode';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation } from '@/features/api/authApi';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

const Navbar = () => {

    const { user } = useSelector(store => store.auth);
    const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
    const navigate = useNavigate();
    const logoutHandler = async () => {
        await logoutUser();
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "User logged out");
            navigate("/");
            window.location.reload();
        }
    }, [isSuccess]);
    return (
        <div className='h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10'>
            {/* Desktop */}
            <div className='max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full'>
                <div className='flex items-center gap-2 ' onClick={() => navigate("/")}>
                    <School size={30} />
                    <h1 className='hidden md:block font-extrabold text-2xl'>brainFuel</h1>
                </div>
                <div className='flex items-center gap-8'>
                    {
                        user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Avatar>
                                        <AvatarImage src={user?.imgUrl || "https://github.com/shadcn.png"} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link to="my-learning">My Learning</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link to="profile">Edit Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={logoutHandler}>
                                        <div className='flex items-center justify-between w-full'>
                                            <p>Logout</p>
                                            <LogOutIcon size={10} />
                                        </div>
                                    </DropdownMenuItem>
                                    {
                                        user.role === "instructor" && (
                                            <>   
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>Dashboard</DropdownMenuItem>
                                            </>
                                        )
                                    }

                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className='flex items-center gap-2'>
                                <Button onClick={() => navigate("/login")}>Login / SignUp</Button>
                            </div>
                        )
                    }
                    <DarkMode />
                </div>
            </div>
            {/* Mobile */}
            <div className='flex md:hidden items-center justify-between px-4 h-full'>
                <h1 className='font-extrabold text-2xl'>brainFuel</h1>
                <MobileNavbar />
            </div>

        </div>
    )
}

export default Navbar

const MobileNavbar = () => {
    const role = "instructor";
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size='icon' className="rounded-full bg-gray-200 hover:bg-gray-300" variant="outline">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col ">
                <SheetHeader className="flex flex-row items-center justify-center gap-8 mt-4">
                    <SheetTitle className="font-bold">brainFuel</SheetTitle>
                    <DarkMode />
                </SheetHeader>
                <Separator className='mr-2' />
                <nav className='flex flex-col space-y-4'>
                    <span>My Learning</span>
                    <span>Edit Profile</span>
                    <div className='flex justify-between'>
                        <p>Log out</p>
                        <LogOutIcon />
                    </div>
                </nav>
                {
                    role === "instructor" && (
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button type="submit">Dashboard</Button>
                            </SheetClose>
                        </SheetFooter>
                    )
                }

            </SheetContent>
        </Sheet>
    )
}