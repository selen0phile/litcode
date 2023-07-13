import Editor, { useMonaco } from '@monaco-editor/react'
import { ListItemButton } from '@mui/joy'
import { Box, Button, CircularProgress, Divider, Drawer, Grid, IconButton, LinearProgress, Menu } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu';
import { Cancel, CheckCircle } from '@mui/icons-material'
import { storage } from '../firebase'
import { getDownloadURL, ref } from 'firebase/storage'
import { MathJax } from 'better-react-mathjax'
import Sidebar from './Sidebar'
import { useMediaQuery } from 'react-responsive';
import ReactMarkdown from 'react-markdown'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';

import { getDataFromFile, setLocal, getLocal } from '../Utils'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Toast from './Toast'


const options = {
    readOnly: false,
    minimap: { enabled: false },
}

const languages = ['c++', 'java']

function Problem() {
    const isMobile = useMediaQuery({ query: '(max-width: 800px)' })

    const { id } = useParams()
    const [open, setOpen] = useState(false)
    const [lang, setLang] = useState(0)
    const [status, setStatus] = useState('')
    const [testOutput, setTestOutput] = useState('')
    const [correctOutput, setCorrectOutput] = useState('')
    const [status_sample, setSStatus] = useState('')
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState(false)
    const [TC, setTC] = useState(false)
    const [runningTestId, setRunningTestId] = useState(null);
    const [data, setData] = useState({
        statements: 'Input starts with a positive integer $T$, denoting the number of testcases. Then next T lines contain a positive integer N. For each test case, find the square of N.',
        constraints: 'loading ...',
        test_in: [],
        test_out: [],
        statement: 'loading ...',
        constraint: '$T\\leq10 , N \\le 10000$',
        sample_out: ['loading ...'],
        sample_in: ['loading ...'],
    })
    const template = '#include<stdio.h>\n\nint main() {\n\n\treturn 0;\n}'
    const monaco = useMonaco()

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }
    useEffect(() => {
        async function init() {
            var d = {}
            d['statement'] = await getDataFromFile(id, 'statement.txt')
            d['constraints'] = await getDataFromFile(id, 'constraints.txt')
            d['sample_in'] = []
            d['sample_out'] = []
            d['test_in'] = []
            d['test_out'] = []

            for (var i = 1; i <= 10; i++) {
                try {
                    const si = await getDataFromFile(id, 'si_' + i + '.txt')
                    const so = await getDataFromFile(id, 'so_' + i + '.txt')
                    d['sample_in'].push(si);
                    d['sample_out'].push(so);
                }
                catch (err) {
                    break
                }
            }

            for (var i = 1; i <= 10; i++) {
                try {
                    const ti = await getDataFromFile(id, 'in_' + i + '.txt')
                    const to = await getDataFromFile(id, 'out_' + i + '.txt')
                    d['test_in'].push(ti);
                    d['test_out'].push(to);
                }
                catch (err) {
                    break
                }
            }

            setData({ ...data, ...d })
            if (monaco) {
                if (getLocal(id + '_code') !== null) {
                    monaco.editor.getModels()[0].setValue(getLocal(id + '_code'))
                }
                else {
                    monaco.editor.getModels()[0].setValue(template)
                }
            }
        }
        init()
        if (getLocal(id + '_status') !== null) {
            setStatus(getLocal(id + '_status'))
        }
    }, [])
    // useEffect(() => {
    //     if (monaco) {
    //         if (getLocal(id + '_code') !== null) {
    //             monaco.editor.getModels()[0].setValue(getLocal(id + '_code'))
    //         }
    //         else {
    //             monaco.editor.getModels()[0].setValue(template)
    //         }
    //     }
    // }, [monaco])

    function codeChanged(v, e) {
        setLocal(id + '_code', v)
    }
    async function compileAndRun() {
        setLoading(true)
        const url = "http://localhost:3000/cr";
        const options = {
            method: "POST",
            body: JSON.stringify({
                code: monaco.editor.getModels()[0].getValue(),
                input: monaco.editor.getModels()[1].getValue(),
                language: languages[lang]
            })
        };
        const resp = await fetch(url, options)
        const content = await resp.text()
        monaco.editor.getModels()[2].setValue(content)
        setLoading(false)
    }
    function toggleOpen() {
        if (open) setOpen(false)
        else setOpen(true)
    }
    function matchOutput(real, out, tc, inp) {
        var out_lines = out.split('\n');
        var real_lines = real.split('\n')
        while (out_lines.length > 0) {
            if (out_lines[out_lines.length - 1].trim() === '') out_lines.pop();
            else break;
        }
        while (real_lines.length > 0) {
            if (real_lines[real_lines.length - 1].trim() === '') real_lines.pop();
            else break;
        }
        var a = '', b = '';
        for (var i = 0; i < out_lines.length; i++) {
            a += out_lines[i].trim() + '\n';
        }
        for (var i = 0; i < real_lines.length; i++) {
            b += real_lines[i].trim() + '\n';
        }
        if (out_lines.length !== real_lines.length) {
            setInput(inp + '\n' + '(Number of lines does not match)');
            setTC(tc);
            window.location.hash='#diff';

            setTestOutput(a)
            setCorrectOutput(b)
            return -1;
        }
        for (var i = 0; i < out_lines.length; i++) {
            if (out_lines[i].trim().localeCompare(real_lines[i].trim())!==0) {
                setTestOutput(a)
                setCorrectOutput(b)
                window.location.hash='#diff';

                setInput(inp);
                setTC(tc);

                return i;
            }
        }
        setInput('');
        setTC('');
        setTestOutput('')
        setCorrectOutput('')
        return 2005023;
    }
    async function run() {
        setLoading(true)
        const url = "http://localhost:3000/r";
        const options = {
            method: "POST",
            body: JSON.stringify({
                input: monaco.editor.getModels()[1].getValue(),
                code: monaco.editor.getModels()[0].getValue(),
                language: languages[lang]
            })
        };
        const resp = await fetch(url, options)
        const content = await resp.text()
        monaco.editor.getModels()[2].setValue(content)
        setLoading(false)
    }
    async function compile() {
        setLoading(true)
        const url = "http://localhost:3000/c";
        const options = {
            method: "POST",
            body: JSON.stringify({
                code: monaco.editor.getModels()[0].getValue(),
                language: languages[lang]
            })
        };
        const resp = await fetch(url, options)
        const content = await resp.text()
        monaco.editor.getModels()[2].setValue(content)
        setLoading(false)
    }
    async function runOnSamples() {
        setSStatus('loading')
        setLoading(true)
        for (var i = 0; i < data['sample_in'].length; i++) {
            setRunningTestId(i+1);
            try {
                const url = "http://localhost:3000/r";
                const options = {
                    method: "POST",
                    body: JSON.stringify({
                        input: data['sample_in'][i],
                        code: monaco.editor.getModels()[0].getValue(),
                        language: languages[lang]
                    })
                };
                const resp = await fetch(url, options)
                const content = await resp.text()
                const real = data['sample_out'][i];
                const result = matchOutput(real, content,i+1,data['test_in'][i])
                if (result == 2005023) continue;
                setSStatus('wa')
                setLoading(false)
                return;
            }
            catch (err) {
                alert('Error! ' + err)
                console.log(err);
                setLoading(false)
                setSStatus('')
                setInput('');
                setTC('');
                return;
            }
        }
        setRunningTestId(null);
        setSStatus('ac')
        setLoading(false)
    }
    async function submit() {
        setStatus('loading')
        setLoading(true)
        for (var i = 0; i < data['test_in'].length; i++) {
            setRunningTestId(i+1);
            try {
                const url = "http://localhost:3000/r";
                const options = {
                    method: "POST",
                    body: JSON.stringify({
                        input: data['test_in'][i],
                        code: monaco.editor.getModels()[0].getValue(),
                        language: languages[lang]
                    })
                };
                const resp = await fetch(url, options)
                const content = await resp.text()
                const real = data['test_out'][i]
                const result = matchOutput(real, content,i+1,data['test_in'][i])
                if (result == 2005023) continue;
                setStatus('wa')
                setLocal(id + '_status', 'wa')
                setLoading(false)
                return;
            }
            catch (err) {
                alert('Error!')
                setLoading(false)
                setStatus('')
                setInput('');
                setTC('');
                return;
            }
        }
        setRunningTestId(null);
        setStatus('ac')
        setLocal(id + '_status', 'ac')
        setLoading(false)
    }

    const history = useHistory()
    return (
        <Box sx={{ display: isMobile ? 'block' : 'flex' }}>
            <Sidebar />
            {/* <Drawer
                sx={{
                    width: '25vw',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: '25vw',
                        boxSizing: 'border-box',
                    },
                }}
                anchor="left"
                open={open}
                onClose={toggleOpen}
            >
                <Button>PROBLEMSET</Button>
            </Drawer> */}
            <Toast message='Samples Passed' when='ac' status={status_sample} type='success'/>
            <Toast message='Samples Failed' when='wa' status={status_sample} type='error'/>

            <Toast message='Accepted' when='ac' status={status} type='success'/>
            <Toast message='Wrong Answer' when='wa' status={status} type='error'/>
            <Container sx={{ width: '50vw', height: '100vh', overflowY: 'scroll' }}>
                {/*<IconButton onClick={toggleOpen} sx={{ margin: '10px', marginLeft: 0, padding: 0 }} >
                    <MenuIcon />
                </IconButton>*/}
                <Button onClick={() => {
                    history.push('/problemset')
                }} sx={{ margin: '10px', marginLeft: 0 }} >
                    BACK TO PROBLEMSET
                </Button>
                <br />
                <Box sx={{ border: '1px solid rgba(255,255,255,0.1)', '&:hover': { border: '1px solid rgba(255,255,255,0.4)' } }}>
                    <Box sx={{ display: 'flex', fontWeight: 'bold', margin: '5px', fontSize: '1.5em', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ color: 'red' }}>
                            {id}
                        </Box>
                        {status === 'ac' ?
                            <Box sx={{ color: '#00ff00' }}>
                                <CheckCircle />
                            </Box> : <></>
                        }
                        {status === 'loading' ?
                            <Box sx={{ color: '#00ff00' }}>
                                <CircularProgress size="1.5rem" />
                            </Box> : <></>
                        }
                        {(status === 'wa' || status === 'mle' || status === 'tle' || status === 'rte') ?
                            <Box sx={{ color: 'red' }}>
                                <Cancel />
                            </Box> : <></>
                        }
                    </Box>
                    <Divider />
                    <Box sx={{ margin: '5px' }}>
                        TL: 1s, ML: 128MB
                    </Box>
                </Box>
                <br />
                <Box sx={{ border: '1px solid rgba(255,255,255,0.1)', '&:hover': { border: '1px solid rgba(255,255,255,0.4)' } }}>
                    <Box sx={{ fontSize: 'larger', fontWeight: 'bold', margin: '5px', color: 'red' }}>
                        STATEMENT
                    </Box>
                    <Divider />
                    <Box sx={{ margin: '5px' }}>

                        <MathJax dynamic hideUntilTypeset={'every'}>
                            {
                                data.statement.split('\n').map(line => <div><ReactMarkdown>{line}</ReactMarkdown></div>)
                            }</MathJax>

                    </Box>
                </Box>
                <br />
                <Box sx={{ border: '1px solid rgba(255,255,255,0.1)', '&:hover': { border: '1px solid rgba(255,255,255,0.4)' } }}>
                    <Box sx={{ fontSize: 'larger', fontWeight: 'bold', margin: '5px', color: 'red' }}>
                        CONSTRAINTS
                    </Box>
                    <Divider />
                    <Box sx={{ margin: '5px' }}>
                        <pre><MathJax dynamic hideUntilTypeset={'every'}>{data.constraints}</MathJax></pre>
                    </Box>
                </Box>
                <br />
                <Box sx={{ border: '1px solid rgba(255,255,255,0.1)', '&:hover': { border: '1px solid rgba(255,255,255,0.4)' } }}>
                    <Box sx={{ fontSize: 'larger', fontWeight: 'bold', margin: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ color: 'red' }}>
                            SAMPLE TESTCASE
                        </Box>
                        {status_sample === 'ac' ?
                            <Box sx={{ color: '#00ff00' }}>
                                <CheckCircle />
                            </Box> : <></>
                        }
                        {status_sample === 'loading' ?
                            <Box sx={{ color: '#00ff00' }}>
                                <CircularProgress size="1.5rem" />
                            </Box> : <></>
                        }
                        {(status_sample === 'wa' || status_sample === 'mle' || status_sample === 'tle' || status_sample === 'rte') ?
                            <Box sx={{ color: 'red' }}>
                                <Cancel />
                            </Box> : <></>
                        }
                    </Box>
                    <Box sx={{ display: 'flex', margin: '5px' }}>
                        <Box sx={{ width: '25vw' }}>
                            INPUT
                        </Box>
                        <Box sx={{ width: '25vw' }}>
                            OUTPUT
                        </Box>
                    </Box>
                    <Divider />
                    {
                        data.sample_in.map((txt, id) =>
                            <Box sx={{ margin: '5px' }}>
                                <Box sx={{ display: 'flex' }}>
                                    <Box sx={{ width: '25vw' }}>
                                        <pre>
                                            {data.sample_in[id]}
                                        </pre>
                                    </Box>
                                    <Box sx={{ width: '25vw' }}>
                                        <pre>
                                            {data.sample_out[id]}
                                        </pre>
                                    </Box>
                                </Box>
                            </Box>
                        )
                    }
                </Box>
                <br />
                <Box sx={{ border: '1px solid rgba(255,255,255,0.1)', '&:hover': { border: '1px solid rgba(255,255,255,0.4)' } }}>
                    <Box id='diff' sx={{ fontSize: 'larger', fontWeight: 'bold', margin: '5px', color: 'red' }}>
                        OUTPUT DIFFERENCE
                    </Box>
                    <Box sx={{ margin: '5px' }}>
                        Test Case: {TC} <br/>
                        Input: <br/>
                        <pre>{input}</pre>
                        <br/>
                    </Box>
                    <Box sx={{ margin: '5px' }}>
                        <ReactDiffViewer oldValue={testOutput} newValue={correctOutput} splitView={true} useDarkTheme={true}
                            compareMethod={DiffMethod.LINES} />
                    </Box>
                </Box>
                <br /><br /><br /><br /><br /><br /><br /><br />
            </Container>
            <Box sx={{ width: isMobile ? '100vw' : '50vw' }}>
                <Box sx={{ width: '50vw', height: '50vh' }}>
                    <Editor width='50vw' theme='vs-dark' onChange={codeChanged}
                        defaultValue={getLocal(id + '_code') === null ? template : getLocal(id + '_code')} height='50vh' defaultLanguage='cpp' options={options} />
                </Box>
                <Box>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button onClick={compile}>COMPILE</Button>
                            <Button onClick={run}>RUN</Button>
                            <Button onClick={compileAndRun}>COMPILE AND RUN</Button>
                            <Button onClick={runOnSamples}>RUN ON SAMPLES</Button>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <Select value={lang} onChange={(e) => setLang(e.target.value)}>
                                    <MenuItem value={0}>c++</MenuItem>
                                    <MenuItem value={1}>java</MenuItem>
                                </Select>
                            </FormControl>
                            {
                                runningTestId !== null &&  <div>Running on test {runningTestId} </div>
                            }
                            <Button onClick={submit} sx={{ marginLeft: 'auto' }}>SUBMIT</Button>
                        </Box>
                        <Box sx={{ height: '2vh' }}>
                            {loading ? <LinearProgress /> : <></>}
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            <Box sx={{ width: '25vw' }}>
                                <Editor width='25vw' theme='vs-dark' height='43vh' defaultLanguage='cpp' options={options} />
                            </Box>
                            <Box sx={{ width: '25vw' }}>
                                <Editor theme='vs-dark' width='25vw' height='43vh' defaultLanguage='cpp' options={options} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

        </Box>
    )
}

export default Problem