import React from 'react';
import './App.css';

import Input from './components/Input';
import Select from './components/Select';

import { DUMMY_CATEGORIES } from './data';
import SessionContextProvider from './context/SessionContext';

import { SessionContext } from './context/SessionContext';
import { useActor } from '@xstate/react';
import List from './components/List';

import { useKeyPress, useClickAway } from 'ahooks';

function App() {
  const sessionServices = React.useContext(SessionContext)
  const [state, send] = useActor(sessionServices.sessionService)

  const [titleValue, setTitleValue] = React.useState<string>('')
  const [categoryValue, setCategoryValue] = React.useState<string | null>(null)

  const [activeItem,setActiveItem] = React.useState<number | null>(null)

  const listItemRef = React.useRef(null)
  const inputRef = React.useRef(null)

  useClickAway(() => {
    if (state.value === 'idle') {
      setActiveItem(null)
    }
  }, [listItemRef])

  useKeyPress('uparrow', () => {
    if (state.value === 'idle') {
      setActiveItem((prev) => {
        if (prev === null) return 0
        return prev === 0 ? prev : prev - 1
      })
    }
  })

  useKeyPress('downarrow', () => {
    if (state.value === 'idle') {
      setActiveItem((prev) => {
        if (prev === null) return 0
        return prev === state.context.todos.length - 1 ? prev : prev + 1
      })
    }
  })

  return (
    <div className="App">
      <section className='w-[500px] mx-auto bg-gray-100 p-4'>
        <Select
          value={categoryValue}
          options={DUMMY_CATEGORIES}
          onChange={setCategoryValue}
        />
        <div
          ref={inputRef}
        >
          <Input
            value={titleValue}
            onChange={setTitleValue}
            selectCategory={setCategoryValue}
          />
        </div>
        <div ref={listItemRef} className="w-[280px] mx-auto">
          <List
            activeItem={activeItem}
            setActiveItem={setActiveItem}
          />
        </div>
      </section>
    </div>
  );
}

function AppWrapper() {
  return (
    <SessionContextProvider>
      <App />
    </SessionContextProvider>
  )
}

export default AppWrapper;
