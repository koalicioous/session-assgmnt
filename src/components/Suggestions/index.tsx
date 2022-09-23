import { useKeyPress } from "ahooks"
import { ReactNode, useEffect, useState } from "react"
import{ useActor } from '@xstate/react'
import { useContext } from "react"
import { SessionContext } from "../../context/SessionContext"
import _ from 'lodash'

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
    setTempSelected = null
} : SuggestionType) => {
    const sessionServices = useContext(SessionContext)
    const [state,send] = useActor(sessionServices.sessionService)
    const [selected, setSelected] = useState<number | null>(null)
    
    useKeyPress('uparrow', () => {
        if (state.value !== 'idle') {
            setSelected((prev) => {
                if (prev === null) return 0
                if (prev === 0) return prev
                return prev - 1
            })
        }
    })

    useKeyPress('downarrow', () => {
        if (state.value !== 'idle') {
            setSelected((prev) => {
                if (prev === null) return 0
                if (prev === options.length - 1) return prev
                return prev + 1
            })
        }
    })

    useKeyPress('enter', () => {
        if (state.value !== 'idle') {
            if (selected !==null) {
                onSelect(options[selected])
                send('TYPING_TITLE')
            }
        }
        if (state.value === 'typingTitle') {
            // immidiate insert
            if (!_.isEmpty(state.context.category)) {
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
    })

    useEffect(() => {
        setSelected(null)
    },[options.length])
    
    return (
        <div className="transition-all absolute w-full mt-1 max-h-[300px] overflow-y-auto shadow-md z-99">
            {options.map((option, idx) => {
                return (
                    <div
                        key={option.id}
                        role="button"
                        onMouseEnter={() => {
                            setSelected(idx)
                            if (setTempSelected) {
                                setTempSelected(option)
                            }
                        }}
                        onMouseLeave={(() => {
                            setSelected(null)
                            if (setTempSelected) setTempSelected(null)
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