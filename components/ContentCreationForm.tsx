'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectValue, SelectTrigger, SelectContent } from '@/components/ui/select';
import { Tables } from '@/lib/database.types';
import { createContent } from '@/app/actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from 'sonner';

type Song = Tables<'songs'>

const contentTypes = [
    { value: "chords", label: "Chords" },
    { value: "tab", label: "Tab" },
    { value: "lyrics", label: "Lyrics" },
    { value: "pro", label: "Pro" },
    { value: "lesson", label: "Lesson" },
    { value: "performance", label: "Performance" },
];

const instruments = [
    { value: "guitar", label: "Guitar" },
    { value: "bass", label: "Bass" },
    { value: "keys", label: "Keys" },
    { value: "drums", label: "Drums" },
];

const platforms = [
    { value: "youtube", label: "YouTube" },
    { value: "vimeo", label: "Vimeo" },
];

interface ContentCreationFormProps {
    initialSongs?: Song[]
}

const FormSchema = z.object({
    id: z.number({ required_error: "Please select a song." }),
    type: z.string({ required_error: "Please select a content type." }),
    instrument: z.string(),
    platform: z.string(),
    content: z.string(),
    url: z.string()
})

const ContentCreationForm: React.FC<ContentCreationFormProps> = ({ initialSongs }) => {

    const router = useRouter();
    const [songs, setSongs] = useState<Song[]>([])
    const [songId, setSongId] = useState<number | null>(null)
    const [openSong, setOpenSong] = useState(false);
    const [contentType, setContentType] = useState("");
    const [instrument, setInstrument] = useState("");
    const [platform, setPlatform] = useState("");
    const [content, setContent] = useState("");
    const [videoUrl, setVideoUrl] = useState("");

    useEffect(() => {
        if (Array.isArray(initialSongs)) {
            setSongs(initialSongs)
        }
    }, [initialSongs])

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast('You submitted form data<br />: ' + JSON.stringify(data, null, 2))
    }

    const handleSubmit = async () => {
        try {
            await createContent({
                songId,
                contentType,
                instrument,
                content,
                platform,
                videoUrl,
            });
            router.refresh();
            // Reset form or show success message
        } catch (error) {
            // Handle error
            console.error('Failed to create content:', error);
        }
    };

    const handleSongSelect = (selectedId: number) => {
        setSongId(prevId => prevId === selectedId ? null : selectedId);
        setOpenSong(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="id" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Song</FormLabel>
                        <Popover open={openSong} onOpenChange={setOpenSong}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openSong}
                                    className="w-full justify-between"
                                >
                                    {/*songId !== null ? songs.find((s) => s.id === songId)?.name : */"Select song..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Search song..." />
                                    <CommandEmpty>No song found.</CommandEmpty>
                                    <CommandGroup>
                                        {songs.map((s) => (
                                            <CommandItem
                                                key={s.id}
                                                onSelect={() => handleSongSelect(s.id)}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        songId === s.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {s.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </FormItem>
                )}
                />

                <Select onValueChange={setContentType}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                        {contentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {contentType !== 'lyrics' && (
                    <Select onValueChange={setInstrument}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select instrument" />
                        </SelectTrigger>
                        <SelectContent>
                            {instruments.map((inst) => (
                                <SelectItem key={inst.value} value={inst.value}>
                                    {inst.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {contentType && ['chords', 'tab', 'lyrics', 'pro'].includes(contentType) && (
                    <div className="space-y-2">
                        <Label htmlFor="content">Content ({contentType})</Label>
                        <Textarea
                            id="content"
                            placeholder={`Enter ${contentType} content here...`}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[200px]"
                        />
                        {/* Add live preview rendering logic here */}
                    </div>
                )}

                {contentType && ['lesson', 'performance'].includes(contentType) && (
                    <>
                        <Select onValueChange={setPlatform}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                                {platforms.map((plat) => (
                                    <SelectItem key={plat.value} value={plat.value}>
                                        {plat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="space-y-2">
                            <Label htmlFor="videoUrl">Video URL</Label>
                            <Input
                                id="videoUrl"
                                placeholder="Enter video URL"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                            />
                            {/* Add video preview rendering logic here */}
                        </div>
                    </>
                )}

                <Button type="submit" className="w-full">Submit</Button>
            </form>
        </Form>
    );
};

export default ContentCreationForm;