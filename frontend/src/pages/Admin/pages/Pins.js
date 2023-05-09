import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DownloadIcon from '@mui/icons-material/Download'
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { API_URL } from "../../../configs/endpoint";
import instance from '../../../auth/jwt/useJwt';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
function AlertDialog(props) {
    const { open, setOpen, isDeleting, message } = props

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


function CreatePinDialog(props) {
    const { open, setOpen, getdata } = props
    const [isCreating, setIsCreating] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [personName, setPersonName] = useState("")
    const handleClose = () => {
        setOpen(false);
    };

    const onCreteClick = () => {
        setIsCreating(true)
        instance.post("/pin", {
            name: personName
        }).then(res => {
            setIsCreating(false)
            getdata()
        }).catch(err => {
            setErrorMessage("Error creating API")
            setIsCreating(false)
        })
    }

    if (errorMessage !== "") {
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
                        Error creating a new pin
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


            {isCreating ?
                <DialogContent>
                    Creating...
                </DialogContent>
                :
                <>
                    <DialogTitle id="alert-dialog-title">
                        {"Add a name for person"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Write a person name that you want to create pin for.
                            <div>
                                <input
                                    type='text'
                                    placeholder='Person Name (Optional)'
                                    onChange={(e) => setPersonName(e.target.value)}
                                    value={personName}
                                    style={{
                                        boxSizing: 'border-box',
                                        padding: '8px 10px', width: '100%',
                                        marginTop: '10px'
                                    }}
                                />
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Close</Button>
                        <Button variant='outlined' onClick={() => onCreteClick()} autoFocus>
                            Create
                        </Button>
                    </DialogActions>
                </>}
        </Dialog>
    );
}

export default function Pins(props) {
    const { data, onDelete, getdata } = props
    //const [data, setData] = useState([])
    const [deleteId, setDeleteId] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [message, setMessage] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [addDialog, setAddDialog] = useState(false)



    const onDeleteClick = (delete_id) => {
        setIsDialogOpen(true)
        setDeleteId(delete_id)
    }


    const onConfirm = () => {
        setIsDeleting(true)
        const config = {
            data: { report_id: deleteId },
            headers: {
                'Content-Type': 'application/json'
            }
        };

        instance.delete(`${API_URL}/pdexam`, config).then(res => {
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
        <Card>
            <CardHeader
                title={`Pins (${data?.length})`}
                subheader='Pin for guest users'
                action={
                    <IconButton aria-label="settings" onClick={() => setAddDialog(true)}>
                        <ControlPointIcon color='secondary' />
                    </IconButton>
                }
            />
            <CardContent>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} size='small' aria-label="simple table">
                        <TableHead style={{ backgroundColor: "#0bf" }}>
                            <TableRow>
                                <TableCell style={{ color: "#fff", fontWeight: 'bold' }}>
                                    Code/Pin
                                </TableCell>
                                <TableCell style={{ color: "#fff", fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell style={{ color: "#fff", fontWeight: 'bold' }}>Creation Time</TableCell>
                                <TableCell style={{ color: "#fff", fontWeight: 'bold' }}>Usage</TableCell>
                            </TableRow>
                        </TableHead>
                        {data.length !== 0 ?
                            <TableBody>
                                {data.map((row) => (
                                    <TableRow
                                        key={row._id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.pin_id}
                                        </TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.created_at.slice(5, 22)}</TableCell>
                                        <TableCell>{row.count > 0 ? 'Yes' : 'No'}</TableCell>
                                        {/* <TableCell>
                                        <IconButton style={{ marginTop: '2px' }} href={row.url} download target="_blank">
                                            <DownloadIcon /></IconButton>
                                        <IconButton onClick={() => onDeleteClick(row._id)}><DeleteIcon style={{ color: 'red' }} /></IconButton>
                                    </TableCell> */}
                                    </TableRow>
                                ))}
                            </TableBody>
                            :
                            <Typography variant='p' color={'primary'}>
                                Your reports will appear here.
                            </Typography>
                        }
                    </Table>
                    <AlertDialog open={isDialogOpen} setOpen={() => {
                        setIsDialogOpen(false)
                        setMessage("")
                    }} dialogYes={onConfirm} isDeleting={isDeleting} message={message} />

                    <CreatePinDialog getdata={getdata} open={addDialog} setOpen={() => {
                        setAddDialog(false)
                    }} />
                </TableContainer>
            </CardContent>
        </Card>
    );
}