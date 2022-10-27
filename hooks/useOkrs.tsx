import { useEffect, useReducer } from 'react'
import axios from 'axios'

const reducer = (state, action) => {
  switch (action.type) {
    case 'fetch_success':
      const { Items } = action.payload
      return {
        ...state,
        isLoading: false,
        data: Items,
      }
    case 'fetch_init':
      return {
        ...state,
        isLoading: true,
      }
    case 'fetch_failure':
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    default:
      throw new Error()
  }
}

const useOkrs = () => {
  const [state, dispatch] = useReducer(reducer, {
    data: [],
    isLoading: false,
    isError: false,
  })

  const baseUrl = 'https://e4f13pkfgb.execute-api.us-east-1.amazonaws.com/items'

  useEffect(() => {
    const getOkrs = async () => {
      try {
        dispatch({ type: 'fetch_init' })
        const res = await axios.get(baseUrl)
        dispatch({ type: 'fetch_success', payload: res.data })
      } catch (err) {
        dispatch({ type: 'fetch_failure' })
        console.log('error msg here >>> ', err)
      }
    }
    getOkrs()
  }, [])

  return state
}

export default useOkrs
