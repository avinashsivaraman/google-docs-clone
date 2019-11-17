// Import React!
import React, { useState } from 'react'
import SyncingEditor from './SyncingEditor'
import './App.css'

const App = () => {
  const [userName, setUserName] = useState<string >('')
  const onUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setUserName(event.target.value)
  return (
    <div>
      <div className='header'>
        <h1> Google Docs Clone </h1>
        <div>
          <label htmlFor="username">Enter your username </label>
          <input id='username'type='text' value={userName} onChange={onUserNameChange}></input>
        </div>
      </div>
      <SyncingEditor name={userName}/>
      {/* <SyncingEditor /> */}
    </div>
  )
}

export default App
