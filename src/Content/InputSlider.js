import React, {useEffect, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Slider from '@material-ui/core/Slider'
import {convert_format} from "../utils/utils";


const useStyles = makeStyles(theme => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            // backgroundColor: 'red',
            marginBottom: '0px'
        },
        sliderContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            // backgroundColor: 'green',
            // margin: '5%'
        },
        label: {
            display: 'flex',
            fontWeight: '650',
            fontSize: '0.9em',
            fontFamily: 'Questrial',
            marginTop: '0%',
            marginBottom: '7%',
            color: '#006E9F',
            textAlign: 'center'
        },
        mark: {
            backgroundColor: '#C4C6C8',
            height: 0,
            width: 0.8
        },
        markActive: {
            backgroundColor: '#006E9F'
        },
        rail: {
            backgroundColor: '#767A7F',
        },
        track: {
            backgroundColor: '#006E9F',
        },
        active: {
            backgroundColor: '#A5014B'
        },
        markLabel: {
            borderStyle: 'solid',
            borderColor: '#D8D9DA',
            // opacity:'70%',
            borderRadius: '100%',
            // padding:'5px',
            borderWidth: '4px',
            fontSize: '0.0em',
            color: '#4F545A',
            top: 10,
            // fontWeight:'700',
            fontFamily: 'Questrial',
            "&:hover": {
                fontSize: '0.9em',
                borderStyle: 'none',
                top: -17,
                // borderColor: '#4F545A',
            }
        },
        markLabelActive: {
            borderColor: '#006E9F',
            color: '#006E9F',
            fontFamily: 'Questrial',
            // fontWeight:'600',
        },
        thumb: {
            color: '#006E9F',
            fontFamily: 'Questrial'
        },
        valueLabel: {
            left: 'calc(-50%)',
            top: -22,
            '& *': {
                background: 'transparent',
                color: '#006E9F',
                fontFamily: 'Questrial',
            },
            color: '#006E9F',
            fontFamily: 'Questrial',
            fontSize: '0.9em',
            // backgroundColor:'red'
        }
    }
))


export default function InputSlider(props) {
    const classes = useStyles()
    const [displayVal, setDisplayVal] = useState(0)

    const marks = generateMarks(props.values)
    const min = Math.min(...props.values)
    const max = Math.max(...props.values)

    function valueLabelFormat(value) {
        return convert_format(props.formats[props.address], value)
    }

    function generateMarks(values) {
        return values.map(v => (
                {
                    value: v,
                    label: convert_format(props.formats[props.address], v)
                }
            )
        )
    }


    useEffect(() => {
        setDisplayVal(props.currSliderVal)
    }, [props.currSliderVal])


    return (
        <div className={classes.sliderContainer}>
            <Slider classes={{
                root: classes.root,
                active: classes.active,
                mark: classes.mark,
                markActive: classes.markActive,
                markLabel: classes.markLabel,
                markLabelActive: classes.markLabelActive,
                thumb: classes.thumb,
                valueLabel: classes.valueLabel,
                track: classes.track,
                rail: classes.rail
            }}
                // defaultValue={props.currSliderVal}
                    value={displayVal}
                    aria-labelledby="discrete-slider-restricted"
                    valueLabelDisplay="on"
                    valueLabelFormat={valueLabelFormat}
                    min={min}
                    max={max}
                    step={null}
                    marks={marks}
                    onChangeCommitted={(event, value) => props.onChange(event, value, props.address)}
            />
            <div className={classes.label}>
                {props.name}
            </div>
        </div>

    )
}


