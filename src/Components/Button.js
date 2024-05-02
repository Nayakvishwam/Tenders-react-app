import { Button } from "@mui/material";
import { useRef } from "react";
import { Link } from "react-router-dom";
import * as XLSX from 'xlsx';

export function FileUpload({ ...params }) {
    const fileInputRef = useRef();
    const style = params.applystyle ? params.style : {}
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {

            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                let jsonData = XLSX.utils.sheet_to_json(sheet, { row: false });
                fileInputRef.current.value = ""
                params.passdatafunc(jsonData)
            };

            reader.readAsBinaryString(file);
        }
    }
    return (
        <Button component="label" style={style}>
            {params.name}
            <input hidden accept={params.typefile} ref={fileInputRef} onChange={handleFileChange} multiple type="file" />
        </Button>
    )
}


export function DownloadExcel({ ...params }) {
    const InstallDynamicStructure = async () => {
        const module = await import("../apicaller")
        const ExcelExport = module[params.ExportFunction]
        ExcelExport(params.utilities).then((response) => {
            if (response.data._code == 200) {
                const worksheet = XLSX.utils.json_to_sheet(response.data.data, { header: params.columns });
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
                XLSX.writeFile(workbook, params.excelname);
            }
        })
    }
    const InstallStaticStructure = () => {

        const ws = XLSX.utils.aoa_to_sheet([params.columns]);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, params.excelname);
    }

    return (
        <Link style={params.style} onClick={params.static ? InstallStaticStructure : InstallDynamicStructure}>
            {params.name}
        </Link>
    )
}