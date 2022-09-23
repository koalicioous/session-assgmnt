import { SessionContext } from "../../context/SessionContext"
import { Category } from "../../types"
import Suggestions from "../Suggestions"
import{ useActor } from '@xstate/react'
import { useContext, useRef } from "react"
import useOnClickOutside from "../../helpers/onClickOutside"

type SelectProps = {
    value: string | null,
    options: any[],
    onChange: (value: string) => void,
}

const renderOption = (option: Category) => {
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

const Select = ({
    value,
    options,
    onChange,
} : SelectProps) => {
    const sessionServices = useContext(SessionContext)
    const [state, send] = useActor(sessionServices.sessionService)
    const selectRef = useRef<HTMLDivElement>(null)

    const SelectClickHandler = () => {
        if (state?.value !== 'choosingCategory') send('CHOOSING_CATEGORY')
        else send('IDLE')
    }

    const onSelectCategory = (option: Category) => {
        onChange(option.id) 
        send({
            type: 'TYPING_TITLE',
            value: option
        })
    }

    useOnClickOutside(selectRef, () => {
        if (state.value === 'choosingCategory') send('IDLE')
    })

    return (
        <div
            ref={selectRef}
            className={`w-[280px] mx-auto mb-2 rounded-1 relative ${state.value === 'choosingCategory' ? 'z-20' : 'z-10'}`}
        >
            <button className="w-full flex items-center px-[18px] py-[12px] bg-white" onClick={SelectClickHandler}>
                {!value && (
                    <div>
                        <span className="text-[12px]">Categories</span>
                    </div>
                )}
                {
                    value && (
                        <div>
                            <span className="text-[12px]">{options.find((option: Category) => option.id === value)?.name}</span>
                        </div>
                    )
                }
            </button>
            {state?.value === 'choosingCategory' && (
                <Suggestions
                    options={options}
                    render={renderOption}
                    onSelect={onSelectCategory}
                />
            )}
        </div>
    )
}

export default Select