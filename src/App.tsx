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
import { KEYBOARD_EVENTS } from './userEvents';

function App() {
  const sessionServices = React.useContext(SessionContext)
  const [state, send] = useActor(sessionServices.sessionService)

  const listItemRef = React.useRef(null)
  const inputRef = React.useRef(null)

  const { titleValue, categoryValue, activeItem } = state.context
  const handleSetActiveItem = (index: number | null) => {
    send({
      type:'SET_ACTIVE_ITEM',
      value: index
    })
  }

  useClickAway(() => {
    if (state.value === 'idle') {
      handleSetActiveItem(null)
    }
  }, [listItemRef])

  useKeyPress(KEYBOARD_EVENTS.ARROW_UP, () => {
    if (state.value === 'idle') {
      send({
        type: KEYBOARD_EVENTS.ARROW_UP,
      })
    }
  })

  useKeyPress(KEYBOARD_EVENTS.ARROW_DOWN, () => {
    if (state.value === 'idle') {
      send({
        type: KEYBOARD_EVENTS.ARROW_DOWN,
      })
    }
  })

  const onTitleChange = (value: string) => {
    send({
      type: KEYBOARD_EVENTS.LETTER_INPUT,
      value
    })
  }

  return (
    <div className="App">
      <section className='w-[500px] mx-auto bg-gray-100 p-4'>
        <Select
          value={categoryValue}
          options={DUMMY_CATEGORIES}
        />
        <div
          ref={inputRef}
        >
          <Input
            id="titleValue"
            value={titleValue}
            onChange={onTitleChange}
          />
        </div>
        <div ref={listItemRef} className="w-[280px] mx-auto">
          <List
            activeItem={activeItem}
            setActiveItem={handleSetActiveItem}
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
