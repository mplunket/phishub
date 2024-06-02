import Link from "next/link";

const Footer = () => {
    return (
        <section className="w-full footer py-8 text-center text-sm text-slate-300 bg-gradient-to-b from-slate-900 to-slate-700">
            This site voluntarily complies with the Phish fan web site policy at <Link className="underline dark:hover:text-slate-400 hover:text-slate-100" href="https://www.phish.com/faq/web-guidelines">https://www.phish.com/faq/web-guidelines</Link>.
        </section>
    )
}

export default Footer