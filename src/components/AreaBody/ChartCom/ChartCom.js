import { useRef, useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";

function ChartCom(props) {
  const chartRef = useRef();
  const labels = props.labels;
  const values = Object.values(props?.data ? props.data : {});

  Chart.register(...registerables);

  //dummy data
  let data = {
    labels: labels,
    datasets: [
      {
        label: "Entries",
        backgroundColor: props.colors,
        borderColor: props.borderColor,
        // data: counters,?
        data: values,
      },
    ],
  };

  let config = {
    type: "doughnut",
    data: data,
    options: {
      indexAxis: "y",
      animation: {
        x: {
          duration: 1000,

          easing: "linear",
        },
        y: {
          duration: 1000,

          easing: "linear",
        },
      },
    },
  };

  useEffect(() => {
    let myChart = new Chart(chartRef.current, config);

    return () => myChart.destroy();
  }, [props?.data]);

  return <canvas ref={chartRef}></canvas>;
}

export default ChartCom;
