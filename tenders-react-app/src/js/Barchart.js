import { Bar } from "react-chartjs-2";
export const BarChart=()=>{

    var myChart = {
        labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'],
        datasets: [
            {
                label: "CHN",
                borderColor: 'rgba(218, 140, 255, 1)',
                backgroundColor: 'rgba(154, 85, 255, 1)',
                data: [20, 40, 15, 35, 25, 50, 30, 20]
            },
            {
                label: "USA",
                borderColor: 'rgba(255, 191, 150, 1)',
                backgroundColor: 'rgba(254, 112, 150, 1)',
                data: [40, 30, 20, 10, 50, 15, 35, 40]
            },
            {
                label: "UK",
                borderColor: 'rgba(54, 215, 232, 1)',
                backgroundColor: 'rgba(177, 148, 250, 1)',
                data: [70, 10, 30, 40, 25, 50, 15, 30]
            }
        ]
    }
    return (
        <div>
            <Bar data={myChart}/>
        </div>
    )
}