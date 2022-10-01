import { useKeyPress } from "ahooks"
import { ReactNode } from "react"
import{ useActor } from '@xstate/react'
import { useContext } from "react"
import { SessionContext } from "../../context/SessionContext"
import _ from 'lodash'
import { KEYBOARD_EVENTS, MOUSE_EVENTS } from '../../userEvents'
import { message } from 'antd'

type SuggestionType = {
    options: any[]
    onSelect: (item?: any) => void
    render: (option: any) => ReactNode
    setTempSelected?: Function | null
}

const Suggestions = ({
    options,
    onSelect,
    render = (option) => <></>,
} : SuggestionType) => {
    const sessionServices = useContext(SessionContext)
    const [state,send] = useActor(sessionServices.sessionService)
    const { selectedIndex: selected } = state.context
    
    useKeyPress(KEYBOARD_EVENTS.ARROW_UP, () => {
        if (state.value !== 'idle') {
            send({
                type: KEYBOARD_EVENTS.ARROW_UP,
                value: {
                    optionsLength: options.length,
                    options
                }
            })
        }
    })

    useKeyPress(KEYBOARD_EVENTS.ARROW_DOWN, () => {
        if (state.value !== 'idle') {
            send({
                type: KEYBOARD_EVENTS.ARROW_DOWN,
                value: {
                    optionsLength: options.length,
                    options
                }
            })
        }
    })

    useKeyPress(KEYBOARD_EVENTS.ENTER, () => {
        if (state.value === 'choosingCategory') {
            if (selected !==null) {
                onSelect(options[selected])
                send('TYPING_TITLE')
            }
        }
        if (state.value === 'typingTitle') {
            // immidiate insert
            if (state.context.tempSelectedSuggestion) {
                // onSelect(state.context.tempSelectedSuggestion)
                send({
                    type: 'INSERT_DATA',
                    value: {
                        id: new Date().getTime(),
                        name: state.context.tempSelectedSuggestion.name,
                        category: state.context.category,
                    }
                })
            } else {
                if (!!state.context.activity && !_.isEmpty(state.context.category)) {
                    send({
                        type: 'INSERT_DATA',
                        value: {
                            id: new Date().getTime(),
                            name: state.context.activity,
                            category: state.context.category,
                        }
                    })
                } else message.warning('Please insert title and select category')
            }
            if (!_.isEmpty(state.context.category && !state.context.tempSelectedSuggestion)) {
                if (!!state.context.activity) {
                    send({
                        type: 'INSERT_DATA',
                        value: {
                            id: new Date().getTime(),
                            name: state.context.activity,
                            category: state.context.category,
                        }
                    })
                }
            }
        }
        if (state.value === 'typingCategory') {
            // immidiate insert
            if (state.context.tempSelectedSuggestion) {
                send({
                    type: 'INSERT_DATA',
                    value: {
                        name: state.context.activity,
                        category: state.context.tempSelectedSuggestion,
                    }
                })
            } else message.warning('Please select a category')
        }
    })
    
    return (
        <div className="transition-all absolute w-full mt-1 max-h-[300px] overflow-y-auto shadow-md z-99">
            {options.map((option, idx) => {
                return (
                    <div
                        key={option.id}
                        role="button"
                        onMouseEnter={() => {
                            send({
                                type: MOUSE_EVENTS.MOUSE_ENTER,
                                value: {
                                    index: idx,
                                    tempSelected: option
                                },
                            })
                        }}
                        onMouseLeave={(() => {
                            send({
                                type: MOUSE_EVENTS.MOUSE_LEAVE,
                                value: {
                                    index: null,
                                    tempSelected: null,
                                }
                            })
                        })}
                        onClick={() => {
                            onSelect(option)
                        }}
                        className={`flex items-center text-[12px] px-[12px] cursor-pointer py-[10px]  ${(selected !== null && selected === idx) ? 'bg-[#3073F5] text-white font-semibold' : 'bg-white'}`}
                    >
                        {render(option)}
                    </div>
                )
            })}
        </div>
    )
}

export default Suggestions