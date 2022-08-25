import React, { useEffect, useReducer, useState } from 'react'
import axios from 'axios'
import Input from '../src/components/Input'
import Layout from '../src/components/Layout'
import BaseButton from '../src/components/BaseButton'
import BaseList from '../src/components/BaseList'
import BaseListItem from '../src/components/BaseListItem'
// import NestedLayout from '../src/components/NestedLayout'
import { ReactElement } from 'react'
import { splitStr } from '../src/utils/utils.js'

const initialState = {
  text: '',
  okrs: [
    {
      id: 0, // new Date().valueOf(),
      objective:
        'Getting a jobs that pays 7k+ per month within the next 45 days',
      result_1: 'Be able to destroy all the algo challenges on CodeSignal',
      result_2:
        'Write a short blog article with accompanying code for 10 different React and Next.js concepts.',
      result_3:
        'Go through 6 courses, 3 on React/Next/Typescript and 3 on Node/Vanilla js',
    },
  ],
  editing: null,
}

function reducer(state, action) {
  // TODO: extract this out into a hook?
  const { id, text, name } = action.payload
  switch (action.type) {
    case 'on_change':
      console.log(action.payload)
      return {
        ...state,
        text: action.payload,
      }
    case 'add':
      return {
        ...state,
        text: '',
        okrs: [
          ...state.okrs,
          {
            id: new Date().valueOf(), // easy temp id
            objective: state.text,
            result_1: '',
            result_2: '',
            result_3: '',
          },
        ],
        editing: new Date().valueOf(),
      }
    case 'edit':
      // const { id, text, name } = action.payload
      return {
        ...state,
        okrs: state.okrs.map((o) => (o.id === id ? { ...o, [name]: text } : o)),
      }
    case 'add_result':
      return {
        ...state,
        okrs: state.okrs.map((o, i) => {
          const resultsKeys = Object.keys(o)
          const lastKey = resultsKeys[resultsKeys.length - 1]
          let lastKeyNum = +lastKey.split('_')[1]
          return o.id === id ? { ...o, ['result_' + (lastKeyNum + 1)]: '' } : o
        }),
      }
    case 'delete':
      const deleteOkrOrResult = (name) => {
        if (name === 'objective') {
          return state.okrs.filter((o) => o.id !== id)
        } else {
          return state.okrs.map((o) => {
            if (o.id === id) {
              delete o[name]
              return o
            }
            return o
          })
        }
      }
      return {
        ...state,
        okrs: deleteOkrOrResult(name),
      }
    case 'sync_db':
      const objOrder = {
        id: null,
        objective: null,
        result_1: null,
        result_2: null,
        result_3: null,
      }
      const orderedOjects = []
      for (const obj of action.payload.Items) {
        const orderedOject = { ...objOrder, ...obj }
        orderedOjects.push(orderedOject)
      }
      return {
        ...state,
        okrs: orderedOjects,
      }
      return {
        ...state,
        okrs: deleteOkrOrResult(name),
      }
    default:
      throw new Error()
  }
}

const Okrs = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [input, setInput] = useState('')
  const [showInput, setShowInput] = useState([null, 0])
  //const [items, setItems] = useState(null)
  // TODO: set up refs to focus respective inputs onclick as described below
  // https://stackoverflow.com/questions/52448143/how-to-deal-with-a-ref-within-a-loop
  // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs

  const baseUrl = 'https://e4f13pkfgb.execute-api.us-east-1.amazonaws.com/items'
  useEffect(() => {
    const getOkrs = async () => {
      try {
        const res = await axios.get(baseUrl)
        dispatch({ type: 'sync_db', payload: res.data })
      } catch (err) {
        console.log('error msg here >>> ', err)
      }
    }
    getOkrs()
  }, [])

  // HANDLERS

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') setShowInput([null, 0])
    // TODO: Write something here so that it opens the next result...
  }

  const handleDelete = (data) => {
    if (data.name === 'objective') {
      deleteReq(data.id)
    }
  }

  // API REQUESTS

  const putReq = (id) => {
    const data = () => {
      if (id) {
        return state.okrs.filter((o) => o.id === id)[0]
      } else {
        return {
          id: new Date().valueOf().toString(), // easy temp id
          objective: state.text,
          result_1: '',
          result_2: '',
          result_3: '',
        }
      }
    }

    try {
      const res = axios.put(baseUrl, data())
    } catch (err) {
      console.log('error msg >>> ', err)
    }
  }

  const deleteReq = (id) => {
    const url = baseUrl + '/' + id

    try {
      const res = axios.delete(url)
    } catch (err) {
      console.log('error msg >>> ', err)
    }
  }

  return (
    <>
      <div className="flex">
        <Input
          onChange={(e) =>
            dispatch({ type: 'on_change', payload: e.target.value })
          }
          value={state.text}
          placeholder={'Write your objective...'}
        />
        <BaseButton
          onClick={() => {
            dispatch({ type: 'add', payload: input })
            putReq()
          }}
          text={'Create Objective'}
        />
      </div>
      {state.okrs.map((okr, i) => (
        <div className="py-4" key={i}>
          <BaseList>
            {Object.entries(okr)
              .slice(1)
              .map(([name, value], j) => (
                <div key={j}>
                  {showInput[0] == okr.id && showInput[1] == j ? (
                    <div className="flex">
                      <span className="font-semibold capitalize">
                        {splitStr(name)}:
                      </span>
                      <Input
                        onChange={(e) =>
                          dispatch({
                            type: 'edit',
                            payload: {
                              text: e.target.value,
                              id: okr.id,
                              name: name,
                            },
                          })
                        }
                        onKeyPress={(e) => handleKeyPress(e)}
                        defaultValue={value}
                        inline={true}
                        placeholder={'key result...'}
                      />
                      <a
                        href="#"
                        onClick={() => {
                          setShowInput([null, 0])
                          putReq(okr.id)
                        }}
                      >
                        close
                      </a>
                      {j === 0 && (
                        <>
                          <div>
                            {'\u00A0'}|{'\u00A0'}
                          </div>

                          <a
                            href="#"
                            onClick={() => {
                              dispatch({
                                type: 'delete',
                                payload: { id: okr.id, name: name },
                              })
                              setShowInput([null, 0])
                              handleDelete({ name, id: okr.id })
                            }}
                          >
                            delete
                          </a>
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      <div
                        onClick={() => {
                          setShowInput([okr.id, j])
                        }}
                      >
                        <BaseListItem name={name} value={value} />
                      </div>
                      {j >= Object.keys(okr).length - 2 && (
                        <a
                          href="#"
                          onClick={() =>
                            dispatch({
                              type: 'add_result',
                              payload: { id: okr.id },
                            })
                          }
                        >
                          add key result
                        </a>
                      )}
                    </>
                  )}
                </div>
              ))}
          </BaseList>
        </div>
      ))}

      {/* {<pre>{JSON.stringify(state, null, 2)}</pre>}} */}
      <div className="mt-12">
        {/* {items && <pre>{JSON.stringify(items, null, 2)}</pre>} */}
      </div>
    </>
  )
}

export default Okrs

Okrs.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
      {/* <NestedLayout>{page}</NestedLayout> */}
    </Layout>
  )
}
