import React from 'react';
import styled from '@emotion/styled';
import { PieChart, Pie, ResponsiveContainer, Tooltip } from 'recharts';

export const ChartPie = ({ data, label, light = false }) => {
  return (
    <ChartCon>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill={light ? '#b1b0cf' : '#4f4d7c'}
            dataKey="value"
            label={label}
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </ChartCon>
  );
};

export const ChartCon = styled.div`
  height: 400px;
  width: 600px;
  z-index: 1;
`;
