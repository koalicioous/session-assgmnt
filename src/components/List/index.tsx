import { useContext } from 'react'
import { SessionContext } from '../../context/SessionContext'
import{ useActor } from '@xstate/react'
import { ListItem as ListItemType } from "../../types"

type ListItemProps = ListItemType

const ListItem = ({listItem, active, setActiveItem, index} : { listItem : ListItemProps, active: boolean, setActiveItem: Function, index: number}) => {
    return (
        <div
            role="button"
            onClick={() => setActiveItem(index)}
            className={`py-[10px] px-[8px] rounded-[4px] mb-[4px] flex items-center cursor-pointer ${active ? `bg-[#3073F5]` : 'bg-white' }`}
        >
            <input type="checkbox" />
            <div className='ml-[10px] flex flex-col justify-start'>
                <div className={`text-[12px] text-left ${ !active ? 'text-[#606060]' : 'text-white font-semibold'}`}>
                    {listItem.name}
                </div>
                <div className={`text-[10px] flex items-center justify-start`}>
                    <span
                        className='rounded-full w-[5px] h-[5px]'
                        style={{
                            backgroundColor: listItem.category.hexColor,
                        }}
                    ></span>
                    <span className={`ml-1 ${active ? 'text-white' : 'text-[#8A8A8A]'}`}>
                        {listItem.category.name}
                    </span>
                </div>
            </div>
        </div>
    )
}

const List = ({
    activeItem,
    setActiveItem
}: { activeItem: number | null, setActiveItem: Function}) => {
    const sessionServices = useContext(SessionContext)
    const [state] = useActor(sessionServices.sessionService)
    return (
        <section className='w-[280px] mt-[32px] mx-auto'>
            {
                state.context.todos.map((item, idx) => (
                    <ListItem index={idx} listItem={item} active={idx === activeItem} setActiveItem={(setActiveItem)} key={idx}/>
                ))
            }
        </section>
    )
}

export default List;