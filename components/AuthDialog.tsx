"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';


type AuthDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    handleAuth: () => void;
}

const AuthDialog = ({ open, onOpenChange, handleAuth }: AuthDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-50">
                <DialogHeader>
                    <DialogTitle>Sign Up or Sign In</DialogTitle>
                    <DialogDescription>
                        You need to be signed in to download videos.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="signup" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-200">
                        <TabsTrigger className="bg-slate-200 data-[state=active]:bg-white" value="signup">Sign Up</TabsTrigger>
                        <TabsTrigger className="bg-slate-200 data-[state=active]:bg-white" value="signin">Sign In</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signup">
                        <form onSubmit={(e) => { e.preventDefault(); handleAuth(); }} className="space-y-4">
                            <Input type="email" placeholder="Email" required />
                            <Input type="password" placeholder="Password" required />
                            <Button type="submit" className="w-full">Sign Up</Button>
                        </form>
                    </TabsContent>
                    <TabsContent value="signin">
                        <form onSubmit={(e) => { e.preventDefault(); handleAuth(); }} className="space-y-4">
                            <Input type="email" placeholder="Email" required />
                            <Input type="password" placeholder="Password" required />
                            <Button type="submit" className="w-full">Sign In</Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default AuthDialog;