import { Category } from "../types"

export const DUMMY_CATEGORIES: Category[] = [
    {
        id: "1",
        name: "Work",
        hexColor: "#dc2626",
    },
    {
        id: "2",
        name: "Households",
        hexColor: "#fb923c",
    },
    {
        id: "3",
        name: "Entertainment",
        hexColor: "#84cc16",
    },
    {
        id: "4",
        name: "College",
        hexColor: "#38bdf8"
    },
    {
        id: "5",
        name: "Hobby",
        hexColor: "#7c3aed"
    },
]

export const DUMMY_LIST_ITEMS = [
    {
        id: "01",
        name: "Finish checkout page",
        category: DUMMY_CATEGORIES[0],
    },
    {
        id: "02",
        name: "Watch Stranger Things 4.2",
        category: DUMMY_CATEGORIES[2],
    },
    {
        id: "03",
        name: "Finish the new version of the app",
        category: DUMMY_CATEGORIES[0],
    },
    {
        id: "04",
        name: "clean bathroom",
        category: DUMMY_CATEGORIES[1],
    },
]

export const ACTIVITY_SUGGESTIONS = [
    {
        id: "001",
        name: "Watch a movie",
    },
    {
        id: "002",
        name: "Read a book",
    },
    {
        id: "003",
        name: "Play a game",
    },
    {
        id: "004",
        name: "Go for a walk",
    },
    {
        id: "005",
        name: "Go to the gym",
    },
]