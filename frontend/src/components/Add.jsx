import React, { useEffect, useState } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db } from '../firebase'
import { query, doc, getDoc, addDoc, collection, setDoc } from 'firebase/firestore'
import { useParams } from 'react-router'
import { Button, LinearProgress } from '@mui/material';
import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';
import { useAuth } from '../contexts/AuthContext';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import Sidebar from './Sidebar';

const drawerWidth = 260
function Add() {
  const [data, setData] = useState({ 'title': '' })
  const [file, setFile] = useState()
  const [percent, setPercent] = useState(0)
  const [fileNo, setFileNo] = useState(1)
  const [uploading, setUploading] = useState(false)

  const { id } = useParams()
  const { currentUser } = useAuth()

  useEffect(() => {
    if (id === undefined) return;

  }, [id])

  function handleFileChange(e) {
    setFile(e.target.files)
    for (var i = 0; i < e.target.files.length; i++) {
      console.log(e.target.files[i].name)
    }
  }
  function handleDateChange(e) {
    setDate(e)
    alert(new Date(e).getTime())
    setExamData({
      ...examData,
      start: new Date(e).getTime() / 1000,
    })
  }
  function handleChange(e) {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }
  function process(x) {
    return x.toLowerCase().replaceAll(' ', '-')
  }
  function getCode() {
    return data.title;
  }
  function handleUpload() {
    if (!file) {
      alert('No file selected!')
      return
    }
    setUploading(true);
    for (var i = 0; i < file.length; i++) {
      setFileNo(i + 1)
      const storageRef = ref(storage, '/problems/' + getCode() + '/' + file[i].name);
      const uploadTask = uploadBytesResumable(storageRef, file[i])
      uploadTask.on(
        "state_changed",
        (snap) => {
          const percent = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
          setPercent(percent)
        },
        (err) => console.log(err),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(url => {
            console.log(url)
          })
        }
      )
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ marginTop: '50px', flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <div style={{ fontSize: '14px' }}>
          <center>
            <h1>ADD PROBLEM</h1>

            <TextField placeholder="title" onChange={handleChange} name="title" value={data.title} />

            {uploading &&
              <div style={{ marginTop: '30px' }}>
                Uploading file {fileNo} <br /><br />
                <LinearProgress sx={{ width: '50vw' }} variant="determinate" value={percent} />
              </div>
            }
            <br />
            <br />
            <input type="file" onChange={handleFileChange} multiple='multiple' /><br />
            <br />
            <Button size="large" variant='contained' onClick={handleUpload}>UPLOAD</Button>
          </center>
        </div>
      </Box>
    </Box >
  )
}

export default Add