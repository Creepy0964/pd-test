import { Chart, ChartConfiguration, Plugin } from "chart.js";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { MyContext } from "../context/context";

// Плагин для рисования горизонтальной линии на уровне y = 70
const horizontalLinePlugin: Plugin = {
  id: "horizontalLinePlugin",
  afterDraw(chart) {
    const {
      ctx,
      chartArea: { left, right },
      scales: { y },
    } = chart;
    const yPos = y.getPixelForValue(70);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(left, yPos);
    ctx.lineTo(right, yPos);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
    ctx.stroke();
    ctx.restore();
  },
};

const width = 1000;
const height = 500;

// Регистрируем плагин в контексте ChartJSNodeCanvas через chartCallback
const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  chartCallback: (ChartJS) => {
    ChartJS.register(horizontalLinePlugin);
  },
});

export async function sendResultChart(
  ctx: MyContext,
  result: { trait: string; t: number }[],
) {
  const labels = result.map((r) => r.trait);
  const values = result.map((r) => r.t);

  const configuration: ChartConfiguration<"line"> = {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "t",
          data: values,
          borderColor: "blue",
          borderWidth: 2,
          fill: false,
          tension: 0,
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: false,
      scales: {
        y: {
          id: "y",
          min: 30,
          max: 105,
        },
      },
      plugins: {
        // Настройка плагина по ID (необязательно, можно убрать или использовать для параметров)
        horizontalLinePlugin: {},
      },
    },
  };

  const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  await ctx.replyWithPhoto(
    { source: buffer },
    { caption: `твой результат в графическом виде` },
  );
}
