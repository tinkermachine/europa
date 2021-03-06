import React, {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {myRound} from "../utils/utils";
import Spreadsheet from "../Features/Spreadsheet";
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton"
import RemoveCircleSharpIcon from '@material-ui/icons/RemoveCircleSharp';
import Button from "@material-ui/core/Button";
import {hasDuplicates, omitKeys} from "../utils/utils";
import {NavLink} from "react-router-dom";

export default function OutputSelector(props) {


    const useStyles = makeStyles(theme => ({
        root: {
            display: 'flex',
            position: 'fixed',
            height: '93vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: '#FEFEFD',
            width: '20.0%',
            overflowY: 'auto',
            padding: '10px'
        },
        instruction: {
            fontSize: '0.85em',
            fontWeight: '100',
            paddingLeft: '5px',
            fontFamily: 'Questrial',
            color: '#292F36',
            padding: '3px',
            margin: '0px',
            width: '100%',
            textAlign: 'center'
        },
        loadButtonContainer: {
            display: 'flex',
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'center'
        },
        loadedButton: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#BD467C',
            padding: '2px',
            marginBottom: '2px',
            width: '90%',
            "&:hover": {
                backgroundColor: "#A5014B",
            }
        },
        loadedText: {
            fontFamily: 'Questrial',
            fontSize: '0.8em',
            fontWeight: '500',
            color: '#FEFEFD',
            margin: '0px'
        },
        selectionContainer: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'flex-start'
        },
        genericSelector: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '5px',
            background: '#D7DEE2',
            padding: '4px',
            width: '100%'
        },
        rootTextContainer: {
            display: 'flex',
            width: '100%',
            margin: '2px',
            fontWeight: '100',
            fontFamily: 'Questrial',
            fontSize: '0.85em'
        },
        textField: {
            fontSize: '0.9em',
            fontWeight: '100',
            fontFamily: 'Questrial',
            paddingTop: '5px',
            paddingBottom: '0px',
        },
        labelAddress: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '0.85em',
            color: '#FEFEFD',
            fontWeight: '100',
            fontFamily: 'Questrial',
            textAlign: 'center',
            width: '100%',
            backgroundColor: '#004666',
            padding: '2px',
            margin: '2px',
            borderRadius: '3px',
            "&:hover": {
                backgroundColor: "#A5014B",
            }
        },
        labelField: {
            fontSize: '1.0em',
            fontWeight: '100',
            fontFamily: 'Questrial',
            width: '100%',
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1px'
        },
        setButton: {
            display: 'flex',
            flexDirection: 'column',
            background: '#006E9F',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#FEFEFD',
            padding: '3px',
            margin: '5px',
            width: '100px',
            height: '40px',
            "&:hover": {
                background: '#004666',
            }
        },
        buttonText: {
            fontSize: '0.85em',
            fontWeight: '100',
            fontFamily: 'Questrial',
            margin: '0px',
        }
    }))
    const classes = useStyles()

    const MAXCAT = 10
    const MAXLABEL = 10


    const [selectedCells, setSelectedCells] = useState([])
    const [selectedLabels, setSelectedLabels] = useState([])
    const [category, setCategory] = useState('')
    const [labels, setLabels] = useState({})
    const [formats, setFormats] = useState({})
    const [loadMode, setLoadMode] = useState(false)
    const [errorOpen, setErrorOpen] = useState(false)
    const [error, setError] = useState('')


    //Element Creators
    const createIOPanel = () => {

        if (props.stage === 'empty') {
            return null
        } else {
            let error_msg = null

            const genericSelector = createCatSelector()
            const labelSelector = createLabelSelector()

            return (
                <div className={classes.selectionContainer}>
                    {genericSelector}
                    {labelSelector}
                    <h3 className={classes.instructions} style={{color: 'red', margin: '10px'}}>{error_msg}</h3>
                </div>
            )
        }
    }

    const createCatSelector = () => {
        if (props.stage === 'loaded' || props.stage === 'labelSelect' || props.stage === 'labelComplete') {
            let labelText
            if (category === '') {
                labelText = 'Output Category Name'
            } else {
                labelText = ''
            }

            return (
                <Paper className={classes.genericSelector}>
                    <TextField
                        required id="standard-required"
                        className={classes.rootTextContainer}
                        label={labelText}
                        size="small"
                        InputLabelProps={{
                            className: classes.labelField
                        }}
                        InputProps={{
                            classes: {
                                input: classes.textField
                            }
                        }}
                        inputProps={{
                            maxLength: 23
                        }}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </Paper>
            )
        } else {
            return null
        }
    }

    const createLabelSelector = () => {

        if (props.stage === 'loaded') {
            return selectedCells.map(c => {
                return (
                    <div key={c.address} style={{display: 'flex', width: '100%'}}>
                        <h3 className={classes.labelAddress}
                            onMouseEnter={(e) => labelEnter(e, c.address)}
                            onMouseLeave={(e) => labelExit(e, c.address)}
                        >{c.address}</h3>
                        <IconButton onClick={() => deleteLabelHandler(c.address)} size="small">
                            <RemoveCircleSharpIcon style={{color: '#899CA9'}} size="small"/>
                        </IconButton>
                    </div>
                )
            })
        } else if (props.stage === 'labelSelect' || props.stage === 'labelComplete') {

            return selectedCells.map(c => {
                return (
                    <div key={c.address} style={{display: 'flex', width: '100%'}}>
                        <TextField
                            required
                            className={classes.rootTextContainer}
                            label={c.address}
                            size="small"
                            InputLabelProps={{
                                className: classes.labelField
                            }}
                            InputProps={{
                                classes: {
                                    input: classes.textField,
                                }
                            }}
                            value={labels[c.address]}
                            onChange={(e) => labelChange(e, c.address)}
                            onMouseEnter={(e) => labelEnter(e, c.address)}
                            onMouseLeave={(e) => labelExit(e, c.address)}
                        />
                        <IconButton onClick={() => deleteLabelHandler(c.address)} size="small">
                            <RemoveCircleSharpIcon style={{color: '#8BBDD3'}} size="small"/>
                        </IconButton>
                    </div>
                )
            })
        } else {
            return null
        }
    }

    const createButtons = () => {

        //Activates when status is empty
        let setOutputButton
        let backButton
        let doneWithOutputs

        if (props.stage === 'loaded') {
            setOutputButton = (
                <Button className={classes.setButton} size="small" onClick={() => props.updateStage("labelSelect")}>
                    <h3 className={classes.buttonText}>OK</h3>
                </Button>)
        } else if (props.stage === 'labelSelect') {
            if (labelCheck() === true) {
                props.updateStage("labelComplete")
            }

        } else if (props.stage === 'labelComplete') {
            if (labelCheck() === false) {
                props.updateStage("labelSelect")
            } else {
                let setText = "OK"
                setOutputButton = (
                    <Button className={classes.setButton} size="small" onClick={() => setOutputHandler()}>
                        <h3 className={classes.buttonText}>{setText}</h3>
                    </Button>)
            }

        } else if (props.stage === 'summary') {
            doneWithOutputs = (
                <Button className={classes.setButton} size="small" onClick={() => props.updateIO("inputs")}>
                    <h3 className={classes.buttonText}>GO TO INPUTS</h3>
                </Button>
            )
        } else {
            setOutputButton = null
            backButton = null
            doneWithOutputs = null
        }

        return (
            <div className={classes.buttonContainer}>
                {backButton}
                {setOutputButton}
                {doneWithOutputs}
            </div>
        )
    }

    const createInstructions = () => {

        let alreadySelected = null

        if (props.outputs.length > 0) {
            alreadySelected = props.outputs.map(output => {
                return (
                    <div className={classes.loadButtonContainer} key={output.category}>
                        <Button
                            key={output.address}
                            className={classes.loadedButton}
                            onClick={() => loadOutputHandler(output.category)}
                        >
                            <h3 className={classes.loadedText}>{output.category}</h3>
                        </Button>
                        <IconButton onClick={() => deleteOutputHandler(output.category)} size="small">
                            <RemoveCircleSharpIcon style={{color: '#BD467C'}} size="small"/>
                        </IconButton>
                    </div>
                )
            })
        }

        //If no outputs have been selected yet
        if (props.stage === 'empty') {

            return (
                <h3 className={classes.instruction}>
                    Select an output cell or multiple cells (one at a time) that are part of the same category (Net
                    Profit for e.g.) <br/><br/>

                    All cells should have the same <em>units</em>. For example, all cells under a Net Profit cateogry
                    must be in dollars.<br/><br/>
                </h3>
            )
        } else if (props.stage === 'loaded') {

            return (
                <h3 className={classes.instruction}>
                    Select upto 10 cells
                </h3>
            )
        } else if (props.stage === 'labelSelect') {

            return (
                <h3 className={classes.instruction}>
                    Give these cells a label. For e.g. Year 1, Year 2 etc. You can type labels below or click cells in
                    the spreadsheet that contain labels.
                </h3>
            )
            //If user has selected at least one input
        } else if (props.stage === 'summary' && props.outputs.length < MAXCAT) {

            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginBottom: '10px'
                }}>
                    <h3 className={classes.instruction}>
                        Outputs already selected are shown below. Click on the spreadsheet to select a new set of cells
                        for the next
                        desired output category.<br/><br/>
                    </h3>
                    <h3 className={classes.instruction} style={{
                        color: '#A5014B',
                    }}>You can revisit and make changes to your previously defined outputs by selecting them below</h3>
                    {alreadySelected}
                </div>

            )

            //All 5 inputs have been selected
        } else if (props.outputs.length === MAXCAT) {
            return (
                <>
                    <h3 className={classes.instruction}>
                        Maximum of 10 outputs have been defined. Click on the outputs below to go back and change
                        assumptions, or click on the to remove icon to delete this output
                        <br/>
                    </h3>
                    {alreadySelected}
                </>
            )
        } else {
            return null
        }
    }


