import { useInterpret } from "@xstate/react"
import { createContext, ReactNode, useContext } from "react"
import { InterpreterFrom } from "xstate"
import SessionMachine from "../machines/SessionMachine"

export const SessionContext = createContext({
    sessionService: {} as InterpreterFrom<typeof SessionMachine>
})

const SessionContextProvider = ({ children }: { children: ReactNode}) => {
    const sessionService = useInterpret(SessionMachine)

    return (
        <SessionContext.Provider value={{ sessionService }}>
            {children}
        </SessionContext.Provider>
    )
}

export const useSessionContext = () => {
    const context = useContext(SessionContext)
    return context
}

export default SessionContextProvider;