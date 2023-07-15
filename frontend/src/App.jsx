import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { createTheme, ThemeProvider, Box, CssBaseline } from '@mui/material'
import Problemset from "./components/Problemset"
import Problem from "./components/Problem"
import Add from "./components/Add"
import PrivateRoute from './PrivateRoute'
import './App.css'
import { green } from "@mui/material/colors"
import { MathJaxContext } from "better-react-mathjax"
import { signInWithGoogle, auth } from "./firebase"
import { AuthProvider } from "./contexts/AuthContext"
import Login from "./components/Login"
import Logout from "./components/Logout"
import Home from "./components/Home"
import Download from "./components/Download"
import ExportImport from "./components/ExportImport"


const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [["$", "$"]],
    displayMath: [["\\(", "\\)"]]
  },
  "HTML-CSS": {
    linebreaks: { automatic: true, width: "container" }
  }
}
function App() {
  const [mode, setMode] = useState('dark')
  const darkTheme = createTheme({
    palette: {
      mode: mode,
      primary: {
        // light: will be calculated from palette.primary.main,
        main: '#ff0000',
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
    },
    typography: {
      fontFamily: 'Inconsolata'
    }
  })

  return (
    <MathJaxContext config={config}>
      <ThemeProvider theme={darkTheme}>
        <AuthProvider>
          <CssBaseline />
          <Box bgcolor={'background.default'} color={'text.primary'}>
            <Router>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/Login" component={Login} />
                <Route exact path="/logout" component={Logout} />
                <PrivateRoute exact path="/problemset" component={Problemset} />
                <PrivateRoute exact path="/export-import" component={ExportImport} />
                <PrivateRoute exact path="/problem/:id" component={Problem} />
                <PrivateRoute exact path="/problem" component={Problem} />
                <PrivateRoute exact path="/add" component={Add} />
                <PrivateRoute exact path="/home" component={Home} />
                <PrivateRoute exact path="/download-client" component={Download} />
              </Switch>
            </Router>
          </Box>
        </AuthProvider>
      </ThemeProvider>
    </MathJaxContext>
  )
}
export default App
