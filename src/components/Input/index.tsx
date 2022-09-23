import { useEffect, useRef, useContext, useState } from "react";
import { SessionContext } from "../../context/SessionContext"
import { ACTIVITY_SUGGESTIONS, DUMMY_CATEGORIES } from "../../data";
import { parseInput } from "../../helpers";
import Suggestions from "../Suggestions";
import { Activity, Category } from '../../types';
import{ useActor } from '@xstate/react'

type InputProps = {
    value: string,
    onChange: (value: string) => void,
    selectCategory: (category: string) => void,
}

const renderCategory = (option: Category) => {
    return (
        <div className="flex items-center text-[12px] px-[12px] py-[10px]">
            <span
                className="w-[5px] h-[5px] rounded-full"
                style={{
                    backgroundColor: option.hexColor,
                }}
            />
            <span className="ml-1">
                {option.name}
            </span>
        </div>
    )
}

const renderActivities = (option: { id: string, name: string}) => {
    return (
        <div className="flex items-center text-[12px] px-[12px] py-[10px]">
            {option.name}
        </div>
    )
}

const Input = ({
    value,
    onChange,
} : InputProps) => {

    const inputRef = useRef<HTMLInputElement>(null)
    const sessionServices = useContext(SessionContext)
    const [state, send] = useActor(sessionServices.sessionService)
    const [tempSelected, setTempSelected] = useState<Category | Activity | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const { title, category } = parseInput(value)

    const handleSelectActivity = (option: { id: string, name: string}) => {
        onChange(option.name)
        send({
            type: 'SET_ACTIVITY',
            value: option.name
        })
    }

    const handleSelectCategory = (option: Category) => {
        onChange('')
        send({
            type: 'INSERT_DATA',
            value: {
                name: title,
                category: option,
            }
        })
        if (inputRef.current) {
            inputRef.current.blur()
        }
    }

    useEffect(() => {
        if (state?.value === 'typingTitle') {
            if (inputRef.current) {
                inputRef.current.focus()
                onChange('')
            }
        }
    }, [state?.value, onChange])

    useEffect(() => {
        if (
            state.value === 'typingTitle' || state.value === 'typingCategory'
        ) {
            if (category !== null) {
                if (state.value === 'typingTitle') send('TYPING_CATEGORY')
            } else send('TYPING_TITLE')
        }
    },[category, send, state.value])

    const handleBlur = () => {
        if (tempSelected === null) send('IDLE')
        else {
            if (state.value === 'typingTitle') {
                if (inputRef.current) {
                    inputRef.current.focus()
                    onChange(`${tempSelected.name}`)
                }
            }
        }
    }

    return (
        <div
            ref={containerRef}
            className={`relative w-[280px] bg-red-500 mx-auto ${(state?.value === 'typingTitle' || state?.value === 'typingCategory') ? 'z-20' : 'z-10'}`}
        >
            <input
                ref={inputRef}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={`What's your focus?`}
                className='p-4 w-[280px] text-[12px] px-[18px] py-[12px] rounded-1'
                onFocus={() => send('TYPING_TITLE')}
                onBlur={handleBlur}
            />
            {
                (state?.value === 'typingTitle' || state?.value === 'typingCategory') && (
                    <Suggestions
                        options={
                            state.value === 'typingTitle' ?
                             !!title ?
                                ACTIVITY_SUGGESTIONS.filter((option) => option.name.toLowerCase().includes(title.toLowerCase()))
                                : ACTIVITY_SUGGESTIONS
                             : !!category ?
                                DUMMY_CATEGORIES.filter((option) => option.name.toLowerCase().includes(category.toLowerCase()))
                            : DUMMY_CATEGORIES
                        }
                        render={
                            state.value === 'typingTitle' ?
                                renderActivities :
                                renderCategory
                        }
                        onSelect={
                            state.value === 'typingTitle' ?
                                handleSelectActivity :
                                handleSelectCategory
                        }
                        setTempSelected={setTempSelected}
                    />
                )
            }
        </div>
    )
}

export default Input;