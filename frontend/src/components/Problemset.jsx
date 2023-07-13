import { Button, Card, Divider, Grid, Link } from '@mui/material'
import { Box, Container } from '@mui/material'
import { listAll, ref, getMetadata,getDownloadURL } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { storage, auth } from '../firebase'
import Sidebar from './Sidebar'

import ProblemCard from './ProblemCard'

import CardActionArea from '@mui/material/CardActionArea'
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { getDataFromFile } from '../Utils'

const drawerWidth = 260;
const colors = ['red', 'yellow', 'aqua', '#00ff00']

function Problemset() {
  const [problems, setProblems] = useState([])
  useEffect(() => {
    async function getData() {
      var storageRef = ref(storage, '/problems/')
      listAll(storageRef)
        .then(async (res) => {
          var p = []
          res.prefixes.forEach(async (folderRef) => {
            p.push({ title: folderRef.name });
          });
          setProblems(p)
          res.items.forEach((itemRef) => {
            // All the items under listRef.
          });
        }).catch((error) => {
          // Uh-oh, an error occurred!
        });
    }
    getData()
  }, [])
  function getColor(id) {
    if (localStorage.getItem(id + '_status') !== null) {
      const status = localStorage.getItem(id + '_status')
      if (status === 'ac') return '#00ff00'
      else return 'red'
    }
    return 'white'
  }
  
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ marginTop: '50px', flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <h1>PROBLEMSET</h1>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            {problems.map((problem) =>
              <Grid key={problem.title} item xs={12} md={6} sm={12} lg={4} xl={3}>
                <ProblemCard problem={problem}/>
              </Grid>
            )}
          </Grid>
        </Box>

      </Box>
    </Box >
  )
}

export default Problemset