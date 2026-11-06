import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { init, use } from "echarts/core";
import type { ECharts, EChartsCoreOption } from "echarts/core";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { TooltipComponent } from "echarts/components";

use([PieChart, TooltipComponent, CanvasRenderer]);

export interface DonutChartItem {
  name: string;
  bottles: number;
  wines: number;
  color: string;
}

@customElement("ploc-cellar-donut-chart")
export class PlocCellarDonutChart extends LitElement {
  @property({ attribute: false }) items: DonutChartItem[] = [];
  @property() language = "en";

  private chart?: ECharts;
  private resizeObserver?: ResizeObserver;

  static styles = css`
    :host { display: block; width: 100%; height: 100%; min-width: 0; min-height: 0; }
    .chart { width: 100%; height: 100%; min-height: 0; }
  `;

  protected firstUpdated(): void {
    const container = this.renderRoot.querySelector<HTMLElement>(".chart");
    if (!container) return;

    this.chart = init(container, undefined, { renderer: "canvas" });
    this.resizeObserver = new ResizeObserver(() => this.chart?.resize());
    this.resizeObserver.observe(container);
    this.updateChart();
  }

  protected updated(): void {
    this.updateChart();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.chart?.dispose();
    this.chart = undefined;
  }

  private updateChart(): void {
    if (!this.chart) return;

    const numberFormat = new Intl.NumberFormat(this.language);
    const option: EChartsCoreOption = {
      animation: false,
      tooltip: {
        trigger: "item",
        renderMode: "html",
        confine: true,
        valueFormatter: (value: string | number) => numberFormat.format(Number(value)),
      },
      series: [{
        type: "pie",
        radius: ["62%", "90%"],
        center: ["50%", "50%"],
        clockwise: true,
        startAngle: 90,
        avoidLabelOverlap: true,
        label: { show: false },
        labelLine: { show: false },
        itemStyle: { borderWidth: 2, borderColor: "transparent" },
        emphasis: { scale: true, scaleSize: 4 },
        data: this.items.map((item) => ({
          name: item.name,
          value: item.bottles,
          itemStyle: { color: item.color },
        })),
      }],
    };
    this.chart.setOption(option, { notMerge: true, lazyUpdate: true });
  }

  protected render() {
    return html`<div class="chart" role="presentation"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ploc-cellar-donut-chart": PlocCellarDonutChart;
  }
}