//Output Selection Functions
    const addSelectedCells = (newCell, sheetName) => {

        //if clicked a cell that already exists then reset color of that cell and remove that cell from state
        let foundIndex = selectedCells.findIndex(cell => (cell.raw === newCell && sheetName === cell.sheet))
        if (foundIndex !== -1) {
            deleteLabelHandler(sheetName + '!' + newCell)
        }

        //If max labels exceeded, throw an error
        else if (selectedCells.length === MAXLABEL) {
            setErrorOpen(true)
            setError("Maximum allowed cells per category of 10")

            //Highlight that cell and update states
        } else {

            // Get cell metadata on old color, value and format for ne cell
            let oldColor = getOldColor(newCell, sheetName)
            let v = getValue(newCell, sheetName)
            let format = getFormat(newCell, sheetName)

            //Set new clicked cell
            setSelectedCells([...selectedCells,
                {
                    address: sheetName + '!' + newCell,
                    sheet: sheetName,
                    raw: newCell,
                    oldColor: oldColor,
                    value: v,
                    format: format
                }])

            //Add to labels
            setLabels({
                ...labels,
                [sheetName + '!' + newCell]: ''
            })

            setFormats({
                ...formats,
                [sheetName + '!' + newCell]: format
            })

        }
        props.updateStage('loaded')
    }

    const addSelectedLabels = (labelCell, labelValue, sheetName) => {

        let oldColor

        //Find if this cell is already clicked
        let foundIndex = selectedLabels.findIndex(cell => (cell.raw === labelCell && sheetName === cell.sheet))

        //If clicked, then unhighlight it
        if (foundIndex !== -1) {
            document.getElementById('sjs-' + labelCell).style.backgroundColor = '#' + selectedLabels[foundIndex].oldColor
            const newSelection = selectedLabels.filter((cell, idx) => idx !== foundIndex)
            setLabels({...labels, [selectedCells[foundIndex].address]: ''})
            setSelectedLabels([...newSelection])

            // Otherwise Go ahead and add it to state
        } else {

            if (selectedLabels.length < selectedCells.length) {
                document.getElementById('sjs-' + labelCell).style.backgroundColor = '#F4F075'
                oldColor = getOldColor(labelCell, sheetName)

                //if selected labels is already the same length as selected cells, then don't add more

                setLabels({
                    ...labels,
                    [selectedCells[selectedLabels.length].address]: labelValue
                })


                //Save metadata on label cell in case we need to unhighlight
                setSelectedLabels([...selectedLabels,
                    {
                        address: sheetName + '!' + labelCell,
                        sheet: sheetName,
                        raw: labelCell,
                        oldColor: oldColor,
                        value: labelValue,
                    }])
            }
        }
    }


