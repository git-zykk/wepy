import { createStore, applyMiddleware } from 'redux'
import promiseMiddleware from 'redux-promise'
import { createLogger } from 'redux-logger' //TODO: 这里在打包的时候要删掉，因为现在还没看如何判断生产环境
import rootReducer from './reducers'

const logger = createLogger({ collapsed: true })

export default function configStore () {
  const store = createStore(rootReducer, applyMiddleware(promiseMiddleware, logger))
  // const store = createStore(rootReducer, applyMiddleware(promiseMiddleware))
  return store
}