import React from 'react';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-200">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-wrap justify-between">
                    <div className="w-full md:w-1/2 mb-6 md:mb-0">
                        <h3 className="text-2xl text-primary font-black mb-2">phishub</h3>
                        <p>Phish tabs, chords, video lessons and performances.</p>
                    </div>
                    <div className="w-full flex justify-center md:justify-end space-x-8 md:w-1/2">
                        <Button className="w-8 h-8" variant="ghost" size="icon" asChild>
                            <a href="https://x.com/phishub" target="_blank" rel="noopener noreferrer">
                                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
                                <span className="sr-only">Twitter</span>
                            </a>
                        </Button>
                        <Button className="w-8 h-8" variant="ghost" size="icon" asChild>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Facebook</title><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" /></svg>
                                <span className="sr-only">Facebook</span>
                            </a>
                        </Button>
                        <Button className="w-8 h-8" variant="ghost" size="icon" asChild>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>YouTube</title><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                <span className="sr-only">YouTube</span>
                            </a>
                        </Button>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <p>&copy; {new Date().getFullYear()} Phishub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;