//Output sets and loads
    const setOutputHandler = () => {

        const outputPayload = {
            "category": category,
            "labels": labels,
            "formats": formats
        }

        let foundIndex = props.outputs.findIndex(output => output.category === category)

        //Validations Start
        //If category is not set
        if (category === '') {
            setErrorOpen(true)
            setError("Please give this output a category name before proceeding. A name could be descriptions of the output category, such as Net Income, or Enterprise Value, or IRR.")
        }

        //If category already exists in outputs
        else if (foundIndex !== -1) {

            //If in load mode and labels match the new cell , then update this output
            if (loadMode) {
                let newOutputs = props.outputs
                newOutputs[foundIndex] = outputPayload
                props.updateOutputs([...newOutputs])
                resetState()
            }
            //Else throw an error
            else {
                setErrorOpen(true)
                setError("Output category has already been assigned to other cells. Please select a different name")
            }

        } else if (hasDuplicates(Object.values(labels))) {
            setErrorOpen(true)
            setError("This category already contains duplicate labels")
        }

        //Otherwise we are go for inserting into output array
        else {
            props.updateOutputs([...props.outputs, outputPayload])
            props.updateFormats({...props.formats, ...formats})
            resetState()
        }
    }

    const loadOutputHandler = (category) => {
        let foundOutput = props.outputs.find(output => output.category === category)

        let newSelectedCells = []
        let newLabels = {}
        let newFormats = {}

        //Have to do this to avoid setting state within loop. Ugh. We are creating a temp array of new selectedCells
        //and labels and loading those at the end of the loop
        Object.entries(foundOutput.labels).forEach(entry => {
            const splits = entry[0].split("!")
            const sheetName = splits[0]
            if (sheetName !== props.currSheet) {
                props.handleSheetChange(sheetName)
            }
            const rawAdd = splits[1]

            const oldColor = getOldColor(rawAdd, sheetName)
            const v = getValue(rawAdd, sheetName)
            const format = getFormat(rawAdd, sheetName)

            if (sheetName === props.currSheet) {
                document.getElementById('sjs-' + rawAdd).style.backgroundColor = '#F4F075'
            }

            newSelectedCells.push({
                address: sheetName + '!' + rawAdd,
                sheet: sheetName,
                raw: rawAdd,
                oldColor: oldColor,
                value: v,
                format: format
            })
            newLabels[sheetName + '!' + rawAdd] = entry[1]
            newFormats[sheetName + '!' + rawAdd] = format
        })

        setCategory(category)
        setSelectedCells([...newSelectedCells])
        setLabels({...newLabels})
        setFormats({...newFormats})
        setLoadMode(true)
        props.updateStage("loaded")
    }

