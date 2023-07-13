import { Button, Card, Divider, Grid, Link } from '@mui/material'
import { Box, Container } from '@mui/material'
import { listAll, ref, getMetadata,getDownloadURL } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { storage, auth } from '../firebase'
import Sidebar from './Sidebar'

import CardActionArea from '@mui/material/CardActionArea'
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import TaskIcon from '@mui/icons-material/Task';

import { getDataFromFile } from '../Utils'
import '../App.css';

function ProblemCard({ problem }) {
    
    const history = useHistory()
    function openProblem(id) {
        history.push(`/problem/${id}`);
    }
    const [tags, setTags] = useState('loading ...');
    const [added, setAdded] = useState('loading ...');
    const [deadline, setDeadline] = useState('loading ...');
    const [link, setLink] = useState('loading ...');
    const [time, setTime] = useState(100);
    const [solved, setSolved] = useState(false);
    // useEffect(()=>{
        
    // },[]);
    useEffect(() => {
        async function init() {
            const details = JSON.parse(await getDataFromFile(problem.title, 'meta.json'));
            setTags(details.tags);
            setAdded(new Date(details.added).toLocaleString());
            setLink(details.link);
            setTime(Math.max(0, Math.floor((new Date(details.deadline) - Date.now())/1000.0)));
            setDeadline(new Date(details.deadline).toLocaleString());    
        }
        if(localStorage.getItem(problem.title + '_status') === 'ac') {
            setSolved(true)
        }
        init();
        const tmr = setInterval(()=>setTime(time=>time-1),1000);
        return () => clearInterval(tmr);
    }, []);
    

    function getTime() {
        if(time <= 0) return '00:00:00';
        try {
            var hours = Math.floor(time / 3600);
            var minutes = Math.floor((time % 3600) / 60);
            var remainingSeconds = time % 60;
        
            var formattedTime = hours.toString().padStart(2, '0') + ':' +
                                minutes.toString().padStart(2, '0') + ':' +
                                remainingSeconds.toString().padStart(2, '0');
        
            return formattedTime;
        }
        catch(er){}
        return 'loading ...';
    }
    return (
        <Card sx={{ minWidth: 275, height: 300 }}>
            <CardActionArea className={solved?'gradient':''} onClick={() => openProblem(problem.title)} sx={{ height: '80%' }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        TIME REMAINING: {getTime()}
                    </Typography>
                    <Typography variant="h5" component="div">
                        {problem.title}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Added: {added} <br />
                        Deadline: {deadline}
                    </Typography>
                    <Typography variant="body2">
                        {
                            tags.split(',').map((tag,id) =>
                                <span key={id}><Chip label={tag} />&nbsp;</span>
                            )
                        }
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions sx={{ height: '20%', display:'flex'}}>
                <Link href={link} target='_blank'><Button size="small"><TaskIcon/>&nbsp;SUBMISSION URL</Button></Link>
                &nbsp;&nbsp;<Button size="small"><CloudDownloadIcon/>&nbsp;DOWNLOAD </Button>
            </CardActions>
        </Card>
    )
}

export default ProblemCard