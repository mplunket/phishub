import Link from "next/link";

const Footer = () => {
    return (
        <section className="w-full footer py-8 text-center text-sm bg-slate-900 text-slate-300 dark:bg-white dark:text-slate-900">
            This site voluntarily complies with the Phish fan web site policy at <Link className="underline dark:hover:text-slate-500 hover:text-slate-100" href="https://www.phish.com/faq/web-guidelines">https://www.phish.com/faq/web-guidelines</Link>.
        </section>
    )
}

export default Footer