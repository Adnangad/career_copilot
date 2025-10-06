import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './Header'
import Jobs from './Jobs'

function App() {
  const [searchValue, setSearch] = useState("")
  return (
    <>
     <Header setSearch={setSearch}></Header>
     <Jobs searchValue={searchValue}></Jobs>
    </>
  )
}

export default App
