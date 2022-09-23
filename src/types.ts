export type Category = {
    id: string,
    name: string,
    hexColor?: string,
}

export type Activity = {
    id: string,
    name: string
}

export type ListItem = {
    id: string,
    name: string,
    category: Category,
}

export type ListContent = ListItem[]