import Link from 'next/link'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export type Breadcrumb = {
    name: string,
    url: string
}

export default function BreadcrumbsLinks({ data }: { data: Breadcrumb[] }) {

    function makeBreadcrumb(crumb: Breadcrumb, index: number, length: number) {
        return (
            <>
                <BreadcrumbItem key={'breadcrumb-' + index}>
                    <BreadcrumbLink>
                        <Link href={crumb.url}>{crumb.name}</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {index < length - 1 ? <BreadcrumbSeparator key={'separator-' + index} /> : ''}
            </>
        )
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {data.map((crumb: Breadcrumb, index) => (
                    makeBreadcrumb(crumb, index, data.length)
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}