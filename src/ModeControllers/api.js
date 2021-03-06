//API Functions
import {read} from "@sheet/core"


export const uploadFile = async (file, Dashname, token) => {
    const data = new FormData()
    data.append("file", file[0])
    data.append("Dashname", Dashname)

    console.log("Uploading excel file")
    const api_url = "http://localhost:5000/uploadFile"
    const settings = {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        method: "POST",
        body: data
    }
    try {
        const response = await fetch(api_url, settings)
        const result = await response.json()
        if (result.message === 'OK') {
            return result
        }
    } catch (error) {
        return "Unable to load file"
    }
}

export const getSolutions = async (dash_id, token) => {
    console.log("Getting Solutions...");
    const api_url = "http://localhost:5000/getSolutions"

    let result
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify({dash_id: dash_id})
    }
    try {
        const response = await fetch(api_url, headers)
        result = await response.json()

    } catch (error) {
        result = "Server not responsive"
    }
    console.log("Solutions recieved")
    return result
}

export const getMetaData = async (dash_id, token) => {
    console.log("Getting Metadata...");
    const api_url = "http://localhost:5000/getMetaData"

    let result
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify({dash_id: dash_id})
    }
    try {
        const response = await fetch(api_url, headers)
        result = await response.json()
    } catch (error) {
        result = "Server not responsive"
    }
    console.log("Metadata recieved")
    return result
}

export const calculateSolutions = async (dash_id, inputs, outputs, token) => {
    console.log("Getting calculation results...");
    const api_url = "http://localhost:5000/calculateSolutions"

    let result
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify({
            dash_id: dash_id,
            inputs: inputs,
            outputs: outputs
        })
    }
    try {
        const response = await fetch(api_url, headers)
        result = await response.json()
    } catch (error) {
        result = "Server not responsive"
    }
    console.log("Solutions recieved")
    return result
}

export const loadFile = async (dash_id, token) => {
    console.log("Loading excel file")
    const api_url = "http://localhost:5000/downloadFile"
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify({
            dash_id: dash_id
        })
    }
    try {
        const ab = await fetch(api_url, headers)
            .then(res => res.arrayBuffer())

        const wb = read(ab, {
                type: "array",
                raw: true,
                cellStyles: true,
                cellNF: false,
                cellText: false,
                showGridLines: false
            }
        )
        console.log("Excel sheet loaded")
        return wb
    } catch (error) {
        return "Unable to load file"
    }
}

export const downloadFile = async (dash_id, origFilename, token) => {
    console.log("Downloading...")
    console.log(origFilename)
    console.log("Downloading excel model")
    const api_url = "http://localhost:5000/downloadFile"
    const settings = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
            dash_id: dash_id
        })
    }
    try {
        const response = await fetch(api_url, settings)
        const blob = await response.blob()
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = origFilename;
        a.click()
    } catch (error) {
        return "Unable to load file"
    }
}

export const saveDashboard = async (dash_id, name, inputs, outputs, cases, formats, token) => {
    console.log("Saving dashboard...");
    const api_url = "http://localhost:5000/saveDashboard"

    let result
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify({
            dash_id: dash_id,
            name: name,
            inputs: inputs,
            outputs: outputs,
            cases: cases,
            formats: formats
        })
    }
    try {
        const response = await fetch(api_url, headers)
        result = await response.json()
    } catch (error) {
        result = "Server not responsive"
    }
    console.log("Dashboard Saved")
    return result
}

export const getRecords = async (token) => {
    console.log("Getting all records with this user...")

    const api_url = "http://localhost:5000/getRecords"

    let result
    const settings = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: "POST"
    }
    try {
        const response = await fetch(api_url, settings)
        result = await response.json()
        console.log("All records recieved")
    } catch (error) {
        console.log("Get Records failed")
        result = []
    }
    return result
}

export const deleteRecord = async (dash_id, token) => {
    console.log("deleting this dashboard...")
    const api_url = "http://localhost:5000/deleteRecord"

    let result
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify({
            dash_id: dash_id
        })
    }
    try {
        const response = await fetch(api_url, headers)
        result = await response.json()
    } catch (error) {
        result = {'message': "ERROR"}
    }
    console.log("Dashboard deleted")
    return result.message
}

export const sendDashboard = async (dash_id, rec_email, token) => {
    console.log("Saving dashboard...");
    const api_url = "http://localhost:5000/sendDashboard"

    let result
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify({
            dash_id: dash_id,
            rec_email: rec_email
        })
    }
    try {
        const response = await fetch(api_url, headers)
        result = await response.json()
    } catch (error) {
        result = "Server not responsive"
    }
    console.log("Dashboard sent")
    return result
}

export const getStatus = async (poll_ids, token) => {
    console.log("Poll request...")
    const api_url = "http://localhost:5000/getStatus"

    let result
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify({
            poll_ids: poll_ids
        })
    }
    try {
        const response = await fetch(api_url, headers)
        result = await response.json()
    } catch (error) {
        result = {'message': "ERROR"}
    }
    return result
}



