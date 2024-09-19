"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Tables } from "@/lib/database.types"
import Link from "next/link"

export type Song = Tables<'songs'>

export const columns: ColumnDef<Song>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            return <Link href={'/songs/' + row.original.slug}>{row.original.name}</Link>
        }
    },
    {
        accessorKey: "artist",
        header: "Original Artist",
    },
]
