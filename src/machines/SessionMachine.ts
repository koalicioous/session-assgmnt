import { assign, createMachine } from "xstate";
import { DUMMY_LIST_ITEMS } from "../data";
import { Activity, Category, ListItem } from "../types";

import { KEYBOARD_EVENTS, MOUSE_EVENTS } from '../userEvents';

const SessionMachine = createMachine({
    id: "session",
    predictableActionArguments: true,
    initial: "idle",
    context: {
        titleValue: '',
        categoryValue: null as string | null,
        todos: [
            ...DUMMY_LIST_ITEMS
        ] as ListItem[],
        category: {} as Category,
        activity: '',
        selectedIndex: null as null | number,
        tempSelectedSuggestion: null as Category | Activity | null,
        activeItem: null as null | number,
    },
    states: {
        idle: {
            on: {
                'CHOOSING_CATEGORY': {
                    target: 'choosingCategory',
                },
                'TYPING_TITLE': {
                    target: 'typingTitle',
                },
                'SET_ACTIVE_ITEM': {
                    target: 'idle',
                    actions: 'setActiveItem',
                },
                [KEYBOARD_EVENTS.ARROW_UP]: {
                    target: 'idle',
                    actions: 'selectPreviousActiveItem',
                },
                [KEYBOARD_EVENTS.ARROW_DOWN]: {
                    target: 'idle',
                    actions: 'selectNextActiveItem',
                }
            }
        },
        typingTitle: {
            on: {
                'CHOOSING_CATEGORY': {
                    target: 'choosingCategory',
                },
                'TYPING_CATEGORY': {
                    target: 'typingCategory',
                },
                'INSERT_DATA': {
                    target: 'idle',
                    actions: 'insertData',
                },
                'IDLE': {
                    target: 'idle',
                },
                'SET_ACTIVITY': {
                    target: 'typingTitle',
                    actions: 'setActivity',
                },
                [KEYBOARD_EVENTS.LETTER_INPUT]: {
                    target: 'typingTitle',
                    actions: 'setTitleValue',
                },
                [KEYBOARD_EVENTS.ARROW_DOWN]: {
                    target: 'typingTitle',
                    actions: 'selectNextSuggestion',
                },
                [KEYBOARD_EVENTS.ARROW_UP]: {
                    target: 'typingTitle',
                    actions: 'selectPreviousSuggestion',
                },
                [MOUSE_EVENTS.MOUSE_ENTER]: {
                    target: 'typingTitle',
                    actions: 'selectSuggestion',
                },
                [MOUSE_EVENTS.MOUSE_LEAVE]: {
                    target: 'typingTitle',
                    actions: 'selectSuggestion',
                }
            }
        },
        typingCategory: {
            on: {
                'IDLE': {
                    target: 'idle',
                },
                'CHOOSING_CATEGORY': {
                    target: 'choosingCategory',
                },
                'TYPING_TITLE': {
                    target: 'typingTitle',
                },
                'INSERT_DATA': {
                    target: 'idle',
                    actions: 'insertData',
                },
                [KEYBOARD_EVENTS.LETTER_INPUT]: {
                    target: 'typingCategory',
                    actions: 'setTitleValue',
                },
                [KEYBOARD_EVENTS.ARROW_DOWN]: {
                    target: 'typingCategory',
                    actions: 'selectNextSuggestion',
                },
                [KEYBOARD_EVENTS.ARROW_UP]: {
                    target: 'typingCategory',
                    actions: 'selectPreviousSuggestion',
                },
                [MOUSE_EVENTS.MOUSE_ENTER]: {
                    target: 'typingCategory',
                    actions: 'selectSuggestion',
                },
                [MOUSE_EVENTS.MOUSE_LEAVE]: {
                    target: 'typingCategory',
                    actions: 'selectSuggestion',
                }
            }
        },
        choosingCategory: {
            on: {
                'IDLE': {
                    target: 'idle',
                },
                'TYPING_TITLE': {
                    target: 'typingTitle',
                    actions: 'selectCategory'
                },
                [KEYBOARD_EVENTS.ARROW_DOWN]: {
                    target: 'choosingCategory',
                    actions: 'selectNextSuggestion',
                },
                [KEYBOARD_EVENTS.ARROW_UP]: {
                    target: 'choosingCategory',
                    actions: 'selectPreviousSuggestion',
                },
                [MOUSE_EVENTS.MOUSE_ENTER]: {
                    target: 'choosingCategory',
                    actions: 'selectSuggestion',
                },
                [MOUSE_EVENTS.MOUSE_LEAVE]: {
                    target: 'choosingCategory',
                    actions: 'selectSuggestion',
                }
            }
        }
    }
}, {
    actions: {
        'insertData': assign((ctx, event: any) => {
            return {
                todos: [
                    ...ctx.todos,
                    event.value
                ],
                selectedIndex: null,
                titleValue: '',
                tempSelectedSuggestion: null,
                activity: '',
            }
        }),
        'selectCategory': assign((ctx, event: any) => {
            if (!event.value) return {}
            return {
                categoryValue: event.value.id,
                category: event.value,
                selectedIndex: null,
                tempSelectedSuggestion: null,
            }
        }),
        'setActivity': assign((ctx, event: any) => {
            return {
                activity: event.value,
                tempSelectedSuggestion: null,
                selectedIndex: null,
            }
        }),
        'selectNextSuggestion': assign((ctx, event: any) => {
            const next: number = ctx.selectedIndex === null ? 0 : ctx.selectedIndex + 1;
            return {
                selectedIndex: next === event.value.optionsLength ? ctx.selectedIndex : next,
                tempSelectedSuggestion: event.value.options[next === event.value.optionsLength ? ctx.selectedIndex ?? 0 : next]
            }
        }),
        'selectPreviousSuggestion': assign((ctx, event: any) => {
            const prev: number = ctx.selectedIndex === null ? 0 : ctx.selectedIndex - 1;
            return {
                selectedIndex: prev === -1 ? ctx.selectedIndex : prev,
                tempSelectedSuggestion: event.value.options[prev === -1 ? ctx.selectedIndex ?? 0 : prev]
            }
        }),
        'selectSuggestion': assign((ctx, event: any) => {
            return {
                selectedIndex: event.value.index,
                tempSelectedSuggestion: event.value.tempSelected,
            }
        }),
        'setTitleValue': assign((_, event: any) => {
            return {
                titleValue: event.value,
                activity: event.value.split('@')[0],
                tempSelectedSuggestion: null,
            }
        }),
        'selectNextActiveItem': assign((ctx, event: any) => {
            const next: number | null = ctx.todos.length === 0 ? null
                : ctx.activeItem === null ? 0
                : ctx.activeItem === ctx.todos.length - 1 ? ctx.activeItem
                : ctx.activeItem + 1;
            return {
                activeItem: next,
            }
        }),
        'selectPreviousActiveItem': assign((ctx, event: any) => {
            const prev: number | null = ctx.todos.length === 0 ? null
                : ctx.activeItem === null ? 0
                : ctx.activeItem === 0 ? ctx.activeItem
                : ctx.activeItem - 1;
            return {
                activeItem: prev,
            }
        }),
        'setActiveItem': assign((ctx, event: any) => {
            return {
                activeItem: event.value,
            }
        })
    }
})

export default SessionMachine;