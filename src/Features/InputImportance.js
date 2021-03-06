import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles'
import {
    BarChart,
    Bar,
    LabelList,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts'
import Paper from '@material-ui/core/Paper'
import {Card} from "@material-ui/core";
import {OutputDropdown} from "../UtilityComponents/OutputDropdown";
import {getAvgfromKey, getMaxfromKey, getMinfromKey, getDomains, convert_format} from "../utils/utils";
import Fade from '@material-ui/core/Fade'
import {CircularProgressbar} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

const chartColors = [
    '#006E9F',
    '#A5014B',
    '#3DA32D',
    '#6014BC',
    '#C62525',
    '#002247'
]


export default function InputImportance(props) {


    //Styles
    const useStyles = makeStyles(theme => ({
        distCard: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: '10px',
            // background: '#FEFEFD',
        },
        paper: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            margin: '1%',
            padding: '1%',
            background: 'linear-gradient(#F4F4F4 10%,#FEFEFD)',
            // borderRadius:'64px'
        },
        deltaChartsContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '1%',
            padding: '1%',
            background: 'linear-gradient(#F4F4F4 10%,#FEFEFD)',
        },
        deltaChart: {
            display: 'flex',
            width: '45%',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '1%',
            padding: '1%',
        },
        inputComparisonContainer: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
            margin: '1%',
            padding: '1%'
        },
        keyStatsContainer: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            alignItems: 'center',
            width: '100%',
            margin: '1%',
        },
        keyStatsPaper: {
            display: 'flex',
            flexDirection: 'column',
            // justifyContent: 'center',
            // alignItems: 'center',
            minWidth: '20%',
            // maxHeight:'5%',
            margin: '1%',
            padding: '1%',
            background: '#4595B9'
        },
        statsText: {
            color: '#F4F9E9',
            fontFamily: 'Questrial',
            // textAlign:'center',
            margin: '0px',
            fontWeight: '20',
            fontSize: '0.9em'
        },
        statFigure: {
            color: '#F4F9E9',
            textAlign: 'center',
            margin: '0px',
            fontFamily: 'Questrial',
            fontWeight: '10',
            fontSize: '1.3em'
        },
        cardHeaderContainer: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        cardTitleHeader: {
            color: '#4F545A',
            fontFamily: 'Questrial',
            fontWeight: '20',
            fontSize: '2em',
            marginTop: '10px',
            marginLeft: '15px',
            marginBottom: '20px',
            // backgroundColor:'blue'
        },
        chartTitle: {
            fontFamily: 'Questrial',
            // background: '#7C97B7',
            fontSize: '1.2em',
            fontWeight: '300',
            color: '#3C4148',
            marginTop: '0px',
            marginBottom: '0px'
        },
        chartNote: {
            fontFamily: 'Questrial',
            fontSize: '0.9em',
            fontWeight: '300',
            color: '#3C4148',
            marginTop: '0'
        }
    }))
    const classes = useStyles()
    const color_url = (color) => "url(#" + color + ")"

    //Hooks
    const [inptCont, setInputCont] = useState([...props.iiSummaryData])

    useEffect(() => {

        setInputCont([...props.iiSummaryData])

    }, [props.iiSummaryData])

//Formatters
    const CustomizedCompXAxisTick = (props) => {
        const {x, y, payload} = props

        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dx={10}
                    dy={16}
                    textAnchor="middle"
                    fill={chartColors[payload.index]}
                    transform="rotate(-0)"
                    fontSize='0.9em'
                    fontFamily="Questrial"
                    fontWeight='500'
                >
                    {payload.value}
                </text>
            </g>
        )
    }

    const CustomizedDeltaXAxisTick = (props) => {
        const {x, y, payload} = props

        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dx={10}
                    dy={16}
                    textAnchor="middle"
                    fill='#006E9F'
                    transform="rotate(-0)"
                    fontSize='0.85em'
                    fontFamily="Questrial"
                    fontWeight='500'
                >
                    {payload.value}
                </text>
            </g>
        )
    }


