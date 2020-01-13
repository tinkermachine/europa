import React from 'react';
import {makeStyles} from '@material-ui/core/styles'
import {
    AreaChart,
    BarChart,
    Bar,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts'
import Paper from '@material-ui/core/Paper'
import {Card} from "@material-ui/core";
import {LabelSelector} from "./LabelSelector";
import {convert_format} from "../utils/utils"
import Fade from '@material-ui/core/Fade'


export default function Distribution(props) {


    //Styles
    const useStyles = makeStyles(theme => ({
        distCard: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            background: '#FEFEFD'
        },
        paper: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '1%',
            padding: '1%',
            background: 'linear-gradient(#F4F4F4 10%,#EBEEF0)',
            // borderRadius:'64px'
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
            fontSize: '1em'
        },
        statFigure: {
            color: '#F4F9E9',
            textAlign: 'center',
            margin: '0px',
            fontFamily: 'Questrial',
            fontWeight: '10',
            fontSize: '2.0em'
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
            marginBottom: '0'
        },
        chartNote: {
            fontFamily: 'Questrial',
            fontSize: '0.9em',
            fontWeight: '300',
            color: '#3C4148',
            marginTop: '0'
        },
        xlabel: {
            fontFamily: 'Questrial',
            fontSize: '1.0em',
            fontWeight: '100',
            fill: '#4F545A'
        },
        ylabel: {
            fontFamily: 'Questrial',
            fontSize: '1.0em',
            fill: '#4F545A',
            textAnchor: 'left'
        }
    }))
    const classes = useStyles()
    const color_url = "url(#" + '#006E9F'.toString() + ")"
    const area_color_url = "url(#" + '#006E9F'.toString() + ")"


    // Get address of outout label selected from dropdown

    const outAdd = props.outAdd

    const out_fmt = props.formats[outAdd]
    const outCat = props.outCat
    const probs = props.distributions.prob[outAdd]


    const processCases = () => {

        const probKey = props.currSolution[outAdd].toFixed(3)
        return Object.entries(props.cases[0]).reduce((acc, caseData) => {
            const caseName = caseData[0]
            const inputCombo = caseData[1]
            const caseOutVal = props.findSolution(inputCombo)[outAdd].toFixed(3)
            acc[caseName] = [caseOutVal, probs[caseOutVal][1]]
            return acc
        }, {'Current': [props.currSolution[outAdd], probs[probKey][1]]})
    }

    const createRefBars = (caseVals, yAxisId) => {
        return Object.entries(caseVals).map((caseVal, idx) => {
            let labelposition
            let labelfill
            let labelWeight
            let labelvalue
            let labelwidth
            let labelFront
            let labelDash
            if (caseVal[0] === "Current") {
                labelposition = "top"
                labelfill = '#DB0263'
                labelWeight = 600
                labelwidth = 4
                labelFront = true
                labelDash = "5 0"
            } else {
                labelposition = "insideLeft"
                labelfill = '#DB0263'
                labelWeight = 350
                labelwidth = 0.7
                labelFront = false
                labelDash = "3 3"
            }
            if (yAxisId === 'pdf') {
                labelvalue = caseVal[0] + " " + convert_format("0.0%", caseVal[1][1])
            } else {
                labelvalue = caseVal[0] + " " + convert_format(out_fmt, caseVal[1][0])
            }

            return <ReferenceLine
                key={caseVal[0]}
                yAxisId={yAxisId}
                x={caseVal[1][0]}
                stroke={labelfill}
                strokeWidth={labelwidth}
                strokeDasharray={labelDash}
                label={{
                    position: labelposition,
                    value: labelvalue,
                    fontFamily: 'Questrial',
                    fontSize: '0.9em',
                    fill: labelfill,
                    width: '10px',
                    fontWeight: labelWeight
                }}
                isFront={labelFront}
                ifOverflow="extendDomain"
            />
        })
    }

    const createProbData = (probs, counts) => {
        return Object.entries(probs).map(ValProbPair => {
            const outVal = parseFloat(ValProbPair[0])
            const pdf = ValProbPair[1][0]

            return ({
                value: outVal,
                pdf: pdf
            })
        })
    }

    const createBinCenters = (counts) => {
        const bin_edges = props.distributions.bin_edges[outAdd]
        let bin_centers = bin_edges.map((edge, idx) => {
            if (idx < bin_edges.length - 1) {
                return (edge + bin_edges[idx + 1]) / 2
            } else {
                return null
            }
        })
        return bin_centers.slice(0, bin_centers.length - 1)
    }

    const createHistogramData = (bin_centers, counts) => {
        return bin_centers.map((center, idx) => {
            return {
                value: center,
                count: counts[idx]
            }
        })
    }

    //Tick formatter
    const CustomizedXAxisTick = (props, fmt) => {
        const {x, y, payload} = props

        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dy={16}
                    textAnchor="middle"
                    fill='#3C4148'
                    transform="rotate(-0)"
                    fontSize='0.9em'
                    fontFamily="Questrial"
                    fontWeight='500'
                >
                    {convert_format(fmt, payload.value)}
                </text>
            </g>
        )
    }

    const generateHistChart = (outAdd, outCat, caseVals, counts, bin_centers) => {
        const hist_data = createHistogramData(bin_centers, counts)
        const referenceBars = createRefBars(caseVals, "count")

        return (
            <Paper className={classes.paper} elevation={2}>
                <h3 className={classes.chartTitle}>Histogram for {outCat.category}, {outCat.labels[outAdd]}</h3>
                <h3 className={classes.chartNote}><em>Represents relative frequency of values assuming a standrard bin
                    width</em></h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={hist_data}
                        margin={{top: 50, right: 100, left: 100, bottom: 0}}
                        barSize={20}
                        // style={{background: 'linear-gradient(#FFFFFF 60%,#F4F4F4)'}}
                    >
                        <defs>
                            <linearGradient id={'#006E9F'} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="25%" stopColor={'#006E9F'} stopOpacity={0.75}/>
                                <stop offset="95%" stopColor={'#006E9F'} stopOpacity={0.25}/>
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="value"
                            type="number"
                            tick={(tickData) => CustomizedXAxisTick(tickData, out_fmt)}
                            ticks={bin_centers}
                            tickLine={false}
                            interval={0}
                            // padding={{top: 30, bottom: 30}}
                            stroke='#004666'
                            // scale="linear"
                            domain={[props.distributions.min[outAdd], props.distributions.max[outAdd]]}
                        />
                        <YAxis
                            yAxisId="count"
                            hide={true}
                        />
                        <Tooltip
                            wrapperStyle={{fontSize: '0.9em', fontFamily: 'Questrial'}}
                            cursor={{fill: '#FEFEFD', fontFamily: 'Questrial', fontSize: '0.8em'}}
                            formatter={value => [`${value} solutions`]}
                            labelFormatter={value => `${convert_format(out_fmt, value)}`}
                        />
                        {referenceBars}
                        <Bar
                            yAxisId="count"
                            dataKey="count"
                            fill={color_url}
                            isAnimationActive={true}>
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        )
    }

    const generateProbChart = (outAdd, outCat,caseVals, ticks) => {
        const prob_data = createProbData(probs)
        const referenceBars = createRefBars(caseVals, "pdf")

        //Combine with cases
        prob_data.sort((a, b) => a.value - b.value)


        return (
            <Paper className={classes.paper} elevation={2}>
                <h3 className={classes.chartTitle}>Estimated Probability of Achievement
                    for {outCat.category}, {outCat.labels[outAdd]}</h3>
                <h3 className={classes.chartNote}><em>Represents probability that Case will be achieved or exceeded</em>
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart
                        data={prob_data}
                        margin={{top: 50, right: 100, left: 100, bottom: 0}}
                        barSize={20}
                    >
                        <defs>
                            {/*<linearGradient id={'#41C0EB'} x1="0" y1="0" x2="0" y2="1">*/}
                            <linearGradient id={'#41C0EB'} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#006E9F" stopOpacity={0.7}/>
                                <stop offset="95%" stopColor="#006E9F" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="value"
                            type="number"
                            tick={(tickData) => CustomizedXAxisTick(tickData, out_fmt)}
                            ticks={ticks}
                            tickLine={false}
                            interval={0}
                            padding={{top: 30, bottom: 30}}
                            stroke='#768C9B'
                            // scale="linear"
                            domain={[props.distributions.min[outAdd], props.distributions.max[outAdd]]}
                        />
                        <YAxis yAxisId="pdf"
                               orientation='right'
                               hide={true}
                        />
                        {/*<YAxis yAxisId="cdf" orientation='right'/>*/}
                        <Tooltip
                            wrapperStyle={{fontSize: '0.9em', fontFamily: 'Questrial'}}
                            cursor={{fill: '#FEFEFD', fontFamily: 'Questrial', fontSize: '0.8em'}}
                            // formatter={value => [`${value} solutions`]}
                            labelFormatter={value => [`${convert_format(out_fmt, value)}`]}
                        />
                        {/*<Legend/>*/}
                        {referenceBars}
                        <Area yAxisId="pdf"
                              type="monotone"
                              dataKey="pdf"
                              fill={area_color_url}
                              stroke="#F4F9E9"
                              connectNulls={true}
                              isAnimationActive={true}/>
                    </AreaChart>
                </ResponsiveContainer>
            </Paper>
        )
    }

    const generateKeyStats = (outAdd) => {
        const xmin = props.distributions.min[outAdd]
        const xmax = props.distributions.max[outAdd]
        const xmean = props.distributions.mean[outAdd]
        const xstd = props.distributions.std[outAdd]

        return (
            <div className={classes.keyStatsContainer}>
                <Paper className={classes.keyStatsPaper} elevation={3}>
                    <h2 className={classes.statsText}>{'Mean'}</h2>
                    <h3
                        className={classes.statFigure}>{convert_format(out_fmt, xmean)}
                    </h3>
                </Paper>
                <Paper className={classes.keyStatsPaper} elevation={3}>
                    <h2 className={classes.statsText}>{'Minimum'}</h2>
                    <h3 className={classes.statFigure}>{convert_format(out_fmt, xmin)}</h3>
                </Paper>
                <Paper className={classes.keyStatsPaper} elevation={3}>
                    <h2 className={classes.statsText}> {'Maximum'}</h2>
                    <h3 className={classes.statFigure}>{convert_format(out_fmt, xmax)}</h3>
                </Paper>
                <Paper className={classes.keyStatsPaper} elevation={3}>
                    <h2 className={classes.statsText}> {'Standard Deviation'}</h2>
                    <h3 className={classes.statFigure}>{convert_format(out_fmt, xstd)}</h3>
                </Paper>
            </div>
        )
    }


    //Execute Functions
    const caseVals = processCases()
    const counts = props.distributions.count[outAdd]
    const bin_centers = createBinCenters(counts)
    const histChart = generateHistChart(outAdd, outCat, caseVals, counts, bin_centers)
    const probChart = generateProbChart(outAdd,outCat, caseVals, bin_centers)
    const keyStats = generateKeyStats(outAdd)

    return (
        <Card
            className={classes.distCard}
            key={"dist" + props.currOutputCell}
            // raised={true}
            elevation={3}
        >
            <div className={classes.cardHeaderContainer}>
                <h2 className={classes.cardTitleHeader}>Output Distributions</h2>
            </div>
            <LabelSelector
                type="withLabel"
                outputs={props.outputs}
                handleOutputLabelChange={props.handleOutputLabelChange}
                handleOutputCategoryChange={props.handleOutputCategoryChange}
                currOutputCell={outAdd}
                currCategory={outCat.category}/>
            <Fade in={true} timeout={1000}>
                {keyStats}
            </Fade>
            {histChart}
            {probChart}
        </Card>
    )

}
