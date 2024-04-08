import * as React from 'react';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

export default function WinAlert({alert, setAlert}) {
    return (
        <Collapse in={alert !== ""}>
            <Alert
            icon={<CheckIcon fontSize="inherit" />}
            severity="success"
            action={
                <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                    setAlert(false);
                }}
                >
                <CloseIcon fontSize="inherit" />
                </IconButton>
            }
            sx={{ mb: 2 }}
            >
            {alert}
            </Alert>
        </Collapse>
    );
}