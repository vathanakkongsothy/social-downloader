"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { setCookie } from 'cookies-next';

type AuthDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    handleAuth: (token : string) => void;
}

const AuthDialog = ({ open, onOpenChange, handleAuth }: AuthDialogProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent, type: 'signUp' | 'signIn') => {
        e.preventDefault();
        const action = type;
        const response = await fetch("/api/auth", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, action }),
        });

        if (response.ok) {
            const data = await response.json();
            setCookie('sessionToken', data.token, { maxAge: 60 * 60 * 24 });      
            handleAuth(data.token);
        } else {
            console.error('Authentication failed');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-50">
                <DialogHeader>
                    <DialogTitle>Sign Up or Sign In</DialogTitle>
                    <DialogDescription>
                        You need to be signed in to download videos.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="signUp" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white">
                        <TabsTrigger className="bg-slate-200 data-[state=active]:bg-white" value="signUp">Sign Up</TabsTrigger>
                        <TabsTrigger className="bg-slate-200 data-[state=active]:bg-white" value="signIn">Sign In</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signUp">
                        <form onSubmit={(e) => handleSubmit(e, 'signUp')} className="space-y-4">
                            <Input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                            <Button type="submit" className="w-full">Sign Up</Button>
                        </form>
                    </TabsContent>
                    <TabsContent value="signIn">
                        <form onSubmit={(e) => handleSubmit(e, 'signIn')} className="space-y-4">
                            <Input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                            <Input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                            <Button type="submit" className="w-full">Sign In</Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default AuthDialog;