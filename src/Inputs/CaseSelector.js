import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
    formControl: {
        // margin: theme.spacing(1),
        // backgroundColor: 'yellow',
        minWidth: 150
    },
    caseSelect: {
        marginTop: '1px',
        fontFamily: 'Questrial',
        fontSize: '0.8em',
        background: '#F1F2EF',
        padding: '2px',
    },
    caseItem: {
        fontFamily: 'Questrial',
        fontSize: '0.9em',
        background: '#FEFEFD'
    }

}));

export default function CaseSelector(props) {
    const classes = useStyles();
    const [inputCase, setInputCase] = React.useState('');


    return (
        <div>
            <FormControl
                className={classes.formControl}
                disableScrollLock={true}
                // size="small"
                // margin="dense"
                // variant="standard"
                // fullWidth={true}
            >
                <Select
                    classes={{selectMenu: classes.caseSelect}}
                    value={inputCase}
                    onChange={props.handleCaseChange}
                    displayEmpty
                    disableUnderline
                    MenuProps={{
                        disableScrollLock: true
                    }}

                >
                    <MenuItem classes={{root: classes.caseItem}} value="">Default</MenuItem>
                    <MenuItem classes={{root: classes.caseItem}} value={"Low"}>Low</MenuItem>
                    <MenuItem classes={{root: classes.caseItem}} value={"Base"}>Base</MenuItem>
                    <MenuItem classes={{root: classes.caseItem}} value={"High"}>High</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}
