import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Close from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';

export default function VideoDialog(props) {
    const video_tutorial = useSelector(state => state.pdexam)
    console.log(video_tutorial)
    console.log(video_tutorial)
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
                <iframe 
                    width={`${window.innerWidth - 20}px`}
                     style={{ maxWidth: '100%' }} 
                     height="400" src={video_tutorial.tutorial} 
                     frameBorder="0" 
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                     allowFullScreen></iframe>
            </DialogContent>
        </Dialog>
    );
}