//Output Deletions
    const deleteOutputHandler = (category) => {

        //First remove all the formats associated with this output
        const outputToRemove = props.outputs.find(output => output.category === category)
        if (outputToRemove) {
            const newFormat = omitKeys(props.formats, Object.keys(outputToRemove.labels))
            props.updateFormats({...newFormat})
        }

        //Then go ahead and remove this output
        const newOutputs = props.outputs.filter(output => output.category !== category)
        props.updateOutputs([...newOutputs])
        if (newOutputs.length === 0) {
            props.updateStage("empty")
        }
    }

    const deleteLabelHandler = (address) => {
        const indexToRemove = selectedCells.findIndex(output => output.address === address)

        //Remove cell from selectedCells
        const cellToRemove = selectedCells[indexToRemove]
        document.getElementById('sjs-' + cellToRemove.raw).style.backgroundColor = '#' + cellToRemove.oldColor
        // props.wb.Sheets[cellToRemove.sheet][cellToRemove.raw].s.fgColor = {rgb: cellToRemove.oldColor}

        //If selected cells will be empty after this removal AND no outputs have been selected yet props.updateStage to empty
        if (selectedCells.length === 1 && props.outputs.length === 0) {
            deleteOutputHandler(category)
            unHighlightAll()
            setSelectedCells([])
            setSelectedLabels([])
            setLabels({})
            setFormats({})
            setCategory("")
            props.updateStage("empty")
        }

        //If selected cells will be empty after this removal BUT other outputs exist, delete this output and stage is summary
        if (selectedCells.length === 1 && props.outputs.length > 0) {
            deleteOutputHandler(category)
            resetState()
        }

        const newCells = selectedCells.filter(output => output.address !== address)
        setSelectedCells([...newCells])

        //Remove from local labels
        const {[address]: tmp, ...rest} = labels
        setLabels(rest)

        //Remove from local formats
        const {[address]: tmpF, ...restF} = formats
        setFormats(restF)

        //Remove from global formats
        const {[address]: tmp2, ...rest2} = props.formats
        props.updateFormats({...rest2})


        //Remove label from selectedLabels
        if ((props.stage === 'labelSelect' || props.stage === 'labelComplete') && typeof (selectedLabels[indexToRemove]) !== 'undefined') {
            const labelToRemove = selectedLabels[indexToRemove]
            document.getElementById('sjs-' + labelToRemove.raw).style.backgroundColor = "#" + labelToRemove.oldColor
            const newSelectedLabels = selectedLabels.filter(label => selectedLabels.indexOf(label) !== indexToRemove)
            setSelectedLabels([...newSelectedLabels])
        }
    }

