"use client"

import type * as React from "react"
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
} from "recharts"

interface ChartProps {
  data: any[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
  className?: string
}

export const BarChart: React.FC<ChartProps> = ({
  data,
  index,
  categories,
  colors = ["#3b82f6"],
  valueFormatter,
  yAxisWidth = 40,
  className,
}) => {
  return (
    <ResponsiveContainer width="100%" height={350} className={className}>
      <RechartsBarChart data={data}>
        <XAxis dataKey={index} />
        <YAxis width={yAxisWidth} tickFormatter={valueFormatter} />
        <Tooltip formatter={valueFormatter} />
        <Legend />
        {categories.map((category, idx) => (
          <Bar key={category} dataKey={category} fill={colors[idx % colors.length]} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export const LineChart: React.FC<ChartProps> = ({
  data,
  index,
  categories,
  colors = ["#3b82f6"],
  valueFormatter,
  yAxisWidth = 40,
  className,
}) => {
  return (
    <ResponsiveContainer width="100%" height={350} className={className}>
      <RechartsLineChart data={data}>
        <XAxis dataKey={index} />
        <YAxis width={yAxisWidth} tickFormatter={valueFormatter} />
        <Tooltip formatter={valueFormatter} />
        <Legend />
        {categories.map((category, idx) => (
          <Line key={category} type="monotone" dataKey={category} stroke={colors[idx % colors.length]} />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

interface DonutChartProps {
  data: { name: string; value: number }[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  className?: string
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  colors = ["#3b82f6", "#e5e7eb"],
  valueFormatter,
  className,
}) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0)

  return (
    <ResponsiveContainer width="100%" height={350} className={className}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [
            valueFormatter ? valueFormatter(value as number) : value,
            `${(((value as number) / total) * 100).toFixed(2)}%`,
          ]}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

