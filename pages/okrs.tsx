import React from 'react'
import Input from '../src/components/Input'
import Layout from '../src/components/Layout'
import BaseButton from '../src/components/BaseButton'
import BaseList from '../src/components/BaseList'
import BaseListItem from '../src/components/BaseListItem'
// import NestedLayout from '../src/components/NestedLayout'
import { useReducer, useState } from 'react'
import { ReactElement } from 'react'
import { splitStr } from '../src/utils/utils.js'

// TODO:
/*
  DONE-take out id
  DONE-make font bold
  -write helper function to manipulate string
  

  I should...
    -finish the whole thing as best as I can 
      DONE-add and delete results
      DONE-don't show "objective" placeholder
      DONE-get rid of the underscore on the result
      -make it soe "add key result" doesn't disappear
      -space close and delete
      DONE-delete objective?
      DONE-close input on enter
      2-add a little bit of design
      3-clean it up, ensure best practices
      3-connect it up to a db
        -cloud formation...
      4-convert it to typescript
      5-testing
      


    -convert it to typescript
    -put testing into it
    -write a read.me to talk about design decisions
    -connect it up to lambda, db, etc (perhaps first just localStorage)
    -put it in my portfolio
    -maybe for each technique I can write a little medium article and do it that way

*/

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

// REDUCER FUNCTIONS

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
            id: new Date().valueOf(),
            objective: state.text, // action.payload
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
    default:
      throw new Error()
  }
}

const Okrs = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [input, setInput] = useState('')
  const [showInput, setShowInput] = useState([null, 0])
  // TODO: set up refs to focus respective inputs onclick as described below
  // https://stackoverflow.com/questions/52448143/how-to-deal-with-a-ref-within-a-loop

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') setShowInput([null, 0])
    // TODO: could you write something here so that it opens the next result...
  }

  return (
    <>
      <div className="flex">
        {/* <Input onChange={(e) => setInput(e.target.value)} value={input} /> */}
        <Input
          onChange={(e) =>
            dispatch({ type: 'on_change', payload: e.target.value })
          }
          value={state.text}
          placeholder={'Write your objective...'}
        />
        <BaseButton
          onClick={() => dispatch({ type: 'add', payload: input })}
          text={'Create Objective'}
        />
      </div>
      {/* {<pre>{JSON.stringify(state, null, 2)}</pre>}} */}
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
                      <a href="#" onClick={() => setShowInput([null, 0])}>
                        close
                      </a>
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
                        }}
                      >
                        delete
                      </a>
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
      {/* {<BaseButton text="make okr" />} */}
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
