import { useEffect, useReducer } from 'react'
import axios from 'axios'

/*
  TODO: 
    -add loading and error states
    -roll back optimistic updates when an error occurs
    -think about refetching after certain actions, how and why...

*/

const initialState = {
  text: '',
  okrs: [],
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
      console.log(action.payload)
      return {
        ...state,
        text: '',
        okrs: [...state.okrs, action.payload],
      }
    case 'edit':
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
    case 'set_okrs':
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
    default:
      throw new Error()
  }
}

const useOkrsReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const baseUrl = 'https://e4f13pkfgb.execute-api.us-east-1.amazonaws.com/items'

  useEffect(() => {
    console.log('useEffect running here')
    const getOkrs = async () => {
      try {
        const res = await axios.get(baseUrl)
        dispatch({ type: 'set_okrs', payload: res.data })
      } catch (err) {
        console.log('error msg here >>> ', err)
      }
    }
    getOkrs()
  }, []) // you could trigger a re-fetch after certain actions given that you are optimisically
  // updating the state and only triggering a fetch on refresh - but it's not necessary either
  return { okrs: state.okrs, text: state.text, dispatch }
}

export default useOkrsReducer
