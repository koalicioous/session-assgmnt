import { assign, createMachine } from "xstate";
import { DUMMY_LIST_ITEMS } from "../data";
import { Category, ListItem } from "../types";

const SessionMachine = createMachine({
    id: "session",
    predictableActionArguments: true,
    initial: "idle",
    context: {
        todos: [
            ...DUMMY_LIST_ITEMS
        ] as ListItem[],
        category: {} as Category,
        activity: '',
    },
    states: {
        idle: {
            on: {
                'CHOOSING_CATEGORY': {
                    target: 'choosingCategory',
                },
                'TYPING_TITLE': {
                    target: 'typingTitle',
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
                ]
            }
        }),
        'selectCategory': assign((ctx, event: any) => {
            if (!event.value) return {}
            return {
                category: event.value
            }
        }),
        'setActivity': assign((ctx, event: any) => {
            return {
                activity: event.value
            }
        })
    }
})

export default SessionMachine;