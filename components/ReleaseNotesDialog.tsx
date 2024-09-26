'use client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface ReleaseNote {
    version: string
    date: string
    features: string[]
}

const releaseNotes: ReleaseNote[] = [
    {
        version: "2.1.0",
        date: "2023-09-26",
        features: [
            "Added bulk download feature for TikTok profiles",
            "Improved download speed and reliability",
            "New user profile section with download history"
        ]
    },
]

type ReleaseNotesDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ReleaseNotesDialog = ({ open, onOpenChange }: ReleaseNotesDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-slate-50">
                <DialogHeader>
                    <DialogTitle>{"What's New"}</DialogTitle>
                    <DialogDescription>
                        Check out the latest updates and improvements to VideoGrab.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <Accordion type="single" collapsible className="w-full">
                        {releaseNotes.map((note, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger>
                                    <div className="flex justify-between w-full">
                                        <span>Version {note.version}</span>
                                        <span className="text-sm text-gray-500">{note.date}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="list-disc pl-5 space-y-2">
                                        {note.features.map((feature: string, featureIndex: number) => (
                                            <li key={featureIndex}>{feature}</li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

export default ReleaseNotesDialog;