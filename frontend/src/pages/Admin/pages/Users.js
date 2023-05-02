import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download'
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { API_URL } from "../../../configs/endpoint";
import instance from '../../../auth/jwt/useJwt';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function AlertDialog(props) {
  const { open, setOpen, isDeleting, message} = props

  const handleClose = () => {
    setOpen(false);
  };

  if (message !== "") {
    return (
      <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
            {"Error!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Error deleting report
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
          </Dialog>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      

      {isDeleting ?
        <DialogContent>
          Deleting...
        </DialogContent>
        :
        <>
          <DialogTitle id="alert-dialog-title">
            {"Sure?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You want to delete report and data?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button onClick={() => props.dialogYes()} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </>}
    </Dialog>
  );
}

export default function UsersPage(props) {
  const { data, onDelete } = props
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [message, setMessage] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)


  const onDeleteClick = (delete_id) => {
    setIsDialogOpen(true)
    setDeleteId(delete_id)
  }

  const onConfirm = () => {
    setIsDeleting(true)
    const config = {
      data: { report_id : deleteId },
      headers: {
        'Content-Type': 'application/json'
      }
    };

    instance.delete(`${API_URL}/pdexam`,config).then(res => {
      onDelete(deleteId)
      setMessage(res.data)
      setIsDeleting(false)
      setIsDialogOpen(false)
    }).catch(err => {
      setMessage("Error deleting report")
      setIsDeleting(false)
    })

  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader title="No data found" />
        <CardContent>
          <Typography variant='p' color={'primary'}>
            Your reports will appear here.
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500, overflow: 'auto' }} size="small" aria-label="simple table">
        <TableHead style={{ backgroundColor: "#0bf" }}>
          <TableRow>
            <TableCell style={{ color: "#fff", fontWeight: 'bold' }}>Name</TableCell>
            <TableCell style={{ color: "#fff", fontWeight: 'bold' }}>Email</TableCell>
            <TableCell style={{ color: "#fff", fontWeight: 'bold' }}>Created At</TableCell>
            <TableCell style={{ color: "#fff", fontWeight: 'bold' }}>Reports</TableCell>
          </TableRow>
        </TableHead>
        <TableBody >
          {data.map((row) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.full_name}
              </TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.created_at.slice(5, 22)}</TableCell>
              <TableCell>{row.report_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AlertDialog open={isDialogOpen} setOpen={() => {
        setIsDialogOpen(false)
        setMessage("")
      }} dialogYes={onConfirm} isDeleting={isDeleting} message={message} />
    </TableContainer>
  );
}