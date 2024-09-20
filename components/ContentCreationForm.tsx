'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectItem, SelectValue, SelectTrigger, SelectContent } from '@/components/ui/select'
import { Tables } from '@/lib/database.types'
import { createContent } from '@/app/actions'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from 'sonner'
import ReactPlayer from 'react-player'
import MarkdownPreview from '@uiw/react-markdown-preview'
import Link from 'next/link'

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

const FormSchema = z.object({
    id: z.string({ required_error: "Please select a song." }),
    type: z.string({ required_error: "Please select a content type." }),
    instrument: z.string().optional(),
    platform: z.string().optional(),
    content: z.string().optional(),
    url: z.string().url().optional()
}).refine((value) => {
    return ['chords', 'tabs', 'pro'].includes(value.type) ? value.instrument && value.content : false
}).refine((value) => {
    return ['lesson', 'performance'].includes(value.type) ? value.platform && value.url : false
})

const ContentCreationForm = ({ data }: { data: Song[] }) => {
    const router = useRouter();
    const [songId, setSongId] = useState<number | null>(null)
    const [contentType, setContentType] = useState("")
    const [instrument, setInstrument] = useState("")
    const [platform, setPlatform] = useState("")
    const [content, setContent] = useState("")
    const [videoUrl, setVideoUrl] = useState("")

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: 'onChange',
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log('Form submitted')
        toast('You submitted form data<br />: ' + JSON.stringify(data, null, 2));
    }

    const handleSongSelect = (selectedId: number) => {
        setSongId(prevId => prevId === selectedId ? null : selectedId);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Song</FormLabel>
                            <FormControl>
                                <Select onValueChange={(value) => {
                                    field.onChange(value)
                                }}>
                                    <SelectTrigger className="w-full md:w-fit">
                                        <SelectValue placeholder="Select a song..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {data.map((song) => (
                                            <SelectItem key={song.id} value={song.id.toString()}>
                                                {song.name} ({song.artist})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Content Type</FormLabel>
                            <FormControl>
                                <Select value={field.value} onValueChange={(value) => {
                                    setContentType(value)
                                    field.onChange(value)
                                }}>
                                    <SelectTrigger className="w-full md:w-fit">
                                        <SelectValue placeholder="Select content type..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {contentTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {contentType !== 'lyrics' && (
                    <FormField
                        control={form.control}
                        name="instrument"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Instrument</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={(value) => {
                                        setInstrument(value)
                                        field.onChange(value)
                                    }}>
                                        <SelectTrigger className="w-full md:w-fit">
                                            <SelectValue placeholder="Select instrument..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {instruments.map((inst) => (
                                                <SelectItem key={inst.value} value={inst.value}>
                                                    {inst.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {contentType && ['chords', 'tab', 'lyrics', 'pro'].includes(contentType) && (
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content ({contentType})</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            id="content"
                                            placeholder={`Enter ${contentType} content here...`}
                                            value={content}
                                            onChange={(e) => {
                                                setContent(e.target.value)
                                                field.onChange(e.target.value)
                                            }}
                                            className="font-mono min-h-[200px]"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {['chords', 'tab', 'lyrics'].includes(contentType) && (
                            <div className="text-right text-sm text-slate-800">
                                You can use <Link className="font-bold" href="https://commonmark.org/help/">Markdown</Link> formatting in your {contentType}!
                            </div>
                        )}
                        {/* Add live preview rendering logic here */}
                    </div>
                )}

                {contentType && ['lesson', 'performance'].includes(contentType) && (
                    <>
                        <FormField
                            control={form.control}
                            name="platform"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Video Platform</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={(value) => {
                                            setPlatform(value)
                                            field.onChange(value)
                                        }}>
                                            <SelectTrigger className="w-full md:w-fit">
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
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Video URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="videoUrl"
                                                className="w-full md:w-fit"
                                                placeholder="Enter video URL"
                                                value={field.value}
                                                onChange={(e) => {
                                                    setVideoUrl(e.target.value)
                                                    field.onChange(e.target.value)
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </>
                )}

                <Button type="submit" className="w-full md:w-fit">Submit</Button>

                {/* Preview area */}

                {content && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-2">Content Preview</h3>
                        <div className="border p-4 rounded-md bg-white">
                            <MarkdownPreview source={content} style={{ padding: 16, fontFamily: 'monospace', fontSize: '0.75em' }} />
                        </div>
                    </div>
                )}

                {videoUrl && (
                    <div className="pt-4 pb-6">
                        <Label>Video Preview</Label>
                        <div className="relative w-full pt-[56.25%] shadow-lg">
                            <ReactPlayer
                                url={videoUrl}
                                width="100%"
                                height="100%"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                }}
                                controls={true}
                            />
                        </div>
                    </div>
                )}

            </form>
        </Form>
    );
};

export default ContentCreationForm;