//Other Handlers
    const labelChange = (e, address) => {
        setLabels({
            ...labels,
            [address]: e.target.value
        })
    }

    const handleErrorClose = () => {
        setErrorOpen(false)
    }

    const labelEnter = (e, address) => {
        const splits = address.split("!")
        const sheetName = splits[0]
        let raw = splits[1]
        if (props.currSheet === sheetName) {
            document.getElementById('sjs-' + raw.toString()).style.backgroundColor = "orange"
            document.getElementById('sjs-' + raw.toString()).scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center"
            })
        } else {
            props.handleSheetChange(sheetName)
        }
    }

    const labelExit = (e, address) => {
        const splits = address.split("!")
        const sheetName = splits[0]
        let raw = splits[1]
        if (props.currSheet === sheetName) {
            document.getElementById('sjs-' + raw).style.backgroundColor = '#F4F075'
        }
        // window.scrollTo({left: 0, top: 0, behavior: 'smooth'})
    }

//Utils
    const resetState = () => {
        unHighlightAll()
        setSelectedCells([])
        setSelectedLabels([])
        setLabels({})
        setFormats({})
        setCategory("")
        props.updateStage("summary")
        setLoadMode(false)
    }

    const unHighlightAll = () => {

        //unhighlight cat cells
        selectedCells.forEach(c => {
            document.getElementById('sjs-' + c.raw).style.backgroundColor = '#' + c.oldColor
        })

        //unhighlight labels
        selectedLabels.forEach(label => {
            document.getElementById('sjs-' + label.raw).style.backgroundColor = '#' + label.oldColor
            // props.wb.Sheets[label.sheet][label.raw].s.fgColor = {rgb: label.oldColor}
        })
    }

    const getOldColor = (newCell, sheetName) => {
        try {
            return props.wb.Sheets[sheetName][newCell].s.fgColor.rgb
        } catch {
            return "FFFFFF"
        }
    }

    const getValue = (newCell, sheetName) => {
        try {
            return myRound(props.wb.Sheets[sheetName][newCell].v)
        } catch {
            return 0
        }
    }

    const getFormat = (newCell, sheetName) => {
        try {
            return props.wb.Sheets[sheetName][newCell].z
        } catch {
            return 'General'
        }
    }

    const labelCheck = () => {
        return Object.keys(labels).every((address => labels[address] !== ''))
    }


//Executions
    let instructions = createInstructions()
    let buttons = createButtons()
    let ioPanel = createIOPanel()
    let cancelEl
    if (props.mode === 'loaded') {
        cancelEl = (
            <NavLink to="/dashboard" style={{textDecoration: 'none'}}>
                <h3 style={{
                    color: 'gray',
                    marginTop: '5px',
                    fontSize: '0.85em',
                    fontWeight: '100',
                    fontFamily: 'Questrial',
                    cursor: 'pointer'
                }} onClick={() => props.cancel()}>Cancel and Go Back</h3>
            </NavLink>)
    }


    return (
        <div style={{display: 'flex', width: '100%'}}>
            <div className={classes.root}>
                {instructions}
                {ioPanel}
                {buttons}
                {cancelEl}
            </div>
            <Spreadsheet
                stage={props.stage}
                IO={props.IO}
                worksheet={props.worksheet}
                currSheet={props.currSheet}
                sheets={props.sheets}
                handleSheetChange={props.handleSheetChange}
                selectedCells={selectedCells}
                addSelectedCells={addSelectedCells}
                selectedLabels={selectedLabels}
                addSelectedLabels={addSelectedLabels}
                updateMsg={props.updateMsg}
                updateOpen={props.updateOpen}
            />
            <Dialog open={errorOpen} onClose={handleErrorClose}>
                <div>
                    <h2 className={classes.instruction}>{error}</h2>
                </div>
            </Dialog>
        </div>
    )
}
