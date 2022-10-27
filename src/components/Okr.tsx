import React, { useState } from 'react'
import BaseList from './BaseList'
import Input from './Input'
import BaseListItem from './BaseListItem'
import ListItemControl from './ListItemControl'
import BaseDropdown from './BaseDropdown'
import Portal from './Portal'
import { splitStr } from '../utils/utils'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'

const Okr = ({ okr, putReq, onChange, handleDelete, addResult, i, key }) => {
  const [showInput, setShowInput] = useState([null, 0])
  const [collapse, setCollapse] = useState(true)

  const handleKeyPress = (e, id) => {
    if (e.key === 'Enter') setShowInput([null, 0])
    if (id && e.key === 'Enter') {
      console.log('id from inside handleKeyPress here ', typeof id)
      putReq(id)
    }
    // TODO: Write something here so that it opens the next result...
  }

  const handleCollapse = ({ index }) => {
    if (index < 1) {
      return null
    } else if (collapse) {
      return 'hidden'
    } else {
      return null
    }
  }

  const Chevron = collapse ? ChevronDownIcon : ChevronUpIcon

  return (
    <div className="rounded-md bg-white my-4 shadow" key={key}>
      <BaseList>
        <div className="grid grid-cols-5">
          <div className="col-span-4 px-6 py-4">
            {Object.entries(okr)
              .slice(1)
              .map(
                (
                  [name, value],
                  j // TODO: maybe extract out this inline edit into component, maybe not
                ) => (
                  <div key={`${key}-${j}`}>
                    {showInput[0] == okr.id && showInput[1] == j ? (
                      <div className="flex">
                        <span className="font-semibold capitalize">
                          {splitStr(name)}:
                        </span>
                        <Input
                          onChange={(e) =>
                            onChange({
                              type: 'edit',
                              payload: {
                                name,
                                id: okr.id,
                                text: e.target.value,
                              },
                            })
                          }
                          onKeyPress={(e) => handleKeyPress(e, okr.id)}
                          value={value}
                          inline={true}
                          placeholder={'key result...'}
                        />
                        <ListItemControl
                          onClick={() => {
                            setShowInput([null, 0])
                            putReq(okr.id)
                          }}
                        >
                          close
                        </ListItemControl>
                        {j === 0 && ( // TODO: change this so you can delete just results in DB
                          <>
                            <div>
                              {'\u00A0'}|{'\u00A0'}
                            </div>
                            <ListItemControl
                              onClick={() => {
                                setShowInput([null, 0])
                                handleDelete({ name, id: okr.id })
                              }}
                            >
                              delete
                            </ListItemControl>
                          </>
                        )}
                      </div>
                    ) : (
                      <BaseListItem
                        onClick={() => setShowInput([okr.id, j])}
                        name={name}
                        value={value}
                        hidden={handleCollapse({ index: j })}
                      />
                    )}
                  </div>
                )
              )}
            {!collapse && (
              <ListItemControl onClick={addResult}>
                add key result
              </ListItemControl>
            )}
          </div>
          <div className="bg-gray-100 p-2 relative">
            <Chevron
              onClick={() => setCollapse(!collapse)}
              className="h-5 w-5 absolute top-1 right-3"
            />
            <BaseDropdown />
          </div>
        </div>
      </BaseList>
    </div>
  )
}

export default Okr
