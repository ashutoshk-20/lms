import React, { useEffect, useState } from 'react'
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useLoginUserMutation, useRegisterUserMutation } from '@/features/api/authApi'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'


const Login = () => {
    const [signupInput, setSignupInput] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loginInput, setLoginInput] = useState({
        email: "",
        password: ""
    });
    const [registerUser, { data: registerData, error: registerError, isLoading: registerIsLoading, isSuccess: registerIsSucceess }] = useRegisterUserMutation();
    const [loginUser, { data: loginData, error: loginError, isLoading: loginIsLoading, isSuccess: loginIsSucceess }] = useLoginUserMutation();

    const navigate = useNavigate();

    const changeInputHandler = (e, type) => {
        const { name, value } = e.target;
        if (type === "signup") {
            setSignupInput({ ...signupInput, [name]: value });
        } else {
            setLoginInput({ ...loginInput, [name]: value });
        }
    };

    const handleRegistration = async (type) => {
        const inputData = type === "signup" ? signupInput : loginInput;
        const action = type === "signup" ? registerUser : loginUser;

        await action(inputData);
    }

    useEffect(() => {
        if (registerIsSucceess && registerData) {
            toast.success(registerData.message || "Signup successful.");
            navigate("/")
        }
        if (registerError) {
            const errorMessage = registerError?.data?.message || "Signup failed. Please try again.";
            toast.error(errorMessage);
        }
        if (loginIsSucceess && loginData) {
            toast.success(loginData.message || "Login successful.");
            navigate("/");
        }
        if (loginError) {
            const errorMessage = loginError?.data?.message || "Login failed. Please try again.";
            toast.error(errorMessage);
        }
    },[loginIsLoading,registerIsLoading,registerData,loginData,loginError,registerError])


    return (
        <div className='flex items-center justify-center w-full h-screen'>
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Tabs defaultValue="login">
                    <TabsList className={"grid w-full grid-cols-2"}>
                        <TabsTrigger value="signup">Signup</TabsTrigger>
                        <TabsTrigger value="login">Login</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signup">
                        <Card>
                            <CardHeader>
                                <CardTitle>Signup</CardTitle>
                                <CardDescription>
                                    Create a new account here by clicking the button below.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name"
                                        name="name"
                                        value={signupInput.name}
                                        type={"text"}
                                        onChange={(e) => changeInputHandler(e, "signup")}
                                        placeholder="eg. patel"
                                        required="true"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email"
                                        type="email"
                                        name="email"
                                        value={signupInput.email}
                                        onChange={(e) => changeInputHandler(e, "signup")}
                                        placeholder="xyz@abc.com"
                                        required="true"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password"
                                        type="password"
                                        name="password"
                                        value={signupInput.password}
                                        onChange={(e) => changeInputHandler(e, "signup")}
                                        required="true"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={() => handleRegistration("signup")}>
                                    {
                                        registerIsLoading ? (
                                            <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                            </>
                                        ): "Create Account"
                                    }
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="login">
                        <Card>
                            <CardHeader>
                                <CardTitle>Login</CardTitle>
                                <CardDescription>
                                    Login to your account by clicking the button below.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email"
                                        type="email"
                                        name="email"
                                        value={loginInput.email}
                                        placeholder="xyz@abc.com"
                                        onChange={(e) => changeInputHandler(e, "login")}
                                        required="true"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password"
                                        type="password"
                                        name="password"
                                        value={loginInput.password}
                                        onChange={(e) => changeInputHandler(e, "login")}
                                        required
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={() => handleRegistration("login")}>
                                    {
                                        loginIsLoading ? (
                                            <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                            </>
                                        ): "Login"
                                    }
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Login