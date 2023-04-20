import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Close from '@mui/icons-material/Close';

export default function VideoDialog(props) {
    const { open } = props
    const handleClose = () => {
        props.setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="md"
        >
            <DialogTitle id="alert-dialog-title" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Close onClick={handleClose} style={{ cursor: 'pointer' }} />
            </DialogTitle>
            <DialogContent>
            <iframe width={`${window.innerWidth - 20}px`} style={{ maxWidth: '100%' }} height="400" src="https://www.youtube.com/embed/a9__D53WsUs" title="What is AWS? | Amazon Web Services" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </DialogContent>
        </Dialog>
    );
}
