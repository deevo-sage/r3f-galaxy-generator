import * as React from "react"
import { render } from "react-dom"
import App from "./App"
import "./main.scss"
const Index = () => {
    return <React.StrictMode>
        <App />
    </React.StrictMode>
}

render(<Index />, document.getElementById('root'))