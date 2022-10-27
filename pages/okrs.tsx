import React, { useEffect, useReducer, useState } from 'react'
import axios from 'axios'
// import useOkrs from '../hooks/useOkrs'
import useOkrsReducer from '../hooks/useOkrsReducer'
import Input from '../src/components/Input'
import Layout from '../src/components/Layout'
import BaseButton from '../src/components/BaseButton'
import Okr from '../src/components/Okr'
// import NestedLayout from '../src/components/NestedLayout'
import { ReactElement } from 'react'
import { stringify } from 'querystring'

// const initialState = {
//   text: '',
//   okrs: [],
// }

// function reducer(state, action) {
//   // TODO: extract this out into a hook?
//   const { id, text, name } = action.payload
//   switch (action.type) {
//     case 'on_change':
//       console.log(action.payload)
//       return {
//         ...state,
//         text: action.payload,
//       }
//     case 'add':
//       console.log(action.payload)
//       return {
//         ...state,
//         text: '',
//         okrs: [...state.okrs, action.payload],
//       }
//     case 'edit':
//       return {
//         ...state,
//         okrs: state.okrs.map((o) => (o.id === id ? { ...o, [name]: text } : o)),
//       }
//     case 'add_result':
//       return {
//         ...state,
//         okrs: state.okrs.map((o, i) => {
//           const resultsKeys = Object.keys(o)
//           const lastKey = resultsKeys[resultsKeys.length - 1]
//           let lastKeyNum = +lastKey.split('_')[1]
//           return o.id === id ? { ...o, ['result_' + (lastKeyNum + 1)]: '' } : o
//         }),
//       }
//     case 'delete':
//       const deleteOkrOrResult = (name) => {
//         if (name === 'objective') {
//           return state.okrs.filter((o) => o.id !== id)
//         } else {
//           return state.okrs.map((o) => {
//             if (o.id === id) {
//               delete o[name]
//               return o
//             }
//             return o
//           })
//         }
//       }
//       return {
//         ...state,
//         okrs: deleteOkrOrResult(name),
//       }
//     case 'set_okrs':
//       const objOrder = {
//         id: null,
//         objective: null,
//         result_1: null,
//         result_2: null,
//         result_3: null,
//       }
//       const orderedOjects = []
//       for (const obj of action.payload.Items) {
//         const orderedOject = { ...objOrder, ...obj }
//         orderedOjects.push(orderedOject)
//       }
//       return {
//         ...state,
//         okrs: orderedOjects,
//       }
//     default:
//       throw new Error()
//   }
// }

const Okrs = () => {
  // const [state, dispatch] = useReducer(reducer, initialState)
  const [showInput, setShowInput] = useState([null, 0])
  // const { data, isLoading, isError } = useOkrs()
  // console.log(
  //   'isLoading here!',
  //   isLoading,
  //   ' isError here ',
  //   isError,
  //   ' data here',
  //   data
  // )

  const { okrs, text, dispatch } = useOkrsReducer()
  console.log('okrs ', okrs, ' and text ', text)

  // TODO: set up refs to focus respective inputs onclick as described below
  // https://stackoverflow.com/questions/52448143/how-to-deal-with-a-ref-within-a-loop
  // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs

  const baseUrl: string =
    'https://e4f13pkfgb.execute-api.us-east-1.amazonaws.com/items'

  // useEffect(() => {
  //   console.log('useEffect running here')
  //   const getOkrs = async () => {
  //     try {
  //       const res = await axios.get(baseUrl)
  //       dispatch({ type: 'set_okrs', payload: res.data })
  //     } catch (err) {
  //       console.log('error msg here >>> ', err)
  //     }
  //   }
  //   getOkrs()
  // }, [])

  // HANDLERS

  const handleKeyPress = (e: { key: string }, id: string) => {
    if (e.key === 'Enter') setShowInput([null, 0])
    if (id && e.key === 'Enter') {
      putReq(id)
    }
    // TODO: Write something here so that it opens the next result...
  }

  // interface OkrOrOkrField {
  //   name: string,
  //   id: string
  // }
  // You could use this below as well instead of the inline object
  // like: const handleDelete = (data: OkrOrOkrField) => {

  const handleDelete = (data: { name: string; id: string }) => {
    console.log('object from data here! >>>>> ', data)
    if (data.name === 'objective') {
      deleteReq(data.id)
    }
    dispatch({
      type: 'delete',
      payload: { id: data.id, name: data.name },
    })
  }

  // API REQUESTS

  const putReq = (id: string) => {
    const data = () => {
      if (id) {
        console.log('this runs from inside if (id)')
        return /*state.*/ okrs.filter((o) => o.id === id)[0]
      } else {
        console.log('this runs from inside else')

        // return state.okrs[state.okrs.length - 1]
        const objective = {
          id: new Date().valueOf().toString(), // easy temp id
          objective: /*state.*/ text,
          result_1: '',
          result_2: '',
          result_3: '',
        }
        dispatch({ type: 'add', payload: objective })
        return objective
      }
    }

    try {
      const res = axios.put(baseUrl, data())
    } catch (err) {
      console.log('error msg >>> ', err)
    }
  }

  const deleteReq = (id: string) => {
    console.log('deleteReq running here')
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
          value={/*state.*/ text}
          placeholder={'Write your objective...'}
        />
        <BaseButton
          onClick={() => {
            putReq(null)
          }}
          text={'Create Objective'}
        />
      </div>
      {/*!state.*/ !okrs.length && <div>no okrs yet!</div>}
      {
        /*state.*/ okrs.map((okr, i) => (
          <Okr
            key={okr.id}
            okr={okr}
            onChange={dispatch}
            putReq={putReq}
            i={i}
            handleDelete={handleDelete}
            addResult={() =>
              // perhaps it's cleaner to put the dispatch in a handler...?
              dispatch({
                type: 'add_result',
                payload: { id: okr.id },
              })
            }
          />
        ))
      }
      {/* {<pre>{JSON.stringify(state, null, 2)}</pre>} */}
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