//Chart Creators
    const generateCharts = () => {
        const {avgData, outAdd} = props
        const out_fmt = props.formats[outAdd]


        const deltaCharts = avgData.map((inptData, idx) => {
            const inAdd = Object.keys(inptData)
            const inputLabel = props.inputLabelMap[inAdd]
            const inVal = Object.values(inptData)[0]
            const xmax = getMaxfromKey(inVal, "value")
            const xmin = getMinfromKey(inVal, "value")
            const domains = getDomains(xmin, xmax)


            inptCompData.push({
                "name": inputLabel,
                "value": (getAvgfromKey(inVal, "value")),
                "fill": color_url(chartColors[idx])
            })

            return (
                <div className={classes.deltaChart} key={"Delta_" + out_fmt + inAdd}>
                    <h3 className={classes.chartTitle}>Impact of</h3><h3 className={classes.chartTitle}
                                                                         style={{color: chartColors[idx]}}>{inputLabel}</h3>
                    <h3 className={classes.chartNote}>Represents average change for one slider increment</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={inVal}
                            margin={{top: 25, right: 10, left: 10, bottom: 10}}
                            barSize={20}
                            // style={{background: 'linear-gradient(#FFFFFF 60%,#F4F4F4)'}}
                        >
                            <defs>
                                <linearGradient id={chartColors[idx]} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="25%" stopColor={chartColors[idx]} stopOpacity={0.75}/>
                                    <stop offset="95%" stopColor={chartColors[idx]} stopOpacity={0.25}/>
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                type="category"
                                tick={(tickData) => CustomizedDeltaXAxisTick(tickData)}
                                tickLine={false}
                                interval={0}
                                stroke='#004666'
                                // padding={{top: 30, bottom: 30}}
                                // scale="linear"
                                // domain={[props.distributions.min[outAdd], props.distributions.max[outAdd]]}
                            />
                            <YAxis
                                // yAxisId="count"
                                hide={true}
                                // domain={[-30000, 0]}
                                domain={domains}
                            />
                            <Tooltip
                                wrapperStyle={{fontSize: '0.9em', fontFamily: 'Questrial'}}
                                cursor={{fill: '#FEFEFD', fontFamily: 'Questrial', fontSize: '0.8em'}}
                                labelFormatter={value => `${value}`}
                                formatter={value => [`${convert_format(out_fmt, value)}`]}
                            />
                            <ReferenceLine
                                y={0}
                                label={{
                                    position: "right",
                                    value: '0',
                                    opacity: '60%',
                                    fontFamily: 'Questrial',
                                    fontSize: '0.7em',
                                    fill: '#767A7F',
                                    width: '10px'
                                    // fontWeight: labelWeight
                                }}
                                stroke='#B1B3B5'
                                strokeDasharray="3 3"
                            />
                            <Bar
                                // yAxisId="count"
                                dataKey="value"
                                isAnimationActive={true}
                                fill={color_url(chartColors[idx])}
                                radius={[3, 3, 0, 0]}
                            >
                                >
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                    style={{
                                        fontFamily: 'Questrial',
                                        fontSize: '0.8em',
                                        fontWeight: '500',
                                        fill: chartColors[idx]
                                    }}
                                    formatter={(value) => convert_format(out_fmt, value)}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )
        })

        //Bar chart
        const inputCompChart = (
            <Paper className={classes.paper} elevation={4}>
                <h3 className={classes.chartTitle}>Impact Analysis
                    on {props.outCat.category}, {props.outCat.labels[props.outAdd]}</h3>
                <h3 className={classes.chartNote}>Average change in output for 1 increment change in input</h3>
                <ResponsiveContainer width="75%" height={300}>
                    <BarChart
                        data={inptCompData}
                        margin={{top: 50, right: 25, left: 25, bottom: 0}}
                        barSize={20}
                    >
                        <XAxis
                            dataKey="name"
                            tick={(tickData) => CustomizedCompXAxisTick(tickData)}
                            tickLine={false}
                            interval={0}
                            padding={{top: 30, bottom: 30}}
                            stroke='#004666'
                            // domain={[props.distributions.min[outAdd], props.distributions.max[outAdd]]}
                        />

                        <YAxis
                            hide={true}
                            padding={{top: 30, bottom: 30}}
                        />
                        <Tooltip
                            wrapperStyle={{fontSize: '0.9em', fontFamily: 'Questrial'}}
                            cursor={{fill: '#FEFEFD', fontFamily: 'Questrial', fontSize: '0.8em'}}
                            labelFormatter={value => `${value}`}
                            formatter={value => [`${convert_format(out_fmt, value)}`]}
                        />
                        <ReferenceLine
                            y={0}
                            label={{
                                position: "right",
                                value: '0',
                                opacity: '60%',
                                fontFamily: 'Questrial',
                                fontSize: '0.9em',
                                fill: '#767A7F',
                                width: '10px'
                                // fontWeight: labelWeight
                            }}
                            stroke='#B1B3B5'
                            strokeDasharray="3 3"
                        />
                        <Bar
                            dataKey="value"
                            isAnimationActive={true}
                            barSize={30}
                            radius={[3, 3, 0, 0]}
                        >
                            <LabelList
                                dataKey="value"
                                position="top"
                                style={{
                                    fontFamily: 'Questrial',
                                    fontSize: '0.9em',
                                    fontWeight: '500',
                                    fill: '#292F36'
                                }}
                                formatter={(value) => convert_format(out_fmt, value)}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        )


        //Guage charts
        const inputMagCharts = inptCont.map((inputData, idx) => {

            let value = inputData.value

            return (
                <div
                    key={inputData.name + 'contributionChart'}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '10px'
                    }}>
                    <h3
                        className={classes.chartTitle}
                        style={{color: chartColors[idx]}}>
                        {inputData.name}
                    </h3>
                    <CircularProgressbar
                        value={value}
                        minValue={0}
                        maxValue={1}
                        text={convert_format('0.0%', value)}
                        styles={{
                            root: {
                                width: "180px",
                                height: "180px",
                                cursor: "pointer"
                            },
                            path: {
                                // Path color
                                stroke: chartColors[idx],
                                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                strokeLinecap: 'round',
                                // Customize transition animation
                                transition: 'stroke-dashoffset 0.5s ease 0s',
                                // Rotate the path
                                transform: 'rotate(0.25turn)',
                                transformOrigin: 'center center',
                            },
                            trail: {
                                // Trail color
                                stroke: chartColors[idx],
                                opacity: '10%',
                                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                strokeLinecap: 'butt',
                                // Rotate the trail
                                transform: 'rotate(0.25turn)',
                                transformOrigin: 'center center',
                            },
                            text: {
                                fill: chartColors[idx],
                                fontFamily: 'Questrial',
                                fontSize: '1em'
                            }
                        }}
                    />
                </div>
            )
        })


        return (
            <>
                <Paper className={classes.paper} elevation={4}>
                    <h3 className={classes.chartTitle}>Which Inputs Drive The Greatest Variance
                        for {props.outCat.category}, {props.outCat.labels[props.outAdd]}?</h3>
                    <h3 className={classes.chartNote}>% of variance contribution</h3>
                    <div style={{
                        display: 'flex',
                        height: '100%',
                        width: '100%',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {inputMagCharts}
                    </div>
                </Paper>
                {inputCompChart}
                <Paper className={classes.deltaChartsContainer} elevation={4}>
                    {deltaCharts}
                </Paper>
            </>
        )
    }

    const generateKeyStats = () => {

        const mostSensitiveMag = props.iiSummaryData.reduce(function (prev, current) {
            return (prev.value > current.value) ? prev : current
        })

        const leastSensitiveMag = props.iiSummaryData.reduce(function (prev, current) {
            return (prev.value < current.value) ? prev : current
        })

        const mostSensitive = inptCompData.reduce(function (prev, current) {
            return (prev.value > current.value) ? prev : current
        })

        const leastSensitive = inptCompData.reduce(function (prev, current) {
            return (prev.value < current.value) ? prev : current
        })


        return (
            <div className={classes.keyStatsContainer}>
                <Paper className={classes.keyStatsPaper} elevation={3}>
                    <h2 className={classes.statsText}>{'Most Sensitive Driver'}</h2>
                    <h3
                        className={classes.statFigure}>{mostSensitiveMag.name}
                    </h3>
                </Paper>
                <Paper className={classes.keyStatsPaper} elevation={3}>
                    <h2 className={classes.statsText}>{'Least Sensitive Driver'}</h2>
                    <h3
                        className={classes.statFigure}>{leastSensitiveMag.name}
                    </h3>
                </Paper>
                <Paper className={classes.keyStatsPaper} elevation={3}>
                    <h2 className={classes.statsText}>{'Highest Positive Driver'}</h2>
                    <h3
                        className={classes.statFigure}>{mostSensitive.name}
                    </h3>
                </Paper>
                <Paper className={classes.keyStatsPaper} elevation={3}>
                    <h2 className={classes.statsText}>{'Highest Negative Driver'}</h2>
                    <h3
                        className={classes.statFigure}>{leastSensitive.name}
                    </h3>
                </Paper>
            </div>
        )
    }


//Execute Functions
    const inptCompData = []
    const charts = generateCharts()
    const keyStats = generateKeyStats()

    return (
        <Card
            className={classes.distCard}
            key={"ii_" + props.outAdd}
            // raised={true}
            elevation={0}
        >
            <div className={classes.cardHeaderContainer}>
                <h2 className={classes.cardTitleHeader}>Input Contribution</h2>
            </div>
            <OutputDropdown
                type="withLabel"
                outputs={props.outputs}
                handleOutputLabelChange={props.handleOutputLabelChange}
                handleOutputCategoryChange={props.handleOutputCategoryChange}
                currOutputCell={props.outAdd}
                currCategory={props.outCat.category}/>
            <Fade in={true} timeout={1000}>
                {keyStats}
            </Fade>
            {charts}
            {/*{probChart}*/}
        </Card>
    )

}
