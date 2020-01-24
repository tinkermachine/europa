import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Output from "../Content/Outputs"
import Input from "../Content/Inputs";
import {Switch, Route} from 'react-router-dom'
import SideBar from "../Content/SideBar";
import IOSelection from "../Content/IOSelection";
import Spreadsheet from "../Outputs/Spreadsheet";


export default function Content(props) {


    // Defining Hooks
    const useStyles = makeStyles(theme => ({
        root: {
            display: 'flex',
            width: '100%',
            background: '#FEFEFD'
        },
        content: {
            display: 'flex',
            width: '100%'
        },
        menuBar: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '6px',
        },
    }))
    const classes = useStyles()
    let contentEl

    if (props.mode === 'existing') {
        contentEl = (
            <div className={classes.content}>
                <SideBar className={classes.sidebar} outputs={props.outputs}/>
                <Switch>
                    <Route exact path={"/dashboard"}>
                        <Output
                            type="summary"
                            {...props}
                        />
                        <Input
                            {...props}
                        />
                    </Route>
                    <Route exact path="/distributions">
                        <Output
                            type="distributions"
                            {...props}
                        />
                        <Input
                            {...props}
                        />
                    </Route>
                    <Route exact path="/inputimportance">
                        <Output
                            type="inputimportance"
                            {...props}
                        />
                    </Route>
                    <Route exact path="/sensitivity">
                        <Output
                            type="sensitivity"
                            {...props}
                        />
                        <Input
                            {...props}
                        />
                    </Route>
                    <Route exact path="/scenario">
                        <Output
                            type="scenarioanalysis"
                            {...props}
                        />
                    </Route>
                    <Route exact path="/spreadsheet">
                        <Spreadsheet
                            type="spreadsheet"
                            mode={props.mode}
                            worksheet={props.worksheet}
                        />
                    </Route>
                </Switch>
            </div>
        )
    } else {
        contentEl = (
            <div className={classes.content}>
                <IOSelection
                    outputs={props.outputs}
                    sheetName={props.sheetName}
                    clickedCells={props.clickedCells}
                />
                <Switch>
                    <Route exact path="/spreadsheet">
                        <Spreadsheet
                            type="spreadsheet"
                            mode={props.mode}
                            worksheet={props.worksheet}
                            clickedCells={props.clickedCells}
                            addClickedCell={props.addClickedCell}
                        />
                    </Route>
                </Switch>
            </div>
        )
    }


    return (
        <div className={classes.root}>
            {contentEl}
        </div>
    )
}


